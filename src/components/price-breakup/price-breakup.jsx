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
 * @param {boolean} isInternationalTaxLabel - To display tax label for international orders.
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
 * isInternationalTaxLabel = false,
 *
 * Example usage:
 * <PriceBreakup breakUpValues={orderData?.breakup_values} cartItemCount={getItemCount()} currencySymbol={orderData?.breakup_values?.[0]?.currency_symbol}/>
 *
 */

import React, { useMemo } from "react";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import * as styles from "./price-breakup.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { useGlobalTranslation } from "fdk-core/utils";

function PriceBreakup({
  title,
  breakUpValues = [],
  showItemsCount = true,
  cartItemCount = 0,
  currencySymbol = "₹",
  showTotalDiscount = true,
  includeZeroValues = false,
  discountGreetingMessage,
  greetingIcon = <SvgWrapper svgSrc="celebration" className={styles.svgIcon} />,
  cardBorderRadius = "8px",
  isInternationalTaxLabel = false,
}) {
  const { t } = useGlobalTranslation("translation");
  const cssVar = {
    "--card-border-radius": `${cardBorderRadius}`,
  };

  const totalDiscount = useMemo(() => {
    let totalDis = 0;
    breakUpValues?.forEach((element) => {
      if (
        element.value < 0 &&
        ["coupon", "discount", "promotion"].includes(element.key)
      ) {
        totalDis -= element.value;
      }
    });
    return totalDis;
  }, [breakUpValues]);

  const breakUpValuesList = useMemo(() => {
    if (!breakUpValues) return [];

    const totalVal = breakUpValues.filter(
      (f) => f?.key === "total" || f?.name === "total"
    );
    const restVal = breakUpValues.filter(
      (f) =>
        f?.key !== "total" &&
        f?.name !== "total" &&
        (includeZeroValues || f?.value !== 0)
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
        {title || t("resource.common.price_summary")}
        {showItemsCount && (
          <span>{` ( ${cartItemCount} ${cartItemCount > 1 ? t("resource.common.items_caps_plural") : t("resource.common.items_caps_singular")
            } )`}</span>
        )}
      </div>
      {breakUpValuesList?.map((item, index) => (
        <div
          className={`fontBody ${index !== breakUpValuesList.length - 1
            ? styles.priceSummaryItem
            : styles.priceSummaryItemTotal
            }`}
          key={item?.key}
        >
          {index !== breakUpValuesList.length - 1 ? (
            <>
              <div>{item?.display}</div>
              <div className={Number(item.value) < 0 ? styles.discount : ""}>
                {priceFormatCurrencySymbol(item?.currency_symbol, item?.value)}
              </div>
            </>
          ) : (
            <>
              <div>{item?.display}</div>
              <div>
                {priceFormatCurrencySymbol(item?.currency_symbol, item?.value)}
              </div>
            </>
          )}
        </div>
      ))}
      {isInternationalTaxLabel && (
        <div className={styles.internationalTaxLabel}>
          <SvgWrapper className={styles.infoIcon} svgSrc="infoIcon" />
          <span>
            {t("resource.common.delivery_custom_fees_notice")}
          </span>
        </div>
      )}
      {showTotalDiscount && totalDiscount > 0 && (
        <div className={styles.discountPreviewContiner}>
          <span className={styles.icon}>{greetingIcon}</span>
          <span className={styles.discountPreviewMessage}>
            {discountGreetingMessage || t("resource.common.discount_greeting_message")}
          </span>
          <span className={styles.discountPreviewAmount}>
            {priceFormatCurrencySymbol(currencySymbol, totalDiscount)}
          </span>
        </div>
      )}
    </div>
  );
}

export default PriceBreakup;
