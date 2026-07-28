import React, { useEffect, useRef } from "react";
import * as styles from "./tooltip.less";

function Tooltip({
  message,
  isVisible,
  onClose,
  showCloseButton = true,
  position = "top",
  className = "",
}) {
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${styles[position]} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.tooltipContent}>
        <span className={styles.tooltipMessage}>{message}</span>
        {showCloseButton && (
          <button
            className={styles.tooltipClose}
            onClick={onClose}
            aria-label="Close tooltip"
            type="button"
          >
            ×
          </button>
        )}
      </div>
      <div className={styles.tooltipArrow} />
    </div>
  );
}

export default Tooltip;
