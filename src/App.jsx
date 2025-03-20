import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import Router from "./routes/Router";

export default function App() {
  return <RouterProvider router={Router} />;
}
