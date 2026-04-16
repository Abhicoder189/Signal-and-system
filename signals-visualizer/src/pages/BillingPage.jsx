import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

const CHECKOUT_FUNCTION =
  import.meta.env.VITE_RAZORPAY_CHECKOUT_FUNCTION || "create-razorpay-checkout";
const MANAGE_FUNCTION =
  import.meta.env.VITE_RAZORPAY_MANAGE_FUNCTION || "get-razorpay-manage-link";
const DEFAULT_CHECKOUT_FUNCTION = "create-razorpay-checkout";
const DEFAULT_MANAGE_FUNCTION = "get-razorpay-manage-link";
const PAYMENT_LINK = import.meta.env.VITE_RAZORPAY_CHECKOUT_LINK;
const MANAGE_LINK = import.meta.env.VITE_RAZORPAY_MANAGE_LINK;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getRuntimeAnonKey() {
  return (
    SUPABASE_ANON_KEY ||
    supabase?.supabaseKey ||
    ""
  );
}

function getProjectRefFromUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const hostParts = parsed.hostname.split(".");
    return hostParts[0] || null;
  } catch {
    return null;
  }
}

function getFunctionCandidateUrls(functionName) {
  const urls = [];
  const anonKey = getRuntimeAnonKey();
  const keyQuery = anonKey ? `?apikey=${encodeURIComponent(anonKey)}` : "";

  if (SUPABASE_URL) {
    urls.push(`${SUPABASE_URL}/functions/v1/${functionName}${keyQuery}`);
  }

  const projectRef = getProjectRefFromUrl(SUPABASE_URL);
  if (projectRef) {
    urls.push(`https://${projectRef}.functions.supabase.co/${functionName}${keyQuery}`);
  }

  return Array.from(new Set(urls));
}

function extractRedirectUrl(payload) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  return (
    payload.url ||
    payload.short_url ||
    payload.payment_url ||
    payload.link?.url ||
    ""
  );
}

function normalizeExternalUrl(url) {
  if (!url) return "";

  const trimmed = String(url).trim();
  if (!trimmed) return "";

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

function redirectToExternalUrl(rawUrl) {
  const normalized = normalizeExternalUrl(rawUrl);
  if (!normalized) {
    return false;
  }

  window.location.assign(normalized);
  return true;
}

async function directInvoke(functionName) {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;
  const anonKey = getRuntimeAnonKey();

  if (!accessToken || !anonKey) {
    return {
      data: null,
      error: { message: "Missing auth session or Supabase anon key for direct function call." }
    };
  }

  const candidateUrls = getFunctionCandidateUrls(functionName);
  let lastError = null;

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({})
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        lastError = {
          message: body?.error || `Function request failed with ${response.status}`,
          context: { status: response.status }
        };
        continue;
      }

      return { data: body, error: null };
    } catch (error) {
      lastError = { message: error?.message || "Direct function call failed." };
    }
  }

  return { data: null, error: lastError || { message: "Unable to reach edge function." } };
}

function formatFunctionInvokeError(error, functionName, fallbackMessage) {
  const message = String(error?.message || "");

  if (message.includes("Failed to send a request to the Edge Function")) {
    return `Unable to reach Supabase function \"${functionName}\". Deploy the function and verify VITE_SUPABASE_URL is correct.`;
  }

  if (message.includes("non-2xx status code")) {
    return `Supabase function \"${functionName}\" returned an error. Check function logs and secrets in Supabase.`;
  }

  return message || fallbackMessage;
}

function isNotFoundInvokeError(error) {
  if (!error) return false;
  if (error?.context?.status === 404) return true;
  const message = String(error.message || "").toLowerCase();
  return message.includes("404") || message.includes("not found");
}

async function invokeWithNameFallback(functionName, fallbackFunctionName) {
  const firstAttempt = await supabase.functions.invoke(functionName);

  const firstMessage = String(firstAttempt.error?.message || "");
  if (firstMessage.includes("Failed to send a request to the Edge Function")) {
    const directResult = await directInvoke(functionName);
    if (!directResult.error) {
      return directResult;
    }
  }

  if (!isNotFoundInvokeError(firstAttempt.error) || functionName === fallbackFunctionName) {
    return firstAttempt;
  }

  const secondAttempt = await supabase.functions.invoke(fallbackFunctionName);
  const secondMessage = String(secondAttempt.error?.message || "");

  if (secondMessage.includes("Failed to send a request to the Edge Function")) {
    return directInvoke(fallbackFunctionName);
  }

  return secondAttempt;
}

