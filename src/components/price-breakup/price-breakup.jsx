/**
 * PriceBreakup Component
 *
 * This component represents a Cart and checkout Price Breakup.
 * It can be used across the application wherever a Price Breakup is required.[Cart / Checkout/ Order Details/ Order Confirmation]
 *
 * Props:
 * @param {string} title - The heading/title of the price breakup card.
 * @param {array} breakUpValues - Data that you have to pass from getters or GraphQL Queries or API.
 * @param {boolean} showItemsCount - It is a flag to hide/show items count.
 * @param {number} cartItemCount - item count for which breakup is displayed.
 * @param {string} currencySymbol - Currency Symbol for showing discount amount.
 * @param {boolean} showTotalDiscount - Show total discount with greeting at the bottom of card.
 * @param {boolean} includeZeroValues - To include Zero amount values from `breakUpValues` data.
 * @param {string} discountGreetingMessage - Discount Greeting Message shown at bottom of Card.
 * @param {component} greetingIcon - React component to show Greeting icon like celebration.
 * @param {string} cardBorderRadius - String value in `px` for card border radius.
 *
 * Default Props:
 * title = "PRICE SUMMARY",
 * breakUpValues = [],
 * showItemsCount = true,
 * cartItemCount = 0,
 * currencySymbol = "₹",
 * showTotalDiscount = true,
 * includeZeroValues = false,
 * discountGreetingMessage = "Yayy!!! You've saved",
 * greetingIcon = <SvgWrapper svgSrc="celebration" className={styles.svgIcon} />,
 * cardBorderRadius = "8px",
 *
 * Example usage:
 * <PriceBreakup breakUpValues={orderData?.breakup_values} cartItemCount={getItemCount()} currencySymbol={orderData?.breakup_values?.[0]?.currency_symbol}/>
 *
 */

import React, { useMemo } from "react";
import { numberWithCommas } from "../../helper/utils";
import * as styles from "./price-breakup.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function PriceBreakup({
  title = "PRICE SUMMARY",
  breakUpValues = [],
  showItemsCount = true,
  cartItemCount = 0,
  currencySymbol = "₹",
  showTotalDiscount = true,
  includeZeroValues = false,
  discountGreetingMessage = "Yayy!!! You've saved",
  greetingIcon = <SvgWrapper svgSrc="celebration" className={styles.svgIcon} />,
  cardBorderRadius = "8px",
}) {
  const cssVar = {
    "--card-border-radius": `${cardBorderRadius}`,
  };

  const totalDiscount = useMemo(() => {
    let totalDis = 0;
    breakUpValues?.forEach((element) => {
      if (element.value < 0) {
        totalDis -= element.value;
      }
    });
    return totalDis;
  }, [breakUpValues]);

  const breakUpValuesList = useMemo(() => {
    if (!breakUpValues) return [];
    const totalVal = breakUpValues.filter((f) => f?.key === "total");
    const restVal = breakUpValues.filter(
      (f) => f?.key !== "total" && (includeZeroValues || f?.value !== 0)
    );
    return [...restVal, ...totalVal];
  }, [includeZeroValues, breakUpValues]);

  return (
    <div
      className={styles.priceSummaryContainer}
      style={cssVar}
      id="price-breakup-container-id"
    >
      <div className={`fontBody ${styles.priceSummaryHeading}`}>
        {title}
        {showItemsCount && (
          <span>{` ( ${cartItemCount} ${
            cartItemCount > 1 ? "ITEMS" : "ITEM"
          } )`}</span>
        )}
      </div>
      {breakUpValuesList?.map((item, index) => (
        <div
          className={`fontBody ${
            index !== breakUpValuesList.length - 1
              ? styles.priceSummaryItem
              : styles.priceSummaryItemTotal
          }`}
          key={item?.key}
        >
          {index !== breakUpValuesList.length - 1 ? (
            <>
              <div>{item?.display}</div>
              <div className={Number(item.value) < 0 ? styles.discount : ""}>
                {item?.currency_symbol}
                {numberWithCommas(item?.value)}
              </div>
            </>
          ) : (
            <>
              <div>{item?.display}</div>
              <div>
                {item?.currency_symbol}
                {numberWithCommas(item?.value)}
              </div>
            </>
          )}
        </div>
      ))}
      {showTotalDiscount && totalDiscount > 0 && (
        <div className={styles.discountPreviewContiner}>
          <span>{greetingIcon}</span>
          <span className={styles.discountPreviewMessage}>
            {discountGreetingMessage}
          </span>
          <span className={styles.discountPreviewAmount}>
            {`${currencySymbol} ${numberWithCommas(totalDiscount)}`}
          </span>
        </div>
      )}
    </div>
  );
}

export default PriceBreakup;
