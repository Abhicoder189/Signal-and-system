import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { isChunkLoadError, maybeRecoverFromChunkError } from "../utils/chunkRecovery";

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

  const chunkLoadFailed = isChunkLoadError(error) || isChunkLoadError(details);

  return (
    <section className="page-card">
      <h1>Something went wrong</h1>
      <p className="mono">{title}</p>
      <p>{details}</p>
      {chunkLoadFailed && (
        <p>
          The app was updated while this tab was open. Reload to fetch the latest files.
        </p>
      )}
      {chunkLoadFailed && (
        <p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              maybeRecoverFromChunkError();
            }}
          >
            Reload app
          </button>
        </p>
      )}
      <p>
        <Link className="text-link" to="/">
          Return to home
        </Link>
      </p>
    </section>
  );
}

export default RouteErrorBoundary;
