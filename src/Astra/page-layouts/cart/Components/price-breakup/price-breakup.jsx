import React, { useMemo } from "react";
import { currencyFormat, numberWithCommas } from "../../../../helper/utils";
import * as styles from "./price-breakup.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";

function priceBreakup({ breakUpValues, cartItemCount, currencySymbol }) {
  const breakup = breakUpValues?.display || [];

  const totalDiscount = useMemo(() => {
    let totalDis = 0;
    breakUpValues?.display?.forEach((element) => {
      if (element.value < 0) {
        totalDis += element.value;
      }
    });
    return totalDis;
  }, [breakUpValues]);
  return (
    <div className={styles.priceSummaryContainer}>
      <div
        className={styles.priceSummaryHeading}
      >{`PRICE SUMMARY (${cartItemCount} ITEMS)`}</div>
      {breakup?.map((item, index) => (
        <div
          className={`${
            index !== breakup.length - 1
              ? styles.priceSummaryItem
              : styles.priceSummaryItemTotal
          }`}
          key={item?.key}
        >
          {index !== breakup.length - 1 ? (
            <>
              <div>{item?.display}</div>
              <div className={Number(item.value) < 0 ? styles.discount : ""}>
                {item?.currency_symbol}
                {item?.value}
              </div>
            </>
          ) : (
            <>
              <div>{item?.display}</div>
              <div>
                {item?.currency_symbol}
                {item?.value}
              </div>
            </>
          )}
        </div>
      ))}
      {totalDiscount > 0 && (
        <div className={styles.discountPreviewContiner}>
          <span className={styles.svgContainer}>
            <SvgWrapper svgSrc="celebration" />
          </span>
          <span className={styles.discountPreviewMessage}>
            Yayy!!! You've saved
          </span>
          <span className={styles.discountPreviewAmount}>
            {currencyFormat(numberWithCommas(totalDiscount), currencySymbol)}
          </span>
        </div>
      )}
    </div>
  );
}

export default priceBreakup;
