import React, { useState, useRef, useEffect, useId } from "react";
import { validatePhone } from "../../../helper/utils";
// import TelInput from 'intl-tel-input';
// import utilFile from 'intl-tel-input/build/js/utils';
// import 'intl-tel-input/build/css/intlTelInput.css';
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
}) {
  // const telInput = useRef(null);
  const inputId = useId();

  const mobileInput = useRef(null);
  const [mobileData, setMobileData] = useState("");
  // const [isValidNumberCheck, setIsValidNumberCheck] = useState(true);

  // const isValidNumber = () => {
  // 	if (
  // 		(telInput?.current && mobileData && telInput?.current.isValidNumber()) ||
  // 		(isRequired === 'optional' && !mobileData)
  // 	) {
  // 		setIsValidNumberCheck(true);
  // 	} else {
  // 		setIsValidNumberCheck(false);
  // 	}
  // };

  // const getCountryCode = () => telInput?.current?.getSelectedCountryData().dialCode;

  // const getNumber = () => {
  // 	const currentCountryCode = getCountryCode();
  // 	const regex = `^\\+${currentCountryCode}`;
  // 	return telInput?.current.getNumber().replace(new RegExp(regex), '');
  // };

  // const getNumInfo = () => ({
  // 	// mobile: getNumber(),
  // 	// countryCode: getCountryCode(),
  // 	// isValidNumber: telInput?.current.isValidNumber(),
  // });

  const handleInputChange = (e) => {
    const value = e?.target?.value.replace(/\D/g, "") || "";
    setMobileData(value);
    onChange({
      mobile: value,
      countryCode: "91",
      isValidNumber: validatePhone(value),
    });
  };

  // const handleKeyUp = (event) => {
  // 	if (event.key === 'Enter') {
  // 		console.log('Enter key pressed');
  // 		submit();
  // 	}
  // };

  useEffect(() => {
    // if (!mobileInput?.current) {
    // 	return;
    // }
    // if (mobileInput?.current) {
    // 	mobileInput.current.removeEventListener('countrychange', handleInputChange);
    // }
    // const intlTelInput = TelInput(mobileInput?.current, {
    // 	separateDialCode: true,
    // 	autoPlaceholder: 'aggressive',
    // 	formatOnDisplay: false,
    // 	preferredCountries: ['IN'],
    // 	utilsScript: utilFile,
    // 	allowDropdown,
    // 	// onlyCountries: ['IN', 'US'],
    // });
    // telInput.current = intlTelInput;
    // if (countryCode || mobile) {
    // 	telInput?.current?.setNumber(`+${countryCode}${mobile}`);
    // }
    // mobileInput?.current.addEventListener('countrychange', handleInputChange);
    if (isFocused) {
      mobileInput.current.focus();
    }
    // // eslint-disable-next-line consistent-return
    // return () => {
    // 	if (mobileInput?.current) {
    // 		mobileInput?.current.removeEventListener('countrychange', handleInputChange);
    // 	}
    // 	telInput?.current?.destroy();
    // };
  }, []);

  useEffect(() => {
    if (countryCode || mobile) {
      setMobileData(mobile);
      // telInput?.current?.setNumber(`+${countryCode}${mobile}`);
    }
  }, [countryCode, mobile]);

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
      <div className={`${styles.telInput} ${telInputClassName || ""}`}>
        <span className={styles.dialCode}>{`+${countryCode}`}</span>
        <input
          ref={mobileInput}
          type="tel"
          id={inputId}
          value={mobileData}
          autoComplete="tel"
          disabled={disable}
          placeholder={placeholder || "81234 56789"}
          onChange={handleInputChange}
          className={`${styles.mobileNumberInput} ${inputClassName || ""}`}
        />
      </div>
      {error && <span className={styles.errorText}>{error.message}</span>}
    </div>
  );
}

export default MobileNumber;
