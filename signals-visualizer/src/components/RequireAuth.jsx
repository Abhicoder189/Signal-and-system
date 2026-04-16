import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingPage from "../pages/LoadingPage";

function RequireAuth({ children }) {
  const location = useLocation();
  const { authEnabled, user, loading } = useAuth();

  if (!authEnabled) {
    return (
      <section className="page-card">
        <h1>Authentication setup required</h1>
        <p>
          Add Supabase keys in your environment so sign in and billing routes can be used in this
          app.
        </p>
      </section>
    );
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
