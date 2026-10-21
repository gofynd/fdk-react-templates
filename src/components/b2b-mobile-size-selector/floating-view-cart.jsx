/**
 * FloatingViewCart is a floating pill that links to the cart, showing a product
 * thumbnail and the number of items in the cart.
 *
 * @param {Object} props - The properties object.
 * @param {string[]} [props.images=[]] - Thumbnails of cart items; the first
 * `maxImages` are shown stacked, like Blinkit.
 * @param {number} [props.maxImages=3] - Maximum thumbnails to stack.
 * @param {string} [props.imageUrl] - Single thumbnail, used when `images` is empty.
 * @param {number} [props.itemCount=0] - Number of items in the cart.
 * @param {string} [props.label="View cart"] - Primary label.
 * @param {string} [props.itemsLabel] - Secondary label; defaults to "<n> Item(s)".
 * @param {Function} [props.onClick] - Called when the pill is clicked.
 * @param {boolean} [props.disabled=false] - Disables the pill.
 * @param {string} [props.className] - Extra class for the pill.
 *
 * @returns {JSX.Element|null} The pill, or null when the cart is empty.
 */

import React from "react";
import * as styles from "./floating-view-cart.less";

function FloatingViewCart({
  images = [],
  maxImages = 3,
  imageUrl = "",
  itemCount = 0,
  label = "View cart",
  itemsLabel = "",
  onClick = () => {},
  disabled = false,
  className = "",
}) {
  if (!itemCount) return null;

  const thumbnails = (images?.length ? images : [imageUrl])
    .filter(Boolean)
    .slice(0, maxImages);

  return (
    <button
      type="button"
      className={`${styles.floatingViewCart} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {thumbnails.length > 0 && (
        <span className={styles.thumbs}>
          {thumbnails.map((url, index) => (
            <img
              key={`${url}-${index}`}
              className={styles.thumb}
              src={url}
              alt=""
              style={{ zIndex: thumbnails.length - index }}
            />
          ))}
        </span>
      )}
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>
          {itemsLabel || `${itemCount} ${itemCount === 1 ? "Item" : "Items"}`}
        </span>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        &#8250;
      </span>
    </button>
  );
}

export default FloatingViewCart;
