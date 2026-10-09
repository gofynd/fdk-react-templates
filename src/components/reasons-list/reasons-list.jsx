/**
 * This React component renders a list of reasons, sorted by priority, and allows for interaction with each reason item.
 *
 * @param {Object[]} reasons - An array of reason objects, each containing a priority and other properties.
 * @param {Object} selectedReason - The currently selected reason object.
 * @param {Function} change - A callback function to handle changes when a reason is selected or modified.
 * @param {string} otherReason - A string representing an additional reason not included in the main list.
 *
 * @returns {JSX.Element} A JSX element containing a list of reason items, each rendered with a ReasonItem component.
 *
 */

import React from "react";
import * as styles from "./reasons-list.less";
import ReasonItem from "./reason-item/reason-item";

function ReasonsList({ reasons, selectedReason, change, otherReason }) {
  const getPriorityReasons = () => {
    const allreason = reasons?.sort((a, b) => a.priority - b.priority);
    return allreason?.map((it) => {
      it.reason_other_text = "";
      return it;
    });
  };
  return (
    <div>
      {getPriorityReasons()?.map((item, index) => (
        <ReasonItem
          key={index}
          className={`${styles.reasonItem}`}
          selectedReason={selectedReason}
          reason={item}
          change={change}
          otherReason={otherReason}
        ></ReasonItem>
      ))}
    </div>
  );
}

export default ReasonsList;
