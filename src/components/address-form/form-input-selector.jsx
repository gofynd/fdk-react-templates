import React from "react";
import { Controller } from "react-hook-form";
import FyInput from "../core/fy-input/fy-input";
import FyInputGroup from "../core/fy-input-group/fy-input-group";
import FyDropdown from "../core/fy-dropdown/fy-dropdown";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import * as styles from "./form-input-selector.less";

const FormInputSelector = ({ formData, control }) => {
  const {
    display = "",
    enum: options = [],
    key = "",
    placeholder = "",
    regex = "",
    showRegexInput = false,
    required = false,
    type = "",
    error_message = "",
    countryCode,
    disabled = false,
  } = formData;
  const getInput = ({ error, field }) => {
    switch (type) {
      case "checkbox":
      case "radio": {
        return (
          <FyInputGroup
            name={key}
            options={options}
            label={display}
            type={type}
            required={required}
            error={error}
            value={field?.value}
            onChange={field?.onChange}
          />
        );
      }
      case "list": {
        return (
          <FyDropdown
            name={key}
            error={error}
            options={options}
            onChange={field?.onChange}
            value={field?.value}
            required={required}
            label={display}
            placeholder={placeholder}
            containerClassName={styles.customClass}
          />
        );
      }
      case "mobile": {
        return (
          <MobileNumber
            mobile={field?.value?.mobile}
            label={`${display}${required ? " *" : ""}`}
            error={error}
            isRequired={required}
            onChange={field?.onChange}
            placeholder={placeholder}
            countryCode={countryCode}
            containerClassName={styles.customClass}
            inputClassName={styles.mobileInput}
            labelClassName={styles.mobileLabel}
            telInputClassName={styles.telInput}
          />
        );
      }
      default: {
        return (
          <FyInput
            name={key}
            label={display}
            type={type}
            multiline={type === "textarea"}
            required={required}
            placeholder={placeholder}
            error={error}
            errorMessage={error?.message}
            value={field.value}
            inputSize="medium"
            containerClassName={styles.customClass}
            onChange={(event) => {
              field?.onChange(event?.target?.value);
            }}
            disabled={disabled}
          />
        );
      }
    }
  };

  return (
    <Controller
      name={key}
      control={control}
      rules={formData.validation}
      render={({ field, fieldState: { error } }) => {
        return getInput({ field, error });
      }}
    />
  );
};

export default FormInputSelector;
