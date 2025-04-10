import React, { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./verify-both.less";
import { useGlobalTranslation } from "fdk-core/utils";

function VerifyBoth({
  isShowMobileOtp = true,
  isShowEmailOtp = true,
  submittedMobile = "",
  mobileOtpResendTime = 0,
  mobileFormError = null,
  submittedEmail = "",
  emailOtpResendTime = 0,
  emailFormError = null,
  onVerifyMobileSubmit = () => { },
  onResendMobileOtpClick = () => { },
  onVerifyEmailSubmit = () => { },
  onResendEmailOtpClick = () => { },
}) {
  return (
    <div className={styles.verifyBoth}>
      {isShowMobileOtp && (
        <VerifyMobile
          error={mobileFormError}
          {...{
            submittedMobile,
            mobileOtpResendTime,
            onVerifyMobileSubmit,
            onResendMobileOtpClick,
          }}
        />
      )}
      {isShowEmailOtp && (
        <VerifyEmail
          error={emailFormError}
          {...{
            submittedEmail,
            emailOtpResendTime,
            onVerifyEmailSubmit,
            onResendEmailOtpClick,
          }}
        />
      )}
    </div>
  );
}

export default VerifyBoth;

function VerifyMobile({
  submittedMobile = "",
  mobileOtpResendTime = 0,
  error = null,
  onVerifyMobileSubmit = () => { },
  onResendMobileOtpClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setError,
    clearErrors,
    resetField,
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });
  const mobileOtpId = useId();

  const isResendBtnDisabled = mobileOtpResendTime > 0;

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  const resendOtp = () => {
    resetField("otp");
    onResendMobileOtpClick();
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.header}>{t("resource.auth.verify_mobile")}</h3>
      <form
        className={styles.verifyOtpForm}
        onSubmit={handleSubmit(onVerifyMobileSubmit)}
      >
        <div>
          <p
            className={styles.otpSentMessage}
          >{`${t("resource.common.otp_sent_to")} ${submittedMobile}`}</p>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor={mobileOtpId}>
              {t("resource.common.enter_otp")}
            </label>
            <input
              id={mobileOtpId}
              type="number"
              maxLength={4}
              {...register("otp", {
                validate: (value) => /^[0-9]{4}$/.test(value),
              })}
            />
          </div>
        </div>
        {errors.root && (
          <div className={styles.loginAlert}>
            <span>{errors.root.message}</span>
          </div>
        )}
        <button className={styles.submitBtn} type="submit" disabled={!isValid}>
          {t("resource.facets.submit_action")}
        </button>
      </form>
      <div className={styles.resendOtpWrapper}>
        <button
          className={styles.resendOtpBtn}
          onClick={resendOtp}
          disabled={isResendBtnDisabled}
        >
          {`${t("resource.common.resend_otp")}${isResendBtnDisabled ? ` (${mobileOtpResendTime}S)` : ""}`}
        </button>
      </div>
    </div>
  );
}

function VerifyEmail({
  submittedEmail = "",
  emailOtpResendTime = 0,
  error = null,
  onVerifyEmailSubmit = () => { },
  onResendEmailOtpClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setError,
    clearErrors,
    resetField,
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });
  const emailOtpId = useId();

  const isResendBtnDisabled = emailOtpResendTime > 0;

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  const resendOtp = () => {
    resetField("otp");
    onResendEmailOtpClick();
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.header}>{t("resource.auth.verify_email")}</h3>
      <form
        className={styles.verifyOtpForm}
        onSubmit={handleSubmit(onVerifyEmailSubmit)}
      >
        <div>
          <p
            className={styles.otpSentMessage}
          >{`${t("resource.common.otp_sent_to")} ${submittedEmail}`}</p>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor={emailOtpId}>
              {t("resource.common.enter_otp")}
            </label>
            <input
              id={emailOtpId}
              type="number"
              maxLength={4}
              {...register("otp", {
                validate: (value) => /^[0-9]{4}$/.test(value),
              })}
            />
          </div>
        </div>
        {errors.root && (
          <div className={styles.loginAlert}>
            <span>{errors.root.message}</span>
          </div>
        )}
        <button className={styles.submitBtn} type="submit" disabled={!isValid}>
          <span>{t("resource.facets.submit_action")}</span>
        </button>
      </form>
      <div className={styles.resendOtpWrapper}>
        <button
          className={styles.resendOtpBtn}
          onClick={resendOtp}
          disabled={isResendBtnDisabled}
        >
          {`${t("resource.common.resend_otp")}${isResendBtnDisabled ? ` (${emailOtpResendTime}S)` : ""}`}
        </button>
      </div>
    </div>
  );
}
