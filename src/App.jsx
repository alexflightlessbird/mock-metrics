import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loader from "./common/components/loader/GavelLoader";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Error404,
  Error401,
  Error403,
  Error418,
  Error503,
  Error402,
  Error500,
} from "./pages/ErrorCodePages";
import Error from "./pages/Error";
import NavLayout from "./layouts/NavLayout";
import TestPage from "./pages/Test";
import SchoolInfoPage from "./pages/SchoolInfoPage";
import { useLocalStorage } from "@mantine/hooks";
import PrivacyAndSecurityPage from "./pages/PrivacyAndSecurityPage";
import SettingsPage from "./pages/SettingsPage";
import BetaOverlay from "./layouts/BetaOverlay";
import ErrorExplanationPage from "./pages/ErrorExplanationPage";
import StatusPage from "./pages/StatusPage";
import TournamentDashboard from "./pages/TournamentDashboard";
import TournamentInfoPage from "./pages/TournamentInfoPage";
import TeamInfoPage from "./pages/TeamInfoPage";
import StudentInfoPage from "./pages/StudentInfoPage";
import BallotAnalysisPage from "./pages/BallotAnalysisPage";

export default function App({ onReady }) {
  const { user, isSuperAdmin, loading, superAdminLoading } = useAuth();

  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  if (loading || superAdminLoading) return <Loader />;

  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={Error}>
        <Routes>
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/admin"
            element={
              !user ? (
                <Error401 />
              ) : isSuperAdmin ? (
                <NavLayout>
                  <AdminDashboard />
                </NavLayout>
              ) : (
                <NavLayout>
                  <Error403 />
                </NavLayout>
              )
            }
          />
          <Route
            path="/ba"
            element={
              !user ? (
                <Error401 />
              ) : !selectedSchoolId ? (
                <Navigate to="/" replace />
              ) : (
                <NavLayout>
                  <BallotAnalysisPage />
                  <BetaOverlay />
                </NavLayout>
              )
            }
          />
          <Route path="/school">
            <Route
              index
              element={
                !user ? (
                  <Error401 />
                ) : !selectedSchoolId ? (
                  <Navigate to="/" replace />
                ) : (
                  <NavLayout>
                    <SchoolInfoPage />
                  </NavLayout>
                )
              }
            />
            <Route
              path="t/:id"
              element={
                !user ? (
                  <Error401 />
                ) : !selectedSchoolId ? (
                  <Navigate to="/" replace />
                ) : (
                  <NavLayout>
                    <TeamInfoPage />
                  </NavLayout>
                )
              }
            />
            <Route
              path="s/:id"
              element={
                !user ? (
                  <Error401 />
                ) : !selectedSchoolId ? (
                  <Navigate to="/" replace />
                ) : (
                  <NavLayout>
                    <StudentInfoPage />
                  </NavLayout>
                )
              }
            />
          </Route>
          <Route path="/tournaments">
            <Route
              index
              element={
                !user ? (
                  <Error401 />
                ) : !selectedSchoolId ? (
                  <Navigate to="/" replace />
                ) : (
                  <NavLayout>
                    <TournamentDashboard />
                  </NavLayout>
                )
              }
            />
            <Route
              path=":id"
              element={
                !user ? (
                  <Error401 />
                ) : !selectedSchoolId ? (
                  <Navigate to="/" replace />
                ) : (
                  <NavLayout>
                    <TournamentInfoPage />
                  </NavLayout>
                )
              }
            />
          </Route>
          <Route
            path="/admin-test"
            element={
              !user ? (
                <Error401 />
              ) : isSuperAdmin ? (
                <NavLayout>
                  <TestPage />
                  <BetaOverlay />
                </NavLayout>
              ) : (
                <NavLayout>
                  <Error403 />
                </NavLayout>
              )
            }
          />
          <Route
            path="/privacy-and-security"
            element={
              !user ? (
                <PrivacyAndSecurityPage />
              ) : (
                <NavLayout>
                  <PrivacyAndSecurityPage />
                </NavLayout>
              )
            }
          />
          <Route
            path="/settings"
            element={
              !user ? (
                <Error401 />
              ) : (
                <NavLayout>
                  <SettingsPage />
                </NavLayout>
              )
            }
          />
          <Route
            path="/404"
            element={
              !user ? (
                <Error404 />
              ) : (
                <NavLayout>
                  <Error404 />
                </NavLayout>
              )
            }
          />
          <Route
            path="/403"
            element={
              !user ? (
                <Error403 />
              ) : (
                <NavLayout>
                  <Error403 />
                </NavLayout>
              )
            }
          />
          <Route
            path="/401"
            element={
              !user ? (
                <Error401 />
              ) : (
                <NavLayout>
                  <Error401 />
                </NavLayout>
              )
            }
          />
          <Route
            path="/418"
            element={
              !user ? (
                <Error418 />
              ) : (
                <NavLayout>
                  <Error418 />
                </NavLayout>
              )
            }
          />
          <Route
            path="/503"
            element={
              !user ? (
                <Error503 />
              ) : (
                <NavLayout>
                  <Error503 />
                </NavLayout>
              )
            }
          />
          <Route
            path="/402"
            element={
              !user ? (
                <Error402 />
              ) : (
                <NavLayout>
                  <Error402 />
                </NavLayout>
              )
            }
          />
          <Route
            path="/500"
            element={
              !user ? (
                <Error500 />
              ) : (
                <NavLayout>
                  <Error500 />
                </NavLayout>
              )
            }
          />
          <Route
            path="/error-explanation"
            element={
              !user ? (
                <ErrorExplanationPage />
              ) : (
                <NavLayout>
                  <ErrorExplanationPage />
                </NavLayout>
              )
            }
          />
          <Route
            path="/status"
            element={
              !user ? (
                <>
                  <StatusPage />
                  <BetaOverlay />
                </>
              ) : (
                <NavLayout>
                  <StatusPage />
                  <BetaOverlay />
                </NavLayout>
              )
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <NavLayout>
                  <DashboardPage />
                </NavLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              !user ? (
                <Error404 />
              ) : (
                <NavLayout>
                  <Error404 />
                </NavLayout>
              )
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
