// Dependency imports
import { RouterProvider } from "react-router-dom";

// Router imports
import Router from "./app/routes/Router";

// Other imports
import "./assets/styles/App.css";

export default function App() {
  return <RouterProvider router={Router} />;
}
