import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import { useAccounts } from "../../../helper/useAccounts";
import * as styles from "./login-register-toggle.less";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";

function LoginRegisterToggle({ fpi }) {
	const { pathname } = useLocation();
	const platformData = useGlobalStore(fpi.getters.PLATFORM_DATA);
	const { openLogin, openRegister } = useAccounts({ fpi });

	const toggleLabel = useMemo(
		() => `GO TO ${pathname === "/auth/register" ? "LOGIN" : "REGISTER"}`,
		[pathname],
	);

	const toggleMode = () => {
		if (pathname === "/auth/register") {
			openLogin({ redirect: false });
		} else {
			openRegister();
		}
	};

	if (!platformData?.register && (pathname === "/auth/login" || pathname === "/auth/register")) {
		return null;
	}

	return (
		<button className={styles.loginRegisterToggle} onClick={toggleMode}>
			<SvgWrapper svgSrc="login-icon" />
			<span className={styles.label}>{toggleLabel}</span>
		</button>
	);
}

export default LoginRegisterToggle;
