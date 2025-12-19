import { useEffect, useState } from "react";
// cancel animation frame on unmount to prevent memory leaks
export default function CountUp({ end, duration = 1000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frameId;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId); // Cleanup on unmount
  }, [end, duration]);

  return <>{count}</>;
}