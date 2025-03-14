import React from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
