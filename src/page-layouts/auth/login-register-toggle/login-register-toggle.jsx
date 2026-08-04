import React from "react";
import * as styles from "./login-register-toggle.less";
import LoginIcon from "../../../assets/images/login_icon.svg";
import { useGlobalTranslation } from "fdk-core/utils";

function LoginRegisterToggle({ label, onClick = () => { } }) {
  const { t } = useGlobalTranslation("translation");
  const handleBtnClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(e);
  };
  return (
    <button className={styles.loginRegisterToggle} onClick={handleBtnClick}>
      <LoginIcon />
      <span className={styles.label}>{label || t("resource.common.go_to_register")}</span>
    </button>
  );
}

export default LoginRegisterToggle;
