import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="page-card">
      <h1>Page not found</h1>
      <p>The route you requested does not exist in this workspace.</p>
      <p>
        <Link className="text-link" to="/">
          Go back to home
        </Link>
      </p>
    </section>
  );
}

export default NotFoundPage;
