import React, { useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";

import Router from "./routes/Router";

function App() {
  const router = useMemo(() => Router, []);
  return <RouterProvider router={router} />;
}

export default App;
