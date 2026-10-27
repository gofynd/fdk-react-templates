/**
 * SizeHints shows the two helper lines under the size cards: the "what is in this size" chips
 * (e.g. "35 - 2 Pcs", from the size's child details) and one short suggestive line that says
 * how the buyer can pay less, or what the ordering rules are. It is shared by the PDP size
 * selector and the PLP add to cart popup, so both always say the same thing.
 *
 * The suggestion is the first scenario that applies: contract quantity left, quoted quantity
 * left, the next ladder slab that beats the current price, the best price, maximum reached,
 * minimum order quantity, order multiples, maximum order quantity.
 *
 * @param {Object} props - The properties object.
 * @param {Object} [props.best] - Price details of the active size: `contract`, `quotation`,
 * `ladder` (with `price_slabs`), `best_price`, `pricing_tier` and `currency_symbol`.
 * @param {Object} [props.display] - `{ effective, marked, symbol }`, the unit price the buyer
 * pays now, its MRP, and the currency symbol.
 * @param {boolean} [props.canSeeDiscounts=false] - Whether ladder and best-price offers may be
 * shown (signed in, and KYC approved or discounts allowed for non-KYC buyers).
 * @param {number} [props.productCartQuantity=0] - Quantity of this product in the cart, across
 * all sizes (ladder slabs are counted on it).
 * @param {number} [props.activeQuantity=0] - Quantity of the active size in the cart.
 * @param {number} [props.maxQuantity] - Maximum quantity of the active size.
 * @param {number} [props.minQuantity=1] - Minimum order quantity.
 * @param {number} [props.incrementDecrementUnit=1] - Order multiple.
 * @param {Object} [props.moq] - Product MOQ (`maximum` is used as the last-resort hint).
 * @param {boolean} [props.showSavingsHint=true] - Turns the suggestive line off.
 * @param {Array<Object>} [props.childDetails=[]] - `{ seller_identifier, required_quantity }`.
 * @param {Function} [props.formatPrice] - `(value, symbol) => string`; defaults to the theme's
 * number + currency formatting.
 * @param {string} [props.className] - Extra class for the wrapper.
 *
 * @returns {JSX.Element|null} The chips and/or the suggestion, or null when there is neither.
 */

import React from "react";
import { useGlobalTranslation } from "fdk-core/utils";
import * as styles from "./size-hints.less";
import { currencyFormat, numberWithCommas } from "../../helper/utils";

const PREFIX = "resource.b2b.components.size_wrapper";

const extractSizeFromSellerIdentifier = (sellerIdentifier) => {
  if (!sellerIdentifier) return "";
  const parts = sellerIdentifier.split("-");
  return parts[parts.length - 1];
};

const remaining = (entry) =>
  Math.max((entry?.total_count || 0) - (entry?.used_count || 0), 0);

// Same unit price the ladder table shows for a slab.
const getSlabPrice = (slab) =>
  slab.ladder_type === "fixed" ? slab.ladder_price : slab.offer_price;

function SizeHints({
  best = null,
  display = {},
  canSeeDiscounts = false,
  productCartQuantity = 0,
  activeQuantity = 0,
  maxQuantity,
  minQuantity = 1,
  incrementDecrementUnit = 1,
  moq = null,
  showSavingsHint = true,
  childDetails = [],
  formatPrice = (value, symbol) =>
    currencyFormat(numberWithCommas(value), symbol),
  className = "",
}) {
  const { t } = useGlobalTranslation("translation");

  const getHint = () => {
    const symbol = display?.symbol;

    if (best?.contract?.is_applicable && remaining(best.contract) > 0) {
      return t(`${PREFIX}.hint_contract_qty`, {
        count: remaining(best.contract),
      });
    }
    if (best?.quotation?.is_applicable && remaining(best.quotation) > 0) {
      return t(`${PREFIX}.hint_quotation_qty`, {
        count: remaining(best.quotation),
      });
    }

    if (canSeeDiscounts && best?.ladder?.is_applicable) {
      // Only suggest a slab that actually beats what the buyer pays now (a contract, tier
      // or best price can already be lower than the ladder's first slabs).
      const nextSlab = [...(best.ladder.price_slabs || [])]
        .sort((a, b) => a.min_qty - b.min_qty)
        .find((slab) => {
          if (!(slab.min_qty > productCartQuantity)) return false;
          const price = getSlabPrice(slab);
          return (
            !price || !(display?.effective > 0) || price < display.effective
          );
        });
      if (nextSlab) {
        const slabPrice = getSlabPrice(nextSlab);
        if (slabPrice) {
          const percent =
            display?.marked > slabPrice
              ? Math.round(
                  ((display.marked - slabPrice) / display.marked) * 100
                )
              : 0;
          const values = {
            qty: nextSlab.min_qty,
            count: nextSlab.min_qty - productCartQuantity,
            price: formatPrice(slabPrice, best.currency_symbol || symbol),
          };
          let key;
          if (productCartQuantity > 0) {
            key =
              percent > 0
                ? "hint_ladder_add_more_percent"
                : "hint_ladder_add_more";
          } else {
            key =
              percent > 0 ? "hint_ladder_buy_percent" : "hint_ladder_buy";
          }
          return t(`${PREFIX}.${key}`, { ...values, percent });
        }
        return t(`${PREFIX}.hint_ladder_generic`, { qty: nextSlab.min_qty });
      }
    }

    if (
      canSeeDiscounts &&
      best?.best_price?.is_applicable &&
      best?.best_price?.price
    ) {
      return t(`${PREFIX}.hint_best_price`, {
        price: formatPrice(
          best.best_price.price,
          best.currency_symbol || symbol
        ),
      });
    }

    const max = Number(maxQuantity);
    if (activeQuantity > 0 && Number.isFinite(max) && activeQuantity >= max) {
      return t(`${PREFIX}.hint_max_reached`, { max });
    }
    if (activeQuantity === 0 && minQuantity > 1) {
      return t(`${PREFIX}.hint_min_qty`, { min: minQuantity });
    }
    if (incrementDecrementUnit > 1) {
      return t(`${PREFIX}.hint_multiples`, { unit: incrementDecrementUnit });
    }
    if (moq?.maximum) {
      return t(`${PREFIX}.hint_max_qty`, { max: moq.maximum });
    }
    return "";
  };

  const hint = showSavingsHint ? getHint() : "";
  const chips = Array.isArray(childDetails) ? childDetails : [];

  if (!hint && !chips.length) return null;

  return (
    <div className={`${styles.sizeHints} ${className}`}>
      {chips.length > 0 && (
        <div className={styles.childDetailsContainer}>
          {chips.map((child, index) => (
            <div key={index} className={styles.childDetailBox}>
              <span className={styles.childSize}>
                {extractSizeFromSellerIdentifier(child.seller_identifier)}
              </span>
              <span className={styles.childSeparator}>-</span>
              <span className={styles.childQuantity}>
                {child.required_quantity} Pcs
              </span>
            </div>
          ))}
        </div>
      )}
      {!!hint && <p className={styles.savingsHint}>{hint}</p>}
    </div>
  );
}

export default SizeHints;
