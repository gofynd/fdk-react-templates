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

import React, { useState, useEffect, useRef } from "react";
import * as styles from "./b2b-size-quantity-control.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import Tooltip from "../tool-tip/tool-tip";
import { useMobile } from "../../helper/hooks/useMobile";

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
  sizeType = "large",
  isSizeWrapperVisible = true,
}) {
  const [quantity, setQuantity] = useState(count);
  const [showTooltip, setShowTooltip] = useState(false);
  const isMobile = useMobile();

  // Function to truncate text with ellipsis
  const truncateText = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  // Truncate based on device type
  const displaySize = isMobile
    ? truncateText(size, 20)
    : truncateText(size, 47);

  // Show tooltip if original text is longer than the limit for the current device
  const shouldShowTooltip = isMobile ? size.length > 20 : size.length > 47;

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
      let newQty = currentQty;
      if (currentQty > maxCartQuantity) {
        newQty = maxCartQuantity;
      } else if (currentQty < minCartQuantity) {
        newQty = minCartQuantity;
      }
      setQuantity(newQty);
      onQtyChange(evt, newQty);
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
        className={`${styles.quantityCtrlContainer} ${styles[sizeType]} ${containerClassName} ${
          serviceable ? "" : styles.notServiceable
        } ${isSizeWrapperVisible ? "" : styles.borderRadius}`}
      >
        {isSizeWrapperVisible && (
          <div
            className={styles.sizeWrapper}
            onMouseEnter={() => shouldShowTooltip && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Tooltip
              title={size}
              position="top"
              showTooltip={shouldShowTooltip}
            >
              <p className={`${styles.size} ${styles[sizeType]}`}>
                {displaySize}
              </p>
            </Tooltip>
          </div>
        )}

        <div
          className={`${styles.quantityControl} ${
            !isSizeWrapperVisible ? styles.removeBorderLeft : ""
          }`}
        >
          <button
            disabled={isCartUpdating || !serviceable}
            className={styles.decreaseCount}
            onClick={handleDecrement}
          >
            <div className={`${styles.svgContainer} ${styles[sizeType]}`}>
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
                className={`${styles.qtyInput} ${styles[sizeType]}`}
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
            <span className={`${styles.svgContainer} ${styles[sizeType]}`}>
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
