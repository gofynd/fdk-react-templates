import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./add-phone-modal.less";
import Modal from "../../../../components/core/modal/modal";
import FyButton from "../../../../components/core/fy-button/fy-button";
import FyInput from "../../../../components/core/fy-input/fy-input";
import MobileNumber from "../../../../page-layouts/auth/mobile-number/mobile-number";
import { useGlobalTranslation } from "fdk-core/utils";

function AddPhoneModal({
  sendOtpMobile,
  verifyMobileOtp,
  resendOtp,
  isOpen,
  onClose,
  countryCode = "91",
  initialPhone = null,
  initialOtpData = null,
  allowInitialPhoneEdit = false,
  onPhoneChange,
}) {
  const { t } = useGlobalTranslation("translation");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(Boolean(initialOtpData));

  const [isShowResendOtp, setIsShowResendOtp] = useState(false);
  const [otpTime, setOtpTime] = useState(initialOtpData?.resend_timer || 0);
  const [otpData, setOtpData] = useState(initialOtpData || {});
  const initialPhoneValue = {
    mobile: initialPhone?.mobile || "",
    countryCode: initialPhone?.countryCode || countryCode,
    isValidNumber: initialPhone?.isValidNumber || Boolean(initialPhone?.mobile),
  };

  const {
    handleSubmit: handleNumberSubmit,
    control: numberControl,
    getValues: getNumberValues,
    formState: { isValid: isNumberValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phone: initialPhoneValue,
    },
  });

  const {
    handleSubmit: handleOtpSubmit,
    register: otpRegister,
    setValue: setOtpValue,
    watch: watchOtp,
    resetField,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const onPhoneNumberSubmit = useCallback(
    async ({ phone: { countryCode, mobile } }) => {
      try {
        setIsLoading(true);
        const data = await sendOtpMobile({ mobile, countryCode });
        setOtpData(data);

        setShowOtp(true);
        setOtpTime(data?.resend_timer);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [sendOtpMobile]
  );

  const onOtpSubmit = useCallback(
    async ({ otp }) => {
      try {
        setIsOtpLoading(true);
        const { request_id } = otpData;
        await verifyMobileOtp({
          requestId: request_id,
          otp,
          phone: getNumberValues("phone"),
        });

        onClose();
      } catch (error) {
        resetField("otp");
        throw error;
      } finally {
        setIsOtpLoading(false);
      }
    },
    [getNumberValues, otpData, onClose, resetField, verifyMobileOtp]
  );

  const handleOtpChange = useCallback(
    (event) => {
      const value = event?.target?.value;

      setOtpValue("otp", value.toString().slice(0, 4));
    },
    [setOtpValue]
  );

  const resetOtpStep = useCallback(() => {
    resetField("otp");
    setShowOtp(false);
    setOtpData({});
    setOtpTime(0);
    setIsShowResendOtp(false);
  }, [resetField]);

  const handlePhoneChange = useCallback(
    (value, onChange) => {
      onChange(value);
      onPhoneChange?.(value);

      if (!allowInitialPhoneEdit || !showOtp) return;

      const normalizePhoneValue = (phoneValue) =>
        phoneValue?.toString().replace("+", "").trim() || "";
      const otpMobile = otpData?.mobile || initialPhone?.mobile || "";
      const otpCountryCode =
        otpData?.country_code ||
        otpData?.countryCode ||
        initialPhone?.countryCode ||
        countryCode;

      const hasChangedOtpPhone =
        normalizePhoneValue(value?.mobile) !== normalizePhoneValue(otpMobile) ||
        normalizePhoneValue(value?.countryCode) !==
          normalizePhoneValue(otpCountryCode);

      if (hasChangedOtpPhone) {
        resetOtpStep();
      }
    },
    [
      allowInitialPhoneEdit,
      countryCode,
      initialPhone,
      otpData,
      onPhoneChange,
      resetOtpStep,
      showOtp,
    ]
  );

  const handleResendOtp = useCallback(async () => {
    resetField("otp");

    try {
      if (isShowResendOtp) {
        setIsLoading(true);
        const { mobile, country_code, resend_token } = otpData;
        const data = await resendOtp({
          mobile,
          countryCode: country_code,
          token: resend_token,
          action: "resend",
        });
        setOtpData(data);
        setOtpTime(data?.resend_timer);
        setIsShowResendOtp(false);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [otpData, isShowResendOtp, resendOtp, resetField]);

  useEffect(() => {
    let interval;
    if (showOtp) {
      if (otpTime > 0) {
        interval = setInterval(() => {
          setOtpTime((prevTimer) => prevTimer - 1);
        }, 1000);
      } else if (otpTime === 0) {
        setIsShowResendOtp(true);
      }
    }

    return () => clearInterval(interval);
  }, [showOtp, otpTime]);

  return (
    <Modal
      isOpen={isOpen}
      closeDialog={onClose}
      title={
        !showOtp && !allowInitialPhoneEdit
          ? t("resource.profile.add_number")
          : t("resource.profile.verify_number")
      }
      containerClassName={styles.addPhoneContainer}
      bodyClassName={styles.addPhoneBody}
      headerClassName={styles.header}
      titleClassName={styles.modalTitle}
    >
      <div className={styles.modalContainer}>
        <div className={styles.body}>
          <form
            onSubmit={handleNumberSubmit(onPhoneNumberSubmit)}
            id="numberForm"
          >
            <Controller
              name="phone"
              control={numberControl}
              rules={{
                validate: (value) =>
                  value.isValidNumber ||
                  t("resource.common.enter_valid_phone_number"),
              }}
              render={({ field, fieldState: { error } }) => (
                <MobileNumber
                  mobile={field?.value?.mobile}
                  countryCode={field?.value?.countryCode}
                  height="40px"
                  textColor="var(--textHeading, #26201a)"
                  fontSize="12px"
                  containerClassName={styles.phoneInputContainer}
                  error={error}
                  isRequired
                  isShowLabel={false}
                  disable={
                    !allowInitialPhoneEdit &&
                    (Boolean(initialPhone?.mobile) ||
                      (showOtp && otpTime > 0 && !error))
                  }
                  onChange={(value) => handlePhoneChange(value, field.onChange)}
                />
              )}
            />
          </form>
          {showOtp && (
            <form
              className={styles.loginInputGroup}
              id="otpForm"
              onSubmit={handleOtpSubmit(onOtpSubmit)}
            >
              <FyInput
                id="otp"
                label={t("resource.auth.login.otp")}
                labelVariant="floating"
                type="number"
                name="otp"
                placeholder={t("resource.common.enter_otp")}
                className={styles.addMobileOtp}
                {...otpRegister("otp")}
                onChange={handleOtpChange}
              />
              {showOtp && (
                <FyButton
                  size="small"
                  variant="text"
                  onClick={handleResendOtp}
                  isLoading={isLoading}
                  className={`${styles.resendOtp} ${isShowResendOtp ? styles.showResendButton : ""}`}
                >
                  {t("resource.common.resend_otp")}
                  {!isShowResendOtp
                    ? t("resource.profile.countdown_in_seconds", {
                        count: otpTime,
                      })
                    : null}
                </FyButton>
              )}
            </form>
          )}
        </div>
        <div className={styles.btnContainer}>
          {!showOtp ? (
            <FyButton
              fullWidth
              type="submit"
              isLoading={isLoading}
              className={styles.yesBtn}
              form="numberForm"
              disabled={!isNumberValid}
            >
              {t("resource.profile.send_otp")}
            </FyButton>
          ) : (
            <FyButton
              fullWidth
              type="submit"
              isLoading={isOtpLoading}
              className={styles.yesBtn}
              form="otpForm"
              disabled={watchOtp("otp")?.length !== 4}
            >
              {t("resource.facets.verify")}
            </FyButton>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default AddPhoneModal;
