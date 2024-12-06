import React, { useState, useRef, useEffect, useId } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import * as styles from "./mobile-number.less";
import { PhoneNumberUtil } from "google-libphonenumber";

function MobileNumber({
  mobile = "",
  countryCode = "91",
  disable = false,
  isShowLabel = true,
  isRequired = "required",
  allowDropdown = true,
  isFocused = false,
  placeholder = "",
  label = "",
  error,
  onChange,
  inputClassName,
  containerClassName,
  labelClassName,
  inputContainerClassName,
  height = "48px",
  textColor = "var(--textBody, #3c3131)",
  backgroundColor = "var(--pageBackground, #f8f8f8)",
}) {
  const inputId = useId();
  const [phone, setPhone] = useState();
  const phoneInputRef = useRef(null);

  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (phoneNumber) => {
    try {
      return phoneUtil.isValidNumber(
        phoneUtil.parseAndKeepRawInput(phoneNumber)
      );
    } catch (error) {
      return false;
    }
  };

  const getNumber = (mobileNumber, dialCode) =>
    mobileNumber?.replace(new RegExp(`^\\+${dialCode}`), "");

  const handleChange = (phone, { country }) => {
    setPhone(phone);
    onChange?.({
      mobile: getNumber(phone, country?.dialCode),
      countryCode: country?.dialCode,
      isValidNumber: isPhoneValid(phone),
    });
  };

  useEffect(() => {
    if (isFocused) {
      document.getElementById(inputId)?.focus();
    }
  }, [inputId, isFocused]);

  useEffect(() => {
    const phoneNumber = `+${countryCode}${mobile}`;
    if (phone !== phoneNumber) {
      setPhone(`+${countryCode}${mobile}`);
    }
  }, [mobile, countryCode]);

  return (
    <div
      className={`${styles.mobileInputWrapper} ${error ? styles.errorInput : ""} ${containerClassName || ""}`}
    >
      {isShowLabel && (
        <label
          className={`${styles.inputTitle} ${labelClassName || ""}`}
          htmlFor={inputId}
        >
          {label ||
            `Mobile ${isRequired === "optional" ? " (optional)" : " *"}`}
        </label>
      )}

      <PhoneInput
        defaultCountry="in"
        value={phone}
        onChange={handleChange}
        forceDialCode
        ref={phoneInputRef}
        style={{
          "--react-international-phone-height": height,
          "--react-international-phone-text-color": textColor,
          "--react-international-phone-border-radius": "4px",
          "--react-international-phone-border-color": `${error ? "var(--errorText, #b24141)" : "var(--dividerStokes, #d4d1d1)"}`,
          "--react-international-phone-background-color": backgroundColor,
          "--react-international-phone-dropdown-top": `calc(${height} + 4px)`,
        }}
        countrySelectorStyleProps={{
          buttonContentWrapperStyle: {
            gap: "4px",
          },
          buttonStyle: {
            padding: "0 8px",
          },
          dropdownStyleProps: {
            style: {
              zIndex: 999,
            },
          },
        }}
        disabled={disable}
        className={`${styles.mobileInputContainer} ${inputContainerClassName || ""}`}
        inputClassName={`${styles.mobileNumberInput} ${inputClassName || ""}`}
        inputProps={{
          id: inputId,
        }}
        placeholder={placeholder}
        hideDropdown={!allowDropdown}
      />
      {error && <span className={styles.errorText}>{error.message}</span>}
    </div>
  );
}

export default MobileNumber;
