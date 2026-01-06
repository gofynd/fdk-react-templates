import React, { useState } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./login.less";
import LoginPassword from "../../page-layouts/login/component/login-password/login-password";
import LoginOtp from "../../page-layouts/login/component/login-otp/login-otp";
import LoginModeButton from "../../page-layouts/login/component/login-mode-button/login-mode-button";
import LoginRegisterToggle from "../../page-layouts/auth/login-register-toggle/login-register-toggle";
import TermPrivacy from "../../page-layouts/login/component/term-privacy/term-privacy";
import { useGlobalTranslation } from "fdk-core/utils";
import GoogleLoginButton from "../../page-layouts/login/component/soacial-login-button/google-login-button";
import FacebookLogin from "../../page-layouts/login/component/soacial-login-button/facebook-login-button";
import AppleLoginButton from "../../page-layouts/login/component/soacial-login-button/apple-login-button";

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
  googleClientId,
  onGoogleCredential,
  handleGoogleError,
  social,
  facebookAppId,
  appleId,
  appleRedirectURI,
  loginWithFacebookMutation,
  application_id,
  onAppleCredential,
}) {
  const { t } = useGlobalTranslation("translation");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  
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
              isTermsAccepted,
            }}
          />
        )}
        {!isFormSubmitSuccess && (
          <>
            <TermPrivacy 
              onChange={setIsTermsAccepted}
              checked={isTermsAccepted}
            />
            <div className={styles.loginBtnGroup}>
              {showLoginToggleButton && (
                <LoginModeButton {...{ onLoginToggleClick, isOtp }} />
              )}
              {social?.google && (
                <GoogleLoginButton
                  googleClientId={googleClientId}
                  onGoogleCredential={onGoogleCredential}
                  onError={handleGoogleError}
                />
              )}
              {social?.facebook && (
                <FacebookLogin
                  facebookAppId={facebookAppId}
                  loginWithFacebookMutation={loginWithFacebookMutation}
                  application_id={application_id}
                />
              )}
              {/* {social?.apple && (
                <AppleLoginButton
                  appleClientId={appleId}
                  onAppleCredential={onAppleCredential}
                  redirectURI={appleRedirectURI}
                  onError={handleGoogleError}
                />
              )} */}
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
