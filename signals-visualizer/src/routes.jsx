import { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import RequirePro from "./components/RequirePro";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import LoadingPage from "./pages/LoadingPage";

const Home = lazy(() => import("./pages/Home"));
const SignalsPage = lazy(() => import("./pages/SignalsPage"));
const OperationsPage = lazy(() => import("./pages/OperationsPage"));
const SystemsPage = lazy(() => import("./pages/SystemsPage"));
const ConvolutionPage = lazy(() => import("./pages/ConvolutionPage"));
const FourierPage = lazy(() => import("./pages/FourierPage"));
const LaplacePage = lazy(() => import("./pages/LaplacePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const PricingGatePage = lazy(() => import("./pages/PricingGatePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

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