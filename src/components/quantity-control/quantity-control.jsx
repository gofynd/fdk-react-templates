import React from "react";
import * as styles from "./quantity-control.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function QuantityControl({
  isCartUpdating,
  count = 0,
  onDecrementClick = () => {},
  onIncrementClick = () => {},
}) {
  function handleDecrement(e) {
    e.stopPropagation();
    e.preventDefault();
    onDecrementClick(e);
  }

  function handleIncrement(e) {
    e.stopPropagation();
    e.preventDefault();
    onIncrementClick(e);
  }

  return (
    <div className={styles.quantityCtrlContainer}>
      <button
        disabled={isCartUpdating}
        className={styles.decreaseCount}
        onClick={handleDecrement}
      >
        <div className={styles.svgContainer}>
          <SvgWrapper svgSrc="decrease" />
        </div>
      </button>
      <div className={styles.count}>{count}</div>
      <button
        disabled={isCartUpdating}
        className={styles.increaseCount}
        onClick={handleIncrement}
      >
        <span className={styles.svgContainer}>
          <SvgWrapper svgSrc="increase" />
        </span>
      </button>
    </div>
  );
}

export default QuantityControl;
