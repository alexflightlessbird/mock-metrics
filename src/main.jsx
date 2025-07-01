import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";

setTimeout(() => {
  const splashScreen = document.getElementById("splash-screen");
  if (splashScreen) {
    splashScreen.style.opacity = "0";
    setTimeout(() => {
      splashScreen.remove();
    }, 500);
  }
}, 3000);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <ModalsProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
          <ReactQueryDevtools />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
