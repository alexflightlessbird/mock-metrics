import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SessionProvider } from "./context/auth/SessionContext.jsx";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")).render(
  <StrictMode>
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
      <SessionProvider>
        <App />
      </SessionProvider>
    </ConfigProvider>
  </StrictMode>
);
