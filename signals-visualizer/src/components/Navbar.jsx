import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/signals", label: "Signals" },
  { to: "/operations", label: "Operations" },
  { to: "/systems", label: "Systems" },
  { to: "/convolution", label: "Convolution" },
  { to: "/fourier", label: "Fourier" },
  { to: "/laplace", label: "Laplace" }
];

function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <h2 className="navbar-title">Signals Visualizer</h2>

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
    </nav>
  );
}

export default Navbar;