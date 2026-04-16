import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authEnabled, user, signIn, signUp, emailConfirmed, resendConfirmationEmail } = useAuth();

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmationPending, setShowConfirmationPending] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  const from = location.state?.from?.pathname || "/";

  // User is logged in but email not confirmed yet
  if (user && !emailConfirmed) {
    return (
      <section className="page-card auth-card">
        <h1>Confirm your email</h1>
        <p className="module-caption">
          We sent a confirmation link to <strong>{user.email}</strong>. Click the link in your email to confirm your account.
        </p>
        
        <p className="status-message status-success">
          Awaiting email confirmation. You can browse the app while waiting.
        </p>

        <div className="control-row">
          <button
            type="button"
            className="button button-subtle"
            onClick={async () => {
              setResendingEmail(true);
              const { error } = await resendConfirmationEmail(user.email);
              setResendingEmail(false);
              if (error) {
                setError(error.message || "Failed to resend confirmation email.");
              } else {
                setMessage("Confirmation email sent! Check your inbox.");
              }
            }}
            disabled={resendingEmail}
          >
            {resendingEmail ? "Sending..." : "Resend confirmation email"}
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={async () => {
              // Refresh session to check if email was confirmed
              const { data } = await signIn(user.email, "");
              if (data?.user?.email_confirmed_at) {
                navigate(from, { replace: true });
              }
            }}
          >
            Already confirmed? Refresh
          </button>
        </div>

        {error && <p className="status-message status-error" style={{ marginTop: "1rem" }}>{error}</p>}
        {message && <p className="status-message status-success" style={{ marginTop: "1rem" }}>{message}</p>}
      </section>
    );
  }

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

    const { error: signUpError, data } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message || "Unable to create account.");
      setSubmitting(false);
      return;
    }

    // After successful signup, show confirmation pending message
    if (data?.user) {
      setShowConfirmationPending(true);
      setMessage("Account created! Check your email for a confirmation link.");
      setEmail("");
      setPassword("");
    }
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

      {showConfirmationPending && (
        <div className="status-message status-success">
          <p>✓ Account created! A confirmation link has been sent to <strong>{email || "your email"}</strong>.</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Click the link in your email to confirm your account and start using the app.
          </p>
        </div>
      )}

      {!showConfirmationPending && (
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
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
                setMessage("");
              }}
              disabled={submitting}
            >
              {mode === "signin" ? "Need an account?" : "Have an account?"}
            </button>
          </div>
        </form>
      )}

      {showConfirmationPending && (
        <div className="control-row" style={{ marginTop: "1rem", flexDirection: "column", alignItems: "stretch" }}>
          <button
            type="button"
            className="button button-subtle"
            onClick={() => setShowConfirmationPending(false)}
          >
            Back to sign in
          </button>
        </div>
      )}

      <p className="module-caption">
        Pro access unlocks Convolution, Fourier, and Laplace premium labs. <Link className="text-link" to="/pricing">View plan details</Link>.
      </p>
    </section>
  );
}

export default AuthPage;
