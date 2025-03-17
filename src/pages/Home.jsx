import React from "react";
import { setDocumentTitle } from "../utils/helpers";

function Home() {
  setDocumentTitle({ isHomePage: true });
  return <div>Welcome to MockMetrics</div>;
}

export default Home;
