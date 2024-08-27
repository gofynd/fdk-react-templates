import React, { useEffect, useId } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./login-otp.less";
import MobileNumber from "../../../auth/mobile-number/mobile-number";

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
  onLoginFormSubmit = () => {},
  onOtpSubmit = () => {},
  onResendOtpClick = () => {},
}) {
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
              validate: (value) =>
                value.isValidNumber || "Please enter valid phone number",
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
            GET OTP
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
  onOtpSubmit = () => {},
  onResendOtpClick = () => {},
}) {
  const otpInputId = useId();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const isResendBtnDisabled = otpResendTime > 0;

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  return (
    <>
      <form
        className={styles.loginInputGroup}
        onSubmit={handleSubmit(onOtpSubmit)}
      >
        <p className={styles.otpSentMsg}>{`OTP sent to ${submittedMobile}`}</p>
        <label className={styles.loginInputTitle} htmlFor={otpInputId}>
          Enter OTP
        </label>
        <input
          id={otpInputId}
          type="number"
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
          Continue
        </button>
      </form>
      <button
        className={styles.resendOtpBtn}
        onClick={() => onResendOtpClick(mobileInfo)}
        disabled={isResendBtnDisabled}
      >
        {`Resend OTP${isResendBtnDisabled ? ` (${otpResendTime}S)` : ""}`}
      </button>
    </>
  );
}
