/**
 * FyCheckbox Component
 *
 * A single, standalone boolean checkbox atom for React applications. Unlike
 * `FyInputGroup` (which manages an array of selected keys across a set of
 * options), this component controls exactly one boolean value - suited for
 * single acceptance/toggle checkboxes such as "Same as business address" or
 * "I accept the Terms & Conditions".
 *
 * @param {boolean} checked - Whether the checkbox is checked.
 * @param {function(boolean): void} onChange - Callback invoked with the new checked value.
 * @param {React.ReactNode} label - Label rendered next to the checkbox.
 * @param {boolean} required - If true, an asterisk is appended to the label.
 * @param {boolean} disabled - If true, the checkbox cannot be interacted with.
 * @param {object|string} error - Error state; if truthy, renders `errorMessage` (or `error.message`) below the checkbox.
 * @param {string} errorMessage - Explicit error message to render when `error` is truthy.
 * @param {string} name - The name attribute for the input element.
 * @param {string} id - The id attribute for the input element (also used to associate the label).
 * @param {string} className - Optional custom CSS class(es) to apply to the input element.
 * @param {string} containerClassName - Optional custom CSS class(es) to apply to the wrapping container.
 * @param {string} labelClassName - Optional custom CSS class(es) to apply to the label element.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to the checkbox input element.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Additional attributes passed to the input element.
 *
 * @returns {JSX.Element} A single controlled checkbox with label and error support.
 */

import React, { forwardRef, useId } from "react";
import * as styles from "./fy-checkbox.less";

const FyCheckbox = forwardRef(
  (
    {
      checked = false,
      onChange = () => {},
      label = "",
      required = false,
      disabled = false,
      error,
      errorMessage = "",
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
    const displayErrorMessage = errorMessage || error?.message;

    return (
      <div className={`${styles.checkboxContainer} ${containerClassName}`}>
        <label
          htmlFor={inputId}
          className={`${styles.checkboxLabelWrapper} ${
            disabled ? styles.disabled : ""
          }`}
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            name={name}
            checked={checked}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked, event)}
            className={`${styles.checkbox} ${
              error ? styles.error : ""
            } ${className}`}
            {...props}
          />
          {label && (
            <span className={`${styles.label} ${labelClassName}`}>
              {label}
              {required && <span className={styles.required}> *</span>}
            </span>
          )}
        </label>
        {error && displayErrorMessage && (
          <div className={styles.errorMessage}>{displayErrorMessage}</div>
        )}
      </div>
    );
  }
);

export default FyCheckbox;
