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
import * as styles from "./b2b-size-quantity-control.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function B2BSizeQuantityControl({
  isCartUpdating,
  count = 0,
  onDecrementClick = () => {},
  onIncrementClick = () => {},
  onQtyChange = () => {},
  maxCartQuantity = 0,
  minCartQuantity = 0,
  containerClassName = "",
  inputClassName = "",
  size = "",
  placeholder = "Add Qty",
  serviceable = true,
  hasError = false,
  errorMessage = "",
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
    <>
      <div
        className={`${styles.quantityCtrlContainer} ${containerClassName} ${
          serviceable ? "" : styles.notServiceable
        }`}
      >
        <p className={styles.size}>{size}</p>

        <div className={styles.quantityControl}>
          <button
            disabled={isCartUpdating || !serviceable}
            className={styles.decreaseCount}
            onClick={handleDecrement}
          >
            <div className={styles.svgContainer}>
              <SvgWrapper
                svgSrc="decrease"
                className={styles.decreaseCountSvg}
              />
            </div>
          </button>
          <div className={`${styles.count} ${inputClassName}`}>
            {isCartUpdating ? (
              <div className={styles.loaderContainer}>
                <img 
                  src="https://cdn.pixelbin.io/v2/b2b-commerce/original/b2b-console/animations/qty_loader_x2.gif" 
                  alt="Loading" 
                  className={styles.sizeLoader} 
                />
              </div>
            ) : (
              <input
                className={styles.qtyInput}
                placeholder={placeholder}
                type="text"
                value={quantity === 0 ? "" : quantity}
                onChange={onCurrentQtyChange}
                onBlur={onQtyLostFocus}
                onKeyDown={handleKeyDown}
                readOnly={isCartUpdating || !serviceable}
              />
            )}
          </div>
          <button
            disabled={
              isCartUpdating || quantity === maxCartQuantity || !serviceable
            }
            className={styles.increaseCount}
            onClick={handleIncrement}
          >
            <span className={styles.svgContainer}>
              <SvgWrapper
                svgSrc="increase"
                className={styles.increaseCountSvg}
              />
            </span>
          </button>
        </div>
      </div>
      {hasError && <p className={styles.errorMessage}>{errorMessage}</p>}
    </>
  );
}

export default B2BSizeQuantityControl;
