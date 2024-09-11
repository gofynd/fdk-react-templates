import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { validatePasswordField } from "../../helper/utils";
import * as styles from "./set-password.less";

function SetPassword({ error = null, onSetPasswordSubmit = () => {} }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  return (
    <form
      className={styles.setWrapper}
      onSubmit={handleSubmit(onSetPasswordSubmit)}
    >
      <div className={styles.setContentTitle}>Create New Password</div>
      <div
        className={`${styles.setInputGroup} ${errors.newPassword ? `${styles.errorInput}` : ""}`}
      >
        <label className={styles.setInputTitle} htmlFor="newPassword">
          New Password
        </label>
        <input
          type="password"
          {...register("newPassword", {
            validate: (value) =>
              validatePasswordField(value) ||
              "Password must be at least 8 characters and contain at least 1 letter, 1 number and 1 special character.",
          })}
        />
        {errors.newPassword && (
          <p className={styles.errorText}>{errors.newPassword.message}</p>
        )}
      </div>

      <div
        className={`${styles.setInputGroup} ${
          errors.confirmNewPassword ? `${styles.errorInput}` : ""
        }`}
      >
        <label className={styles.setInputTitle} htmlFor="confirmNewPassword">
          Confirm New Password
        </label>
        <input
          type="password"
          {...register("confirmNewPassword", {
            validate: (value) =>
              value === getValues("newPassword") || "Password does not match",
          })}
        />
        {errors.confirmNewPassword && (
          <p className={styles.errorText}>
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>
      {errors.root && (
        <div className={styles.loginAlert}>
          <span>{errors.root.message}</span>
        </div>
      )}

      <button className={styles.setSubmitBtn} type="submit" disabled={!isValid}>
        Set Password
      </button>
    </form>
  );
}

export default SetPassword;
