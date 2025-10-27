import React, { useRef, useEffect, useId } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import * as styles from "./mobile-number.less";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useGlobalTranslation } from "fdk-core/utils";

function MobileNumber({
  name = "",
  mobile = "",
  countryCode = "91",
  disable = false,
  isShowLabel = true,
  isRequired,
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
  inputProps,
  height = "48px",
  textColor = "var(--textBody, #3c3131)",
  backgroundColor = "var(--pageBackground, #f8f8f8)",
  fontSize = "14px",
  countryIso,
  ...rest
}) {
  const { t } = useGlobalTranslation("translation");
  const inputId = useId();
  const phoneInputRef = useRef(null);

  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (phoneNumber, countryIso2) => {
    try {
      return phoneUtil.isValidNumber(
        phoneUtil.parseAndKeepRawInput(phoneNumber, countryIso2)
      );
    } catch (error) {
      return false;
    }
  };

  const getNumber = (mobileNumber, dialCode) =>
    mobileNumber?.replace(new RegExp(`^\\+${dialCode}`), "");

  const handleChange = (phone, { country }) => {
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
    if (countryIso && phoneInputRef?.current?.setCountry) {
      phoneInputRef?.current?.setCountry(countryIso);
    }
  }, [countryIso, phoneInputRef?.current, mobile]);

  return (
    <div
      className={`${styles.mobileInputWrapper} ${error ? styles.errorInput : ""} ${containerClassName || ""}`}
    >
      {isShowLabel && (
        <label
          className={`${styles.inputTitle} ${labelClassName || ""}`}
          htmlFor={inputId}
        >
          {label || t("resource.common.mobile")}
          {isRequired === "optional" ? (
            ` (${t("resource.common.optional_lower")})`
          ) : (
            <span className={styles.required}> * </span>
          )}
        </label>
      )}

      <PhoneInput
        name={name}
        defaultCountry="in"
        value={`+${countryCode}${mobile}`}
        onChange={handleChange}
        forceDialCode
        ref={phoneInputRef}
        style={{
          "--react-international-phone-height": height,
          "--react-international-phone-text-color": textColor,
          "--react-international-phone-border-radius": "4px",
          "--react-international-phone-border-color": `${error ? "var(--errorText, #b24141)" : "var(--dividerStokes, #d4d1d1)"}`,
          "--react-international-phone-background-color": backgroundColor,
          "--react-international-phone-dropdown-item-background-color":
            "var(--pageBackground)",
          "--react-international-phone-selected-dropdown-item-background-color":
            "var(--highlightColor)",
          "--react-international-phone-dropdown-top": `calc(${height} + 4px)`,
          "--react-international-phone-font-size": fontSize,
          "--react-international-phone-country-selector-border-color": `${error ? "var(--errorText, #b24141)" : "var(--dividerStokes, #d4d1d1)"}`,
          direction: "ltr",
        }}
        countrySelectorStyleProps={{
          buttonContentWrapperStyle: {
            gap: "4px",
          },
          buttonStyle: {
            padding: "0 8px",
          },
          buttonClassName: `${styles.countryButton}`,
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
          autoComplete: "tel",
          ...inputProps,
        }}
        placeholder={placeholder}
        hideDropdown={!allowDropdown}
        dialCodePreviewStyleProps={{
          className: styles.dialCodePreview,
        }}
        disableDialCodePrefill={true}
        disableDialCodeAndPrefix={true}
        showDisabledDialCodeAndPrefix={true}
        {...rest}
      />
      {error && <span className={styles.errorText}>{error.message}</span>}
    </div>
  );
}

export default MobileNumber;
