import React, { useId, useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  validateName,
  validateEmailField,
  validatePasswordField,
} from "../../helper/utils";
import * as styles from "./register.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import VerifyBoth from "../../page-layouts/auth/verify-both/verify-both";
import LoginRegisterToggle from "../../page-layouts/auth/login-register-toggle/login-register-toggle";

function Register({
  isFormSubmitSuccess = false,
  isMobile = true,
  mobileLevel = "hard",
  mobileInfo,
  isEmail = true,
  emailLevel = "hard",
  error = null,
  loginButtonLabel = "GO TO LOGIN",
  onLoginButtonClick = () => {},
  onRegisterFormSubmit = () => {},
  verifyDetailsProp = {},
}) {
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
          Email <span className={styles.optional}>(optional)</span>
        </>
      );
    }
    if (emailLevel === "hard") {
      return (
        <>
          Email <span className={styles.required}>*</span>
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
          <h1 className={styles.title}>Complete Signup</h1>
          <div
            className={`${styles.registerNameInput} ${errors.firstName ? styles.errorInput : ""}`}
          >
            <label className={styles.inputTitle} htmlFor={firstnameId}>
              First Name<span className={styles.required}> *</span>
            </label>
            <input
              id={firstnameId}
              type="text"
              maxLength="30"
              {...register("firstName", {
                validate: (value) =>
                  validateName(value) || "Please enter a valid first name",
                maxLength: {
                  value: 30,
                  message: "Maximum 30 characters allowed",
                },
              })}
            />
            {errors.firstName && (
              <p className={styles.errorText}>{errors.firstName.message}</p>
            )}
          </div>
          <div
            className={`${styles.registerNameInput} ${errors.lastName ? styles.errorInput : ""}`}
          >
            <label className={styles.inputTitle} htmlFor={lastnameId}>
              Last Name<span className={styles.required}> *</span>
            </label>
            <input
              id={lastnameId}
              type="text"
              maxLength="30"
              {...register("lastName", {
                validate: (value) =>
                  validateName(value) || "Please enter a valid last name",
                maxLength: {
                  value: 30,
                  message: "Maximum 30 characters allowed",
                },
              })}
            />
            {errors.lastName && (
              <p className={styles.errorText}>{errors.lastName.message}</p>
            )}
          </div>
          <div className={styles.genderRadioContainer}>
            <label className={styles.radioContainer}>
              Male
              <input type="radio" value="male" {...register("gender")} />
              <span className={styles.checkmark} />
            </label>
            <label className={styles.radioContainer}>
              Female
              <input type="radio" value="female" {...register("gender")} />
              <span className={styles.checkmark} />
            </label>
            <label className={styles.radioContainer}>
              Other
              <input type="radio" value="unisex" {...register("gender")} />
              <span className={styles.checkmark} />
            </label>
          </div>
          {isEmail && (
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
                    validateEmail(value) || "Please enter valid email address",
                })}
              />
              {errors.email && (
                <p className={styles.errorText}>{errors.email.message}</p>
              )}
            </div>
          )}
          {isMobile && (
            <div className={styles.registerMobileInput}>
              <Controller
                name="phone"
                control={control}
                rules={{
                  validate: (value) => {
                    if (isMobileRequired === "required" || value?.mobile) {
                      return (
                        value.isValidNumber || "Please enter valid phone number"
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
          )}
          <div
            className={`${styles.registerPasswordInput} ${
              errors.password ? styles.errorInput : ""
            }`}
          >
            <label className={styles.inputTitle} htmlFor={passwordId}>
              Password<span className={styles.required}> *</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                id={passwordId}
                type={isPasswordShow ? "text" : "password"}
                {...register("password", {
                  validate: (value) =>
                    validatePassword(value) ||
                    "Password must be at least 8 characters and contain at least 1 letter, 1 number and 1 special character.",
                })}
              />
              {watch("password") && (
                <button
                  className={styles.passwordToggle}
                  aria-label={
                    !isPasswordShow
                      ? "Show confirm password"
                      : "Hide confirm password"
                  }
                  onClick={togglePasswordDisplay}
                >
                  <SvgWrapper
                    svgSrc={!isPasswordShow ? "show-password" : "hide-password"}
                  />
                </button>
              )}
            </div>
            {errors.password && (
              <p className={styles.errorText}>{errors.password.message}</p>
            )}
          </div>
          <div
            className={`${styles.registerConfirmPasswordInput} ${
              errors.confirmPassword ? styles.errorInput : ""
            }`}
          >
            <label className={styles.inputTitle} htmlFor={confirmPasswordId}>
              Confirm Password<span className={styles.required}> *</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                id={confirmPasswordId}
                type={isConfirmPasswordShow ? "text" : "password"}
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === getValues("password") ||
                    "Password does not match",
                })}
              />
              {watch("confirmPassword") && (
                <button
                  className={styles.passwordToggle}
                  aria-label={
                    !isConfirmPasswordShow
                      ? "Show confirm password"
                      : "Hide confirm password"
                  }
                  onClick={toggleConfirmPasswordDisplay}
                >
                  <SvgWrapper
                    svgSrc={
                      !isConfirmPasswordShow ? "show-password" : "hide-password"
                    }
                  />
                </button>
              )}
            </div>
            {errors.confirmPassword && (
              <p className={styles.errorText}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {errors.root && (
            <div className={styles.loginAlert}>
              <span>{errors.root.message}</span>
            </div>
          )}

          {/* Extension slot: above_register_button */}

          <button className={styles.registerBtn} type="submit">
            Continue
          </button>

          <LoginRegisterToggle
            label={loginButtonLabel}
            onClick={onLoginButtonClick}
          />
        </form>
      ) : (
        <VerifyBoth {...verifyDetailsProp} />
      )}
    </div>
  );
}

export default Register;
