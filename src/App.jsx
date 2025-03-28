import React from "react";
import { RouterProvider } from "react-router-dom";
import "./assets/styles/App.css";
import Router from "./app/routes/Router";

export default function App() {
  return <RouterProvider router={Router} />;
}
