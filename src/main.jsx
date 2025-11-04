import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import App from "./App";
import { MantineProvider, SegmentedControl, createTheme } from "@mantine/core";
import "./assets/css/globals.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./pages/Error";
import { ModalProvider as ModalContext } from "./context/ModalContext";
import { MobileProvider } from "./context/MobileContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  cursorType: "pointer",
  autoContrast: true,
  components: {
    Button: {
      defaultProps: {
        tabIndex: 0,
      },
    },
    ActionIcon: {
      defaultProps: {
        tabIndex: 0,
      },
    },
    SegmentedControl: {
      styles: {
        control: {
          tabIndex: 0,
        },
      },
    },
  },
});

const removeLoadingScreen = () => {
  const loadingElement = document.getElementById("app-loading");
  if (loadingElement) {
    setTimeout(() => {
      loadingElement.style.opacity = "0";
      loadingElement.style.transition = "opacity 500ms ease-out";
      setTimeout(() => loadingElement.remove(), 500);
    }, 1000);
  }
};

const notificationsStyles = {
  root: {
    zIndex: 9999,
  }
}

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={Error}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <MobileProvider>
            <ModalsProvider>
              <ModalContext>
                <ThemeProvider>
                  <AuthProvider>
                    <Notifications styles={notificationsStyles} />
                    <App onReady={removeLoadingScreen} />
                    {/* <App /> */}
                  </AuthProvider>
                </ThemeProvider>
                {/* <ReactQueryDevtools /> */}
              </ModalContext>
            </ModalsProvider>
          </MobileProvider>
        </MantineProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
