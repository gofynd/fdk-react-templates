/**
 * QuantityControl is a React component that provides a user interface for incrementing
 * and decrementing a numerical count, typically used for adjusting quantities in a cart.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isCartUpdating - Indicates whether the cart is currently updating,
 * which disables the increment and decrement buttons when true.
 * @param {number} [props.count=0] - The current count or quantity to be displayed.
 * @param {Function} [props.onDecrementClick=() => {}] - Callback function to be called when
 * the decrement button is clicked.
 * @param {Function} [props.onIncrementClick=() => {}] - Callback function to be called when
 * the increment button is clicked.
 *
 * @returns {JSX.Element} A JSX element representing the quantity control interface.
 */

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
