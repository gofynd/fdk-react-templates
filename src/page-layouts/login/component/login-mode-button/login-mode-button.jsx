import React, { useMemo } from "react";
import * as styles from "./login-mode-button.less";
import LoginIcon from "../../../../assets/images/login_icon.svg";
import { useGlobalTranslation } from "fdk-core/utils";

function LoginModeButton({ isOtp = true, onLoginToggleClick = () => { } }) {
  const { t } = useGlobalTranslation("translation");
  const getButtonLabel = useMemo(
    () => `${t("resource.auth.login.login_with_caps")} ${isOtp ? t("resource.auth.login.password_caps") : t("resource.auth.login.otp")}`,
    [isOtp]
  );
  return (
    <button className={`btnSecondary ${styles.loginModeBtn}`} onClick={onLoginToggleClick}>
      <LoginIcon />
      <span className={styles.loginModeLabel}>{getButtonLabel}</span>
    </button>
  );
}

export default LoginModeButton;
