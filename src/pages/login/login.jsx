// import FPIClient from 'fdk-store';
import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./login.less";
import LoginPassword from "../../page-layouts/login/component/login-password/login-password";
import LoginOtp from "../../page-layouts/login/component/login-otp/login-otp";
import LoginModeButton from "../../page-layouts/login/component/login-mode-button/login-mode-button";
import LoginRegisterToggle from "../../page-layouts/auth/login-register-toggle/login-register-toggle";
import TermPrivacy from "../../page-layouts/login/component/term-privacy/term-privacy";

function Login({
  logo = {},
  title = "Login",
  subTitle = "Login to Shop",
  isPassword = true,
  isOtp = true,
  showLoginToggleButton = true,
  isRegisterEnabled = true,
  registerButtonLabel = "GO TO REGISTER",
  onLoginToggleClick = () => {},
  onRegisterButtonClick = () => {},
  onLoginFormSubmit = () => {},

  mobileInfo,
  submittedMobile,
  otpResendTime,
  otpError,
  isFormSubmitSuccess,
  onOtpSubmit,
  onResendOtpClick,

  loginButtonText,
  isForgotPassword,
  passwordError,
  onForgotPasswordClick,
}) {
  return (
    <div className={styles.loginWrapper}>
      <div>
        {logo?.desktop?.url && (
          <FDKLink to={logo?.desktop?.link}>
            <img
              className={styles.loginLogoDesktop}
              src={logo?.desktop?.url}
              alt="desktop-logo"
            />
          </FDKLink>
        )}
        {logo?.mobile?.url && (
          <FDKLink to={logo?.mobile?.link}>
            <img
              className={styles.loginLogoMobile}
              src={logo?.mobile?.url}
              alt="mobile-logo"
            />
          </FDKLink>
        )}
        {title && <h1 className={styles.loginTitle}>{title}</h1>}
        {subTitle && <p className={styles.loginSubText}>{subTitle}</p>}
        {isPassword && (
          <LoginPassword
            error={passwordError}
            {...{
              loginButtonText,
              isForgotPassword,
              onForgotPasswordClick,
              onLoginFormSubmit,
            }}
          />
        )}
        {isOtp && (
          <LoginOtp
            {...{
              mobileInfo,
              submittedMobile,
              otpResendTime,
              otpError,
              isFormSubmitSuccess,
              onOtpSubmit,
              onResendOtpClick,
              onLoginFormSubmit,
            }}
          />
        )}
        <div className={styles.loginBtnGroup}>
          {showLoginToggleButton && (
            <LoginModeButton {...{ onLoginToggleClick, isOtp }} />
          )}
          {isRegisterEnabled && (
            <LoginRegisterToggle
              label={registerButtonLabel}
              onClick={onRegisterButtonClick}
            />
          )}
        </div>
        <TermPrivacy />
      </div>
    </div>
  );
}

export default Login;
