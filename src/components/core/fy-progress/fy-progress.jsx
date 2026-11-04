/**
 * FyProgress Component
 *
 * A linear, determinate progress bar for React applications - used, for
 * example, to show per-file upload progress.
 *
 * @param {number} value - Current progress value from 0 to 100.
 * @param {string} size - The size (thickness) of the progress bar, either "small", "medium", or "large".
 * @param {string} color - The color theme of the progress fill, such as "primary", "success", or "error".
 * @param {boolean} showLabel - If true, renders the numeric percentage next to the bar.
 * @param {string} className - Optional custom CSS class(es) to apply to the progress fill element.
 * @param {string} containerClassName - Optional custom CSS class(es) to apply to the outer track container.
 * @param {string} ariaLabel - An accessible label for screen readers.
 *
 * @returns {JSX.Element} A determinate linear progress bar.
 */

import React from "react";
import * as styles from "./fy-progress.less";

const clamp = (value) => Math.min(100, Math.max(0, Number(value) || 0));

const FyProgress = ({
  value = 0,
  size = "medium",
  color = "primary",
  showLabel = false,
  className = "",
  containerClassName = "",
  ariaLabel = "Progress",
}) => {
  const clampedValue = clamp(value);

  return (
    <div className={`${styles.progressWrapper} ${containerClassName}`}>
      <div
        className={`${styles.progressTrack} ${styles[size]}`}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${styles.progressFill} ${styles[color]} ${className}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className={styles.progressLabel}>{clampedValue}%</span>
      )}
    </div>
  );
};

export default FyProgress;
