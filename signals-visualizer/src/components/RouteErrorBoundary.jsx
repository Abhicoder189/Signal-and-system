import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

function RouteErrorBoundary() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Unexpected application error";

  const details = isRouteErrorResponse(error)
    ? error.data?.message || "The requested page could not be loaded."
    : error instanceof Error
      ? error.message
      : "An unknown error occurred.";

  return (
    <section className="page-card">
      <h1>Something went wrong</h1>
      <p className="mono">{title}</p>
      <p>{details}</p>
      <p>
        <Link className="text-link" to="/">
          Return to home
        </Link>
      </p>
    </section>
  );
}

export default RouteErrorBoundary;
