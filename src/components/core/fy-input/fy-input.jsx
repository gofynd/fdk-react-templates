/**
 * FyInput Component
 *
 * A customizable input component that supports various styles, error handling, and label configurations.
 * This component is built using React and uses CSS modules for styling.
 *
 * @param {string} label - The text label displayed above or beside the input field.
 * @param {string} labelVariant - The style variant of the label. Options might include "normal", "floating"
 * @param {string} inputVariant - The style variant of the input field. Common options could be "outlined", "no-border", "underline".
 * @param {string} inputClassName - Optional custom CSS class(es) to apply to the input element.
 * @param {string} containerClassName - Optional custom CSS class(es) to apply to the container element that wraps the label and input.
 * @param {string} labelClassName - Optional custom CSS class(es) to apply to the label element.
 * @param {boolean} showAsterik - If true, an asterisk (*) will be displayed next to the label to indicate that the field is required.
 * @param {boolean} multiline - If true, text area element is rendered.
 * @param {string} id - The ID to be applied to the input element, useful for linking labels and inputs or for testing purposes.
 * @param {boolean} error - If true, the input field will display an error state (e.g., changing the border color to red).
 * @param {string} errorMessage - The message displayed below the input field when `error` is true.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Additional props that are passed to the underlying input element, such as `type`, `value`, `onChange`, etc.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to the input element.
 *
 * @returns {JSX.Element} A customizable input field with label, error message, and various styling options.
 */

import React, { forwardRef, useMemo } from "react";
import * as styles from "./fy-input.less";

const FyInput = forwardRef(
  (
    {
      label = "",
      labelVariant = "normal",
      inputVariant = "outlined",
      inputSize = "large",
      inputClassName,
      containerClassName,
      labelClassName,
      showAsterik = true,
      id,
      error = false,
      errorMessage = "Invalid input",
      multiline = false,
      required,
      ...props
    },
    ref
  ) => {
    const customInputClassName = useMemo(
      () =>
        `${styles.fyInput} ${styles[inputSize]} ${multiline ? styles.fyTextArea : ""} ${styles[inputVariant]} ${error ? styles.inputError : ""} ${inputClassName ?? ""} `,
      [inputVariant, inputClassName, error, inputSize]
    );
    const customLabelClassName = useMemo(
      () => `${styles.label} ${styles[labelVariant]} ${labelClassName ?? ""}`,
      [labelClassName, labelVariant]
    );
    const customContainerClassName = useMemo(
      () => `${styles.inputContainer}  ${containerClassName ?? ""}`,
      [containerClassName]
    );

    return (
      <div className={customContainerClassName}>
        {label && (
          <label htmlFor={id} className={customLabelClassName}>
            {label}
            {required && showAsterik && <span> *</span>}
          </label>
        )}
        {multiline ? (
          <textarea
            rows={5}
            {...props}
            id={id}
            className={customInputClassName}
            ref={ref}
          ></textarea>
        ) : (
          <input
            {...props}
            id={id}
            className={customInputClassName}
            ref={ref}
          />
        )}
        {error && <div className={styles.error}>{errorMessage}</div>}
      </div>
    );
  }
);

export default FyInput;
