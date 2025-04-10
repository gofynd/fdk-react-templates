import React, { useEffect, useId } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./login-otp.less";
import MobileNumber from "../../../auth/mobile-number/mobile-number";
import { useGlobalTranslation } from "fdk-core/utils";

function LoginOtp({
  mobileInfo = {
    countryCode: "91",
    mobile: "",
    isValidNumber: false,
  },
  submittedMobile = "",
  otpResendTime = 0,
  otpError = null,
  isFormSubmitSuccess = false,
  onLoginFormSubmit = () => { },
  onOtpSubmit = () => { },
  onResendOtpClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const {
    handleSubmit,
    control,
    getValues,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phone: mobileInfo,
    },
  });

  return (
    <div className={styles.loginOtpWrapper}>
      {!isFormSubmitSuccess ? (
        <form onSubmit={handleSubmit(onLoginFormSubmit)}>
          <Controller
            name="phone"
            control={control}
            rules={{
              validate: (value) => {
                if (value?.mobile && !value.isValidNumber) {
                  return t("resource.common.enter_valid_phone_number");
                }
                return true;
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <MobileNumber
                mobile={field.value.mobile}
                countryCode={field.value.countryCode}
                error={error}
                onChange={(value) => {
                  field.onChange(value);
                }}
              />
            )}
          />
          <button
            className={styles.sendOtpBtn}
            type="submit"
            disabled={!isValid}
          >
            {t("resource.auth.login.get_otp")}
          </button>
        </form>
      ) : (
        <OtpForm
          submittedMobile={submittedMobile}
          mobileInfo={getValues()}
          otpResendTime={otpResendTime}
          error={otpError}
          onOtpSubmit={onOtpSubmit}
          onResendOtpClick={onResendOtpClick}
        />
      )}
    </div>
  );
}

export default LoginOtp;

function OtpForm({
  submittedMobile = "",
  mobileInfo = {},
  otpResendTime,
  error,
  onOtpSubmit = () => { },
  onResendOtpClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const otpInputId = useId();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    watch,
    clearErrors,
    resetField,
  } = useForm();
  const mobileOtp = watch("mobileOtp");

  const isResendBtnDisabled = otpResendTime > 0;
  useEffect(() => {
    const inputEle = document?.getElementById?.(otpInputId);
    if (inputEle) {
      inputEle?.focus();
    }
  }, []);
  useEffect(() => {
    if (mobileOtp && mobileOtp.length < 4) {
      clearErrors("root");
    }
  }, [mobileOtp]);

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  const resendOtp = () => {
    resetField("mobileOtp");
    onResendOtpClick(mobileInfo);
  };

  return (
    <>
      <form
        className={styles.loginInputGroup}
        onSubmit={handleSubmit(onOtpSubmit)}
      >
        <p className={styles.otpSentMsg}>{`${t("resource.common.otp_sent_to")} ${submittedMobile}`}</p>
        <label className={styles.loginInputTitle} htmlFor={otpInputId}>
          {t("resource.common.enter_otp")}
        </label>
        <input
          id={otpInputId}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={4}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
          }}
          className={styles.otpInput}
          {...register("mobileOtp", {
            required: true,
            maxLength: 4,
          })}
        />

        {errors.root && (
          <div className={styles.alertError}>
            <span>{errors.root.message}</span>
          </div>
        )}
        <button className={styles.verifyOtpBtn} type="submit">
          {t("resource.common.continue")}
        </button>
      </form>
      <button
        className={styles.resendOtpBtn}
        onClick={resendOtp}
        disabled={isResendBtnDisabled}
      >
        {`${t("resource.common.resend_otp")}${isResendBtnDisabled ? ` (${otpResendTime}S)` : ""}`}
      </button>
    </>
  );
}
