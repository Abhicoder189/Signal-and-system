import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/signals", label: "Signals" },
  { to: "/operations", label: "Operations" },
  { to: "/systems", label: "Systems" },
  { to: "/convolution", label: "Convolution Pro" },
  { to: "/fourier", label: "Fourier Pro" },
  { to: "/laplace", label: "Laplace Pro" }
];

function Navbar() {
  const { user, isPro, signOut, authEnabled } = useAuth();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <h2 className="navbar-title">Signals Visualizer</h2>

      <div className="navbar-right">
        <div className="navbar-links">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `navbar-link${isActive ? " navbar-link-active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-auth">
          {!authEnabled && <span className="plan-pill">Auth setup required</span>}

          {authEnabled && !user && (
            <>
              <NavLink to="/auth" className="navbar-link">
                Sign in
              </NavLink>
              <NavLink to="/pricing" className="button button-primary">
                Get Pro
              </NavLink>
            </>
          )}

          {authEnabled && user && (
            <>
              <span className="account-email" title={user.email ?? "Signed in"}>
                {user.email ?? "Signed in"}
              </span>
              <span className="plan-pill">{isPro ? "Pro" : "Free"}</span>
              <NavLink to="/billing" className="navbar-link">
                Billing
              </NavLink>
              <button type="button" className="button button-subtle" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;