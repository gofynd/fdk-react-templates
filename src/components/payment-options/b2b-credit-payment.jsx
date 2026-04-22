import React from "react";
import * as styles from "./b2b-credit-payment.less";
import HTMLContent from "../core/html-content/html-content";

function CreditPayment({
  // Amount display
  getCurrencySymbol,
  getTotalValue,
  availableCredit,
  // Lender info
  lender,
  // Payment flow
  proceedToPay,
  acceptOrder,
  selectedPaymentPayload,
  enableLinkPaymentOption,
  isPaymentLoading,
  loader,
  onPriceDetailsClick,
  // UI / layout — shared parent styles (visibleOnTab only)
  styles: sharedStyles,
  isTablet,
  StickyPayNow,
  priceFormatCurrencySymbol,
}) {
  const totalValue = getTotalValue();
  const formattedTotal = priceFormatCurrencySymbol(getCurrencySymbol, totalValue);
  const formattedCredit = priceFormatCurrencySymbol(getCurrencySymbol, availableCredit ?? 0);

  const handlePayNow = () => {
    proceedToPay("CREDIT", selectedPaymentPayload);
    acceptOrder();
  };

  return (
    <div className={styles.creditWrapper}>
      {/* Available credit card */}
      <div className={styles.creditBalanceCard}>
        <div className={styles.creditBalanceContent}>
          <p className={styles.creditBalanceLabel}>AVAILABLE CREDIT</p>
          <p className={styles.creditBalanceAmount}>{formattedCredit}</p>
        </div>
        <div className={styles.creditReadyBadge}>
          <span className={styles.creditReadyDot} />
          <span className={styles.creditReadyText}>Ready to use</span>
        </div>
      </div>

      {/* Order amount row */}
      <div className={styles.creditOrderAmountRow}>
        <span className={styles.creditOrderAmountLabel}>Order amount</span>
        <span className={styles.creditOrderAmountValue}>{formattedTotal}</span>
      </div>

      {/* Info alert — lender description + standard info text */}
      <div className={styles.creditInfoAlert}>
        <div className={styles.creditInfoIcon}>i</div>
        <p className={styles.creditInfoText}>
          {lender?.description ? (
            <HTMLContent content={lender.description} />
          ) : (
            <>
              <strong>Credit is applied instantly on checkout —</strong>{" "}
              no OTP, no waiting. Any unused balance stays in your wallet for next time.
            </>
          )}
        </p>
      </div>

      {/* Pay Now CTA */}
      {isTablet ? (
        <StickyPayNow
          customClassName={sharedStyles?.visibleOnTab}
          value={formattedTotal}
          onPriceDetailsClick={onPriceDetailsClick}
          enableLinkPaymentOption={enableLinkPaymentOption}
          isPaymentLoading={isPaymentLoading}
          loader={loader}
          proceedToPay={handlePayNow}
        />
      ) : (
        <button
          className={styles.creditPayBtn}
          onClick={handlePayNow}
          disabled={isPaymentLoading}
        >
          {!isPaymentLoading ? <>Pay Now &rarr;</> : loader}
        </button>
      )}
    </div>
  );
}

export default CreditPayment;
