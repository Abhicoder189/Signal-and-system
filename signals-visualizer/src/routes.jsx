import { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import RequirePro from "./components/RequirePro";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import LoadingPage from "./pages/LoadingPage";

const CHUNK_RELOAD_KEY = "sv:chunk-reload";

function lazyWithRetry(importer) {
  return lazy(async () => {
    const hasRefreshed =
      typeof window !== "undefined" && sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1";

    try {
      const module = await importer();
      if (typeof window !== "undefined") {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, "0");
      }
      return module;
    } catch (error) {
      const message = String(error?.message || "");
      const isChunkLoadError =
        message.includes("Failed to fetch dynamically imported module") ||
        message.includes("Importing a module script failed");

      if (isChunkLoadError && !hasRefreshed && typeof window !== "undefined") {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
        window.location.reload();
        return new Promise(() => {});
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, "0");
      }
      throw error;
    }
  });
}

const Home = lazyWithRetry(() => import("./pages/Home"));
const SignalsPage = lazyWithRetry(() => import("./pages/SignalsPage"));
const OperationsPage = lazyWithRetry(() => import("./pages/OperationsPage"));
const SystemsPage = lazyWithRetry(() => import("./pages/SystemsPage"));
const ConvolutionPage = lazyWithRetry(() => import("./pages/ConvolutionPage"));
const FourierPage = lazyWithRetry(() => import("./pages/FourierPage"));
const LaplacePage = lazyWithRetry(() => import("./pages/LaplacePage"));
const AuthPage = lazyWithRetry(() => import("./pages/AuthPage"));
const BillingPage = lazyWithRetry(() => import("./pages/BillingPage"));
const PricingGatePage = lazyWithRetry(() => import("./pages/PricingGatePage"));
const NotFoundPage = lazyWithRetry(() => import("./pages/NotFoundPage"));

function withSuspense(element) {
  return <Suspense fallback={<LoadingPage />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "signals", element: withSuspense(<SignalsPage />) },
      { path: "operations", element: withSuspense(<OperationsPage />) },
      { path: "systems", element: withSuspense(<SystemsPage />) },
      {
        path: "convolution",
        element: withSuspense(
          <RequirePro>
            <ConvolutionPage />
          </RequirePro>
        )
      },
      {
        path: "fourier",
        element: withSuspense(
          <RequirePro>
            <FourierPage />
          </RequirePro>
        )
      },
      {
        path: "laplace",
        element: withSuspense(
          <RequirePro>
            <LaplacePage />
          </RequirePro>
        )
      },
      { path: "auth", element: withSuspense(<AuthPage />) },
      {
        path: "billing",
        element: withSuspense(
          <RequireAuth>
            <BillingPage />
          </RequireAuth>
        )
      },
      { path: "pricing", element: withSuspense(<PricingGatePage />) },
      { path: "*", element: withSuspense(<NotFoundPage />) }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default router;