import React, { useEffect, useState } from "react";
import * as styles from "./b2b-credit-payment.less";
import FyButton from "../core/fy-button/fy-button";
import DangerInfoIcon from "../../assets/images/danger-info.svg";
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
  const formattedTotal = priceFormatCurrencySymbol(getCurrencySymbol, totalValue);
  const formattedCredit = priceFormatCurrencySymbol(
    getCurrencySymbol,
    availableCredit ?? 0
  );

  const isCreditPaymentLoading = isPaymentLoading || isCreditPaymentSubmitting;

  useEffect(() => {
    if (!isPaymentLoading && isCreditPaymentSubmitting) {
      setIsCreditPaymentSubmitting(false);
    }
  }, [isPaymentLoading, isCreditPaymentSubmitting]);

  const handlePayNow = async () => {
    if (isCreditPaymentLoading) return;
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
    <div className={styles.creditWrapper}>
      {tagline ? (
        <div className={styles.tagline}>
          <p>{tagline}</p>
        </div>
      ) : null}

      <div className={styles.creditCard}>
        <div className={styles.creditCardTopRow}>
          <p className={styles.creditLabel}>Available Credit</p>
          <div className={styles.creditReadyBadge}>
            <span aria-hidden="true">&bull;</span>
            <span>{readyToUseText}</span>
          </div>
        </div>
        <p className={styles.creditAmount}>{formattedCredit}</p>
      </div>

      <div className={styles.orderAmountRow}>
        <span>Order amount</span>
        <span>{formattedTotal}</span>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoIcon}>
          <DangerInfoIcon />
        </div>
        <div className={styles.infoText}>
          {lenderDescription ? (
            <HTMLContent content={lenderDescription} />
          ) : (
            <p>
              <strong>Credit is applied instantly on checkout.</strong> No OTP,
              no waiting. Any unused balance stays in your wallet for next
              time.
            </p>
          )}
        </div>
      </div>

      {isTablet ? (
        <StickyPayNow
          customClassName={sharedStyles?.visibleOnTab}
          value={formattedTotal}
          onPriceDetailsClick={onPriceDetailsClick}
          enableLinkPaymentOption={enableLinkPaymentOption}
          isPaymentLoading={isCreditPaymentLoading}
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
            disabled={isCreditPaymentLoading}
          >
            {!isCreditPaymentLoading ? <>Pay Now &rarr;</> : loader}
          </FyButton>
        </div>
      )}
    </div>
  );
}

export default CreditPayment;
