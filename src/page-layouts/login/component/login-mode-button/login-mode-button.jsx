import React, { useMemo } from "react";
import * as styles from "./login-mode-button.less";
import LoginIcon from "../../../../assets/images/login_icon.svg";

function LoginModeButton({ isOtp = true, onLoginToggleClick = () => {} }) {
  const getButtonLabel = useMemo(
    () => `LOGIN WITH ${isOtp ? "PASSWORD" : "OTP"}`,
    [isOtp]
  );
  return (
    <button className={styles.loginModeBtn} onClick={onLoginToggleClick}>
      <LoginIcon />
      <span className={styles.loginModeLabel}>{getButtonLabel}</span>
    </button>
  );
}

export default LoginModeButton;
