/**
 * FyButton Component
 *
 * A versatile and customizable button component for React applications.
 * This component allows for different styles, sizes, and additional elements such as icons.
 *
 * @param {React.ReactNode} children - The content inside the button, typically text or other elements.
 * @param {string} className - Optional custom CSS class(es) to apply to the button.
 * @param {string} variant - The style variant of the button. Options might include "contained", "outlined", etc.
 * @param {string} size - The size of the button. Common options could be "small", "medium", "large".
 * @param {string} color - The color theme of the button, such as "primary", "secondary", etc.
 * @param {boolean} fullWidth - If true, the button will expand to fill its container's width.
 * @param {boolean} isLoading - If true, the button will be disabled and loading animation will be visible.
 * @param {React.ReactNode} startIcon - An icon or element to be placed at the start of the button content.
 * @param {React.ReactNode} endIcon - An icon or element to be placed at the end of the button content.
 * @param {string} ariaLabel - An accessible label for screen readers.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref to the button element.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Additional attributes to be passed to the button element.
 *
 * @returns {JSX.Element} A customizable button element with optional icons, accessible label, and flexible styling options.
 */

import React, { forwardRef } from "react";
import * as styles from "./fy-button.less";
import Loader from "../../loader/loader";

const FyButton = forwardRef(
  (
    {
      children,
      className,
      variant = "contained",
      size = "medium",
      color = "primary",
      fullWidth = false,
      startIcon = <></>,
      endIcon = <></>,
      ariaLabel = "",
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const customClassName = `${styles.button} ${styles[color]} ${fullWidth ? styles.fullWidth : ""} ${styles[variant]} ${styles[size]} ${className ?? ""} `;

    return (
      <button
        type="button"
        className={customClassName}
        aria-label={ariaLabel}
        {...props}
        disabled={props?.disabled || isLoading}
        ref={ref}
      >
        {isLoading ? (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={`${styles.loader} ${styles[variant]} ${styles[color]} ${styles[size]}`}
          />
        ) : (
          <>
            {startIcon} <span>{children}</span> {endIcon}
          </>
        )}
      </button>
    );
  }
);

export default FyButton;
