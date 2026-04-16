import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authEnabled, user, signIn, signUp } = useAuth();

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  if (user) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    if (mode === "signin") {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message || "Unable to sign in.");
        setSubmitting(false);
        return;
      }

      navigate(from, { replace: true });
      return;
    }

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message || "Unable to create account.");
      setSubmitting(false);
      return;
    }

    setMessage("Account created. Check your email if confirmation is enabled.");
    setSubmitting(false);
  }

  return (
    <section className="page-card auth-card">
      <h1>{mode === "signin" ? "Sign in" : "Create account"}</h1>

      {!authEnabled && (
        <p className="module-caption">
          Supabase is not configured yet. Add environment values to enable authentication.
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            disabled={!authEnabled || submitting}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            disabled={!authEnabled || submitting}
          />
        </label>

        {error && <p className="status-message status-error">{error}</p>}
        {message && <p className="status-message status-success">{message}</p>}

        <div className="control-row">
          <button type="submit" className="button button-primary" disabled={!authEnabled || submitting}>
            {submitting ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
          <button
            type="button"
            className="button button-subtle"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            disabled={submitting}
          >
            {mode === "signin" ? "Need an account?" : "Have an account?"}
          </button>
        </div>
      </form>

      <p className="module-caption">
        Pro access unlocks Convolution, Fourier, and Laplace premium labs. <Link className="text-link" to="/pricing">View plan details</Link>.
      </p>
    </section>
  );
}

export default AuthPage;
