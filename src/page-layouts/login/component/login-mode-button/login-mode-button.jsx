import React, { useMemo } from "react";
import * as styles from "./login-mode-button.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";

function LoginModeButton({ isOtp, toggleLoginMode }) {
	const getButtonLabel = useMemo(() => `LOGIN WITH ${isOtp ? "PASSWORD" : "OTP"}`, [isOtp]);
	return (
		<button className={styles.loginModeBtn} onClick={toggleLoginMode}>
			<SvgWrapper svgSrc="login-icon" />
			<span className={styles.loginModeLabel}>{getButtonLabel}</span>
		</button>
	);
}

export default LoginModeButton;
