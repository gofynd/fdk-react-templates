import React, { useState } from "react";
import { useGlobalTranslation } from "fdk-core/utils";
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
  const { t } = useGlobalTranslation("translation");
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

  const handlePayNow = async () => {
    if (isPayDisabled) return;
    setIsCreditPaymentSubmitting(true);
    try {
      await proceedToPay("CREDIT", selectedPaymentPayload);
      acceptOrder();
    } catch {
      // error handled by proceedToPay
    } finally {
      setIsCreditPaymentSubmitting(false);
    }
  };

  const tagline = lender?.tagline || "";
  const lenderDescription = lender?.description || "";

  return (
    <>
      <div className={styles.creditPaymentContainer}>
        <div className={styles.creditWrapper}>
          <div className={styles.creditCard}>
            <div className={styles.creditCardTopRow}>
              <p className={styles.creditLabel}>{t("resource.checkout.credit_available_credit")}</p>
              <div
                className={`${styles.creditReadyBadge} ${isInsufficientCredit ? styles.creditReadyBadgeDanger : ""}`}
              >
                <span aria-hidden="true">&bull;</span>
                <span>
                  {isInsufficientCredit
                    ? t("resource.checkout.credit_insufficient")
                    : t("resource.checkout.credit_ready_to_use")}
                </span>
              </div>
            </div>
            <p className={styles.creditAmount}>{formattedCredit}</p>
            {isInsufficientCredit && (
              <p className={styles.insufficientCreditMsg}>
                {t("resource.checkout.credit_insufficient_msg")}
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
                <span className={styles.youPayLabel}>{t("resource.checkout.credit_you_pay")}</span>
                <span className={styles.youPayAmount}>{formattedTotal}</span>
              </div>
              <FyButton
                className={styles.creditPayBtn}
                onClick={handlePayNow}
                disabled={isPayDisabled}
                isLoading={isCreditPaymentLoading}
              >
                {t("resource.checkout.credit_pay_now")}
              </FyButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreditPayment;
