// Dependency imports
import { useEffect, useState } from "react";

export default function Countdown({ initialSeconds, onComplete, children }) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onComplete();
      return;
    }

    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [secondsRemaining, onComplete]);

  return children(secondsRemaining);
}
