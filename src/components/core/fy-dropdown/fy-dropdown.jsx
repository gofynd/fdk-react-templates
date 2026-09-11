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
  useLayoutEffect,
  useId,
} from "react";
import * as styles from "./fy-dropdown.less";
import SvgWrapper from "../svgWrapper/SvgWrapper";
import { isRunningOnClient } from "../../../helper/utils";

const FyDropdown = ({
  options = [],
  label = "",
  placeholder = "",
  error,
  required = false,
  showAsterik = true,
  labelClassName,
  containerClassName,
  dropdownListClassName,
  dropdownOptionClassName,
  value,
  valuePrefix = "",
  dataKey = "key",
  valueClassName = "",
  disabledOptionClassName = "",
  disabled = false,
  disabledOptions = [],
  onChange = () => {},
  disableSearch = false,
}) => {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const dropdown = useRef(null);
  const dropdownButton = useRef(null);
  const dropdownList = useRef(null);
  const inputRef = useRef(null);
  const [dropdownStyles, setDropdownStyles] = useState({});
  const [query, setQuery] = useState(value || "");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isKeyPressed, setIskeyPressed] = useState(0);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    // Handle both object and string values for backward compatibility
    const valueToMatch = typeof value === 'object' && value !== null 
      ? (value?.name || value?.display_name || value?.[dataKey] || "")
      : (value || "");
    
    const foundOption = valueToMatch ? options?.find((option) => option?.[dataKey] === valueToMatch) : null;
    
    setSelectedValue(foundOption);
    // Set query to display text from option, or fallback to valueToMatch
    setQuery(foundOption?.display || valueToMatch);
  }, [value, options, dataKey]);

  const customLabelClassName = useMemo(
    () => `${styles.label} ${labelClassName ?? ""}`,
    [labelClassName]
  );
  const customContainerClassName = useMemo(
    () => `${styles.dropdownContainer}  ${containerClassName ?? ""}`,
    [containerClassName]
  );

  const toggleDropdown = (event) => {
    event?.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = useCallback((event) => {
    // Don't close if clicking on the dropdown list element (which is appended to body)
    const listElement = document?.getElementById?.(id);
    if (listElement && listElement.contains(event.target)) {
      return; // Let the click handler on the list item handle it
    }
    if (!dropdown?.current?.contains(event.target)) {
      setIsOpen(false);
    }
  }, [id]);

  const adjustDropdownMenuPosition = useCallback(() => {
    if (!isRunningOnClient()) return;
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
      setQuery(option.display);
      setSelectedValue(option);
      setIskeyPressed(0);
      const valueToPass = option?.[dataKey];
      onChange?.(valueToPass);
      // Don't toggle here - it's handled in the click handler
    },
    [dataKey, onChange]
  );

  useEffect(() => {
    if (!isRunningOnClient()) return;
    const clearEventListeners = () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", adjustDropdownMenuPosition);
      window.removeEventListener("resize", adjustDropdownMenuPosition);
    };
    if (isOpen) {
      window.addEventListener("resize", adjustDropdownMenuPosition);
      window.addEventListener("scroll", adjustDropdownMenuPosition);
      window.addEventListener("click", handleClickOutside);
      adjustDropdownMenuPosition();
    } else {
      clearEventListeners();
      setDropdownStyles({});
    }

    return () => {
      clearEventListeners();
      setDropdownStyles({});
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    let listElement = document?.getElementById?.(id);

    if (!listElement) {
      listElement = document?.createElement("ul");
      listElement.id = id;
      dropdownList.current = listElement;
      document?.body?.appendChild(listElement);
    }

    listElement.innerHTML = "";

    filteredOptions.forEach((option) => {
      const listItem = document.createElement("li");
      const disabled = disabledOptions?.includes(option?.[dataKey]);
      const className = `${styles.dropdownOption} ${option?.[dataKey] === selectedValue?.[dataKey] ? styles.selected : ""} ${disabled ? `${styles.disabled} ${disabledOptionClassName}` : ""} ${dropdownOptionClassName}`;
      listItem.className = className;
      listItem.innerHTML = option.display;
      if (!disabled) {
        listItem.addEventListener("click", (event) => {
          event?.stopPropagation();
          event?.preventDefault();
          // Close dropdown first, then handle change
          setIsOpen(false);
          // Use setTimeout to ensure state update doesn't interfere
          setTimeout(() => {
            handleChange?.(option);
          }, 0);
        });
      }
      listElement.appendChild(listItem);
    });

    listElement.className = `${styles.dropdownList}  ${isOpen ? styles.open : ""} ${dropdownListClassName}`;
    listElement.style.pointerEvents = 'auto';
    listElement.style.zIndex = '9999';
    Object.keys(dropdownStyles).forEach((key) => {
      listElement.style[key] = dropdownStyles[key];
    });

    return () => {
      if (dropdownList?.current) {
        document?.body?.removeChild(dropdownList?.current);
        dropdownList.current = null;
      }
    };
  }, [
    filteredOptions,
    handleChange,
    dropdownStyles,
    isOpen,
    selectedValue,
    dropdownOptionClassName,
    dropdownListClassName,
    disabledOptionClassName,
    disabledOptions,
  ]);

  const handleInputChange = (e) => {
    const value = e.target?.value || "";
    setQuery(value);

    setFilteredOptions(
      options.filter((option) =>
        (option.display || "").toLowerCase().includes(value.toLowerCase())
      )
    );

    setIsOpen(Boolean(value));
  };

  return (
    <div className={customContainerClassName}>
      {label && (
        <label className={customLabelClassName}>
          {label}
          {required && showAsterik && (
            <span className={styles.required}> *</span>
          )}
        </label>
      )}
      <div
        className={`${styles.dropdown} ${error ? styles.dropDownError : ""} ${disabled ? styles.disabled : ""}`}
        ref={dropdown}
      >
        {disableSearch ? (
          <div
            className={styles.dropdownButton}
            onClick={toggleDropdown}
            ref={dropdownButton}
          >
            <span className={`${styles.selectedValue} ${valueClassName}`}>
              {selectedValue?.display
                ? `${valuePrefix} ${selectedValue?.display}`
                : placeholder}
            </span>
            <SvgWrapper
              svgSrc="arrow-down"
              className={`${styles.dropdownIcon} ${isOpen ? styles.open : ""}`}
            />
          </div>
        ) : (
          <div
            className={styles.dropdownButton}
            onClick={toggleDropdown}
            ref={dropdownButton}
            tabIndex={!disableSearch ? 0 : null}
            onKeyDown={() => {
              setIskeyPressed((prev) => prev + 1);
              isKeyPressed === 0 && setQuery("");
              inputRef.current.focus();
            }}
          >
            <input
              className={`${styles.text_field} ${styles.selectedValue} ${valueClassName}`}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={placeholder}
              ref={inputRef}
            />
            <SvgWrapper
              svgSrc="arrow-down"
              className={`${styles.dropdownIcon} ${isOpen ? styles.open : ""}`}
            />
          </div>
        )}
      </div>
      {isOpen && (
        <div 
          className={styles.emptyDiv} 
          onClickCapture={(e) => {
            // Don't close if clicking on the dropdown list or dropdown button
            const listElement = document?.getElementById?.(id);
            const isClickOnList = listElement && listElement.contains(e.target);
            const isClickOnButton = dropdownButton?.current?.contains(e.target);
            
            if (isClickOnList || isClickOnButton) {
              return; // Let the click handler on the list item handle it
            }
            toggleDropdown(e);
          }}
          style={{ pointerEvents: 'auto' }}
        ></div>
      )}
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  );
};

export default FyDropdown;
