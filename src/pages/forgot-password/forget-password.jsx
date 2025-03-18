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
      setError("email", error);
    } else {
      clearErrors("email");
    }
  }, [error]);

  return (
    <div className={styles.forgetPasswordWrapper}>
      <h1 className={styles.forgotPasswordTitle}>Reset Your Password</h1>
      {!isFormSubmitSuccess ? (
        <div className={styles.forgotPasswordWrapper}>
          <form onSubmit={handleSubmit(onForgotPasswordSubmit)}>
            <div
              className={`${styles.forgotPasswordInputGroup} ${errors.email ? styles.errorInput : ""}`}
            >
              <label className={styles.loginInputTitle} htmlFor={emailInputId}>
                Email
              </label>
              <input
                id={emailInputId}
                type="text"
                placeholder="example@gmail.com"
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
            {/* Extension slot: above_reset_button */}
            <button className={styles.forgotPasswordSubmitBtn} type="submit">
              RESET PASSWORD
            </button>
          </form>
          <div className={styles.loginLink}>
            <button className={styles.loginBtn} onClick={onBackToLoginClick}>
              Back to login
            </button>
          </div>
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
