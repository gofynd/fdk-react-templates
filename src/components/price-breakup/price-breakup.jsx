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
import {
  priceFormatCurrencySymbol,
  translateDynamicLabel,
} from "../../helper/utils";
import * as styles from "./price-breakup.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { useGlobalTranslation } from "fdk-core/utils";
import ForcedLtr from "../forced-ltr/forced-ltr";
import Skeleton from "../core/skeletons/skeleton";

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
  customClassName,
  isLoading = false,
}) {
  const { t } = useGlobalTranslation("translation");
  const cssVar = {
    "--card-border-radius": `${cardBorderRadius}`,
  };
  const priceBreakupLoaderWidth = [60, 50, 45, 90, 34];

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
      <div
        className={`fontBody ${styles.priceSummaryHeading} ${customClassName}`}
      >
        <span className={styles.priceSummaryLabel}>
          {title || t("resource.common.price_summary")}
        </span>

        {isLoading ? (
          <Skeleton width={66} height={15} />
        ) : (
          <>
            {showItemsCount && (
              <span>{`( ${cartItemCount} ${
                cartItemCount > 1
                  ? t("resource.common.items_caps_plural")
                  : t("resource.common.items_caps_singular")
              } )`}</span>
            )}
          </>
        )}
      </div>
      {isLoading ? (
        <>
          {priceBreakupLoaderWidth.map((width, index) => (
            <div
              className={`${
                index !== priceBreakupLoaderWidth.length - 1
                  ? styles.priceSummaryItem
                  : styles.priceSummaryItemTotal
              }`}
            >
              <Skeleton
                width={width}
                height={22}
                className={styles.priceLoading}
              />
              <Skeleton
                width={index !== priceBreakupLoaderWidth.length - 1 ? 40 : 50}
                height={22}
                className={styles.priceLoading}
              />
            </div>
          ))}
        </>
      ) : (
        <>
          {breakUpValuesList?.map((item, index) => (
            <div
              className={`fontBody ${
                index !== breakUpValuesList.length - 1
                  ? styles.priceSummaryItem
                  : styles.priceSummaryItemTotal
              } ${customClassName}`}
              key={item?.key}
            >
              {index !== breakUpValuesList.length - 1 ? (
                <>
                  <div>{translateDynamicLabel(item?.display, t)}</div>
                  <div
                    className={Number(item.value) < 0 ? styles.discount : ""}
                  >
                    {priceFormatCurrencySymbol(
                      item?.currency_symbol,
                      item?.value,
                      undefined,
                      item?.currency_code
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>{translateDynamicLabel(item?.display, t)}</div>
                  <div>
                    {priceFormatCurrencySymbol(
                      item?.currency_symbol,
                      item?.value,
                      undefined,
                      item?.currency_code
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </>
      )}
      {isInternationalTaxLabel && (
        <div className={styles.internationalTaxLabel}>
          <SvgWrapper className={styles.infoIcon} svgSrc="infoIcon" />
          <span>{t("resource.common.delivery_custom_fees_notice")}</span>
        </div>
      )}

      {isLoading ? (
        <Skeleton height={38} className={styles.discountLoading} />
      ) : (
        <>
          {showTotalDiscount && totalDiscount > 0 && (
            <div className={styles.discountPreviewContiner}>
              <span className={styles.icon}>{greetingIcon}</span>
              <span className={styles.discountPreviewMessage}>
                {discountGreetingMessage ||
                  t("resource.common.discount_greeting_message")}
              </span>
              <span className={styles.discountPreviewAmount}>
                <ForcedLtr
                  text={priceFormatCurrencySymbol(
                    currencySymbol,
                    totalDiscount,
                    undefined,
                    breakUpValues?.[0]?.currency_code
                  )}
                />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PriceBreakup;
