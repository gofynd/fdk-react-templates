/**
 * FyInputGroup Component
 *
 * A versatile input group component that can render either a group of radio buttons or checkboxes.
 * This component supports various styles, error handling, and label configurations, and is built using React with CSS modules for styling.
 *
 * @param {string} type - The type of input, either "radio" or "checkbox". Determines the behavior and appearance of the input group.
 * @param {Array<{ label: string, value: any }>} options - An array of objects representing the options for the input group. Each object must have a `label` (display text) and `value` (input value).
 * @param {string} name - The name attribute for the input elements, useful for grouping them in a form.
 * @param {string} label - The text label displayed above the input group.
 * @param {boolean} showAsterik - If true, an asterisk (*) will be displayed next to the label to indicate that the field is required.
 * @param {boolean} required - If true, the input group is marked as required.
 * @param {boolean} error - If true, the input group will display an error state, typically with an error message.
 * @param {string} inputClassName - Optional custom CSS class(es) to apply to each input element (radio or checkbox).
 * @param {string} labelClassName - Optional custom CSS class(es) to apply to the main label element.
 * @param {string} inputLabelClassName - Optional custom CSS class(es) to apply to the label associated with each input element.
 * @param {string} containerClassName - Optional custom CSS class(es) to apply to the container element that wraps the entire input group.
 * @param {any} value - The currently selected value(s) for the input group. If `type` is "checkbox", this should be an array; otherwise, it should be a single value.
 * @param {function(any): void} onChange - A callback function that is triggered when the selected value(s) change. Receives the updated value(s) as an argument.
 *
 * @returns {JSX.Element} A customizable input group component with options for radio buttons or checkboxes, label, error message, and various styling options.
 */

import React, { useCallback, useEffect, useState, useMemo } from "react";
import * as styles from "./fy-input-group.less";

const FyInputGroup = ({
  type = "radio",
  options = [],
  name = "",
  label = "",
  showAsterik = true,
  required = false,
  error,
  inputClassName = "",
  labelClassName = "",
  inputLabelClassName = "",
  containerClassName = "",
  value,
  onChange = (value) => {},
}) => {
  const isCheckbox = useMemo(() => type === "checkbox", [type]);
  const [selectedValue, setSelectedValue] = useState(isCheckbox ? [] : "");

  const handleChange = useCallback(
    (inputValue) => {
      const updatedValue = isCheckbox ? [...selectedValue] : inputValue;
      if (isCheckbox && typeof updatedValue === "object") {
        const index = updatedValue.indexOf(inputValue);

        if (index > -1) {
          updatedValue?.splice(index, 1);
        } else {
          updatedValue?.push(inputValue);
        }
      }

      setSelectedValue(updatedValue);
      onChange?.(updatedValue);
    },
    [selectedValue, isCheckbox]
  );

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const customInputClassName = useMemo(
    () => `${styles.fyInput} ${inputClassName ?? ""}`,
    [inputClassName]
  );
  const customLabelClassName = useMemo(
    () => `${styles.label} ${labelClassName ?? ""}`,
    [labelClassName]
  );
  const customContainerClassName = useMemo(
    () => `${styles.inputGroupContainer}  ${containerClassName ?? ""}`,
    [containerClassName]
  );
  const customInputLabelClassName = useMemo(
    () => `${styles.inputLabel}  ${inputLabelClassName ?? ""}`,
    [inputLabelClassName]
  );

  return (
    <div className={customContainerClassName}>
      {label && (
        <label className={customLabelClassName}>
          {label}
          {required && showAsterik && (
            <span className={styles.required}> *</span>
          )}
        </label>
      )}
      <div className={styles.fyInputGroup}>
        {options.map((option) => (
          <label key={option.value} className={styles.inputContainer}>
            <input
              type={type}
              name={name}
              value={option.value}
              onChange={() => handleChange(option.value)}
              checked={
                isCheckbox
                  ? selectedValue.includes(option.value)
                  : selectedValue === option.value
              }
              className={customInputClassName}
            />
            <span className={customInputLabelClassName}>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  );
};

export default FyInputGroup;
