import React from "react";
import { useMobile } from "../../../../helper/hooks/useMobile";
import StickyPayNow from "../sticky-pay-now/sticky-pay-now";
import * as styles from "./zero-pay-btn.less";
import { priceFormatCurrencySymbol } from "../../../../helper/utils";

function ZeroPayButton({ payment, showPayment, onPriceDetailsClick }) {
  const { proceedToPay, getTotalValue, getCurrencySymbol, isLoading } = payment;
  const isMobile = useMobile();
  return (
    <>
      {showPayment && getTotalValue?.() === 0 && (
        <div>
          {" "}
          {!isMobile ? (
            <button
              className={`${styles.commonBtn} ${styles.payBtn}`}
              onClick={() => proceedToPay("PP", {})}
              disabled={isLoading}
            >
              PLACE ORDER
            </button>
          ) : (
            <StickyPayNow
              value={priceFormatCurrencySymbol(
                getCurrencySymbol,
                getTotalValue()
              )}
              disabled={isLoading}
              onPriceDetailsClick={onPriceDetailsClick}
              proceedToPay={() => {
                proceedToPay("PP", {});
              }}
              btnTitle="PLACE ORDER"
            />
          )}
        </div>
      )}
    </>
  );
}

export default ZeroPayButton;
