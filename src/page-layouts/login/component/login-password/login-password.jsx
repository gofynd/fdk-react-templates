import React, { useState, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccounts } from "../../../../helper/useAccounts";
import { checkIfNumber } from "../../../../helper/utils";
import * as styles from "./login-password.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import MobileNumber from "../../../auth/mobile-number/mobile-number";

function loginPassword({ fpi, platformData, appFeatures }) {
  const navigate = useNavigate();
  const location = useLocation();
  const usernameInputId = useId();
  const passwordInputId = useId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [showInputNumber, setShowInputNumber] = useState(false);

  const { openForgotPassword, signIn } = useAccounts({ fpi });

  const { forgot_password: isForgotPassword } = platformData;
  const getLoginText = appFeatures?.landing_page?.login_btn_text;

  const onLoginInput = (e) => {
    const value = e.target?.value;
    setUsername(value);
    if (checkIfNumber(value)) {
      setShowInputNumber(true);
    }
  };

  const togglePasswordDisplay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPasswordShow((prevState) => !prevState);
  };

  const onNumberInput = (data) => {
    setUsername(data.mobile);
    setCountryCode(data.countryCode);
    if (!checkIfNumber(username)) {
      setShowInputNumber(false);
    }
  };

  const forgotPasswordClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    openForgotPassword();
  };

  const loginClicked = (e) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    const payload = {
      username: showInputNumber ? "91" + username : username,
      password,
      isRedirection: true,
    };
    signIn(payload)
      .then((res) => {
        setIsError(false);
      })
      .catch((err) => {
        if (err?.details?.meta?.is_deleted) {
          navigate({
            pathname: "/auth/account-locked",
            search: location.search,
          });
        }
        setIsError(true);
        setErrorMessage(err?.message || "Something went wrong");
      });
  };

  return (
    <form className={styles.loginInputWrapper} onSubmit={loginClicked}>
      <div className={styles.loginMobileInput}>
        <div className={styles.loginInputGroup}>
          <label className={styles.loginInputTitle} htmlFor={usernameInputId}>
            Email or Phone
          </label>
          {!showInputNumber ? (
            <input
              id={usernameInputId}
              type="text"
              name="username"
              value={username}
              required=""
              onChange={(e) => setUsername(e.target.value)}
              onInput={onLoginInput}
            />
          ) : (
            <MobileNumber
              isFocused
              isShowLabel={false}
              mobile={username}
              onChange={onNumberInput}
            />
          )}
        </div>
        <div className={styles.loginInputGroup}>
          <label className={styles.loginInputTitle} htmlFor={passwordInputId}>
            Password
          </label>
          <input
            id={passwordInputId}
            type={isPasswordShow ? "text" : "password"}
            name="password"
            required=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && (
            <button
              className={styles.passwordToggle}
              onClick={togglePasswordDisplay}
              aria-label={!isPasswordShow ? "Show Password" : "Hide Password"}
            >
              <SvgWrapper
                svgSrc={!isPasswordShow ? "show-password" : "hide-password"}
              />
            </button>
          )}
        </div>
        {isForgotPassword && (
          <div className={styles.forgotBtnWrapper}>
            <button className={styles.forgotBtn} onClick={forgotPasswordClick}>
              Forgot Password?
            </button>
          </div>
        )}
      </div>

      {isError && <div className={styles.loginAlert}>{errorMessage}</div>}

      {/* Extension slot: above_login_button */}

      <button
        className={styles.loginButton}
        type="submit"
        disabled={!(password && username)}
      >
        {getLoginText}
      </button>
    </form>
  );
}

export default loginPassword;
