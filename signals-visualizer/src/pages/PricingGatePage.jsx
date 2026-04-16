import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PricingGatePage() {
  const location = useLocation();
  const { authEnabled, user, isPro } = useAuth();

  const intendedPath = location.state?.from?.pathname;

  return (
    <section className="page-card pricing-card">
      <h1>Signals Visualizer Pro</h1>
      <p>
        Premium plan unlocks advanced interactive labs for convolution animation, Fourier intuition,
        and Laplace-domain analysis.
      </p>

      <div className="module-grid">
        <article className="module-card">
          <h3>Free</h3>
          <p className="module-caption">Great for core fundamentals.</p>
          <ul className="pricing-list">
            <li>Signals, operations, and systems modules</li>
            <li>Basic interaction controls</li>
            <li>Guest browsing support</li>
          </ul>
        </article>

        <article className="module-card module-card-highlight">
          <h3>Pro</h3>
          <p className="module-caption">Built for deeper practice and teaching labs.</p>
          <ul className="pricing-list">
            <li>Convolution visual step engine</li>
            <li>Fourier and Laplace premium modules</li>
            <li>Subscription billing and account portal</li>
          </ul>
        </article>
      </div>

      {intendedPath && (
        <p className="module-caption">
          You attempted to open a premium route: <strong>{intendedPath}</strong>
        </p>
      )}

      {!authEnabled && (
        <p className="status-message status-error">
          Auth and billing are not configured yet. Add environment values to enable paid access.
        </p>
      )}

      <div className="control-row">
        {!user && authEnabled && (
          <Link className="button button-primary" to="/auth" state={{ from: location.state?.from }}>
            Sign in to continue
          </Link>
        )}

        {user && !isPro && authEnabled && (
          <Link className="button button-primary" to="/billing">
            Upgrade to Pro
          </Link>
        )}

        {user && isPro && (
          <Link className="button button-primary" to={intendedPath || "/convolution"}>
            Continue to premium module
          </Link>
        )}

        <Link className="button button-subtle" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}

export default PricingGatePage;
