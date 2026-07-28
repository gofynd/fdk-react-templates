import React, { useRef, useEffect, useId } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import * as styles from "./mobile-number.less";
import { PhoneNumberUtil, PhoneNumberType } from "google-libphonenumber";
import { useGlobalTranslation } from "fdk-core/utils";

function MobileNumber({
  name = "",
  mobile = "",
  countryCode = "91",
  disable = false,
  isShowLabel = true,
  isRequired,
  showAsOptional = true,
  allowDropdown = true,
  isFocused = false,
  placeholder = "",
  label = "",
  error,
  onChange,
  handleKeyDown = () => {},
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
      const parsedNumber = phoneUtil.parseAndKeepRawInput(
        phoneNumber,
        countryIso2
      );
      if (!phoneUtil.isValidNumber(parsedNumber)) return false;
      // India-specific: libphonenumber misclassifies newer allocations (e.g. Jio 68x); TRAI mandates mobile numbers start with 6-9.
      if (countryIso2 === "in") {
        return /^[6-9]\d{9}$/.test(parsedNumber.getNationalNumber().toString());
      }
      const numberType = phoneUtil.getNumberType(parsedNumber);
      return (
        numberType === PhoneNumberType.MOBILE ||
        numberType === PhoneNumberType.FIXED_LINE_OR_MOBILE
      );
    } catch (error) {
      return false;
    }
  };

  const getNumber = (mobileNumber, dialCode) =>
    mobileNumber?.replace(new RegExp(`^\\+${dialCode}`), "");

  const handleChange = (phone, { country }) => {
    const countryIso2 = country?.iso2 || countryIso || "in";
    const fullPhone = phone.startsWith("+")
      ? phone
      : `+${country?.dialCode}${phone}`;
    const validationResult = isPhoneValid(fullPhone, countryIso2);
    onChange?.({
      mobile: getNumber(phone, country?.dialCode),
      countryCode: country?.dialCode,
      isValidNumber: validationResult,
    });
  };

  useEffect(() => {
    if (isFocused) {
      document.getElementById(inputId)?.focus();
    }
  }, [inputId, isFocused]);

  useEffect(() => {
    // Only call setCountry when there is no existing phone value.
    // react-international-phone's setCountry fires onChange with just the dial code ("+91"),
    // which clears the mobile number. Skipping it when a value exists preserves the phone.
    // The PhoneInput value prop ("+${countryCode}${mobile}") already drives the country flag display.
    if (countryIso && phoneInputRef?.current?.setCountry && !mobile) {
      phoneInputRef?.current?.setCountry(countryIso);
    }
  }, [countryIso, mobile]);

  return (
    <div
      className={`${styles.mobileInputWrapper} ${error ? styles.errorInput : ""} ${containerClassName || ""}`}
    >
      {isShowLabel && (
        <label
          className={`${styles.inputTitle} ${labelClassName || ""}
          ${styles.additionalLableClasses}
          `}
          htmlFor={inputId}
          style={{
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: "400",
            color: "var(--textLabel , #7d7676)",
          }}
        >
          {label || t("resource.common.mobile")}
          {isRequired === "optional" ? (
            !showAsOptional ? (
              ""
            ) : (
              ` (${t("resource.common.optional_lower")})`
            )
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
          "--react-international-phone-width": "100%",
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
          onKeyDown: handleKeyDown,
          autoComplete: "tel",
          ...inputProps,
          style: {
            width: "100%",
          },
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
