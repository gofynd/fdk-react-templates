/**
 * ReasonItem component renders a selectable reason item with optional text input.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.reason - The reason object containing details of the reason.
 * @param {Object} props.selectedReason - The currently selected reason object.
 * @param {Function} props.change - Callback function to change the selected reason.
 * @param {Function} props.otherReason - Callback function to handle additional text input for the reason.
 *
 * @returns {JSX.Element} A React component that displays a reason item with selection and optional text input.
 *
 */

import React, { useState, useEffect } from "react";
import * as styles from "./reason-item.less";
import RadioIcon from "../../../assets/images/radio";

function ReasonItem({
  reason,
  selectedReason,
  change = () => {},
  otherReason,
}) {
  const [reasonOtherText, setReasonOtherText] = useState("");
  const [error, setError] = useState("");
  const isSelected = selectedReason?.id === reason?.id;
  const isRemarkRequired = reason?.meta?.remark_required;

  useEffect(() => {
    setReasonOtherText(selectedReason?.reason_other_text || "");
    setError("");
  }, [selectedReason?.id]);

  const handleChange = (e) => {
    const value = e.target.value?.slice(0, 1000) || "";
    setReasonOtherText(value);
    otherReason(value);
    if (isRemarkRequired && value.trim() !== "") {
      setError("");
    }
  };

  const handleBlur = () => {
    if (isRemarkRequired && reasonOtherText.trim() === "") {
      setError("Field is required.");
    }
  };
  return (
    <div className={`${styles.reasonItem}`}>
      <div className={`${styles.reasonContent}`} onClick={() => change(reason)}>
        <span
          className={`${styles.regularRadio} ${isSelected ? styles.checked : ""}`}
        >
          <RadioIcon width={16} checked={isSelected} />
        </span>
        <span className={`${styles.text} ${styles.lightxs} fontHeader`}>
          {reason.display_name}
        </span>
      </div>

      {isSelected && reason?.meta?.show_text_area && (
        <div className={`${styles.textarea}`}>
          <textarea
            className={styles.textarea}
            value={reasonOtherText}
            placeholder={`Enter reason${isRemarkRequired ? "*" : ""}`}
            maxLength={1000}
            onChange={handleChange}
            onBlur={handleBlur}
          ></textarea>
          {error && <div className={styles.error}>{error}</div>}
        </div>
      )}
    </div>
  );
}

export default ReasonItem;
