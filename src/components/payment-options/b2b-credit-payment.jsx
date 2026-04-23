import React, { useEffect, useState } from "react";
import * as styles from "./b2b-credit-payment.less";
import FyButton from "../core/fy-button/fy-button";
import HTMLContent from "../core/html-content/html-content";

function CreditPayment({
  // Amount display
  getCurrencySymbol,
  getTotalValue,
  availableCredit,
  lender,
  // Payment flow
  proceedToPay,
  acceptOrder,
  selectedPaymentPayload,
  enableLinkPaymentOption,
  isPaymentLoading,
  loader,
  onPriceDetailsClick,
  priceFormatCurrencySymbol,
  isTablet,
  StickyPayNow,
  styles: sharedStyles,
}) {
  const [isCreditPaymentSubmitting, setIsCreditPaymentSubmitting] =
    useState(false);
  const totalValue = getTotalValue();
  const formattedTotal = priceFormatCurrencySymbol(
    getCurrencySymbol,
    totalValue
  );
  const formattedCredit = priceFormatCurrencySymbol(
    getCurrencySymbol,
    availableCredit ?? 0
  );

  const isInsufficientCredit = (availableCredit ?? 0) < totalValue;
  const isCreditPaymentLoading = isPaymentLoading || isCreditPaymentSubmitting;
  const isPayDisabled = isCreditPaymentLoading || isInsufficientCredit;

  useEffect(() => {
    if (!isPaymentLoading && isCreditPaymentSubmitting) {
      setIsCreditPaymentSubmitting(false);
    }
  }, [isPaymentLoading, isCreditPaymentSubmitting]);

  const handlePayNow = async () => {
    if (isPayDisabled) return;
    setIsCreditPaymentSubmitting(true);
    try {
      await proceedToPay("CREDIT", selectedPaymentPayload);
      acceptOrder();
    } catch {
      setIsCreditPaymentSubmitting(false);
    }
  };

  const readyToUseText = lender?.status_text || "Ready to use";
  const tagline = selectedPaymentPayload?.tagline;
  const lenderDescription =
    lender?.description || selectedPaymentPayload?.description || "";

  return (
    <>
      <div className={styles.creditPaymentContainer}>
        <div className={styles.creditWrapper}>
          {tagline ? (
            <div className={styles.tagline}>
              <p>{tagline}</p>
            </div>
          ) : null}

          <div className={styles.creditCard}>
            <div className={styles.creditCardTopRow}>
              <p className={styles.creditLabel}>Available Credit</p>
              <div
                className={`${styles.creditReadyBadge} ${isInsufficientCredit ? styles.creditReadyBadgeDanger : ""}`}
              >
                <span aria-hidden="true">&bull;</span>
                <span>
                  {isInsufficientCredit ? "Insufficient credit" : readyToUseText}
                </span>
              </div>
            </div>
            <p className={styles.creditAmount}>{formattedCredit}</p>
            {isInsufficientCredit && (
              <p className={styles.insufficientCreditMsg}>
                Available credit is less than the order amount.
              </p>
            )}
          </div>

          {/* <div className={styles.orderAmountRow}>
        <span>Order amount</span>
        <span>{formattedTotal}</span>
      </div> */}

          <div className={styles.infoContainer}>
            {tagline && lenderDescription && (
              <div className={styles.infoTag}>{tagline}</div>
            )}

            <div className={styles.infoRow}>
              <div className={styles.infoText}>
                {lenderDescription && (
                  <HTMLContent content={lenderDescription} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          {isTablet ? (
            <StickyPayNow
              customClassName={sharedStyles?.visibleOnTab}
              value={formattedTotal}
              onPriceDetailsClick={onPriceDetailsClick}
              enableLinkPaymentOption={enableLinkPaymentOption}
              isPaymentLoading={isCreditPaymentLoading}
              disabled={isPayDisabled}
              loader={loader}
              proceedToPay={handlePayNow}
            />
          ) : (
            <div className={styles.creditFooter}>
              <div className={styles.creditFooterLeft}>
                <span className={styles.youPayLabel}>You pay</span>
                <span className={styles.youPayAmount}>{formattedTotal}</span>
              </div>
              <FyButton
                className={styles.creditPayBtn}
                onClick={handlePayNow}
                disabled={isPayDisabled}
              >
                {!isCreditPaymentLoading ? <>Pay Now &rarr;</> : loader}
              </FyButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreditPayment;
