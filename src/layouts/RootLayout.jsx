import React, { Suspense, memo } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import Watermark from "antd/es/watermark";
import Spin from "antd/es/spin";
import Skeleton from "antd/es/skeleton";
import DelayedFallback from "../components/common/DelayedFallback";

function RootLayout() {
  return (
    <div className="root-layout">
      <div className="navbar-container">
        <Suspense fallback={<DelayedFallback initialFallback={<Spin fullscreen tip="getting things ready..." delay={500} />} delayedFallback={<Spin fullscreen tip="your internet connection seems to be very slow today..." />} delay={5000} />}>
          <NavBar />
        </Suspense>
      </div>
      <Watermark content={["MockMetrics", "Test Mode"]} inherit={false} zIndex={-1} offset={["30","30"]} gap={["75", "75"]}>
        <div className="container">
          <Suspense fallback={<Skeleton active />}>
            <Outlet />
          </Suspense>
        </div>
      {/* Footer */}
      </Watermark>
    </div>
  );
}

export default memo(RootLayout);