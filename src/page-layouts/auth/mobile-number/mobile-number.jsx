import React, { useState, useRef, useEffect, useId } from "react";
import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/build/css/intlTelInput.css";
import * as styles from "./mobile-number.less";

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
  telInputClassName,
  telInputProps = {},
}) {
  const inputId = useId();
  const [isValid, setIsValid] = useState(false);
  const telInput = useRef(null);

  const iti = telInput?.current?.getInstance();

  const getNumber = (mobileNumber) => {
    const code = iti?.selectedCountryData?.dialCode;
    return mobileNumber?.replace(new RegExp(`^\\+${code}`), "");
  };

  const handleValidityChange = (valid) => {
    if (isValid !== valid) {
      setIsValid(valid);
    }
  };

  useEffect(() => {
    const selectedCountryName =
      iti?.countries.find(({ dialCode }) => dialCode === countryCode)?.iso2 ||
      "in";
    iti?.setCountry(selectedCountryName);
  }, [countryCode]);

  useEffect(() => {
    iti?.setNumber(mobile);
  }, [mobile]);

  useEffect(() => {
    if (isFocused) {
      document.getElementById(inputId)?.focus();
    }
  }, [inputId, isFocused]);

  useEffect(() => {
    onChange?.({
      mobile: getNumber(telInput?.current?.getInput()?.value),
      countryCode: iti?.selectedCountryData?.dialCode,
      isValidNumber: isValid,
    });
  }, [iti?.selectedCountryData, telInput?.current?.getInput()?.value, isValid]);

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

      <IntlTelInput
        initialValue={mobile}
        ref={telInput}
        onChangeValidity={handleValidityChange}
        disabled={disable}
        inputProps={{
          class: `${styles.mobileNumberInput} ${inputClassName || ""}`,
          id: inputId,
          placeholder,
        }}
        initOptions={{
          initialCountry: "in",
          allowDropdown,
          separateDialCode: true,
          containerClass: `${styles.mobileInputContainer} ${telInputClassName || ""}`,
          countrySearch: false,
          strictMode: true,
          dropdownContainer: document.body,
          formatOnDisplay: false,
          formatAsYouType: false,
          ...telInputProps,
        }}
      />
      {error && <span className={styles.errorText}>{error.message}</span>}
    </div>
  );
}

export default MobileNumber;
