import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Schools from "./pages/Schools";
import Home from "./pages/Home";
import Cases from "./pages/Cases";
import Case from "./pages/Case";
import ProtectedRoute from "./components/ProtectedRoute";
import School from "./pages/School";
import Witness from "./pages/Witness";
import Team from "./pages/Team";
import Student from "./pages/Student";
import SchoolAnalysis from "./pages/SchoolAnalysis";
import RootLayout from "./layouts/RootLayout";
import Profile from "./pages/Profile";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/:caseId" element={<Case />} />
        <Route path="/witness/:witnessId" element={<Witness />} />
        <Route
          path="/schools"
          element={
            <ProtectedRoute>
              <Schools />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schools/:schoolId"
          element={
            <ProtectedRoute>
              <School />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schools/:schoolId/analysis"
          element={
            <ProtectedRoute>
              <SchoolAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/:teamId"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/:studentId"
          element={
            <ProtectedRoute>
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
