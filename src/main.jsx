import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
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
}

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <ModalsProvider>
          <AuthProvider>
            <Notifications />
            <App onReady={removeLoadingScreen} />
            {/* <App /> */}
          </AuthProvider>
          <ReactQueryDevtools />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
