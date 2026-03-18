import React, { useEffect, useId, useLayoutEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./login-otp.less";
import MobileNumber from "../../../auth/mobile-number/mobile-number";
import { useGlobalTranslation } from "fdk-core/utils";
import ForcedLtr from "../../../../components/forced-ltr/forced-ltr";

function LoginOtp({
  mobileInfo = {
    countryCode: "91",
    mobile: "",
    isValidNumber: false,
  },
  submittedMobile = "",
  setSubmittedMobile = () => {},
  otpResendTime = 0,
  otpError = null,
  isFormSubmitSuccess = false,
  setIsFormSubmitSuccess = () => {},
  onLoginFormSubmit = () => {},
  onOtpSubmit = () => {},
  onResendOtpClick = () => {},
  onClearOtpError = () => {},
  getOtpLoading,
  isTermsAccepted = false,
  setShowConsentTooltip = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const { handleSubmit, control, getValues, reset, setValue, clearErrors } =
    useForm({
      mode: "onChange",
      defaultValues: {
        phone: mobileInfo,
      },
      reValidateMode: "onChange",
    });

  const onChangeButton = () => {
    reset();
    setIsFormSubmitSuccess(false);
    setSubmittedMobile("");
  };

  const handleOtpFormSubmit = (data) => {
    if (!isTermsAccepted) {
      setShowConsentTooltip(true);
      return;
    }
    onLoginFormSubmit(data);
  };

  return (
    <div className={styles.loginOtpWrapper}>
      {!isFormSubmitSuccess ? (
        <form onSubmit={handleSubmit(handleOtpFormSubmit)}>
          <Controller
            name="phone"
            control={control}
            rules={{
              validate: (value) => {
                if (!value.isValidNumber) {
                  return t("resource.common.enter_valid_phone_number");
                }
                return true;
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <MobileNumber
                name={field?.name}
                mobile={field.value.mobile}
                countryCode={field.value.countryCode}
                error={error}
                isFocused={error?.message}
                onChange={(value) => {
                  setValue("phone", value);
                  clearErrors("phone");
                }}
              />
            )}
          />
          <button
            className={`btnPrimary ${styles.sendOtpBtn}`}
            type="submit"
            disabled={getOtpLoading}
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
          onChangeButton={onChangeButton}
          onClearOtpError={onClearOtpError}
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
  onChangeButton = () => {},
  onClearOtpError = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const otpInputId = useId();
  const isFirstRender = useRef(true);

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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (mobileOtp !== undefined && mobileOtp !== null) {
      clearErrors("root");
      clearErrors("mobileOtp");
      // DO NOT clear root error here - it should persist until submission/resend
    }
  }, [mobileOtp, clearErrors]);

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  useLayoutEffect(() => {
    window?.scrollTo({
      top: 0,
    });
  }, []);

  const resendOtp = () => {
    resetField("mobileOtp");
    // Clear errors when resending OTP
    clearErrors("root");
    onClearOtpError();
    onResendOtpClick(mobileInfo);
  };

  return (
    <>
      <form
        className={styles.loginInputGroup}
        onSubmit={handleSubmit((data) => {
          // Clear errors when submitting a new attempt
          clearErrors("root");
          onClearOtpError();
          onOtpSubmit(data);
        })}
      >
        <h3 className={styles.otpTitle}>
          {t("resource.localization.verify_account")}
        </h3>
        <p className={styles.otpSentMsg}>
          {`${t("resource.common.otp_sent_to")}`}{" "}
          <ForcedLtr text={submittedMobile} />
          <button
            type="button"
            className={styles.changeBtn}
            onClick={onChangeButton}
          >
            {t("resource.common.change_caps")}
          </button>
        </p>

        <div className={styles.loginInput}>
          <label
            className={`${styles.loginInputTitle} ${errors?.root || errors?.mobileOtp ? styles.error : ""}`}
            htmlFor={otpInputId}
          >
            {t("resource.common.enter_otp")}{" "}
            <span className={`${styles.formReq}`}>*</span>
          </label>
          <input
            id={otpInputId}
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
            className={`${styles.otpInput} ${errors?.root || errors?.mobileOtp ? styles.error : ""}`}
            {...register("mobileOtp", {
              required: {
                message: t("resource.common.enter_valid_otp"),
                value: true,
              },
              maxLength: 4,
            })}
          />

          {(errors?.root || errors?.mobileOtp) && (
            <div className={styles.alertError}>
              <span>{errors?.root?.message || errors?.mobileOtp?.message}</span>
            </div>
          )}
        </div>
        <button className={`btnPrimary ${styles.verifyOtpBtn}`} type="submit">
          {t("resource.common.continue")}
        </button>
      </form>
      <div className={styles.resendOtpWrapper}>
        <span className={styles.didntReceiveText}>
          {t("resource.common.didnt_receive_otp")}
        </span>
        <button
          className={styles.resendOtpBtn}
          onClick={resendOtp}
          disabled={isResendBtnDisabled}
        >
          {`${t("resource.common.resend_otp")}${isResendBtnDisabled ? ` (${otpResendTime}S)` : ""}`}
        </button>
      </div>
    </>
  );
}
