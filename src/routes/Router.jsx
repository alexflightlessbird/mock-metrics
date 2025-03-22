import React, { lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ProtectedRouteWrapper from "./ProtectedRouteWrapper";
import routesConfig from "./routes.json";
import RootLayout from "../layouts/RootLayout";

//pages
const NotFound = lazy(() => import("../pages/NotFound"));

const componentMap = {
  Home: lazy(() => import("../pages/Home")),
  Test: lazy(() => import("../pages/Test")),
  UserSettings: lazy(() => import("../pages/UserSettings")),
  Auth: lazy(() => import("../pages/Auth")),
};

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
