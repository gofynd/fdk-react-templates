/**
 * ListingDescription is a React functional component that displays a description text.
 * It initially shows a collapsed version of the description if its length exceeds 600 characters.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.description - The description text to be displayed. Defaults to an empty string.
 *
 * @returns {JSX.Element|null} - Returns a JSX element containing the description or null if the description is empty.
 */

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
