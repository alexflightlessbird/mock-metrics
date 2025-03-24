import React from "react";
import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
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
      <SessionProvider>
        <App />
      </SessionProvider>
    </MantineProvider>
  </React.StrictMode>
);

/*import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import Spin from "antd/es/spin";
import { SessionProvider } from "./context/auth/SessionContext.jsx";
import DelayedFallback from "./components/common/DelayedFallback.jsx";

const ConfigProvider = lazy(() => import("antd/es/config-provider"));
const App = lazy(() => import("./App"));

const themeConfig = {
  token: {
    colorPrimary: "#2dace6",
    colorBgBase: "#f7f5f3",
    colorTextBase: "#0a1f3c",
    fontFamily:
      'Urbanist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', // Base font family
    fontSize: 16,
  },
  components: {
    Typography: {
      fontFamilyHeading:
        'Raleway, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', // Heading font family
    },
    Steps: {
      dotCurrentSize: 9,
      dotSize: 5,
      fontSize: 12,
    },
    Button: {},
  },
};

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
    <Suspense
      fallback={
        <DelayedFallback
          initialFallback={<Spin fullscreen tip="loading" delay={500} />}
          delayedFallback={<Spin fullscreen tip="still loading..." />}
          delay={5000} // 5 seconds
        />
      }
    >
      <ConfigProvider theme={themeConfig}>
        <SessionProvider>
          <App />
        </SessionProvider>
      </ConfigProvider>
    </Suspense>
  </StrictMode>
);
*/
