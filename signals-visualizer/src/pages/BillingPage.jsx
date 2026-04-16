import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

const CHECKOUT_FUNCTION = import.meta.env.VITE_CHECKOUT_FUNCTION || "create-checkout-session";
const PORTAL_FUNCTION = import.meta.env.VITE_CUSTOMER_PORTAL_FUNCTION || "create-portal-session";
const PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
const PORTAL_LINK = import.meta.env.VITE_CUSTOMER_PORTAL_LINK;

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

  async function openPortal() {
    setError("");
    setBusyAction("portal");

    if (PORTAL_LINK) {
      window.location.assign(PORTAL_LINK);
      return;
    }

    if (!supabase) {
      setBusyAction("");
      setError("Billing backend is not configured.");
      return;
    }

    const { data, error: portalError } = await supabase.functions.invoke(PORTAL_FUNCTION);

    if (portalError || !data?.url) {
      setBusyAction("");
      setError(portalError?.message || "Unable to open billing portal.");
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
              ? "Use the customer portal to manage your subscription and payment method."
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
              onClick={openPortal}
              disabled={busyAction.length > 0}
            >
              {busyAction === "portal" ? "Opening..." : "Open billing portal"}
            </button>
          </div>
        </article>
      </div>

      {error && <p className="status-message status-error">{error}</p>}

      {!authEnabled && (
        <p className="module-caption">
          Billing requires Supabase and Stripe environment configuration.
        </p>
      )}

      <p className="module-caption">
        Need to compare features first? <Link className="text-link" to="/pricing">View pricing page</Link>.
      </p>
    </section>
  );
}

export default BillingPage;
