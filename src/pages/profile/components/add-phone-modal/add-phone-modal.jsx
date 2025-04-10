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
  countryCode,
}) {
  const { t } = useGlobalTranslation("translation");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);

  const [isShowResendOtp, setIsShowResendOtp] = useState(false);
  const [otpTime, setOtpTime] = useState(0);
  const [otpData, setOtpData] = useState({});

  const {
    handleSubmit: handleNumberSubmit,
    control: numberControl,
    formState: { isValid: isNumberValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phone: {
        mobile: "",
        countryCode,
        isValidNumber: false,
      },
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
    []
  );

  const onOtpSubmit = useCallback(
    async ({ otp }) => {
      try {
        setIsOtpLoading(true);
        const { request_id } = otpData;
        await verifyMobileOtp({ requestId: request_id, otp });

        onClose();
      } catch (error) {
        throw error;
      } finally {
        setIsOtpLoading(false);
      }
    },
    [otpData]
  );

  const handleOtpChange = useCallback((event) => {
    const value = event?.target?.value;

    setOtpValue("otp", value.toString().slice(0, 4));
  }, []);

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
  }, [otpData, isShowResendOtp]);

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
      title={!showOtp ? t("resource.profile.add_number") : t("resource.profile.verify_number")}
      modalType="center-modal"
      containerClassName={styles.addPhoneContainer}
      bodyClassName={styles.addPhoneBody}
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
                  value.isValidNumber || t("resource.common.enter_valid_phone_number"),
              }}
              render={({ field, fieldState: { error } }) => (
                <MobileNumber
                  mobile={field?.value?.mobile}
                  countryCode={field?.value?.countryCode}
                  height="40px"
                  textColor="var(--textHeading, #26201a)"
                  containerClassName={styles.phoneInputContainer}
                  error={error}
                  isRequired
                  isShowLabel={false}
                  disable={showOtp}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
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
                type="number"
                name="otp"
                placeholder={t("resource.common.enter_otp")}
                inputClassName={styles.addMobileOtp}
                {...otpRegister("otp")}
                onChange={handleOtpChange}
              />
              {showOtp && (
                <FyButton
                  size="small"
                  variant={isShowResendOtp ? "contained" : "text"}
                  onClick={handleResendOtp}
                  isLoading={isLoading}
                  className={`${styles.resendOtp} ${isShowResendOtp ? styles.showResendButton : ""}`}
                >
                  {t("resource.common.resend_otp")}
                  {!isShowResendOtp ? t("resource.profile.countdown_in_seconds", { count: otpTime }) : null}
                </FyButton>
              )}
            </form>
          )}
        </div>
        <div className={styles.btnContainer}>
          {!showOtp ? (
            <FyButton
              fullWidth
              variant="text"
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
              variant="text"
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
