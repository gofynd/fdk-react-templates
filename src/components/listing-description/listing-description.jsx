import React, { useState } from "react";
import * as styles from "./listing-description.less";

function ListingDescription({ description = "" }) {
  const [isCollapsed, setIsCollapsed] = useState(description?.length > 600);

  const toggleCollapsedState = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  if (!description.length) {
    return null;
  }
  return (
    <div className={styles.descriptionWrapper}>
      <div className={styles.descriptionContent}>
        {isCollapsed ? `${description.substring(0, 600)}...` : description}
      </div>
      {description.length > 600 && (
        <button className={styles.actionBtn} onClick={toggleCollapsedState}>
          {isCollapsed ? "READ MORE" : "READ LESS"}
        </button>
      )}
    </div>
  );
}

export default ListingDescription;
