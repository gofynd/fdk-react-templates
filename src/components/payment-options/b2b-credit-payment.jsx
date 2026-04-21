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
  // UI / layout — shared parent styles (commonBtn, payBtn, visibleOnTab)
  styles: sharedStyles,
  t,
  isTablet,
  StickyPayNow,
  priceFormatCurrencySymbol,
}) {
  const totalValue = getTotalValue();
  const formattedTotal = priceFormatCurrencySymbol(getCurrencySymbol, totalValue);
  const formattedCredit = priceFormatCurrencySymbol(getCurrencySymbol, availableCredit ?? 0);

  const handlePayNow = () => {
    proceedToPay("Other", selectedPaymentPayload);
    acceptOrder();
  };

  return (
    <div className={styles.creditWrapper}>
      {/* Lender branding */}
      {/* {lender?.logoUrl && (
        <div className={styles.lenderBanner}>
          <img
            className={styles.lenderLogo}
            src={lender.logoUrl}
            alt={lender.tagline || "Lender"}
          />
          {lender.tagline && (
            <span className={styles.lenderTagline}>{lender.tagline}</span>
          )}
        </div>
      )} */}

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

      {/* Info alert */}
      <div className={styles.creditInfoAlert}>
        <div className={styles.creditInfoIcon}>i</div>
        <p className={styles.creditInfoText}>
          <strong>Credit is applied instantly on checkout —</strong>{" "}
          no OTP, no waiting. Any unused balance stays in your wallet for next time.
        </p>
      </div>

      {/* Lender description (HTML) */}
      {lender?.description && (
        <div className={styles.lenderDescription}>
          <HTMLContent content={lender.description} />
        </div>
      )}

      {/* Pay Now CTA */}
      {isTablet ? (
        <StickyPayNow
          customClassName={sharedStyles.visibleOnTab}
          value={formattedTotal}
          onPriceDetailsClick={onPriceDetailsClick}
          enableLinkPaymentOption={enableLinkPaymentOption}
          isPaymentLoading={isPaymentLoading}
          loader={loader}
          proceedToPay={handlePayNow}
        />
      ) : (
        <button
          className={`${sharedStyles.commonBtn} ${sharedStyles.payBtn}`}
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
