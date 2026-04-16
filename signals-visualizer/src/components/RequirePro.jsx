import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingPage from "../pages/LoadingPage";

function RequirePro({ children }) {
  const location = useLocation();
  const { authEnabled, user, loading, entitlementsLoading, isPro } = useAuth();

  if (!authEnabled) {
    return (
      <section className="page-card">
        <h1>Premium access requires setup</h1>
        <p>
          Configure auth and billing environment variables to activate paid modules in this app.
        </p>
      </section>
    );
  }

  if (loading || entitlementsLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (!isPro) {
    return <Navigate to="/pricing" replace state={{ from: location }} />;
  }

  return children;
}

export default RequirePro;
