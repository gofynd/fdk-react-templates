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
