/**
 * FyDatePicker is a customizable date picker component that allows users to select a date using a calendar UI or by typing manually.
 *
 * @component
 *
 * @param {Object} props - Props for FyDatePicker component.
 * @param {string} [props.preselectedDate=""] - A preselected date string in the format specified by `dateFormat`.
 * @param {Function} [props.onChange=() => {}] - Callback function called when the date is selected or changed.
 * @param {string} [props.maxInactiveDate] - A date string before which dates are considered inactive and cannot be selected.
 * @param {string} [props.minInactiveDate] - A date string after which dates are considered inactive and cannot be selected.
 * @param {string} [props.placeholderText=dateFormat] - Placeholder text shown in the input field.
 * @param {string} [props.dateFormat="MM-DD-YYYY"] - Date format for input and output (e.g., "DD-MM-YYYY", "MM/DD/YYYY").
 * @param {boolean} [props.disabled=false] - If true, the input is disabled.
 * @param {boolean} [props.readOnly=false] - If true, the input is read-only.
 * @param {string} [props.themeColor="#1B6163"] - The color used to highlight the selected date in the calendar.
 * @param {string} [props.inputLabel="label"] - The label displayed above the input field.
 * @param {string[]} [props.excludeDates=[]] - Array of date strings (in `dateFormat`) that should be disabled (unselectable).
 * @param {boolean} [props.enableMonthYearSelection=false] - Enables month and year dropdown selectors when true.
 *
 * @returns {JSX.Element} The rendered date picker component.
 */

import React, { useState, useEffect, useRef } from "react";
import * as styles from "./fy-date-picker.less";
import DatePickerIcon from "../../../assets/images/date-picker.svg";
import ChevronRight from "../../../assets/images/chevron-right.svg";
import ChevronLeft from "../../../assets/images/chevron-left.svg";
import ClearIcon from "../../../assets/images/clear-icon.svg";
import { useMobile } from "../../../helper/hooks/useMobile";
import CloseIcon from "../../../assets/images/close.svg";
import Modal from "../../core/modal/modal";
import { useGlobalTranslation } from "fdk-core/utils";

