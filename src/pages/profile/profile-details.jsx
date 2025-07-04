import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./profile-details.less";
import { GENDER_OPTIONS } from "../../helper/constant";
import FyInput from "../../components/core/fy-input/fy-input";
import FyButton from "../../components/core/fy-button/fy-button";
import { deepEqual } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function ProfileDetails({ userData, handleSave }) {
  const { t } = useGlobalTranslation("translation");
  const [isLoading, setIsLoading] = useState(false);
  const { firstName, lastName, gender } = userData;

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      firstName,
      lastName,
      gender,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      firstName,
      lastName,
      gender,
    });
  }, [userData]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        await handleSave(data);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleSave]
  );

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const genderValue = watch("gender");

  const disableSave = useMemo(
    () =>
      deepEqual(
        {
          firstName: firstNameValue?.trim(),
          lastName: lastNameValue?.trim(),
          gender: genderValue?.trim(),
        },
        userData
      ) ||
      errors?.firstName ||
      errors?.lastName,
    [
      userData,
      firstNameValue,
      lastNameValue,
      genderValue,
      errors?.firstName,
      errors?.lastName,
    ]
  );

  const handleKeyDown = (event) => {
    /** Allow specific keys */
    const allowedKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Tab",
      "Shift",
      " ",
    ];

    const isAlphaNumeric = /^[a-zA-Z0-9]$/.test(event.key); // Allow numeric keys

    if (!isAlphaNumeric && !allowedKeys.includes(event.key)) {
      event.preventDefault(); // Block invalid input
    }
  };

  return (
    <div className={styles.profileDetailsContainer}>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <FyInput
            id="firstName"
            label={t("resource.common.first_name")}
            showAsterik
            inputVariant="underline"
            containerClassName={styles.inputContainer}
            type="text"
            maxLength={64}
            error={!!errors?.firstName}
            errorMessage={
              errors?.firstName?.type === "maxLength"
                ? t("resource.common.maximum_64_characters_allowed")
                : errors?.firstName?.type === "pattern"
                  ? t("resource.common.please_enter_valid_first_name")
                  : t("resource.common.required")
            }
            {...register("firstName", {
              required: true,
              maxLength: {
                value: 64,
                message: t("resource.common.maximum_64_characters_allowed"),
              },
              pattern: {
                value: /^[A-Za-z\s'-]+$/,
                message: t("resource.common.please_enter_valid_first_name"),
              },
            })}
            required
          />

          <FyInput
            id="lastName"
            label={t("resource.common.last_name")}
            showAsterik
            inputVariant="underline"
            containerClassName={styles.inputContainer}
            type="text"
            maxLength={64}
            error={!!errors?.lastName}
            errorMessage={
              errors?.lastName?.type === "maxLength"
                ? t("resource.common.maximum_64_characters_allowed")
                : errors?.lastName?.type === "pattern"
                  ? t("resource.common.please_enter_valid_last_name")
                  : t("resource.common.required")
            }
            {...register("lastName", {
              required: true,
              maxLength: {
                value: 64,
                message: t("resource.common.maximum_50_characters_allowed"),
              },
              pattern: {
                value: /^[A-Za-z\s'-]+$/,
                message: t("resource.common.please_enter_valid_last_name"),
              },
            })}
            required
          />

          <div className={styles.radioInputContainer}>
            <div className={styles.formLabel}>
              {t("resource.profile.gender")}{" "}
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.radioContent}>
              {GENDER_OPTIONS.map(({ value, display }) => (
                <div key={value} className={styles.radioInput}>
                  <input
                    className={styles.formRadioInput}
                    id={`gender-${value}`}
                    name="gender"
                    type="radio"
                    {...register("gender")}
                    value={value}
                  />
                  <label
                    className={styles.radioLabel}
                    htmlFor={`gender-${value}`}
                  >
                    {t(display)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.actionContainer}>
            <FyButton
              isLoading={isLoading}
              disabled={disableSave}
              className={styles.submitBtn}
              type="submit"
            >
              {t("resource.facets.save")}
            </FyButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileDetails;
