import { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import LoadingPage from "./pages/LoadingPage";

const Home = lazy(() => import("./pages/Home"));
const SignalsPage = lazy(() => import("./pages/SignalsPage"));
const OperationsPage = lazy(() => import("./pages/OperationsPage"));
const SystemsPage = lazy(() => import("./pages/SystemsPage"));
const ConvolutionPage = lazy(() => import("./pages/ConvolutionPage"));
const FourierPage = lazy(() => import("./pages/FourierPage"));
const LaplacePage = lazy(() => import("./pages/LaplacePage"));
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
      { path: "convolution", element: withSuspense(<ConvolutionPage />) },
      { path: "fourier", element: withSuspense(<FourierPage />) },
      { path: "laplace", element: withSuspense(<LaplacePage />) },
      { path: "*", element: withSuspense(<NotFoundPage />) }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default router;