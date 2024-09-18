/**
 * FyDropdown Component
 *
 * A customizable dropdown component that supports various options, error handling, and label configurations.
 * This component is built using React and uses CSS modules for styling.
 *
 * @param {Array<{ key: string, display: string }>} options - An array of options to display in the dropdown. Each option should have `key` and `display` properties.
 * @param {string} [label=""] - The text label displayed above or beside the dropdown.
 * @param {string} [placeholder=""] - The text shown when no option is selected.
 * @param {object} [error] - If provided, the dropdown will display an error message. The object should contain an `error.message` property.
 * @param {boolean} [required=false] - If true, the dropdown will indicate that selecting an option is mandatory.
 * @param {boolean} [showAsterik=true] - If true, an asterisk (*) will be displayed next to the label to indicate a required field.
 * @param {string} [labelClassName] - Optional custom CSS class(es) to apply to the label element.
 * @param {string} [containerClassName] - Optional custom CSS class(es) to apply to the dropdown container element.
 * @param {object} [value] - The currently selected option, should be an object with `key` and `display` properties.
 * @param {function} onChange - Callback function triggered when an option is selected. Receives the selected option object as an argument.
 *
 * @returns {JSX.Element} A customizable dropdown menu with label, error message, and various styling options.
 */

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import * as styles from "./fy-dropdown.less";
import SvgWrapper from "../svgWrapper/SvgWrapper";

const FyDropdown = ({
  options = [],
  label = "",
  placeholder = "",
  error,
  required = false,
  showAsterik = true,
  labelClassName,
  containerClassName,
  value,
  onChange = (value) => {},
}) => {
  const [selectedValue, setSelectedValue] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const dropdown = useRef(null);
  const dropdownButton = useRef(null);
  const dropdownList = useRef(null);
  const [dropdownStyles, setDropdownStyles] = useState({});

  useEffect(() => {
    setSelectedValue(options?.find(({ key }) => key === value));
  }, [value]);

  const customLabelClassName = useMemo(
    () => `${styles.label} ${labelClassName ?? ""}`,
    [labelClassName]
  );
  const customContainerClassName = useMemo(
    () => `${styles.dropdownContainer}  ${containerClassName ?? ""}`,
    [containerClassName]
  );

  const toggleDropdown = useCallback(
    (event) => {
      event?.stopPropagation();
      const showDropdown = !isOpen;
      setIsOpen(showDropdown);
      if (showDropdown) {
        adjustDropdownMenuPosition();
        window.addEventListener("scroll", adjustDropdownMenuPosition);
        window.addEventListener("click", handleClickOutside);
      } else {
        window.removeEventListener("scroll", adjustDropdownMenuPosition);
        window.removeEventListener("click", handleClickOutside);
      }
    },
    [isOpen]
  );

  const handleClickOutside = useCallback((event) => {
    if (!dropdown?.current?.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  const adjustDropdownMenuPosition = useCallback(() => {
    const dropdownButtonElement = dropdownButton?.current;
    const dropdownListElement = dropdownList?.current;

    if (dropdownButtonElement && dropdownListElement) {
      const buttonRect = dropdownButtonElement.getBoundingClientRect();
      const menuRect = dropdownListElement.getBoundingClientRect();

      let topPosition = buttonRect.bottom + 4;

      if (topPosition + menuRect.height > window.innerHeight) {
        topPosition = buttonRect.top - menuRect.height - 4;
      }

      setDropdownStyles({
        position: "fixed",
        top: `${topPosition}px`,
        left: `${buttonRect.left}px`,
        width: `${buttonRect?.width}px`,
      });
    }
  }, [dropdownButton?.current, dropdownList?.current]);

  const handleChange = useCallback(
    (option) => {
      setSelectedValue(option);
      onChange?.(option?.key);
      toggleDropdown();
    },
    [toggleDropdown]
  );

  useEffect(() => {
    window.addEventListener("resize", adjustDropdownMenuPosition);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", adjustDropdownMenuPosition);
      window.removeEventListener("resize", adjustDropdownMenuPosition);
    };
  }, []);

  return (
    <div className={customContainerClassName}>
      {label && (
        <label className={customLabelClassName}>
          {label}
          {required && showAsterik && <span> *</span>}
        </label>
      )}
      <div className={styles.dropdown} ref={dropdown}>
        <div
          className={styles.dropdownButton}
          onClick={toggleDropdown}
          ref={dropdownButton}
        >
          <span className={styles.selectedValue}>
            {selectedValue?.display || placeholder}
          </span>
          <SvgWrapper
            svgSrc="arrow-down"
            className={`${styles.dropdownIcon} ${isOpen ? styles.open : ""}`}
          />
        </div>

        <ul
          className={`${styles.dropdownList}  ${isOpen ? styles.open : ""}`}
          ref={dropdownList}
          style={dropdownStyles}
        >
          {options?.map((option) => (
            <li
              className={styles.dropdownOption}
              key={option.key}
              onClick={() => handleChange(option)}
            >
              {option.display}
            </li>
          ))}
        </ul>
      </div>
      {isOpen && (
        <div className={styles.emptyDiv} onClickCapture={toggleDropdown}></div>
      )}
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  );
};

export default FyDropdown;
