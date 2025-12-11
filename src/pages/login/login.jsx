import React from "react";
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
import { getConfigFromProps } from "../../helper/utils";

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
  blocks = [], // New prop for blocks
}) {
  const { t } = useGlobalTranslation("translation");
  const isOtpVerificationStep = Boolean(isOtp && isFormSubmitSuccess);

  return (
    <div className={styles.loginWrapper}>
      <div>
        {blocks.map((block, index) => {
          const key = `${block.type}_${index}`;
          const blockConfig = getConfigFromProps(block.props);

          if (isOtpVerificationStep && block.type !== "unified-login") {
            return null;
          }

          switch (block.type) {
            case "login-header":
              return (
                <div key={key} className="login-header-block">
                  {blockConfig.header_logo && (
                    <img
                      className={styles.loginLogoDesktop}
                      src={blockConfig.header_logo}
                      alt="Logo"
                    />
                  )}
                  {blockConfig.header_title && (
                    <h1 className={styles.loginTitle}>
                      {String(blockConfig.header_title)}
                    </h1>
                  )}
                  {blockConfig.header_subtitle && (
                    <p className={styles.loginSubText}>
                      {String(blockConfig.header_subtitle)}
                    </p>
                  )}
                </div>
              );

            case "unified-login":
              return (
                <div key={key} className="unified-login-block">
                  {/* Dynamic form based on current mode */}
                  {isOtp ? (
                    <LoginOtp
                      mobileInfo={mobileInfo}
                      submittedMobile={submittedMobile}
                      setSubmittedMobile={setSubmittedMobile}
                      otpResendTime={otpResendTime}
                      otpError={otpError}
                      isFormSubmitSuccess={isFormSubmitSuccess}
                      setIsFormSubmitSuccess={setIsFormSubmitSuccess}
                      onOtpSubmit={onOtpSubmit}
                      onResendOtpClick={onResendOtpClick}
                      onLoginFormSubmit={onLoginFormSubmit}
                      getOtpLoading={getOtpLoading}
                    />
                  ) : (
                    <LoginPassword
                      error={passwordError}
                      loginButtonText={String(
                        blockConfig.password_form_title || loginButtonText
                      )}
                      isForgotPassword={
                        blockConfig.show_forgot_password !== false
                      }
                      onLoginFormSubmit={onLoginFormSubmit}
                      onForgotPasswordClick={onForgotPasswordClick}
                    />
                  )}
                </div>
              );

            case "social-login":
              const socialButtons = [];

              if (blockConfig.show_google && social?.google) {
                socialButtons.push(
                  <GoogleLoginButton
                    key="google"
                    googleClientId={googleClientId}
                    onGoogleCredential={onGoogleCredential}
                    onError={handleGoogleError}
                  />
                );
              }

              if (blockConfig.show_facebook && social?.facebook) {
                socialButtons.push(
                  <FacebookLogin
                    key="facebook"
                    facebookAppId={facebookAppId}
                    loginWithFacebookMutation={loginWithFacebookMutation}
                    application_id={application_id}
                  />
                );
              }

              if (blockConfig.show_apple && social?.apple) {
                socialButtons.push(
                  <AppleLoginButton
                    key="apple"
                    appleClientId={appleId}
                    onAppleCredential={onAppleCredential}
                    redirectURI={appleRedirectURI}
                    onError={handleGoogleError}
                  />
                );
              }

              if (socialButtons.length === 0) {
                return null;
              }

              return (
                <div
                  key={key}
                  className={`social-login-block ${blockConfig.social_layout || "horizontal"}`}
                >
                  {blockConfig.social_title && (
                    <p className="social-title">
                      {String(blockConfig.social_title)}
                    </p>
                  )}
                  <div
                    className={`${styles.loginBtnGroup} ${blockConfig.social_layout || "horizontal"}`}
                  >
                    {socialButtons}
                  </div>
                </div>
              );

            case "terms-conditions":
              return (
                <div key={key} className="terms-conditions-block">
                  <TermPrivacy />
                </div>
              );

            case "login-mode-button":
              // Only render if toggle button is enabled
              if (blockConfig.show_toggle_button === false) {
                return null;
              }

              return (
                <div key={key} className="login-mode-button-block">
                  <LoginModeButton
                    isOtp={isOtp}
                    onLoginToggleClick={onLoginToggleClick}
                  />
                </div>
              );

            case "login-register-toggle":
              return (
                <div key={key} className="login-register-toggle-block">
                  <LoginRegisterToggle
                    label={
                      registerButtonLabel || t("resource.common.go_to_register")
                    }
                    onClick={onRegisterButtonClick}
                  />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

export default Login;
