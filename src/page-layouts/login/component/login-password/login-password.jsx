import React, { useState, useId, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { checkIfNumber } from "../../../../helper/utils";
import * as styles from "./login-password.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import MobileNumber from "../../../auth/mobile-number/mobile-number";

function loginPassword({
  loginButtonText = "LOGIN",
  error = null,
  isForgotPassword = true,
  onForgotPasswordClick = () => {},
  onLoginFormSubmit = () => {},
}) {
  const usernameInputId = useId();
  const passwordInputId = useId();
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [showInputNumber, setShowInputNumber] = useState(false);

  const togglePasswordDisplay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPasswordShow((prevState) => !prevState);
  };

  const handleForgotPasswordClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onForgotPasswordClick(e);
  };

  const {
    handleSubmit,
    register,
    setValue,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      phone: {
        countryCode: "91",
        mobile: "",
        isValidNumber: false,
      },
      password: "",
    },
  });

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);
  // const onNumberInput = (data) => {
  //   setUsername(data.mobile);
  //   setCountryCode(data.countryCode);
  //   if (!checkIfNumber(username)) {
  //     setShowInputNumber(false);
  //   }
  // };
  // const [username, phone] = useWatch({
  //   control,
  //   name: ["username", "phone"],
  // });
  // console.log({ phone, username });
  useEffect(() => {
    // console.log("useEffect", { phone, username });

    if (checkIfNumber(watch("username"))) {
      setValue("phone.mobile", watch("username"));
      setShowInputNumber(true);
    }
    // if (!phone.mobile) {
    //   setShowInputNumber(false);
    // }
  }, [watch("username")]);

  const handleFormSubmit = ({ username, phone, password }) => {
    const data = {
      username: showInputNumber
        ? `${phone.countryCode}${phone.mobile}`
        : username,
      password,
    };
    console.log({ username, phone, password, data });
    onLoginFormSubmit(data);
  };

  return (
    <form
      className={styles.loginInputWrapper}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className={styles.loginMobileInput}>
        <div className={styles.loginInputGroup}>
          <label className={styles.loginInputTitle} htmlFor={usernameInputId}>
            Email or Phone
          </label>
          {!showInputNumber ? (
            <input
              id={usernameInputId}
              type="text"
              {...register("username", {
                validate: (value) => {
                  if (showInputNumber) {
                    return true;
                  }
                  return !!value;
                },
              })}
            />
          ) : (
            <Controller
              name="phone"
              control={control}
              rules={{
                validate: (value) => {
                  if (!showInputNumber) {
                    return true;
                  }
                  return (
                    value.isValidNumber || "Please enter valid phone number"
                  );
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <MobileNumber
                  isShowLabel={false}
                  isFocused={true}
                  mobile={field.value.mobile}
                  countryCode={field.value.countryCode}
                  error={error}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
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
            {...register("password", {
              required: true,
            })}
          />
          {watch("password") && (
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
            <button
              className={styles.forgotBtn}
              onClick={handleForgotPasswordClick}
            >
              Forgot Password?
            </button>
          </div>
        )}
      </div>

      {errors?.root && (
        <div className={styles.loginAlert}>{errors?.root?.message}</div>
      )}

      {/* Extension slot: above_login_button */}

      <button className={styles.loginButton} type="submit" disabled={!isValid}>
        {loginButtonText}
      </button>
    </form>
  );
}

export default loginPassword;
