import React from "react";
import * as styles from "./best-price.less";
import { currencyFormat, numberWithCommas } from "../../../../helper/utils";

const B2bBestPriceWrapper = ({
  loggedIn,
  isBestPriceLoading,
  bestPriceDetailsData,
  className = "",
  globalConfig,
  isMerchantKycApproved,
}) => {
  const { show_discount_non_kyc } = globalConfig;

  if (!loggedIn) {
    return null;
  }

  if (!isMerchantKycApproved && !show_discount_non_kyc) {
    return null;
  }

  const formattedPrice = currencyFormat(
    numberWithCommas(bestPriceDetailsData?.product?.best_price?.price),
    bestPriceDetailsData?.productPrice?.price?.currency_symbol
  );
  return (
    <>
      {/* {isBestPriceLoading ? (
        <div className={styles.Shimmer}>
          <div className={styles.shimmerLine}></div>
        </div>
      ) : ( */}
      <>
        {!isBestPriceLoading &&
          bestPriceDetailsData?.product?.best_price?.is_applicable &&
          !bestPriceDetailsData?.product?.contract?.is_applicable &&
          !bestPriceDetailsData?.product?.pricing_tier?.is_applicable &&
          !bestPriceDetailsData?.product?.quotation?.is_applicable && (
            <div className={`${styles.bestPriceContainer} ${className}`}>
              <span className={styles.bestPriceContainer__text}>
                Best Price
              </span>
              <span className={styles.bestPriceContainer__available}>
                Available for this item is
              </span>
              <span className={styles.bestPriceContainer__price}>
                {formattedPrice}
              </span>
            </div>
          )}
      </>
      {/* )} */}
    </>
  );
};

export default B2bBestPriceWrapper;
