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

import React, { useState, useEffect } from "react";
import * as styles from "./quantity-control.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function QuantityControl({
  isCartUpdating,
  count = 0,
  onDecrementClick = () => {},
  onIncrementClick = () => {},
  onQtyChange = () => {},
  maxCartQuantity = 0,
  minCartQuantity = 0,
  containerClassName = "",
  inputClassName = "",
}) {
  const [quantity, setQuantity] = useState(count);

  useEffect(() => {
    setQuantity(count);
  }, [count]);

  const handleDecrement = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDecrementClick(e);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onIncrementClick(e);
  };

  const onCurrentQtyChange = (evt) => {
    if (evt.target?.value === "") {
      setQuantity("");
    } else {
      setQuantity(Number(evt.target?.value));
    }
  };

  const onQtyLostFocus = (evt) => {
    const currentQty = Number(quantity);

    if (!currentQty) {
      setQuantity(count);
    } else if (currentQty !== count) {
      if (currentQty > maxCartQuantity) {
        setQuantity(maxCartQuantity);
      } else if (currentQty < minCartQuantity) {
        setQuantity(minCartQuantity);
      }
      onQtyChange(evt, currentQty);
    }
  };

  const handleKeyDown = (event) => {
    /** Submit if the Enter key is pressed */
    if (event?.key === "Enter") {
      event.target?.blur?.();
      return;
    }

    /** Allow specific keys */
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];

    const isNumber = /^[0-9]$/.test(event.key); // Allow numeric keys

    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault(); // Block invalid input
    }
  };

  return (
    <div className={`${styles.quantityCtrlContainer} ${containerClassName}`}>
      <button
        disabled={isCartUpdating}
        className={styles.decreaseCount}
        onClick={handleDecrement}
      >
        <div className={styles.svgContainer}>
          <SvgWrapper svgSrc="decrease" />
        </div>
      </button>
      <div className={`${styles.count} ${inputClassName}`}>
        <input
          className={styles.qtyInput}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={quantity}
          onChange={onCurrentQtyChange}
          onBlur={onQtyLostFocus}
          onKeyDown={handleKeyDown}
          dir="ltr"
        />
      </div>
      <button
        disabled={isCartUpdating || quantity === maxCartQuantity}
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
