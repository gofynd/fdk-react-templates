// import FPIClient from 'fdk-store';
import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./login-page.less";
import useLogin from "../../page-layouts/login/useLogin";
import AuthContainer from "../../page-layouts/auth/auth-container/auth-container";
import LoginPassword from "../../page-layouts/login/component/login-password/login-password";
import LoginOtp from "../../page-layouts/login/component/login-otp/login-otp";
import LoginModeButton from "../../page-layouts/login/component/login-mode-button/login-mode-button";
import LoginRegisterToggle from "../../page-layouts/auth/login-register-toggle/login-register-toggle";
import TermPrivacy from "../../page-layouts/login/component/term-privacy/term-privacy";

function LoginPage({ fpi }) {
	const {
		logo,
		platformData,
		appFeatures,
		isPassword,
		isOtp,
		showLoginModeButton,
		toggleLoginMode,
	} = useLogin(fpi);

	return (
		<AuthContainer>
			<div className={styles.loginWrapper}>
				<div>
					{logo?.desktopImage && (
						<FDKLink to="/">
							<img
								className={styles.loginLogoDesktop}
								src={logo?.desktopImage}
								alt="desktop-logo"
							/>
						</FDKLink>
					)}
					{logo?.mobileImage && (
						<FDKLink to="/">
							<img className={styles.loginLogoMobile} src={logo?.mobileImage} alt="mobile-logo" />
						</FDKLink>
					)}
					{platformData?.display && <h1 className={styles.loginTitle}>{platformData?.display}</h1>}
					{platformData.subtext && <p className={styles.loginSubText}>{platformData.subtext}</p>}
					{isPassword && <LoginPassword {...{ fpi, platformData, appFeatures }} />}
					{isOtp && <LoginOtp {...{ fpi }} />}
					<div className={styles.loginBtnGroup}>
						{showLoginModeButton && <LoginModeButton {...{ toggleLoginMode, isOtp }} />}
						<LoginRegisterToggle fpi={fpi} />
					</div>
					<TermPrivacy />
				</div>
			</div>
			{/* {isLoading && <Loader />} */}
		</AuthContainer>
	);
}

export default LoginPage;
