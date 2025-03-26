import React from "react";
import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import App from "./App";
import "./App.css";
import { SessionProvider } from "./context/auth/SessionContext";

setTimeout(() => {
  const splashScreen = document.getElementById("splash-screen");
  if (splashScreen) {
    splashScreen.style.opacity = "0";
    setTimeout(() => {
      splashScreen.remove();
    }, 500);
  }
}, 3000);

const theme = createTheme({
  colors: {
    darkBlue: ["#0a1f3c"],
    lightGray: ["#f7f5f3"],
    primaryBlue: ["#2dace6"],
  },
  fontFamily:
    "Urbanist, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  headings: {
    fontFamily: "Raleway, sans-serif",
    sizes: {
      h1: "1.5rem",
      h2: "1.25rem",
      h3: "1rem",
      h4: "0.875rem",
      h5: "0.75rem",
      h6: "0.6rem",
    },
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    xxl: "1.5rem",
  },
  autoContrast: true,
  cursorType: "pointer",
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);