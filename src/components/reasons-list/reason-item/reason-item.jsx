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

import React, { useState } from "react";
import * as styles from "./reason-item.less";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";

function ReasonItem({ reason, selectedReason, change, otherReason }) {
  const [reasonOtherText, setReasonOtherText] = useState("");
  return (
    <div className={`${styles.reasonItem}`} onClick={() => change(reason)}>
      <div>
        <div
          className={`${styles.reasonContent}`}
          onClick={() => change(reason)}
        >
          <span className={styles.reasonRadio}>
            {selectedReason?.id !== reason?.id && (
              <SvgWrapper svgSrc="regular" />
            )}
            {selectedReason?.id === reason?.id && (
              <SvgWrapper svgSrc="radio-selected" />
            )}
          </span>

          <span className={`${styles.text} ${styles.lightxs}`}>
            {reason.display_name}
          </span>
        </div>

        {selectedReason?.id === reason?.id && reason?.meta?.show_text_area && (
          <div className={`${styles.textarea}`}>
            <textarea
              className={`${styles.textarea}`}
              value={reasonOtherText}
              placeholder="Enter reason"
              onChange={(e) =>
                setReasonOtherText(e.target.value?.slice(0, 1000))
              }
              onBlur={() => otherReason(reasonOtherText)}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReasonItem;
