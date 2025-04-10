import React, { useId, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./edit-profile.less";
import VerifyBoth from "../../page-layouts/auth/verify-both/verify-both";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import { validateName, validateEmailField } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function EditProfile({
  isFormSubmitSuccess = false,
  user = {
    firstName: "",
    lastName: "",
    gender: "male",
    email: "",
    phone: {
      countryCode: "91",
      mobile: "",
      isValidNumber: false,
    },
  },
  isEmail = true,
  emailLevel = "hard",
  primaryEmail = {},
  isMobile = true,
  mobileLevel = "hard",
  primaryPhone = {},
  isLogoutButton = true,
  isSkipButton = true,
  error = null,
  verifyDetailsProp = {},
  onEditProfileSubmit = () => { },
  onLogoutButtonClick = () => { },
  onSkipButtonClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const fNameInputId = useId();
  const lNameInputId = useId();
  const emailInputId = useId();

  const validateEmail = (value) => {
    if ((isEmail && emailLevel === "hard") || value) {
      return validateEmailField(value);
    }
    return true;
  };

  const isEmailRequired = useMemo(() => {
    if (emailLevel === "soft") {
      return ` (${t("resource.common.optional_lower")})`;
    }
    if (emailLevel === "hard") {
      return "*";
    }
    return "";
  }, [emailLevel]);

  const isMobileRequired = useMemo(() => {
    if (mobileLevel === "soft") {
      return t("resource.common.optional_lower");
    }
    if (mobileLevel === "hard") {
      return t("resource.common.required_lower");
    }
    return "";
  }, [mobileLevel]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    clearErrors,
  } = useForm({
    defaultValues: user,
  });

  useEffect(() => {
    reset({ ...user });
  }, [user]);

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  return (
    <div className={styles.containerWrapper}>
      {!isFormSubmitSuccess ? (
        <>
          <form onSubmit={handleSubmit(onEditProfileSubmit)}>
            <div className={styles.editProfileTitle}>{t("resource.common.complete_signup")}</div>
            <div
              className={`${styles.inputGroup} ${styles.editProfileNameInput} ${errors?.firstName ? styles.errorInput : ""
                }`}
            >
              <label className={styles.inputTitle} htmlFor={fNameInputId}>
                {t("resource.common.first_name")}*
              </label>
              <input
                id={fNameInputId}
                type="text"
                maxLength="30"
                {...register("firstName", {
                  validate: (value) =>
                    validateName(value) || t("resource.common.please_enter_valid_first_name"),
                  maxLength: {
                    value: 30,
                    message: t("resource.common.maximum_30_characters_allowed"),
                  },
                })}
              />
              {errors?.firstName && (
                <p className={styles.errorText}>{errors?.firstName?.message}</p>
              )}
            </div>
            <div
              className={`${styles.inputGroup} ${styles.editProfileNameInput} ${errors.lastName ? styles.errorInput : ""
                }`}
            >
              <label className={styles.inputTitle} htmlFor={lNameInputId}>
                {t("resource.common.last_name")}*
              </label>
              <input
                id={lNameInputId}
                type="text"
                maxLength="30"
                {...register("lastName", {
                  validate: (value) =>
                    validateName(value) || t("resource.common.please_enter_valid_last_name"),
                  maxLength: {
                    value: 30,
                    message: t("resource.common.maximum_30_characters_allowed"),
                  },
                })}
              />
              {errors?.lastName && (
                <p className={styles.errorText}>{errors.lastName.message}</p>
              )}
            </div>
            <div className={styles.genderRadioContainer}>
              <label className={styles.radioContainer}>
                {t("resource.common.male")}
                <input type="radio" value="male" {...register("gender")} />
                <span className={styles.checkmark} />
              </label>
              <label className={styles.radioContainer}>
                {t("resource.common.female")}
                <input type="radio" value="female" {...register("gender")} />
                <span className={styles.checkmark} />
              </label>
              <label className={styles.radioContainer}>
                {t("resource.common.other")}
                <input type="radio" value="unisex" {...register("gender")} />
                <span className={styles.checkmark} />
              </label>
            </div>
            {isEmail && (
              <div
                className={`${styles.inputGroup} ${styles.editProfileEmail} ${errors.email ? styles.errorInput : ""
                  }`}
              >
                <label className={styles.inputTitle} htmlFor={emailInputId}>
                  {`${t("resource.common.email")}${isEmailRequired}`}
                </label>
                <input
                  id={emailInputId}
                  type="text"
                  disabled={primaryEmail?.verified}
                  {...register("email", {
                    validate: (value) =>
                      validateEmail(value) ||
                      t("resource.common.please_enter_valid_email_address"),
                  })}
                />
                {errors.email && (
                  <p className={styles.errorText}>{errors.email.message}</p>
                )}
              </div>
            )}
            {isMobile && (
              <div className={styles.editProfileMobileInput}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (isMobileRequired === "required" || value?.mobile) {
                        return (
                          value.isValidNumber ||
                          t("resource.common.enter_valid_phone_number")
                        );
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <MobileNumber
                      mobile={field.value.mobile}
                      countryCode={field.value.countryCode}
                      error={error}
                      disable={primaryPhone?.verified}
                      isRequired={isMobileRequired}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </div>
            )}
            {errors.root && (
              <div className={styles.editProfileAlert}>
                <span className={styles.alertMessage}>
                  {errors.root.message}
                </span>
              </div>
            )}
            <button className={styles.continueBtn} type="submit">
              {t("resource.common.continue")}
            </button>
          </form>
          {isLogoutButton && (
            <button className={styles.logoutBtn} onClick={onLogoutButtonClick}>
              {t("resource.profile.logout")}
            </button>
          )}
          {isSkipButton && (
            <button className={styles.skipBtn} onClick={onSkipButtonClick}>
              {t("resource.profile.skip_caps")}
            </button>
          )}
        </>
      ) : (
        <VerifyBoth {...verifyDetailsProp} />
      )}
    </div>
  );
}

export default EditProfile;
