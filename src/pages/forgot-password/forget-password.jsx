import React, { useId, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { validateEmailField } from "../../helper/utils";
import * as styles from "./forget-password.less";
import { useGlobalTranslation } from "fdk-core/utils";
import LoginRegisterToggle from "../../page-layouts/auth/login-register-toggle/login-register-toggle";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import { checkIfNumber } from "../../helper/utils";
import VerifyMobile from "../../components/verify-mobile/verify-mobile";
import { useNavigate, useFPI } from "fdk-core/utils";

function ForgetPassword({
  isFormSubmitSuccess = false,
  setIsFormSubmitSuccess = () => {},
  error = null,
  onForgotPasswordSubmit = () => {},
  onBackToLoginClick = () => {},
  onResendEmailClick = () => {},
  handleSubmitMobileResetPassword = () => {},
  forgotPasswordData,
  isResetSuccess,
  handleForgotPasswordSubmit = () => {},
  openForgotPassword = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const emailInputId = useId();
  const [showInputNumber, setShowInputNumber] = useState(false);
  const navigate = useNavigate();
  const fpi = useFPI();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setError,
    clearErrors,
    watch,
    setValue,
    control,
    setFocus,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      phone: {
        countryCode: "91",
        mobile: "",
      },
    },
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (errors?.root) {
      clearErrors("root");
    }
  }, [watch("email"), watch("phone")]);

  useEffect(() => {
    if (checkIfNumber(watch("email"))) {
      setValue("phone.mobile", watch("email"));
      setShowInputNumber((prev) => {
        if (prev === false) {
          clearErrors("email");
          clearErrors("root");
          return true;
        }
      });
    }
  }, [watch("email")]);

  const handleKeyDown = (e) => {
    if (e.key.length !== 1) return;
    if (/[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~ ]/.test(e.key)) {
      const { mobile } = getValues("phone") || {};
      e.preventDefault();
      setShowInputNumber(false);
      setValue("email", mobile + e.key);
    }
  };

  useEffect(() => {
    if (!showInputNumber) {
      setFocus("email");
    }
  }, [showInputNumber]);

  if (isResetSuccess) {
    return (
      <div className={styles.forgetPasswordWrapper}>
        <h1
          className={`${styles.forgotPasswordTitle} ${isFormSubmitSuccess ? styles.formSubmitted : ""}`}
        >
          {t("resource.auth.reset_your_password")}
        </h1>
        <div className={styles.submitWrapper}>
          <p className={styles.submitSuccessMsg}>
            Your password has been reset successfully
          </p>
          <button
            className={styles.resendBtn}
            onClick={() => navigate("/auth/login")}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  const NewPassword = () => {
    return (
      <div
        className={`${styles.registerPasswordInput} ${
          errors.password ? styles.errorInput : ""
        }`}
      >
        <label className={styles.inputTitle} htmlFor={passwordId}>
          {t("resource.auth.new_password")}
          <span className={styles.required}> *</span>
        </label>
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
              {!isPasswordShow ? <ShowPasswordIcon /> : <HidePasswordIcon />}
            </button>
          )}
        </div>
        {errors.password && (
          <p className={styles.errorText}>{errors.password.message}</p>
        )}
      </div>
    );
  };

  return (
    <div className={styles.forgetPasswordWrapper}>
      <h1
        className={`${styles.forgotPasswordTitle} ${isFormSubmitSuccess ? styles.formSubmitted : ""}`}
      >
        {t("resource.auth.reset_your_password")}
      </h1>
      {!isFormSubmitSuccess ? (
        <div className={styles.forgotPasswordWrapper}>
          <form onSubmit={handleSubmit(onForgotPasswordSubmit)}>
            <div
              className={`${styles.forgotPasswordInputGroup} ${errors.email || errors?.phone || errors?.root ? styles.errorInput : ""}`}
            >
              <label className={styles.loginInputTitle} htmlFor={emailInputId}>
                {t("resource.auth.login.email_or_phone")}
              </label>
              {!showInputNumber ? (
                <input
                  name="email"
                  id={emailInputId}
                  type="text"
                  placeholder="example@gmail.com"
                  {...register("email", {
                    validate: (value) =>
                      validateEmailField(value) ||
                      t("resource.common.please_enter_valid_email_address"),
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
                        value?.isValidNumber ||
                        t("resource.common.enter_valid_phone_number")
                      );
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <MobileNumber
                      isShowLabel={false}
                      isFocused={true}
                      mobile={field.value.mobile}
                      countryCode={field.value.countryCode}
                      error={
                        !errors?.root?.message && errors?.phone ? error : null
                      }
                      handleKeyDown={handleKeyDown}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              )}
              {!showInputNumber && (errors?.email || errors?.root) && (
                <p className={styles.emailErrorMessage}>
                  {errors?.email?.message || errors?.root?.message}
                </p>
              )}
            </div>
            {/* Extension slot: above_reset_button */}
            <button className={styles.forgotPasswordSubmitBtn} type="submit">
              {t("resource.auth.reset_password_caps")}
            </button>
          </form>
          <LoginRegisterToggle
            label={t("resource.common.back_to_login_caps")}
            onClick={onBackToLoginClick}
          />
          {/* Extension slot: below_reset_button */}
        </div>
      ) : (
        <div className={styles.submitWrapper}>
          {!showInputNumber ? (
            <>
              <p className={styles.submitSuccessMsg}>
                {t("resource.common.reset_link_sent_to")} {watch("email")}{" "}
                {t("resource.common.email_address")}.
              </p>
              <button
                className={styles.resendBtn}
                onClick={() => onResendEmailClick(getValues())}
              >
                {t("resource.auth.resend_email")}
              </button>
            </>
          ) : (
            <>
              <VerifyMobile
                showTitle={false}
                ResetPassword={<NewPassword />}
                submittedMobile={forgotPasswordData?.mobile}
                mobileOtpResendTime={forgotPasswordData?.resend_timer}
                error={error}
                handleSubmitMobileResetPassword={
                  handleSubmitMobileResetPassword
                }
                resendValues={getValues()}
                onResendMobileOtpClick={handleForgotPasswordSubmit}
                setIsFormSubmitSuccess={setIsFormSubmitSuccess}
                setShowInputNumber={setShowInputNumber}
                reset={reset}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
