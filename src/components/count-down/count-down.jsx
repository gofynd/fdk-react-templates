import React, { useState, useEffect } from "react";
import { useFPI } from "fdk-core/utils";

function CountDown({ mobileOtpResendTime, setIsResendBtnDisabled }) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const fpi = useFPI();
  useEffect(() => {
    if (mobileOtpResendTime > 1) setSecondsLeft(mobileOtpResendTime);
  }, [mobileOtpResendTime]);

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          fpi.custom.setValue("resend_otp_time", 0);
          setIsResendBtnDisabled(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  return secondsLeft !== null && <span>{secondsLeft}s</span>;
}

export default CountDown;
