import React from "react";
import { useMobile } from "../../../../helper/hooks/useMobile";
import StickyPayNow from "../sticky-pay-now/sticky-pay-now";
import * as styles from "./zero-pay-btn.less";
import { currencyFormat, formatLocale } from "../../../../helper/utils";
import { useGlobalStore, useFPI } from "fdk-core/utils";

function ZeroPayButton({ payment, showPayment, onPriceDetailsClick, loader }) {
  const {
    proceedToPay,
    getTotalValue,
    getCurrencySymbol,
    isLoading,
    isPaymentLoading,
    isCreditNoteApplied,
  } = payment;
  const isMobile = useMobile();
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  return (
    <>
      {showPayment && getTotalValue?.() === 0 && (
        <div>
          {" "}
          {
            isMobile && (
              // (
              //   <button
              //     className={`${styles.commonBtn} ${styles.payBtn}`}
              //     onClick={() => proceedToPay("PP", {})}
              //     disabled={isLoading}
              //   >
              //     PLACE ORDER
              //   </button>
              // ) : (
              <StickyPayNow
                value={currencyFormat(
                  getTotalValue() || 0,
                  getCurrencySymbol || "₹",
                  formatLocale(locale, countryCode, true)
                )}
                disabled={isLoading}
                onPriceDetailsClick={onPriceDetailsClick}
                isPaymentLoading={isPaymentLoading}
                loader={loader}
                proceedToPay={() => {
                  proceedToPay(!isCreditNoteApplied ? "PP" : "CREDITNOTE", {});
                }}
                btnTitle="PLACE ORDER"
              />
            )
            // )
          }
        </div>
      )}
    </>
  );
}

export default ZeroPayButton;