async function resolveInvokeErrorMessage(error, functionName, fallbackMessage, responseData) {
  if (responseData?.error) {
    return String(responseData.error);
  }

  const context = error?.context;
  if (context) {
    try {
      const payload = await context.clone().json();
      if (payload?.error) {
        return String(payload.error);
      }
    } catch {
      // Ignore JSON parse issues and fall back to generic formatting.
    }
  }

  return formatFunctionInvokeError(error, functionName, fallbackMessage);
}

function BillingPage() {
  const { authEnabled, user, isPro, planTier, subscriptionStatus, refreshEntitlements } = useAuth();
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");

  async function startCheckout() {
    setError("");
    setBusyAction("checkout");

    if (PAYMENT_LINK) {
      window.location.assign(PAYMENT_LINK);
      return;
    }

    if (!supabase) {
      setBusyAction("");
      setError("Billing backend is not configured.");
      return;
    }

    const { data, error: checkoutError } = await invokeWithNameFallback(
      CHECKOUT_FUNCTION,
      DEFAULT_CHECKOUT_FUNCTION
    );

    const redirectUrl = extractRedirectUrl(data);

    if (checkoutError || !redirectUrl) {
      setBusyAction("");
      const message = await resolveInvokeErrorMessage(
        checkoutError,
        CHECKOUT_FUNCTION,
        "Unable to start checkout.",
        data
      );
      setError(message);
      return;
    }

    const redirected = redirectToExternalUrl(redirectUrl);
    if (!redirected) {
      setBusyAction("");
      setError("Checkout link is invalid. Please try again.");
    }
  }

  async function openManage() {
    setError("");
    setBusyAction("manage");

    if (MANAGE_LINK) {
      window.location.assign(MANAGE_LINK);
      return;
    }

    if (!supabase) {
      setBusyAction("");
      setError("Billing backend is not configured.");
      return;
    }

    const { data, error: manageError } = await invokeWithNameFallback(
      MANAGE_FUNCTION,
      DEFAULT_MANAGE_FUNCTION
    );

    const redirectUrl = extractRedirectUrl(data);

    if (manageError || !redirectUrl) {
      setBusyAction("");
      const message = await resolveInvokeErrorMessage(
        manageError,
        MANAGE_FUNCTION,
        "Unable to open subscription management.",
        data
      );
      setError(message);
      return;
    }

    const redirected = redirectToExternalUrl(redirectUrl);
    if (!redirected) {
      setBusyAction("");
      setError("Subscription management link is invalid. Please try again.");
    }
  }

  return (
    <section className="page-card pricing-card">
      <h1>Billing and Plan</h1>
      <p>
        Signed in as <strong>{user?.email}</strong>
      </p>

      <div className="module-grid">
        <article className="module-card">
          <h3>Current Plan</h3>
          <p className="module-caption">Tier: {planTier.toUpperCase()}</p>
          <p className="module-caption">Subscription status: {subscriptionStatus}</p>
          <button
            type="button"
            className="button button-subtle"
            onClick={() => refreshEntitlements()}
            disabled={!authEnabled || busyAction.length > 0}
          >
            Refresh status
          </button>
        </article>

        <article className="module-card module-card-highlight">
          <h3>{isPro ? "Manage Pro" : "Upgrade to Pro"}</h3>
          <p>
            {isPro
              ? "Use Razorpay subscription management to update your plan and payment method."
              : "Unlock premium Convolution, Fourier, and Laplace labs with paid access."}
          </p>
          <div className="control-row">
            {!isPro && (
              <button
                type="button"
                className="button button-primary"
                onClick={startCheckout}
                disabled={busyAction.length > 0}
              >
                {busyAction === "checkout" ? "Redirecting..." : "Upgrade now"}
              </button>
            )}
            <button
              type="button"
              className="button button-subtle"
              onClick={openManage}
              disabled={busyAction.length > 0}
            >
              {busyAction === "manage" ? "Opening..." : "Manage subscription"}
            </button>
          </div>
        </article>
      </div>

      {error && <p className="status-message status-error">{error}</p>}

      {!authEnabled && (
        <p className="module-caption">
          Billing requires Supabase and Razorpay environment configuration.
        </p>
      )}

      <p className="module-caption">
        Need to compare features first? <Link className="text-link" to="/pricing">View pricing page</Link>.
      </p>
    </section>
  );
}

export default BillingPage;
