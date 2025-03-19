import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import Spin from "antd/es/spin";
import { SessionProvider } from "./context/auth/SessionContext.jsx";

const ConfigProvider = lazy(() => import("antd/es/config-provider"));
const App = lazy(() => import("./App"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<Spin fullscreen tip="loading overall" />}>
      <ConfigProvider
        theme={{
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
          },
        }}
      >
        <Suspense fallback={<Spin fullscreen tip="loading session" />}>
          <SessionProvider>
            <Suspense fallback={<Spin fullscreen tip="loading app" />}>
              <App />
            </Suspense>
          </SessionProvider>
        </Suspense>
      </ConfigProvider>
    </Suspense>
  </StrictMode>
);
