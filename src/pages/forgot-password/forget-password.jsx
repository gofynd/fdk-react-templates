import React, { useId, useEffect } from "react";
import { useForm } from "react-hook-form";
import { validateEmailField } from "../../helper/utils";
import * as styles from "./forget-password.less";
import { useGlobalTranslation } from "fdk-core/utils";

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
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  return (
    <div>
      <h1 className={styles.forgotPasswordTitle}>{t("resource.auth.reset_your_password")}</h1>
      {!isFormSubmitSuccess ? (
        <div className={styles.forgotPasswordWrapper}>
          <form onSubmit={handleSubmit(onForgotPasswordSubmit)}>
            <div className={styles.forgotPasswordInputGroup}>
              <label className={styles.loginInputTitle} htmlFor={emailInputId}>
                {t("resource.common.email")}
              </label>
              <input
                id={emailInputId}
                type="text"
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
            {errors.root && (
              <div className={styles.forgotPasswordAlert}>
                <span className={styles.alertMessage}>
                  {errors.root?.details?.error ?? errors.root?.message}
                </span>
              </div>
            )}
            {/* Extension slot: above_reset_button */}
            <button
              className={styles.forgotPasswordSubmitBtn}
              disabled={!isValid}
              type="submit"
            >
              {t("resource.auth.reset_password_caps")}
            </button>
          </form>
          <button className={styles.loginLink} onClick={onBackToLoginClick}>
            {t("resource.auth.back_to_login")}
          </button>
          {/* Extension slot: below_reset_button */}
        </div>
      ) : (
        <div className={styles.submitWrapper}>
          <p className={styles.submitSuccessMsg}>
            {t("resource.common.reset_link_sent")}
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
