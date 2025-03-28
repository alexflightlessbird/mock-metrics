import React from "react";
import { useNavigate } from "react-router-dom";

import Countdown from "../common/components/Countdown";
import IconButton from "../common/components/NewIconButton";
import { setDocumentTitle } from "../utils/helpers";

export default function NotFound() {
  const navigate = useNavigate();

  const handleCountdownComplete = () => {
    navigate("/", { replace: true });
  };

  setDocumentTitle({ title: "404" });

  return (
    <div>
      <h1>404 | Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Countdown initialSeconds={10} onComplete={handleCountdownComplete}>
        {(secondsRemaining) => (
          <p>
            You will be redirected to the homepage in {secondsRemaining}{" "}
            {secondsRemaining !== 1 ? "seconds" : "second"}.
          </p>
        )}
      </Countdown>
      <IconButton
        icon="home"
        buttonText="Go Now"
        onClick={() => navigate("/", { replace: true })}
      />
    </div>
  );
}
