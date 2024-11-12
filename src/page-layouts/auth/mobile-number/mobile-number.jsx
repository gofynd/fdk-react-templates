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
  const [number, setNumber] = useState(mobile);
  const [country, setCountry] = useState("");
  const [countryName, setCountryName] = useState("in");
  const telInput = useRef(null);

  const getNumber = (mobileNumber) => {
    const code =
      telInput?.current?.getInstance()?.selectedCountryData?.dialCode;
    return mobileNumber?.replace(new RegExp(`^\\+${code}`), "");
  };

  const handleNumberChange = (updatedNumber) => {
    if (updatedNumber !== number) {
      setNumber(updatedNumber);
    }
  };

  const handleCountryChange = (updatedCountry) => {
    if (updatedCountry !== country) {
      setCountry(updatedCountry);
    }
  };

  const handleValidityChange = (valid) => {
    if (isValid !== valid) {
      setIsValid(valid);
    }
  };

  useEffect(() => {
    const selectedCountryName =
      telInput.current
        ?.getInstance()
        ?.countries.find(({ dialCode }) => dialCode === countryCode)?.iso2 ||
      "in";
    setCountryName(selectedCountryName);
  }, [countryCode]);

  useEffect(() => {
    if (isFocused) {
      document.getElementById(inputId)?.focus();
    }
  }, [inputId, isFocused]);

  useEffect(() => {
    onChange?.({
      mobile: getNumber(number),
      countryCode:
        telInput?.current?.getInstance()?.selectedCountryData?.dialCode,
      isValidNumber: isValid,
    });
  }, [isValid, country, number]);

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
        onChangeNumber={handleNumberChange}
        onChangeCountry={handleCountryChange}
        onChangeValidity={handleValidityChange}
        disabled={disable}
        inputProps={{
          class: `${styles.mobileNumberInput} ${inputClassName || ""}`,
          id: inputId,
          placeholder,
        }}
        initOptions={{
          initialCountry: countryName,
          allowDropdown,
          separateDialCode: true,
          containerClass: `${styles.mobileInputContainer} ${telInputClassName || ""}`,
          countrySearch: false,
          strictMode: true,
          dropdownContainer: document.body,
          ...telInputProps,
        }}
      />
      {error && <span className={styles.errorText}>{error.message}</span>}
    </div>
  );
}

export default MobileNumber;
