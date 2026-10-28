/**
 * StickyQtyBar is the bottom bar of the mobile PDP: price details on the left and
 * either an "Add to cart" button or the quantity controller on the right.
 *
 * @param {Object} props - The properties object.
 * @param {string} [props.title] - Label of the active size.
 * @param {string} [props.priceLabel] - Formatted price to display.
 * @param {string} [props.mrpLabel] - Formatted strikethrough MRP.
 * @param {string} [props.taxLabel] - Helper text, e.g. "Inclusive of all taxes".
 * @param {number} [props.quantity=0] - Quantity of the active size in the cart.
 * @param {string} [props.addToCartLabel="Add to cart"] - Button label.
 * @param {Function} [props.onAddToCart] - Called when "Add to cart" is clicked.
 * @param {boolean} [props.disabled=false] - Disables "Add to cart".
 * @param {boolean} [props.isCartUpdating=false] - Shows a loading state.
 * @param {Object} [props.quantityControlProps] - Props forwarded to
 * B2BSizeQuantityControl (count, onIncrementClick, onDecrementClick, ...).
 *
 * @returns {JSX.Element} The sticky bar.
 */

import React from "react";
import * as styles from "./sticky-qty-bar.less";
import B2BSizeQuantityControl from "../b2b-size-controller/b2b-size-controller";

function StickyQtyBar({
  title = "",
  priceLabel = "",
  mrpLabel = "",
  taxLabel = "",
  quantity = 0,
  addToCartLabel = "Add to cart",
  onAddToCart = () => {},
  disabled = false,
  isCartUpdating = false,
  quantityControlProps = {},
  className = "",
}) {
  const hasQuantity = Number(quantity) > 0;

  return (
    <div className={`${styles.stickyQtyBar} ${className}`}>
      <div className={styles.details}>
        {title && <p className={styles.title}>{title}</p>}
        <p className={styles.priceRow}>
          <span className={styles.price}>{priceLabel}</span>
          {mrpLabel && <span className={styles.mrp}>{mrpLabel}</span>}
        </p>
        {taxLabel && <p className={styles.tax}>{taxLabel}</p>}
      </div>
      <div className={styles.action}>
        {hasQuantity ? (
          <div className={styles.qtyWrap}>
            {/* Forwarded props go first so they cannot override the bar's own state. */}
            <B2BSizeQuantityControl
              {...quantityControlProps}
              isSizeWrapperVisible={false}
              isCartUpdating={isCartUpdating}
              count={Number(quantity)}
            />
          </div>
        ) : (
          <button
            type="button"
            className={styles.addButton}
            disabled={disabled || isCartUpdating}
            onClick={onAddToCart}
          >
            {addToCartLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default StickyQtyBar;
