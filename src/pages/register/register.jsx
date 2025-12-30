import React, { useId, useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  validateName,
  validateEmailField,
  validatePasswordField,
  translateDynamicLabel,
} from "../../helper/utils";
import * as styles from "./register.less";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import VerifyBoth from "../../page-layouts/auth/verify-both/verify-both";
import LoginRegisterToggle from "../../page-layouts/auth/login-register-toggle/login-register-toggle";
import { useGlobalTranslation } from "fdk-core/utils";
import ShowPasswordIcon from "../../assets/images/show-password.svg";
import HidePasswordIcon from "../../assets/images/hide-password.svg";
import TermPrivacy from "../../page-layouts/login/component/term-privacy/term-privacy";

function Register({
  isFormSubmitSuccess = false,
  isMobile = true,
  mobileLevel = "hard",
  mobileInfo,
  isEmail = true,
  emailLevel = "hard",
  error = null,
  loginButtonLabel,
  onLoginButtonClick = () => { },
  onRegisterFormSubmit = () => { },
  verifyDetailsProp = {},
}) {
  const { t } = useGlobalTranslation("translation");
  const firstnameId = useId();
  const lastnameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

  const validateEmail = (value) => {
    if ((isEmail && emailLevel === "hard") || value) {
      return validateEmailField(value);
    }
    return true;
  };
  const validatePassword = (value) => validatePasswordField(value);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "male",
      consent: false,
      email: "",
      phone: {
        ...mobileInfo,
      },
      password: "",
      confirmPassword: "",
    },
  });

  const isEmailRequired = useMemo(() => {
    if (emailLevel === "soft") {
      return (
        <>
          {t("resource.common.email")} <span className={styles.optional}>({t("resource.common.optional")})</span>
        </>
      );
    }
    if (emailLevel === "hard") {
      return (
        <>
          {t("resource.common.email")} <span className={styles.required}>*</span>
        </>
      );
    }
    return "";
  }, [emailLevel]);

  const isMobileRequired = useMemo(() => {
    if (mobileLevel === "soft") {
      return "optional";
    }
    if (mobileLevel === "hard") {
      return "required";
    }
    return "";
  }, [mobileLevel]);

  const togglePasswordDisplay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPasswordShow((prevState) => !prevState);
  };

  const toggleConfirmPasswordDisplay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsConfirmPasswordShow((prevState) => !prevState);
  };

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
        <form
          className={styles.registerFormWrapper}
          onSubmit={handleSubmit(onRegisterFormSubmit)}
        >
          <h1 className={styles.title}>{t("resource.common.complete_signup")}</h1>
          <div
            className={`${styles.registerNameInput} ${errors.firstName ? styles.errorInput : ""}`}
          >
            <label className={styles.inputTitle} htmlFor={firstnameId}>
              {t("resource.common.first_name")}<span className={styles.required}> *</span>
            </label >
            <input
              id={firstnameId}
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
            {
              errors.firstName && (
                <p className={styles.errorText}>{errors.firstName.message}</p>
              )
            }
          </div >
          <div
            className={`${styles.registerNameInput} ${errors.lastName ? styles.errorInput : ""}`}
          >
            <label className={styles.inputTitle} htmlFor={lastnameId}>
              {t("resource.common.last_name")}<span className={styles.required}> *</span>
            </label >
            <input
              id={lastnameId}
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
            {
              errors.lastName && (
                <p className={styles.errorText}>{errors.lastName.message}</p>
              )
            }
          </div >
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
          {
            isEmail && (
              <div
                className={`${styles.registerEmail} ${errors.email ? styles.errorInput : ""}`}
              >
                <label className={styles.inputTitle} htmlFor={emailId}>
                  {isEmailRequired}
                </label>
                <input
                  id={emailId}
                  type="text"
                  {...register("email", {
                    validate: (value) =>
                      validateEmail(value) || t("resource.common.please_enter_valid_email_address"),
                  })}
                />
                {errors.email && (
                  <p className={styles.errorText}>{errors.email.message}</p>
                )}
              </div>
            )
          }
          {
            isMobile && (
              <div className={styles.registerMobileInput}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (isMobileRequired === "required" || value?.mobile) {
                        return (
                          value.isValidNumber || t("resource.common.enter_valid_phone_number")
                        );
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <MobileNumber
                      mobile={field.value.mobile}
                      countryCode={field.value.countryCode}
                      isRequired={isMobileRequired}
                      error={error}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </div>
            )
          }
          <div
            className={`${styles.registerPasswordInput} ${errors.password ? styles.errorInput : ""
              }`}
          >
            <label className={styles.inputTitle} htmlFor={passwordId}>
              {t("resource.auth.login.password")}<span className={styles.required}> *</span>
            </label >
            <div className={styles.passwordInputWrapper}>
              <input
                id={passwordId}
                type={isPasswordShow ? "text" : "password"}
                {...register("password", {
                  validate: (value) =>
                    validatePassword(value) ||
                    t("resource.auth.password_requirements"),
                })}
              />
              {watch("password") && (
                <button
                  className={styles.passwordToggle}
                  aria-label={
                    !isPasswordShow
                      ? t("resource.auth.show_confirm_password")
                      : t("resource.auth.hide_confirm_password")
                  }
                  onClick={togglePasswordDisplay}
                >
                  {!isPasswordShow ? (
                    <ShowPasswordIcon />
                  ) : (
                    <HidePasswordIcon />
                  )}
                </button>
              )}
            </div>
            {
              errors.password && (
                <p className={styles.errorText}>{errors.password.message}</p>
              )
            }
          </div >
          <div
            className={`${styles.registerConfirmPasswordInput} ${errors.confirmPassword ? styles.errorInput : ""
              }`}
          >
            <label className={styles.inputTitle} htmlFor={confirmPasswordId}>
              {t("resource.auth.confirm_password")}<span className={styles.required}> *</span>
            </label >
            <div className={styles.passwordInputWrapper}>
              <input
                id={confirmPasswordId}
                type={isConfirmPasswordShow ? "text" : "password"}
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: t("resource.auth.please_enter_a_valid_password"),
                  },
                  validate: (value) =>
                    value === getValues("password") ||
                    t("resource.auth.password_does_not_match"),
                })}
              />
              {watch("confirmPassword") && (
                <button
                  className={styles.passwordToggle}
                  aria-label={
                    !isConfirmPasswordShow
                      ? t("resource.auth.show_confirm_password")
                      : t("resource.auth.hide_confirm_password")
                  }
                  onClick={toggleConfirmPasswordDisplay}
                >
                  {!isConfirmPasswordShow ? (
                    <ShowPasswordIcon />
                  ) : (
                    <HidePasswordIcon />
                  )}
                </button>
              )}
            </div>
            {
              errors.confirmPassword && (
                <p className={styles.errorText}>
                  {errors.confirmPassword.message}
                </p>
              )
            }
          </div >
          {
            errors.root && (
              <div className={styles.loginAlert}>
                <span>{translateDynamicLabel(errors.root.message, t)}</span>
              </div>
            )
          }

          {/* Extension slot: above_register_button */}

          <div className={styles.consentWrapper}>
            <Controller
              name="consent"
              control={control}
              rules={{
                required:t('resource.auth.terms_and_condition'),
              }}
              render={({ field, fieldState: { error } }) => (
                <div className={styles.consentWrapper}>
                  <TermPrivacy
                    onChange={field.onChange}
                    checked={field.value}
                  />
                  {error && <p className={styles.errorText}>{error.message}</p>}
                </div>
              )}
            />
          </div>

          <button className={styles.registerBtn} type="submit">
            {t("resource.common.continue")}
          </button>

          <LoginRegisterToggle
            label={loginButtonLabel || t("resource.auth.login.go_to_login")}
            onClick={onLoginButtonClick}
          />
        </form >
      ) : (
        <VerifyBoth {...verifyDetailsProp} />
      )
      }
    </div >
  );
}

export default Register;
