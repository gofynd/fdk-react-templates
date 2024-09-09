import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./form-builder.less";
import FyInput from "../core/fy-input/fy-input";
import FyInputGroup from "../core/fy-input-group/fy-input-group";
import FyDropdown from "../core/fy-dropdown/fy-dropdown";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import FyButton from "../core/fy-button/fy-button";
import FyImage from "../core/fy-image/fy-image";

const FormBuilder = ({ data, onFormSubmit }) => {
  const { inputs = [], header_image, title, description } = data;
  const { control, handleSubmit } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = useCallback(async (data) => {
    onFormSubmit?.(data);
  }, []);

  return (
    <div className={styles.formContainer}>
      <div className={styles.form}>
        {header_image && (
          <FyImage alt={title} src={header_image} isFixedAspectRatio={false} />
        )}

        {title && <div className={styles.title}>{title}</div>}
        {description && <div className={styles.description}>{description}</div>}

        <form className={styles.inputs} onSubmit={handleSubmit(onSubmit)}>
          {inputs?.map((formData) => (
            <FormInputSelector
              formData={formData}
              control={control}
              key={formData?.key}
            />
          ))}
          <FyButton type="submit">SUBMIT</FyButton>
        </form>
      </div>
    </div>
  );
};

export default FormBuilder;

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
      case "dropdown": {
        return (
          <FyDropdown
            error={error}
            options={options}
            onChange={field?.onChange}
            value={field?.value}
            required={required}
            label={display}
            placeholder={placeholder}
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
            inputClassName={styles.mobileInput}
            labelClassName={styles.mobileLabel}
            telInputClassName={styles.telInput}
            placeholder={placeholder}
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
            value-={field.value}
            inputSize="medium"
            onChange={(event) => {
              field?.onChange(event?.target?.value);
            }}
          />
        );
      }
    }
  };

  return (
    <Controller
      name={key}
      control={control}
      rules={{
        required: {
          value: required,
          message: `Please enter ${display}`,
        },
        ...(showRegexInput && {
          pattern: {
            value: new RegExp(regex),
            message: error_message || `Please enter ${display}`,
          },
        }),
      }}
      render={({ field, fieldState: { error } }) => getInput({ field, error })}
    />
  );
};
