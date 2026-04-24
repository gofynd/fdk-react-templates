import React, { useEffect, useState } from "react";
import * as styles from "./b2b-credit-payment.less";
import FyButton from "../core/fy-button/fy-button";
import HTMLContent from "../core/html-content/html-content";

function CreditPayment({
  getCurrencySymbol,
  getTotalValue,
  availableCredit,
  lender,
  proceedToPay,
  acceptOrder,
  selectedPaymentPayload,
  enableLinkPaymentOption,
  isPaymentLoading,
  onPriceDetailsClick,
  priceFormatCurrencySymbol,
  isTablet,
  StickyPayNow,
  styles: sharedStyles,
  loader,
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

  const readyToUseText = "Ready to use";
  const tagline = lender?.tagline || "";
  const lenderDescription = lender?.description || "";

  return (
    <>
      <div className={styles.creditPaymentContainer}>
        <div className={styles.creditWrapper}>
          <div className={styles.creditCard}>
            <div className={styles.creditCardTopRow}>
              <p className={styles.creditLabel}>Available Credit</p>
              <div
                className={`${styles.creditReadyBadge} ${isInsufficientCredit ? styles.creditReadyBadgeDanger : ""}`}
              >
                <span aria-hidden="true">&bull;</span>
                <span>
                  {isInsufficientCredit
                    ? "Insufficient credit"
                    : readyToUseText}
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

          {(tagline || lenderDescription) && (
            <div className={styles.infoContainer}>
              {tagline && <p className={styles.infoTag}>" {tagline} "</p>}
              {lenderDescription && (
                <div className={styles.infoRow}>
                  <div className={styles.infoText}>
                    <HTMLContent content={lenderDescription} />
                  </div>
                </div>
              )}
            </div>
          )}
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
                isLoading={isCreditPaymentLoading}
              >
                Pay Now &rarr;
              </FyButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreditPayment;
