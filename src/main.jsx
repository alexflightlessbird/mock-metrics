import { StrictMode, Suspense, lazy, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import Spin from "antd/es/spin";
import { SessionProvider } from "./context/auth/SessionContext.jsx";

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
  },
};

const DelayedFallback = ({ initialFallback, delayedFallback, delay }) => {
  const [fallback, setFallback] = useState(initialFallback);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFallback(delayedFallback);
    }, delay);

    return () => clearTimeout(timer);
  }, [delayedFallback, delay]);

  return fallback;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense
      fallback={
        <DelayedFallback
          initialFallback={<Spin fullscreen tip="loading overall" />}
          delayedFallback={<Spin fullscreen tip="still loading overall..." />}
          delay={5000} // 5 seconds
        />
      }
    >
      <ConfigProvider theme={themeConfig}>
        <Suspense
          fallback={
            <DelayedFallback
              initialFallback={<Spin fullscreen tip="loading session" />}
              delayedFallback={
                <Spin fullscreen tip="still loading session..." />
              }
              delay={5000} // 5 seconds
            />
          }
        >
          <SessionProvider>
            <Suspense
              fallback={
                <DelayedFallback
                  initialFallback={<Spin fullscreen tip="loading app" />}
                  delayedFallback={
                    <Spin fullscreen tip="still loading app..." />
                  }
                  delay={5000} // 5 seconds
                />
              }
            >
              <App />
            </Suspense>
          </SessionProvider>
        </Suspense>
      </ConfigProvider>
    </Suspense>
  </StrictMode>
);
