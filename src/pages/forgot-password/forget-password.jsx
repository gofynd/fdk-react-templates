import React, { useId, useEffect } from "react";
import { useForm } from "react-hook-form";
import { validateEmailField } from "../../helper/utils";
import * as styles from "./forget-password.less";
import { useGlobalTranslation } from "fdk-core/utils";
import LoginRegisterToggle from "../../page-layouts/auth/login-register-toggle/login-register-toggle";

function ForgetPassword({
  isFormSubmitSuccess = false,
  error = null,
  onForgotPasswordSubmit = () => { },
  onBackToLoginClick = () => { },
  onResendEmailClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const emailInputId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setError,
    clearErrors,
    watch,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (error) {
      setError("email", error);
    } else {
      clearErrors("email");
    }
  }, [error]);

  return (
    <div className={styles.forgetPasswordWrapper}>
      <h1
        className={`${styles.forgotPasswordTitle} ${isFormSubmitSuccess ? styles.formSubmitted : ""}`}
      >
        Reset Your Password
      </h1>
      {!isFormSubmitSuccess ? (
        <div className={styles.forgotPasswordWrapper}>
          <form onSubmit={handleSubmit(onForgotPasswordSubmit)}>
            <div
              className={`${styles.forgotPasswordInputGroup} ${errors.email ? styles.errorInput : ""}`}
            >
              <label className={styles.loginInputTitle} htmlFor={emailInputId}>
                {t("resource.common.email")}
              </label>
              <input
                id={emailInputId}
                type="text"
                placeholder="example@gmail.com"
                {...register("email", {
                  validate: (value) =>
                    validateEmailField(value) ||
                    t("resource.common.please_enter_valid_email_address"),
                })}
              />
              {errors.email && (
                <p className={styles.emailErrorMessage}>
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Extension slot: above_reset_button */}
            <button className={styles.forgotPasswordSubmitBtn} type="submit">
              RESET PASSWORD
            </button>
          </form>
          <LoginRegisterToggle
            label="BACK TO LOGIN"
            onClick={onBackToLoginClick}
          />
          {/* Extension slot: below_reset_button */}
        </div>
      ) : (
        <div className={styles.submitWrapper}>
          <p className={styles.submitSuccessMsg}>
            Reset Link has been sent to {watch("email")} email address.
          </p>
          <button
            className={styles.resendBtn}
            onClick={() => onResendEmailClick(getValues())}
          >
            {t("resource.auth.resend_email")}
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
