import React from "react";
import * as styles from "./login-register-toggle.less";
import LoginIcon from "../../../assets/images/login_icon.svg";

function LoginRegisterToggle({ label = "GO TO REGISTER", onClick = () => {} }) {
  const handleBtnClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(e);
  };
  return (
    <button className={styles.loginRegisterToggle} onClick={handleBtnClick}>
      <LoginIcon />
      <span className={styles.label}>{label}</span>
    </button>
  );
}

export default LoginRegisterToggle;
