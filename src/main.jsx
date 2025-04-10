// Dependency imports
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";

// Provider imports
import { SessionProvider } from "./app/providers/SessionProvider";
import AppProviders from "./app/providers/AppProviders";

// Component imports
import App from "./App";

setTimeout(() => {
  const splashScreen = document.getElementById("splash-screen");
  if (splashScreen) {
    splashScreen.style.opacity = "0";
    setTimeout(() => {
      splashScreen.remove();
    }, 500);
  }
}, 3000);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <SessionProvider>
        <App />
      </SessionProvider>
    </AppProviders>
  </StrictMode>
);