import React from "react";
import * as creditStyles from "./b2b-credit-payment.less";
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
  // UI / layout
  styles,
  t,
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
    <div className={creditStyles.creditWrapper}>
      {/* Lender branding */}
      {/* {lender?.logoUrl && (
        <div className={creditStyles.lenderBanner}>
          <img
            className={creditStyles.lenderLogo}
            src={lender.logoUrl}
            alt={lender.tagline || "Lender"}
          />
          {lender.tagline && (
            <span className={creditStyles.lenderTagline}>{lender.tagline}</span>
          )}
        </div>
      )} */}

      {/* Available credit card */}
      <div className={creditStyles.creditBalanceCard}>
        <div className={creditStyles.creditBalanceContent}>
          <p className={creditStyles.creditBalanceLabel}>
            {t("resource.checkout.available_credit") || "AVAILABLE CREDIT"}
          </p>
          <p className={creditStyles.creditBalanceAmount}>{formattedCredit}</p>
        </div>
        <div className={creditStyles.creditReadyBadge}>
          <span className={creditStyles.creditReadyDot} />
          <span className={creditStyles.creditReadyText}>
            {t("resource.checkout.ready_to_use") || "Ready to use"}
          </span>
        </div>
      </div>

      {/* Order amount row */}
      <div className={creditStyles.creditOrderAmountRow}>
        <span className={creditStyles.creditOrderAmountLabel}>
          {t("resource.checkout.order_amount") || "Order amount"}
        </span>
        <span className={creditStyles.creditOrderAmountValue}>{formattedTotal}</span>
      </div>

      {/* Info alert */}
      <div className={creditStyles.creditInfoAlert}>
        <div className={creditStyles.creditInfoIcon}>i</div>
        <p className={creditStyles.creditInfoText}>
          <strong>
            {t("resource.checkout.credit_info_bold") ||
              "Credit is applied instantly on checkout —"}
          </strong>{" "}
          {t("resource.checkout.credit_info_body") ||
            "no OTP, no waiting. Any unused balance stays in your wallet for next time."}
        </p>
      </div>

      {/* Lender description (HTML) */}
      {lender?.description && (
        <div className={creditStyles.lenderDescription}>
          <HTMLContent content={lender.description} />
        </div>
      )}

      {/* Pay Now CTA */}
      {isTablet ? (
        <StickyPayNow
          customClassName={styles.visibleOnTab}
          value={formattedTotal}
          onPriceDetailsClick={onPriceDetailsClick}
          enableLinkPaymentOption={enableLinkPaymentOption}
          isPaymentLoading={isPaymentLoading}
          loader={loader}
          proceedToPay={handlePayNow}
        />
      ) : (
        <button
          className={`${styles.commonBtn} ${styles.payBtn}`}
          onClick={handlePayNow}
          disabled={isPaymentLoading}
        >
          {!isPaymentLoading ? (
            <>
              {t("resource.checkout.pay_now") || "Pay Now"} &rarr;
            </>
          ) : (
            loader
          )}
        </button>
      )}
    </div>
  );
}

export default CreditPayment;
