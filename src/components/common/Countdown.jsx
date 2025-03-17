import React, { useEffect, useState } from "react";

function Countdown({ initialSeconds, onComplete, children }) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (secondsRemaining === 0) return;

    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [secondsRemaining]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onComplete();
    }
  }, [secondsRemaining, onComplete]);

  return children(secondsRemaining);
}

export default Countdown;
