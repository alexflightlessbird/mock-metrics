// Dependency imports
import { lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Component imports
import ProtectedRouteWrapper from "./ProtectedRouteWrapper";
import RootLayout from "../../layouts/RootLayout";

// Pages imports
const NotFound = lazy(() => import("../../pages/NotFound"));
const componentMap = {
  Home: lazy(() => import("../../pages/Home")),
  Test: lazy(() => import("../../pages/Test")),
  UserSettings: lazy(() => import("../../pages/UserSettings")),
  Auth: lazy(() => import("../../pages/Auth")),
  Cases: lazy(() => import("../../features/cases/Cases")),
  Witnesses: lazy(() => import("../../pages/Witnesses")),
  Schools: lazy(() => import("../../features/schools/Schools")),
  Teams: lazy(() => import("../../pages/Teams")),
  SchoolsTest: lazy(() => import("../../features/schools/Schools")),
};

// Other imports
import routesConfig from "./routes.json";

function createRouteElements(routes) {
  return routes.map((route) => {
    const Component = componentMap[route.component];
    if (!Component) {
      throw new Error(`Component not found for route: ${route.component}`);
    }

    return <Route key={route.path} path={route.path} element={<Component />} />;
  });
}

const publicRoutes = createRouteElements(routesConfig.public_routes);
const protectedRoutes = createRouteElements(routesConfig.protected_routes);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {publicRoutes}
      <Route element={<ProtectedRouteWrapper />}>{protectedRoutes}</Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
