import React from "react";
import FyButton from "../../../../components/core/fy-button/fy-button";
import * as styles from "./empty-state.less";

const EmptyState = ({
  title = "",
  btnTitle = "",
  onBtnClick = "",
  icon = <></>,
  emptyStateIcon = null,
  style = {},
  description,
}) => {
  return (
    <div className={styles.emptyContainer} style={style}>
      {emptyStateIcon && (
        <div className={styles.emptyStateIconWrapper}>{emptyStateIcon}</div>
      )}
      <div className={styles.emptyContent}>
        <div className={styles.emptyText}>{title}</div>
        {description && (
          <div className={`${styles.description} `}>
            <p>{description}</p>
          </div>
        )}
      </div>
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
