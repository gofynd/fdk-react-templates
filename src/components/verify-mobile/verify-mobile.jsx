import React, { useEffect, useId, useState } from "react";
import ForcedLtr from "../forced-ltr/forced-ltr";
import * as styles from "./verify-mobile.less";
import { useForm } from "react-hook-form";
import { useGlobalTranslation, useFPI, useGlobalStore } from "fdk-core/utils";
import { validatePasswordField } from "../../helper/utils";
import ShowPasswordIcon from "../../assets/images/show-password.svg";
import HidePasswordIcon from "../../assets/images/hide-password.svg";
import CountDown from "../count-down/count-down";

export default function VerifyMobile({
  submittedMobile = "",
  mobileOtpResendTime = 0,
  error = null,
  handleSubmitMobileResetPassword = () => {},
  onResendMobileOtpClick = () => {},
  showTitle = true,
  ResetPassword = "",
  resendValues = "",
  setSubmittedMobile = () => {},
  setIsFormSubmitSuccess = () => {},
  setShowInputNumber = () => {},
  reset = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const validatePassword = (value) => validatePasswordField(value);
  const { resend_otp_time = 0 } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setError,
    clearErrors,
    resetField,
    watch,
  } = useForm({
    defaultValues: {
      otp: "",
      password: "",
    },
    reValidateMode: "onChange",
  });

  const mobileOtpId = useId();
  const passwordId = useId();
  const [isResendBtnDisabled, setIsResendBtnDisabled] = useState(true);

  useEffect(() => {
    if (resend_otp_time > 0) {
      setIsResendBtnDisabled(true);
    }
  }, [resend_otp_time]);

  const [isPasswordShow, setIsPasswordShow] = useState(false);

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  const mobileOtp = watch("otp");

  useEffect(() => {
    if (mobileOtp && mobileOtp.length < 4) {
      clearErrors("root");
    }
  }, [mobileOtp]);

  const onChangeButton = () => {
    resetField("otp");
    resetField("password");
    setIsFormSubmitSuccess(false);
    reset();
    fpi.custom.setValue("resend_otp_time", 0);
    setShowInputNumber(false);
  };

  const resendOtp = () => {
    resetField("otp");
    if (resendValues) {
      const phone = {
        action: "resend",
        ...resendValues,
      };

      onResendMobileOtpClick(phone);
    } else {
      onResendMobileOtpClick();
    }
  };

  const togglePasswordDisplay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPasswordShow((prevState) => !prevState);
  };

  return (
    <div className={styles.formWrapper}>
      {showTitle && (
        <h3 className={styles.header}>{t("resource.auth.verify_mobile")}</h3>
      )}
      <form
        className={styles.verifyOtpForm}
        onSubmit={handleSubmit(handleSubmitMobileResetPassword)}
      >
        <div>
          <p className={styles.otpSentMessage}>
            {`${t("resource.common.otp_sent_to")}`}
            {<ForcedLtr text={submittedMobile} />}
            <button
              type="button"
              className={styles.changeBtn}
              onClick={onChangeButton}
            >
              {t("resource.common.change_caps")}
            </button>
          </p>
          <div
            className={`${styles.inputGroup} ${errors?.otp || errors?.root ? styles.error : ""}`}
          >
            <label className={styles.label} htmlFor={mobileOtpId}>
              {t("resource.common.enter_otp")}
            </label>
            <input
              id={mobileOtpId}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={4}
              dir="ltr"
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 4);
              }}
              {...register("otp", {
                required: "Please enter the OTP",
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: "Please enter the valid OTP",
                },
              })}
            />
          </div>
        </div>
        <div
          className={`${styles.loginInputGroup} ${errors?.password || errors?.root ? styles.error : ""}`}
        >
          <label className={styles.loginInputTitle} htmlFor={passwordId}>
            {t("resource.auth.new_password")}
            <span className={styles.required}> *</span>
          </label>
          <div
            style={{ position: "relative" }}
            className={styles.passwordInputWrapper}
          >
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

          {(errors.root || errors?.otp || errors.password) && (
            <div className={styles.loginAlert}>
              <span className={styles.errorText}>
                {errors?.otp?.message ||
                  errors?.root?.message ||
                  errors.password.message}
              </span>
            </div>
          )}
        </div>
        <button className={styles.submitBtn} type="submit">
          {t("resource.facets.submit_action")}
        </button>
      </form>
      <div className={styles.resendOtpWrapper}>
        <button
          className={styles.resendOtpBtn}
          onClick={resendOtp}
          disabled={isResendBtnDisabled}
        >
          {t("resource.common.resend_otp")}
          {isResendBtnDisabled && (
            <>
              {" ("}
              <CountDown
                mobileOtpResendTime={mobileOtpResendTime}
                setIsResendBtnDisabled={setIsResendBtnDisabled}
              />
              {")"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
