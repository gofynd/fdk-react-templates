/**
 * FySwitch Component
 *
 * A boolean toggle switch component for React applications, used for options
 * such as "GST Registered?" where a checkbox would be visually inappropriate.
 *
 * @param {boolean} checked - Whether the switch is on.
 * @param {function(boolean): void} onChange - Callback invoked with the new checked value.
 * @param {React.ReactNode} label - Label rendered next to the switch.
 * @param {string} labelPosition - Position of the label relative to the switch, either "start" or "end".
 * @param {boolean} disabled - If true, the switch cannot be interacted with.
 * @param {string} size - The size of the switch, either "small" or "medium".
 * @param {string} name - The name attribute for the underlying checkbox input.
 * @param {string} id - The id attribute for the underlying checkbox input.
 * @param {string} className - Optional custom CSS class(es) to apply to the switch track.
 * @param {string} containerClassName - Optional custom CSS class(es) to apply to the wrapping container.
 * @param {string} labelClassName - Optional custom CSS class(es) to apply to the label element.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to the underlying checkbox input element.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Additional attributes passed to the input element.
 *
 * @returns {JSX.Element} A customizable toggle switch with optional label.
 */

import React, { forwardRef, useId } from "react";
import * as styles from "./fy-switch.less";

const FySwitch = forwardRef(
  (
    {
      checked = false,
      onChange = () => {},
      label = "",
      labelPosition = "end",
      disabled = false,
      size = "medium",
      name = "",
      id,
      className = "",
      containerClassName = "",
      labelClassName = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const switchEl = (
      <span
        className={`${styles.switchTrack} ${styles[size]} ${
          checked ? styles.checked : ""
        } ${disabled ? styles.disabled : ""} ${className}`}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          name={name}
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          onChange={(event) => onChange(event.target.checked, event)}
          className={styles.switchInput}
          {...props}
        />
        <span className={styles.switchThumb} />
      </span>
    );

    return (
      <label
        htmlFor={inputId}
        className={`${styles.switchContainer} ${
          disabled ? styles.disabled : ""
        } ${containerClassName}`}
      >
        {label && labelPosition === "start" && (
          <span className={`${styles.label} ${labelClassName}`}>{label}</span>
        )}
        {switchEl}
        {label && labelPosition === "end" && (
          <span className={`${styles.label} ${labelClassName}`}>{label}</span>
        )}
      </label>
    );
  }
);

export default FySwitch;
