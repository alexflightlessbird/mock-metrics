import React from "react";
import { Outlet } from "react-router-dom";
//imports

function RootLayout() {
  return (
    <div>
      {/* Nav bar */}
      <div className="container">
        <Outlet />
      </div>
      {/* Footer */}
    </div>
  );
}

export default RootLayout;
