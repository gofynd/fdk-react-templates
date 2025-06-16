import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./login.less";
import LoginPassword from "../../page-layouts/login/component/login-password/login-password";
import LoginOtp from "../../page-layouts/login/component/login-otp/login-otp";
import LoginModeButton from "../../page-layouts/login/component/login-mode-button/login-mode-button";
import LoginRegisterToggle from "../../page-layouts/auth/login-register-toggle/login-register-toggle";
import TermPrivacy from "../../page-layouts/login/component/term-privacy/term-privacy";
import { useGlobalTranslation } from "fdk-core/utils";

function Login({
  logo = {},
  title,
  subTitle,
  isPassword = false,
  isOtp = true,
  showLoginToggleButton = true,
  isRegisterEnabled = true,
  registerButtonLabel,
  onLoginToggleClick = () => {},
  onRegisterButtonClick = () => {},
  onLoginFormSubmit = () => {},

  mobileInfo,
  submittedMobile,
  setSubmittedMobile,
  otpResendTime,
  otpError,
  isFormSubmitSuccess,
  setIsFormSubmitSuccess,
  onOtpSubmit,
  onResendOtpClick,

  loginButtonText,
  isForgotPassword,
  passwordError,
  onForgotPasswordClick,
  getOtpLoading,
}) {
  const { t } = useGlobalTranslation("translation");
  return (
    <div className={styles.loginWrapper}>
      <div>
        {!isFormSubmitSuccess && (
          <>
            {logo?.desktop?.url && (
              <FDKLink to={logo?.desktop?.link}>
                <img
                  className={styles.loginLogoDesktop}
                  src={logo?.desktop?.url}
                  alt={logo?.desktop?.alt}
                />
              </FDKLink>
            )}
            {logo?.mobile?.url && (
              <FDKLink to={logo?.mobile?.link}>
                <img
                  className={styles.loginLogoMobile}
                  src={logo?.mobile?.url}
                  alt={logo?.mobile?.alt}
                />
              </FDKLink>
            )}
            {title && (
              <h1 className={styles.loginTitle}>
                {title || t("resource.auth.login.login")}
              </h1>
            )}
            {subTitle && (
              <p
                className={
                  styles.loginSubText || t("resource.auth.login.login_to_shop")
                }
              >
                {subTitle}
              </p>
            )}
          </>
        )}
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
              setSubmittedMobile,
              otpResendTime,
              otpError,
              isFormSubmitSuccess,
              setIsFormSubmitSuccess,
              onOtpSubmit,
              onResendOtpClick,
              onLoginFormSubmit,
              getOtpLoading,
            }}
          />
        )}
        {!isFormSubmitSuccess && (
          <>
            <TermPrivacy />
            <div className={styles.loginBtnGroup}>
              {showLoginToggleButton && (
                <LoginModeButton {...{ onLoginToggleClick, isOtp }} />
              )}
              {isRegisterEnabled && (
                <LoginRegisterToggle
                  label={
                    registerButtonLabel || t("resource.common.go_to_register")
                  }
                  onClick={onRegisterButtonClick}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
