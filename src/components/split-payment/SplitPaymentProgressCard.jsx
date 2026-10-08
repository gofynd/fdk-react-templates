import React from "react";
import { useGlobalTranslation } from "fdk-core/utils";
import SplitPaymentTimeline from "./SplitPaymentTimeline";
import * as styles from "./SplitPaymentProgressCard.less";

const formatAmount = (value, currencySymbol = "₹") =>
  `${currencySymbol}${Number(value || 0).toLocaleString("en-IN")}`;

function SplitPaymentProgressCard({
  orderId,
  totalAmount,
  currencySymbol = "",
  payments = [],
  payBeforeText,
  onProcessRemaining,
  onCancelOrder,
  isProcessing = false,
  isCancelling = false,
}) {
  const { t } = useGlobalTranslation("translation");
  const isBusy = isProcessing || isCancelling;

  return (
    <div className={styles.pageWrap}>
      <div className={styles.card}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>
            &#8661; {t("resource.b2b.components.split_payment.total_amount")}
          </span>
          <span className={styles.totalValue}>
            {formatAmount(totalAmount, currencySymbol)}
          </span>
        </div>

        <div className={styles.divider} />
        <SplitPaymentTimeline
          payments={payments}
          currencySymbol={currencySymbol}
        />
        <div className={styles.divider} />

        <div className={styles.orderRow}>
          <span>
            {t("resource.b2b.components.split_payment.order_id")} {orderId}
          </span>
        </div>
      </div>

      <div className={styles.timerRow}>
        <span className={styles.timerIcon}>⏱</span>
        <span>
          {payBeforeText ||
            t("resource.b2b.components.split_payment.pay_before_minutes")}
        </span>
      </div>

      <button
        type="button"
        className={styles.primaryButton}
        disabled={isBusy}
        onClick={onProcessRemaining}
      >
        {isProcessing
          ? t("resource.b2b.components.split_payment.processing")
          : t("resource.b2b.components.split_payment.process_remaining_amount")}
      </button>
      <button
        type="button"
        className={styles.secondaryButton}
        disabled={isBusy}
        onClick={onCancelOrder}
      >
        {isCancelling
          ? t("resource.b2b.components.split_payment.cancelling")
          : t("resource.b2b.components.split_payment.cancel_order")}
      </button>
    </div>
  );
}

export default SplitPaymentProgressCard;
