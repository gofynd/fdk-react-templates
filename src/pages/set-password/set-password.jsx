import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { validatePasswordField } from "../../helper/utils";
import * as styles from "./set-password.less";
import { useGlobalTranslation } from "fdk-core/utils";
import ShowPasswordIcon from "../../assets/images/show-password.svg";
import HidePasswordIcon from "../../assets/images/hide-password.svg";

function SetPassword({ error = null, onSetPasswordSubmit = () => { } }) {
  const { t } = useGlobalTranslation("translation");
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      clearErrors("root");
    }
  }, [watch("confirmNewPassword"), watch("newPassword")]);

  return (
    <form
      className={styles.setWrapper}
      onSubmit={handleSubmit(onSetPasswordSubmit)}
    >
      <div className={styles.setContentTitle}>{t("resource.auth.create_new_password")}</div>
      <div
        className={`${styles.setInputGroup} ${errors?.newPassword || errors?.root ? `${styles.errorInput}` : ""}`}
      >
        <label className={styles.setInputTitle} htmlFor="newPassword">
          {t("resource.auth.new_password")}
        </label>
        <div className={styles.flexItem}>
          <input
            type={showPassword ? "text" : "password"}
            {...register("newPassword", {
              validate: (value) =>
                validatePasswordField(value) ||
                t("resource.auth.password_requirements"),
            })}
          />
          {watch("newPassword") && (
            <span onClick={() => setShowPassword(!showPassword)}>
              {!showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
            </span>
          )}
        </div>
        {errors.newPassword && (
          <p className={styles.errorText}>{errors.newPassword.message}</p>
        )}
      </div>

      <div
        className={`${styles.setInputGroup} ${errors?.confirmNewPassword || errors?.root
          ? `${styles.errorInput}`
          : ""
          }`}
      >
        <label className={styles.setInputTitle} htmlFor="confirmNewPassword">
          {t("resource.auth.confirm_new_password")}
        </label>
        <div className={styles.flexItem}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmNewPassword", {
              required: {
                value: true,
                message: "Please enter a valid password",
              },
              validate: (value) =>
                value === getValues("newPassword") ||
                "Password didn’t match. Try again.",
            })}
          />
          {watch("confirmNewPassword") && (
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {!showConfirmPassword ? (
                <ShowPasswordIcon />
              ) : (
                <HidePasswordIcon />
              )}
            </span>
          )}
        </div>
        {(errors?.confirmNewPassword || errors?.root) && (
          <p className={styles.errorText}>
            {errors?.confirmNewPassword?.message || errors?.root?.message}
          </p>
        )}
      </div>

      <button className={styles.setSubmitBtn} type="submit">
        Set Password
      </button>
    </form>
  );
}

export default SetPassword;
