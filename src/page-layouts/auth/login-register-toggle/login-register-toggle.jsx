import { useMemo } from "react";
import * as styles from "./login-register-toggle.less";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";

function LoginRegisterToggle({ label = "GO TO REGISTER", onClick = () => {} }) {
  const handleBtnClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(e);
  };
  return (
    <button className={styles.loginRegisterToggle} onClick={handleBtnClick}>
      <SvgWrapper svgSrc="login-icon" />
      <span className={styles.label}>{label}</span>
    </button>
  );
}

export default LoginRegisterToggle;
