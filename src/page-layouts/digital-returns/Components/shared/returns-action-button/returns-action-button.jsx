import React from "react";
import FyButton from "../../../../../components/core/fy-button/fy-button";
import * as styles from "./returns-action-button.less";

const ReturnsActionButton = ({
  children,
  tone = "filled",
  layout = "full",
  className = "",
  showChevron = true,
  ...props
}) => {
  const variant = tone === "outlined" ? "outlined" : "contained";
  const toneClass = tone === "outlined" ? styles.outlined : styles.filled;
  const chevronClass = showChevron ? styles.withChevron : "";
  const layoutClass = layout === "inline" ? styles.inline : styles.full;

  return (
    <FyButton
      variant={variant}
      color="primary"
      {...props}
      className={`${className} ${styles.actionBtn} ${layoutClass} ${toneClass} ${chevronClass}`.trim()}
    >
      {children}
    </FyButton>
  );
};

export default ReturnsActionButton;
