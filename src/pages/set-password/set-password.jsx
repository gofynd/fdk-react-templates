import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { validatePasswordField } from "../../helper/utils";
import * as styles from "./set-password.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import { useGlobalTranslation } from "fdk-core/utils";

function SetPassword({ error = null, onSetPasswordSubmit = () => { } }) {
  const { t } = useGlobalTranslation("translation");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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

  return (
    <form
      className={styles.setWrapper}
      onSubmit={handleSubmit(onSetPasswordSubmit)}
    >
      <div className={styles.setContentTitle}>{t("resource.auth.create_new_password")}</div>
      <div
        className={`${styles.setInputGroup} ${errors.newPassword ? `${styles.errorInput}` : ""}`}
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
              <SvgWrapper
                svgSrc={!showPassword ? "show-password" : "hide-password"}
              />
            </span>
          )}
        </div>
        {errors.newPassword && (
          <p className={styles.errorText}>{errors.newPassword.message}</p>
        )}
      </div>

      <div
        className={`${styles.setInputGroup} ${errors.confirmNewPassword ? `${styles.errorInput}` : ""
          }`}
      >
        <label className={styles.setInputTitle} htmlFor="confirmNewPassword">
          {t("resource.auth.confirm_new_password")}
        </label>
        <div className={styles.flexItem}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmNewPassword", {
              validate: (value) =>
                value === getValues("newPassword") || t("resource.auth.password_does_not_match"),
            })}
          />
          {watch("confirmNewPassword") && (
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <SvgWrapper
                svgSrc={
                  !showConfirmPassword ? "show-password" : "hide-password"
                }
              />
            </span>
          )}
        </div>
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
        {t("resource.auth.set_password")}
      </button>
    </form>
  );
}

export default SetPassword;
