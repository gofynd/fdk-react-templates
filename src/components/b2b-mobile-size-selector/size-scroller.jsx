/**
 * SizeScroller renders the available sizes as a horizontally scrollable row of
 * selectable cards (Blinkit style). It is purely presentational; the parent owns
 * all selection and cart logic.
 *
 * @param {Object} props - The properties object.
 * @param {string} [props.title] - Heading shown above the cards.
 * @param {Array<Object>} props.sizes - Sizes to render. Each item supports
 * `value`, `display`, `priceLabel`, `mrpLabel`, `discountLabel`, `badgeLabel`,
 * `badgeType` ("contract" | "quotation"), `isPriceLoading`, `quantity`,
 * `isSelected` and `disabled`.
 * @param {Function} [props.onSelect] - Called with the clicked size item.
 * @param {string} [props.className] - Extra class for the container.
 *
 * @returns {JSX.Element} A horizontally scrollable list of size cards.
 */

import React, { useEffect, useRef } from "react";
import * as styles from "./size-scroller.less";

function SizeScroller({ title = "", sizes = [], onSelect = () => {}, className = "" }) {
  const selectedRef = useRef(null);

  const selectedValue = sizes.find((size) => size?.isSelected)?.value;

  useEffect(() => {
    selectedRef.current?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedValue]);

  return (
    <div className={`${styles.sizeScroller} ${className}`}>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.scrollArea} role="listbox" aria-label={title}>
        {sizes.map((size) => (
          <button
            key={size.value}
            type="button"
            role="option"
            aria-selected={!!size.isSelected}
            ref={size.isSelected ? selectedRef : null}
            disabled={size.disabled}
            className={`${styles.sizeCard} ${size.isSelected ? styles.selected : ""}`}
            onClick={() => onSelect(size)}
          >
            {Number(size.quantity) > 0 && (
              <span className={styles.badge}>{size.quantity}</span>
            )}
            <span className={styles.sizeLabel}>{size.display}</span>
            {size.isPriceLoading && !size.priceLabel ? (
              <span className={styles.priceShimmer} aria-hidden="true" />
            ) : (
              size.priceLabel && (
                <span className={styles.priceRow}>
                  <span className={styles.price}>{size.priceLabel}</span>
                  {size.mrpLabel && (
                    <span className={styles.mrp}>{size.mrpLabel}</span>
                  )}
                </span>
              )
            )}
            {size.badgeLabel && (
              <span
                className={`${styles.priceBadge} ${
                  size.badgeType === "quotation" ? styles.quotation : ""
                }`}
              >
                {size.badgeLabel}
              </span>
            )}
            {size.discountLabel && !size.badgeLabel && (
              <span className={styles.discount}>{size.discountLabel}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizeScroller;
