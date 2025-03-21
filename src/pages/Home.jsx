import React from "react";
import { setDocumentTitle } from "../utils/helpers";

export default function Home() {
  setDocumentTitle({ isHomePage: true });
  return (
    <div style={{ height: "200vh" }}>
      <h1>Home Page</h1>
      <p>Welcome to MockMetrics</p>
    </div>
  );
}
