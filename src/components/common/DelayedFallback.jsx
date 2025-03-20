import React, { useState, useEffect, memo } from "react";

const DelayedFallback = memo(({ initialFallback, delayedFallback, delay }) => {
    const [fallback, setFallback] = useState(initialFallback);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFallback(delayedFallback);
        }, delay);

        return () => clearTimeout(timer);
    }, [initialFallback, delayedFallback, delay]);

    return fallback;
})

export default DelayedFallback;