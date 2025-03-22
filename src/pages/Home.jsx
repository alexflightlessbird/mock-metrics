import React from "react";
import { setDocumentTitle } from "../utils/helpers";

export default function Home() {
  setDocumentTitle({ isHomePage: true });
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to MockMetrics</p>
    </div>
  );
}
