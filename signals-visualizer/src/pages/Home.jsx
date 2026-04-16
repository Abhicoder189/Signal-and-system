import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { authEnabled, user, isPro } = useAuth();

  return (
    <section className="page-card">
      <h1>Signals and Systems Visual Learning Studio</h1>
      <p>
        A complete interactive workspace for understanding core signals and systems concepts through
        visual experimentation, parameter sweeps, and side-by-side comparisons.
      </p>
      <div className="module-grid">
        <article className="module-card">
          <h3>Signals</h3>
          <p>Build and inspect continuous/discrete signals with decomposition and unit templates.</p>
        </article>
        <article className="module-card">
          <h3>Operations</h3>
          <p>Apply shift, scale, reverse, and gain transforms with live waveform overlays.</p>
        </article>
        <article className="module-card">
          <h3>Systems</h3>
          <p>Validate linearity and time invariance numerically and visualize LTI outputs.</p>
        </article>
        <article className="module-card">
          <h3>Frequency Domain</h3>
          <p>Explore convolution, Fourier, and Laplace behavior with dynamic controls.</p>
        </article>

        <article className="module-card module-card-highlight">
          <h3>Pro Labs</h3>
          <p>
            Unlock premium modules: guided convolution animations, deep Fourier exploration, and
            Laplace intuition labs.
          </p>
          <div className="control-row">
            {!authEnabled && <span className="module-caption">Configure auth to enable subscriptions.</span>}
            {authEnabled && !user && (
              <Link className="button button-primary" to="/auth">
                Sign in to start
              </Link>
            )}
            {authEnabled && user && !isPro && (
              <Link className="button button-primary" to="/pricing">
                Upgrade to Pro
              </Link>
            )}
            {authEnabled && user && isPro && (
              <Link className="button button-primary" to="/convolution">
                Open Pro modules
              </Link>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export default Home;