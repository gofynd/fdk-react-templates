import React, { useId, useEffect } from "react";
import { useForm } from "react-hook-form";
import { validateEmailField } from "../../helper/utils";
import * as styles from "./forget-password.less";

function ForgetPassword({
  isFormSubmitSuccess = false,
  error = null,
  onForgotPasswordSubmit = () => {},
  onBackToLoginClick = () => {},
  onResendEmailClick = () => {},
}) {
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
      <h1 className={styles.forgotPasswordTitle}>Reset Your Password</h1>
      {!isFormSubmitSuccess ? (
        <div className={styles.forgotPasswordWrapper}>
          <form onSubmit={handleSubmit(onForgotPasswordSubmit)}>
            <div className={styles.forgotPasswordInputGroup}>
              <label className={styles.loginInputTitle} htmlFor={emailInputId}>
                Email
              </label>
              <input
                id={emailInputId}
                type="text"
                {...register("email", {
                  validate: (value) =>
                    validateEmailField(value) ||
                    "Please enter valid email address",
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
              RESET PASSWORD
            </button>
          </form>
          <button className={styles.loginLink} onClick={onBackToLoginClick}>
            Back to login
          </button>
          {/* Extension slot: below_reset_button */}
        </div>
      ) : (
        <div className={styles.submitWrapper}>
          <p className={styles.submitSuccessMsg}>
            Reset Link has been sent to your primary email address.
          </p>
          <button
            className={styles.resendBtn}
            onClick={() => onResendEmailClick(getValues())}
          >
            RESEND EMAIL
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