const FyDatePicker = React.forwardRef(
  (
    {
      preselectedDate = "",
      onChange = () => {},
      maxInactiveDate,
      minInactiveDate,
      placeholderText = placeholderText ? placeholderText : dateFormat,
      dateFormat = "MM-DD-YYYY",
      disabled,
      readOnly,
      inputLabel = "label",
      isLabelFloating = false,
      excludeDates = [],
      required,
      error = false,
      errorMessage = "",
      handleShowCalendarPopup = () => {},
      enableMonthYearSelection = false,
    },
    ref
  ) => {
    const today = new Date();
    const { t } = useGlobalTranslation("translation");
    const [selectedDate, setSelectedDate] = useState(preselectedDate);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [inlineError, setInlineError] = useState(""); // New state for inline errors
    const isMobile = useMobile(480);
    const wrapperRef = useRef(null);

    useEffect(() => {
      handleShowCalendarPopup(showCalendar);
    }, [showCalendar]);

    useEffect(() => {
      if (preselectedDate && isValidDateString(preselectedDate)) {
        const parsed = parseDateString(preselectedDate);
        if (!isNaN(parsed)) {
          setCurrentYear(parsed.getFullYear());
          setCurrentMonth(parsed.getMonth());
        }
      }
    }, [preselectedDate]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
          setShowCalendar(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Clear inline error when selectedDate changes or component receives new error prop
    useEffect(() => {
      if (!error && !errorMessage) {
        setInlineError("");
      }
    }, [error, errorMessage, selectedDate]);

    const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const monthsOfYear = Array.from({ length: 12 }, (_, index) =>
      new Date(0, index).toLocaleString("default", { month: "long" })
    );

    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

    const getFormatRegex = (format) => {
      const sep = format.includes("/") ? "/" : "-";
      switch (format) {
        case "DD-MM-YYYY":
        case "MM-DD-YYYY":
        case "YYYY-DD-MM":
          return new RegExp(
            `^\\d{2}${sep}\\d{2}${sep}\\d{4}$|^\\d{4}${sep}\\d{2}${sep}\\d{2}$`
          );
        case "DD/MM/YYYY":
        case "MM/DD/YYYY":
        case "YYYY/DD/MM":
          return new RegExp(
            `^\\d{2}${sep}\\d{2}${sep}\\d{4}$|^\\d{4}${sep}\\d{2}${sep}\\d{2}$`
          );
        default:
          return /^\d{2}-\d{2}-\d{4}$/;
      }
    };

    const isValidDateString = (str) => getFormatRegex(dateFormat).test(str);

    const parseDateString = (dateStr) => {
      if (typeof dateStr !== "string") {
        console.log("Expected string, got:", typeof dateStr, dateStr);
        return null; // or handle the error appropriately
      }

      const sep = dateFormat.includes("/") ? "/" : "-";
      const parts = dateStr.split(sep).map(Number);
      switch (dateFormat) {
        case "DD-MM-YYYY":
        case "DD/MM/YYYY":
          return new Date(parts[2], parts[1] - 1, parts[0]);
        case "MM-DD-YYYY":
        case "MM/DD/YYYY":
          return new Date(parts[2], parts[0] - 1, parts[1]);
        case "YYYY-DD-MM":
        case "YYYY/DD/MM":
          return new Date(parts[0], parts[2] - 1, parts[1]);
        default:
          return new Date(NaN);
      }
    };

    const formatDate = (day, month, year) => {
      const dd = pad(day);
      const mm = pad(month + 1);
      const yyyy = year;

      switch (dateFormat) {
        case "DD-MM-YYYY":
          return `${dd}-${mm}-${yyyy}`;
        case "MM-DD-YYYY":
          return `${mm}-${dd}-${yyyy}`;
        case "YYYY-DD-MM":
          return `${yyyy}-${dd}-${mm}`;
        case "DD/MM/YYYY":
          return `${dd}/${mm}/${yyyy}`;
        case "MM/DD/YYYY":
          return `${mm}/${dd}/${yyyy}`;
        case "YYYY/DD/MM":
          return `${yyyy}/${dd}/${mm}`;
        default:
          return `${mm}-${dd}-${yyyy}`;
      }
    };

    const toUTCISOString = (formattedDate) => {
      const sep = dateFormat.includes("/") ? "/" : "-";
      const parts = formattedDate.split(sep).map(Number);

      let dateObj;

      switch (dateFormat) {
        case "DD-MM-YYYY":
        case "DD/MM/YYYY":
          dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
          break;
        case "MM-DD-YYYY":
        case "MM/DD/YYYY":
          dateObj = new Date(parts[2], parts[0] - 1, parts[1]);
          break;
        case "YYYY-DD-MM":
        case "YYYY/DD/MM":
          dateObj = new Date(parts[0], parts[2] - 1, parts[1]);
          break;
        default:
          dateObj = new Date(NaN);
      }

      return !isNaN(dateObj) ? dateObj.toISOString() : "";
    };

    const getDaysInMonth = (month, year) =>
      new Date(year, month + 1, 0).getDate();
    const getStartDayOfMonth = (month, year) =>
      (new Date(year, month, 1).getDay() + 6) % 7;

    const isInactive = (dateStr) => {
      const date = parseDateString(dateStr);
      const maxDate = maxInactiveDate ? parseDateString(maxInactiveDate) : null;
      const minDate = minInactiveDate ? parseDateString(minInactiveDate) : null;

      if (excludeDates.includes(dateStr)) return true;
      if (maxDate && date < maxDate) return true;
      if (minDate && date > minDate) return true;
      return false;
    };

    const getInactiveReason = (dateStr) => {
      const date = parseDateString(dateStr);
      const maxDate = maxInactiveDate ? parseDateString(maxInactiveDate) : null;
      const minDate = minInactiveDate ? parseDateString(minInactiveDate) : null;

      if (excludeDates.includes(dateStr)) {
        return "This date is not available for selection";
      }
      if (maxDate && date < maxDate) {
        return `Date must be on or after ${maxInactiveDate}`;
      }
      if (minDate && date > minDate) {
        return `Date must be on or before ${minInactiveDate}`;
      }
      return null;
    };

    const buildYearOptions = () => {
      const lowerBoundDate = maxInactiveDate
        ? parseDateString(maxInactiveDate)
        : null;
      const upperBoundDate = minInactiveDate
        ? parseDateString(minInactiveDate)
        : null;
      const currentYear = today.getFullYear();
      const defaultLowerBound = currentYear - 100;
      const defaultUpperBound = currentYear;

      const lowerBound =
        lowerBoundDate && !isNaN(lowerBoundDate)
          ? Math.max(lowerBoundDate.getFullYear(), defaultLowerBound)
          : defaultLowerBound;
      const upperBound =
        upperBoundDate && !isNaN(upperBoundDate)
          ? Math.min(upperBoundDate.getFullYear(), defaultUpperBound)
          : defaultUpperBound;
      const start = Math.min(lowerBound, upperBound);
      const end = Math.max(lowerBound, upperBound);

      return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
    };

    const handleClearDate = () => {
      setSelectedDate("");
      setInlineError(""); // Clear inline error when clearing date
      onChange("");
    };

    const handleDateClick = (day) => {
      const formatted = formatDate(day, currentMonth, currentYear);
      if (!isInactive(formatted)) {
        setSelectedDate(formatted);
        setInlineError(""); // Clear any inline error when selecting a valid date
        if (!isMobile) {
          const parsed = parseDateString(formatted);
          const now = new Date();
          parsed.setHours(
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
          );
          onChange(parsed.toISOString());
          setShowCalendar(false);
        }
        // else: wait for CONFIRM
      }
    };

    const handlePrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    };

    const handleMonthSelect = (e) => {
      const selectedMonth = Number(e.target.value);
      if (!Number.isNaN(selectedMonth)) {
        setCurrentMonth(selectedMonth);
      }
    };

    const handleYearSelect = (e) => {
      const selectedYear = Number(e.target.value);
      if (!Number.isNaN(selectedYear)) {
        setCurrentYear(selectedYear);
      }
    };

    const handleNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    };

    const handleConfirm = () => {
      if (selectedDate && isValidDateString(selectedDate)) {
        const parsed = parseDateString(selectedDate);
        const now = new Date();
        parsed.setHours(
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        );
        onChange(parsed.toISOString());
      }
      setShowCalendar(false);
    };

    const handleDateClickFromOtherMonth = (day, month, year) => {
      const formatted = formatDate(day, month, year);
      if (!isInactive(formatted)) {
        setSelectedDate(formatted);
        setCurrentMonth(month);
        setCurrentYear(year);
        setInlineError(""); // Clear any inline error when selecting a valid date
        if (!isMobile) {
          const parsed = parseDateString(formatted);
          const now = new Date();
          parsed.setHours(
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
          );
          onChange(parsed.toISOString());
          setShowCalendar(false);
        }
      }
    };

    const renderCalendar = () => {
      const totalDays = getDaysInMonth(currentMonth, currentYear);
      const startDay = getStartDayOfMonth(currentMonth, currentYear);

      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

      const calendarDays = [];

      for (let i = startDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dateStr = formatDate(day, prevMonth, prevYear);
        const inactive = isInactive(dateStr);
        calendarDays.push(
          <div
            key={`prev-${day}`}
            className={`${styles.dayCell} ${styles.otherMonth} ${inactive ? styles.inactive : ""}`}
            onClick={() =>
              !inactive &&
              handleDateClickFromOtherMonth(day, prevMonth, prevYear)
            }
          >
            <span className={styles.dayCellContent}>{day}</span>
          </div>
        );
      }

      for (let day = 1; day <= totalDays; day++) {
        const dateStr = formatDate(day, currentMonth, currentYear);
        const isSelected = selectedDate === dateStr;
        const inactive = isInactive(dateStr);

        calendarDays.push(
          <div
            key={`curr-${day}`}
            className={`${styles.dayCell} ${inactive ? styles.inactive : ""}
             ${isSelected && !inactive && styles.selectedAndActive}`}
            onClick={() => !inactive && handleDateClick(day)}
          >
            {day}
          </div>
        );
      }

      const totalCells = 35;
      const trailingDays = totalCells - calendarDays.length;

      for (let day = 1; day <= trailingDays; day++) {
        const dateStr = formatDate(day, nextMonth, nextYear);
        const inactive = isInactive(dateStr);

        calendarDays.push(
          <div
            key={`next-${day}`}
            className={`${styles.dayCell} ${styles.otherMonth} ${inactive ? styles.inactive : ""}`}
            onClick={() =>
              !inactive &&
              handleDateClickFromOtherMonth(day, nextMonth, nextYear)
            }
          >
            {day}
          </div>
        );
      }

      const ChildCalender = () => {
        return (
          <div className={styles.calendarPopup}>
            <div className={styles.calendarHeader}>
              <div className={styles.controlContainer}>
                <button type="button" onClick={handlePrevMonth}>
                  <ChevronLeft />
                </button>
                {enableMonthYearSelection ? (
                  <div className={styles.monthYearSelect}>
                    <select
                      aria-label="Select month"
                      value={currentMonth}
                      onChange={handleMonthSelect}
                    >
                      {monthsOfYear.map((month, index) => (
                        <option key={month} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Select year"
                      value={currentYear}
                      onChange={handleYearSelect}
                    >
                      {buildYearOptions().map((yearOption) => (
                        <option key={yearOption} value={yearOption}>
                          {yearOption}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span>
                    {new Date(currentYear, currentMonth).toLocaleString(
                      "default",
                      {
                        month: "long",
                      }
                    )}{" "}
                    {currentYear}
                  </span>
                )}
                <button type="button" onClick={handleNextMonth}>
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className={styles.calendarGrid}>
              {daysOfWeek.map((day) => (
                <div key={day} className={styles.dayName}>
                  {day}
                </div>
              ))}
              {calendarDays}
            </div>
            <div className={styles.confirmButton}>
              <button onClick={handleConfirm}>Confirm</button>
            </div>
          </div>
        );
      };

      return (
        <>
          {!isMobile ? (
            <ChildCalender />
          ) : (
            <Modal
              isOpen={showCalendar}
              closeDialog={() => setShowCalendar(false)}
              headerClassName={styles.popupTitle}
              title="Select Date"
            >
              <ChildCalender />
            </Modal>
          )}
        </>
      );
    };

    return (
      <div ref={wrapperRef} className={styles.calendarWrapper}>
        <label
          className={isLabelFloating ? styles.floating : styles.normalLabel}
          htmlFor="date-input"
        >
          <span>{inputLabel}</span>
          {required && <span className={styles.required}>*</span>}
        </label>
        <div
          className={`${styles.inputWrapper} ${(error || inlineError) && styles.inputError} `}
        >
          <input
            id="date-input"
            type="text"
            ref={ref}
            value={selectedDate}
            placeholder={placeholderText}
            disabled={disabled}
            readOnly={readOnly}
            onFocus={() => {
              if (!disabled && !readOnly) setShowCalendar(true);
            }}
            onChange={(e) => {
              if (disabled || readOnly) return;
              const rawValue = e.target.value;
              const separator = dateFormat.includes("/") ? "/" : "-";
              const sanitizedValue = rawValue
                .replace(new RegExp(`[^0-9${separator}]`, "g"), "")
                .slice(0, dateFormat.length); // keep only digits and separator
              setSelectedDate(sanitizedValue);
              setInlineError(""); // Clear inline error when user starts typing

              // Validate the date if it's in correct format
              if (isValidDateString(sanitizedValue)) {
                const parsed = parseDateString(sanitizedValue);
                if (!isNaN(parsed)) {
                  setCurrentYear(parsed.getFullYear());
                  setCurrentMonth(parsed.getMonth());

                  // Check if the date is inactive and show appropriate error
                  const inactiveReason = getInactiveReason(sanitizedValue);
                  if (inactiveReason) {
                    setInlineError(inactiveReason);
                  }
                }
              }
            }}
            onKeyDown={(e) => {
              if (disabled || readOnly) return;
              const separator = dateFormat.includes("/") ? "/" : "-";
              const controlKeys = [
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
                "Home",
                "End",
              ];
              const isDigit = /^\d$/.test(e.key);
              const isSeparator = e.key === separator;
              if (!isDigit && !isSeparator && !controlKeys.includes(e.key)) {
                e.preventDefault();
                return;
              }
              if (e.key === "Enter") {
                if (isValidDateString(selectedDate)) {
                  const parsed = parseDateString(selectedDate);
                  if (!isNaN(parsed)) {
                    // Check if the date is inactive first
                    const inactiveReason = getInactiveReason(selectedDate);
                    if (inactiveReason) {
                      setInlineError(inactiveReason);
                      return;
                    }

                    // If date is valid and active, proceed
                    setCurrentYear(parsed.getFullYear());
                    setCurrentMonth(parsed.getMonth());
                    setShowCalendar(false);
                    const now = new Date();
                    parsed.setHours(
                      now.getHours(),
                      now.getMinutes(),
                      now.getSeconds(),
                      now.getMilliseconds()
                    );
                    onChange(parsed.toISOString());
                    setInlineError(""); // Clear any existing inline error
                  } else {
                    // Replace alert with inline error
                    setInlineError("Invalid date format");
                  }
                } else {
                  // Replace alert with inline error
                  setInlineError(`Please enter date in ${dateFormat} format`);
                }
              }
            }}
            className={`${disabled ? styles.disabledInput : ""} ${readOnly ? styles.readOnlyInput : ""}`}
          />
          {selectedDate && !disabled && !readOnly && (
            <span onClick={handleClearDate} className={styles.clearIconWrapper}>
              <ClearIcon className={styles.clearIcon} />
            </span>
          )}
          <span
            onClick={() => {
              if (!disabled) setShowCalendar((prev) => !prev);
            }}
            className={`${styles.iconWrapper} ${disabled ? styles.disabledIcon : ""}`}
          >
            <DatePickerIcon className={styles.datePickerIcon} />
          </span>
        </div>
        {/* Show inline error - prioritize inlineError over external error */}
        {(inlineError || (error && errorMessage)) && (
          <div className={styles.error}>
            {inlineError || errorMessage || "Invalid date"}
          </div>
        )}
        {showCalendar && !disabled && renderCalendar()}
      </div>
    );
  }
);

export default FyDatePicker;
