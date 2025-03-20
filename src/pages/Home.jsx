import React from "react";
import { setDocumentTitle } from "../utils/helpers";

export default function Home() {
  setDocumentTitle({ isHomePage: true });
  return <div>Welcome to MockMetrics</div>;
}
