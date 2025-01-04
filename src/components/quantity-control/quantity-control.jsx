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
    setQuantity(Number(evt.target?.value));
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
    /** Submit if the Enter key (keyCode 13) is pressed */
    if (event?.keyCode === 13) {
      event.target?.blur?.();
      return;
    }

    /** Prevent non-numeric keys */
    const allowedKeyCodes = [
      8, // Backspace
      37, // Left Arrow
      39, // Right Arrow
      46, // Delete
    ];

    const isNumber = event.keyCode >= 48 && event.keyCode <= 57; // Regular number keys
    const isNumpadNumber = event.keyCode >= 96 && event.keyCode <= 105; // Numpad keys

    if (
      !isNumber &&
      !isNumpadNumber &&
      !allowedKeyCodes.includes(event.keyCode)
    ) {
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
          type="text"
          value={quantity}
          onChange={onCurrentQtyChange}
          onBlur={onQtyLostFocus}
          onKeyDown={handleKeyDown}
        />
      </div>
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
