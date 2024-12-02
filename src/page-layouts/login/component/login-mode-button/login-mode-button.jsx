import React, { useMemo } from "react";
import * as styles from "./login-mode-button.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";

function LoginModeButton({ isOtp = true, onLoginToggleClick = () => {} }) {
  const getButtonLabel = useMemo(
    () => `LOGIN WITH ${isOtp ? "PASSWORD" : "OTP"}`,
    [isOtp]
  );
  return (
    <button className={styles.loginModeBtn} onClick={onLoginToggleClick}>
      <SvgWrapper svgSrc="login-icon" />
      <span className={styles.loginModeLabel}>{getButtonLabel}</span>
    </button>
  );
}

export default LoginModeButton;
