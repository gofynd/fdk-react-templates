import React, { useState, useId } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./login-otp.less";
import MobileNumber from "../../../auth/mobile-number/mobile-number";
import { useAccounts } from "../../../../helper/useAccounts";

function LoginOtp({ fpi }) {
  const [isShowResendOtp, setIsShowResendOtp] = useState(false);
  const [otpInterval, setOtpInterval] = useState("");
  const [otpTime, setOtpTime] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileInfo, setMobileInfo] = useState({
    countryCode: "91",
    mobile: "",
    isValidNumber: false,
  });
  // const [isValidNumber, setIsValidNumber] = useState(false);
  const [sendOtpSuccess, setSendOtpSuccess] = useState(false);
  const [sendOtpResponse, setSendOtpResponse] = useState({});
  const [isInvalidOtp, setIsInvalidOtp] = useState(false);
  const [otpVerifyErrorMessage, setOtpVerifyErrorMessage] = useState("");

  const otpInputId = useId();

  const { sendOtp, signInWithOtp, resendOtp } = useAccounts({ fpi });

  const { handleSubmit, control } = useForm({
    defaultValues: {
      phone: mobileInfo,
    },
  });

  const timer = (remaining) => {
    let remainingTime = remaining;
    const interval = setInterval(() => {
      remainingTime -= 1;
      if (remainingTime <= 0) {
        clearInterval(interval);
        setIsShowResendOtp(true);
      }
      setOtpTime(`${remainingTime}`);
    }, 1000);
    setOtpInterval(interval);
  };

  const handleSendOtp = ({ phone }) => {
    console.log({ phone });
    setMobileInfo(phone);
    const payload = {
      mobile: phone.mobile,
      countryCode: phone.countryCode,
    };
    sendOtp(payload)
      .then((data) => {
        if (data?.errors) {
          throw data?.errors?.[0];
        }
        const response = data?.loginWithOTP;
        if (response?.success) {
          setSendOtpSuccess(true);
          setSendOtpResponse(response);
          setIsShowResendOtp(false);
          setOtpTime(response?.resend_timer);
          timer(response?.resend_timer);
        }
      })
      .catch((err) => {
        setSendOtpSuccess(false);
        setIsInvalidOtp(true);
        setOtpVerifyErrorMessage(err?.message || "Something went wrong");
      });
  };
  const verifyOtp = () => {
    if (!mobileOtp) {
      return;
    }
    const payload = {
      otp: mobileOtp,
      requestId: sendOtpResponse?.request_id,
      isRedirection: true,
    };
    signInWithOtp(payload)
      .then((data) => {
        if (data?.errors) {
          throw data?.errors?.[0];
        }
        setIsInvalidOtp(false);
      })
      .catch((err) => {
        setIsInvalidOtp(true);
        if (err?.details?.meta?.is_deleted) {
          // return this.$router.push({
          //     path: '/auth/account-locked',
          //     query: this.$router.currentRoute.query,
          // });
        }
        setOtpVerifyErrorMessage(err?.message || "Something went wrong");
      });
  };
  const handleResendOtp = () => {
    if (!isShowResendOtp) {
      return;
    }
    clearInterval(otpInterval);
    const payload = {
      mobile: mobileInfo?.mobile,
      countryCode: mobileInfo?.countryCode,
      token: sendOtpResponse?.resend_token,
      action: "resend",
    };
    resendOtp(payload).then((data) => {
      const res = data?.sendOTPOnMobile;
      setIsInvalidOtp(false);
      if (res?.success) {
        setSendOtpSuccess(true);
        setSendOtpResponse(res);
        setIsShowResendOtp(false);
        setOtpTime(res?.resend_timer);
        timer(res?.resend_timer);
      }
    });
  };

  const checkNumber = (evt) => {
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
    }
    if (evt.key === "Enter") {
      verifyOtp();
    }
  };

  return (
    <div>
      <div className={styles.loginOtpWrapper}>
        {!sendOtpSuccess ? (
          <form onSubmit={handleSubmit(handleSendOtp)}>
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
            <button className={styles.sendOtpBtn} type="submit">
              GET OTP
            </button>
          </form>
        ) : (
          <div className={styles.loginInputGroup}>
            <p
              className={styles.otpSentMsg}
            >{`OTP sent to ${sendOtpResponse?.mobile}`}</p>
            <label className={styles.loginInputTitle} htmlFor={otpInputId}>
              Enter OTP
            </label>
            <input
              id={otpInputId}
              type="number"
              name="otp"
              required=""
              className={styles.otpInput}
              value={mobileOtp}
              onKeyDown={checkNumber}
              onChange={(e) => {
                setMobileOtp(e?.target?.value);
              }}
            />
          </div>
        )}
      </div>

      {/* Extension slot: above_login_button */}

      {sendOtpSuccess && (
        <div>
          {isInvalidOtp && (
            <div className={styles.alertError}>
              <span>{otpVerifyErrorMessage}</span>
            </div>
          )}
          <button
            className={styles.verifyOtpBtn}
            disabled={!mobileOtp}
            onClick={verifyOtp}
          >
            Continue
          </button>
          <button
            className={styles.resendOtpBtn}
            onClick={handleResendOtp}
            disabled={!isShowResendOtp}
          >
            {`RESEND OTP ${!isShowResendOtp ? `(${otpTime}s)` : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginOtp;
