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
 * `isSelected`, `disabled` and `statusLabel` (replaces the price, e.g. "Out of stock").
 * @param {Function} [props.onSelect] - Called with the clicked size item.
 * @param {Function} [props.onVisibleChange] - Called with the `value`s of the cards that are
 * on screen or within `visibleMargin` px of it, whenever that set changes (and once on mount).
 * Never called where IntersectionObserver is unavailable.
 * @param {number} [props.visibleMargin=160] - How far, in px, beyond the visible edge a card
 * still counts as visible, so its data can load just before it scrolls into view.
 * @param {string} [props.className] - Extra class for the container.
 *
 * @returns {JSX.Element} A horizontally scrollable list of size cards.
 */

import React, { useEffect, useRef } from "react";
import * as styles from "./size-scroller.less";

function SizeScroller({
  title = "",
  sizes = [],
  onSelect = () => {},
  onVisibleChange,
  visibleMargin = 160,
  className = "",
}) {
  const selectedRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const cardRefs = useRef(new Map());
  // Kept in a ref so a new callback each render does not recreate the observer.
  const onVisibleChangeRef = useRef(onVisibleChange);
  onVisibleChangeRef.current = onVisibleChange;
  const sizeValuesKey = sizes.map((size) => size.value).join(",");
  // Whether tracking is wanted at all; a callback supplied later must start the observer.
  const hasVisibleCallback = !!onVisibleChange;

  const selectedValue = sizes.find((size) => size?.isSelected)?.value;

  useEffect(() => {
    selectedRef.current?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedValue]);

  useEffect(() => {
    if (
      !hasVisibleCallback ||
      typeof IntersectionObserver === "undefined" ||
      !scrollAreaRef.current
    ) {
      return undefined;
    }
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const value = entry.target.getAttribute("data-size-value");
          if (entry.isIntersecting) visible.add(value);
          else visible.delete(value);
        });
        onVisibleChangeRef.current?.([...visible]);
      },
      {
        root: scrollAreaRef.current,
        rootMargin: `0px ${visibleMargin}px 0px ${visibleMargin}px`,
        threshold: 0,
      }
    );
    cardRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sizeValuesKey, visibleMargin, hasVisibleCallback]);

  return (
    <div className={`${styles.sizeScroller} ${className}`}>
      {title && <p className={styles.title}>{title}</p>}
      <div
        ref={scrollAreaRef}
        className={styles.scrollArea}
        role="listbox"
        aria-label={title}
      >
        {sizes.map((size) => (
          <button
            key={size.value}
            type="button"
            role="option"
            aria-selected={!!size.isSelected}
            data-size-value={size.value}
            ref={(el) => {
              if (el) cardRefs.current.set(String(size.value), el);
              else cardRefs.current.delete(String(size.value));
              if (size.isSelected) selectedRef.current = el;
            }}
            disabled={size.disabled}
            className={`${styles.sizeCard} ${size.isSelected ? styles.selected : ""}`}
            onClick={() => onSelect(size)}
          >
            {Number(size.quantity) > 0 && (
              <span className={styles.badge}>{size.quantity}</span>
            )}
            <span className={styles.sizeLabel}>{size.display}</span>
            {size.statusLabel ? (
              <span className={styles.statusLabel}>{size.statusLabel}</span>
            ) : size.isPriceLoading && !size.priceLabel ? (
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
            {!size.statusLabel && size.badgeLabel && (
              <span
                className={`${styles.priceBadge} ${
                  size.badgeType === "quotation" ? styles.quotation : ""
                }`}
              >
                {size.badgeLabel}
              </span>
            )}
            {!size.statusLabel && size.discountLabel && !size.badgeLabel && (
              <span className={styles.discount}>{size.discountLabel}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizeScroller;
