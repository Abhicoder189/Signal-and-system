import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

const CHECKOUT_FUNCTION =
  import.meta.env.VITE_RAZORPAY_CHECKOUT_FUNCTION || "create-razorpay-checkout";
const MANAGE_FUNCTION =
  import.meta.env.VITE_RAZORPAY_MANAGE_FUNCTION || "get-razorpay-manage-link";
const PAYMENT_LINK = import.meta.env.VITE_RAZORPAY_CHECKOUT_LINK;
const MANAGE_LINK = import.meta.env.VITE_RAZORPAY_MANAGE_LINK;

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

    const { data, error: checkoutError } = await supabase.functions.invoke(CHECKOUT_FUNCTION);

    if (checkoutError || !data?.url) {
      setBusyAction("");
      setError(checkoutError?.message || "Unable to start checkout.");
      return;
    }

    window.location.assign(data.url);
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

    const { data, error: manageError } = await supabase.functions.invoke(MANAGE_FUNCTION);

    if (manageError || !data?.url) {
      setBusyAction("");
      setError(manageError?.message || "Unable to open subscription management.");
      return;
    }

    window.location.assign(data.url);
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
