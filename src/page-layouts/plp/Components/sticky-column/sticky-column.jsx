import React, { useEffect, useRef } from "react";
import { isRunningOnClient } from "../../../../helper/utils";

const StickyColumn = ({ className, topOffset = 0, children }) => {
  const elementRef = useRef(null);
  const lastKnownY = useRef(0);
  const currentTop = useRef(0);
  const pendingRaf = useRef(false);

  const colStyle = {
    position: "sticky",
    alignSelf: "start",
    willChange: "top",
  };

  useEffect(() => {
    if (isRunningOnClient()) {
      getInitialValues();
      window?.addEventListener("scroll", checkPosition);
      return () => {
        window?.removeEventListener("scroll", checkPosition);
      };
    }
  }, []);

  const getInitialValues = () => {
    lastKnownY.current = window?.scrollY || 0;
    currentTop.current = 0;
    pendingRaf.current = false;
  };

  const checkPosition = () => {
    if (pendingRaf.current) return;
    pendingRaf.current = true;
    requestAnimationFrame(() => {
      if (elementRef?.current) {
        const { top } = elementRef?.current.getBoundingClientRect();
        const maxTop =
          top + window?.scrollY - elementRef?.current.offsetTop + topOffset;
        const minTop =
          elementRef?.current.clientHeight - window?.innerHeight + 30;
        if (window?.scrollY < lastKnownY.current) {
          currentTop.current -= window?.scrollY - lastKnownY.current;
        } else {
          currentTop.current += lastKnownY.current - window?.scrollY;
        }
        lastKnownY.current = window?.scrollY;
        currentTop.current = Math.min(
          Math.max(currentTop.current, -minTop),
          maxTop,
          topOffset
        );
        elementRef.current.style.top = `${currentTop.current}px`;
        pendingRaf.current = false;
      }
    });
  };

  return (
    <div className={className} style={colStyle} ref={elementRef}>
      {children}
    </div>
  );
};

export default StickyColumn;
