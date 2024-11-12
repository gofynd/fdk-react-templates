import { useState, useEffect } from "react";

export const useViewport = (minBreakpoint = 0, maxBreakpoint = Infinity) => {
  const [isInRange, setIsInRange] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const width = window?.innerWidth;
        setIsInRange(width >= minBreakpoint && width <= maxBreakpoint);
      }
    };

    handleResize();

    window?.addEventListener("resize", handleResize);
    return () => {
      window?.removeEventListener("resize", handleResize);
    };
  }, [minBreakpoint, maxBreakpoint]);

  return isInRange;
};
