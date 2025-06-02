import React, { useState, useEffect } from "react";

export const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window?.innerWidth <= breakpoint);
      }
    };

    handleResize();

    window?.addEventListener("resize", handleResize);
    return () => {
      window?.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
};
