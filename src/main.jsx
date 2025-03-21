import { StrictMode, Suspense, lazy } from "react";
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
