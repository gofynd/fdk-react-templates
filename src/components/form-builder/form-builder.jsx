/**
 * FormBuilder Component
 *
 * A form generation and management component for React applications. It dynamically generates form fields based on the `data` prop
 * and handles form submission with built-in success messaging.
 *
 * @param {object} data - Object containing the form structure, including inputs, title, and description.
 * @param {function} onFormSubmit - Callback function triggered when the form is submitted. Receives the form data as an argument.
 * @param {boolean} isLoading - Loading state depending on which page loader is displayed.
 * @param {string} [successMessage="Enquiry Submitted"] - Message displayed upon successful form submission.
 *
 * @returns {JSX.Element} A dynamically generated form with input fields and submission logic.
 */

import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./form-builder.less";
import FyInput from "../core/fy-input/fy-input";
import FyInputGroup from "../core/fy-input-group/fy-input-group";
import FyDropdown from "../core/fy-dropdown/fy-dropdown";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import FyButton from "../core/fy-button/fy-button";
import FyImage from "../core/fy-image/fy-image";
import Loader from "../loader/loader";
import { useGlobalTranslation } from "fdk-core/utils";

const FormBuilder = ({
  data,
  onFormSubmit,
  successMessage,
  isLoading = false,
}) => {
  const { t } = useGlobalTranslation("translation");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { inputs = [], header_image, title, description } = data;
  const { control, handleSubmit } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = useCallback(async (data) => {
    try {
      await onFormSubmit?.(data);
      setShowSuccessMessage(true);
    } catch (error) { }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.formLoader}>
        <Loader
          containerClassName={styles.loaderContainer}
          loaderClassName={styles.customLoader}
        />
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.form}>
        {header_image && (
          <FyImage alt={title} src={header_image} isFixedAspectRatio={false} />
        )}

        {title && <div className={styles.title}>{title}</div>}
        {description && <div className={styles.description}>{description}</div>}

        {showSuccessMessage ? (
          <div className={styles.submissionMessage}>{successMessage || t("resource.common.enquiry_submitted")}</div>
        ) : (
          <form className={styles.inputs} onSubmit={handleSubmit(onSubmit)}>
            {inputs?.map((formData) => (
              <FormInputSelector
                formData={formData}
                control={control}
                key={formData?.key}
              />
            ))}
            <FyButton className={styles.submitBtn} type="submit">
              {t("resource.facets.submit")}
            </FyButton>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;

const FormInputSelector = ({ formData, control }) => {
  const { t } = useGlobalTranslation("translation");
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
            height="40px"
            labelClassName={styles.mobileLabel}
            backgroundColor="transparent"
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
          message: `${t("resource.common.please_enter")} ${display}`,
        },
        ...(showRegexInput && {
          pattern: {
            value: new RegExp(regex),
            message: error_message || `${t("resource.common.please_enter")} ${display}`,
          },
        }),
      }}
      render={({ field, fieldState: { error } }) => getInput({ field, error })}
    />
  );
};
