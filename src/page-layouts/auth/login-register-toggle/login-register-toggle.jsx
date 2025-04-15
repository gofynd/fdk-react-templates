import React from "react";
import * as styles from "./login-register-toggle.less";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
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
      <SvgWrapper svgSrc="login-icon" />
      <span className={styles.label}>{label || t("resource.common.go_to_register")}</span>
    </button>
  );
}

export default LoginRegisterToggle;
