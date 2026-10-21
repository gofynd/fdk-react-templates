import React from "react";
import FyButton from "../../../../components/core/fy-button/fy-button";
import * as styles from "./empty-state.less";

const EmptyState = ({
  title = "",
  btnTitle = "",
  onBtnClick = "",
  icon = <></>,
  style = {},
  description,
}) => {
  return (
    <div className={styles.emptyContainer} style={style}>
      <div className={styles.emptyText}>{title}</div>
      {description && (
        <div className={`${styles.description} `}>
          <p>{description}</p>
        </div>
      )}
      <div className={styles.submitBtnContainer}>
        <FyButton
          className={styles.btn}
          startIcon={icon}
          onClick={onBtnClick}
          variant="outlined"
        >
          {btnTitle}
        </FyButton>
      </div>
    </div>
  );
};

export default EmptyState;
