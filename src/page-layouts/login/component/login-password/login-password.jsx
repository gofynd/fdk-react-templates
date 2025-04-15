import React, { useState, useId, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { checkIfNumber, validatePasswordField } from "../../../../helper/utils";
import * as styles from "./login-password.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import MobileNumber from "../../../auth/mobile-number/mobile-number";
import { useGlobalTranslation } from "fdk-core/utils";

function loginPassword({
  loginButtonText,
  error = null,
  isForgotPassword = true,
  onForgotPasswordClick = () => { },
  onLoginFormSubmit = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const usernameInputId = useId();
  const passwordInputId = useId();
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [showInputNumber, setShowInputNumber] = useState(false);

  const togglePasswordDisplay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPasswordShow((prevState) => !prevState);
  };

  const handleForgotPasswordClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onForgotPasswordClick(e);
  };

  const {
    handleSubmit,
    register,
    setValue,
    control,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      phone: {
        countryCode: "91",
        mobile: "",
        isValidNumber: false,
      },
      password: "",
    },
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (error) {
      clearErrors();
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  useEffect(() => {
    if (checkIfNumber(watch("username"))) {
      setValue("phone.mobile", watch("username"));
      setShowInputNumber(true);
    }
  }, [watch("username")]);

  useEffect(() => {
    if (errors?.root) {
      clearErrors("root");
    }
  }, [watch("password"), watch("username"), watch("phone")]);

  const handleFormSubmit = ({ username, phone, password }) => {
    const data = {
      username: showInputNumber
        ? `${phone.countryCode}${phone.mobile}`
        : username,
      password,
    };
    onLoginFormSubmit(data);
  };

  return (
    <form
      className={styles.loginInputWrapper}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className={styles.loginMobileInput}>
        <div
          className={`${styles.loginInputGroup} ${errors?.username || errors?.phone || errors?.root ? styles.error : ""}`}
        >
          <label className={styles.loginInputTitle} htmlFor={usernameInputId}>
            {t("resource.auth.login.email_or_phone")}
          </label>
          {!showInputNumber ? (
            <input
              id={usernameInputId}
              type="text"
              {...register("username", {
                validate: (value) => {
                  if (showInputNumber) {
                    return true;
                  }
                  return !!value || "Please enter valid username";
                },
              })}
            />
          ) : (
            <Controller
              name="phone"
              control={control}
              rules={{
                validate: (value) => {
                  if (!showInputNumber) {
                    return true;
                  }
                  return (
                    value.isValidNumber || t("resource.common.enter_valid_phone_number")
                  );
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <MobileNumber
                  isShowLabel={false}
                  isFocused={true}
                  mobile={field.value.mobile}
                  countryCode={field.value.countryCode}
                  error={error}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
          )}
          {(errors?.username || errors?.phone) && (
            <p className={styles.loginAlert}>
              {errors?.phone?.message || errors?.username?.message}
            </p>
          )}
        </div>
        <div
          className={`${styles.loginInputGroup} ${errors?.password || errors?.root ? styles.error : ""}`}
        >
          <div style={{ position: "relative" }}>
            <label className={styles.loginInputTitle} htmlFor={passwordInputId}>
              Password
            </label>
            <input
              id={passwordInputId}
              type={isPasswordShow ? "text" : "password"}
              {...register("password", {
                validate: (value) =>
                  validatePasswordField(value) ||
                  "Password must be at least 8 characters and contain at least 1 letter, 1 number and 1 special character.",
              })}
            />
            {watch("password") && (
              <button
                className={styles.passwordToggle}
                onClick={togglePasswordDisplay}
                aria-label={!isPasswordShow ? "Show Password" : "Hide Password"}
              >
                <SvgWrapper
                  svgSrc={!isPasswordShow ? "show-password" : "hide-password"}
                />
              </button>
            )}
          </div>
          {(errors?.password || errors?.root) && (
            <p className={styles.loginAlert}>
              {errors?.password?.message || errors?.root?.message}
            </p>
          )}
        </div>

        {isForgotPassword && (
          <div className={styles.forgotBtnWrapper}>
            <button
              className={styles.forgotBtn}
              onClick={handleForgotPasswordClick}
            >
              {t("resource.auth.login.forgot_password")}
            </button>
          </div>
        )}
      </div>

      <button className={styles.loginButton} type="submit">
        {loginButtonText}
      </button>
    </form>
  );
}

export default loginPassword;
