import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { authEnabled, user, isPro } = useAuth();

  return (
    <aside className="sidebar">
      <h3>Learning Track</h3>
      <ul>
        <li>Signal synthesis and decomposition</li>
        <li>Temporal and amplitude transformations</li>
        <li>LTI response and system properties</li>
        <li>Stepwise convolution computation</li>
        <li>Fourier spectrum interpretation</li>
        <li>Laplace ROC and pole intuition</li>
      </ul>

      <div className="sidebar-plan">
        <h4>Access</h4>
        {!authEnabled && <p className="module-caption">Configure Supabase to enable sign in and paid plans.</p>}
        {authEnabled && !user && (
          <p className="module-caption">
            You are browsing as a guest. <Link className="text-link" to="/auth">Sign in</Link> to
            unlock progress sync and upgrade options.
          </p>
        )}
        {authEnabled && user && (
          <p className="module-caption">
            Current plan: <strong>{isPro ? "Pro" : "Free"}</strong>.{" "}
            <Link className="text-link" to="/billing">
              {isPro ? "Manage billing" : "Upgrade"}
            </Link>
          </p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;