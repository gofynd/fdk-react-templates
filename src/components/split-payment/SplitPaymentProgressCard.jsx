import React from "react";
import SplitPaymentTimeline from "./SplitPaymentTimeline";
import * as styles from "./SplitPaymentProgressCard.less";

const formatAmount = (value, currencySymbol = "₹") =>
  `${currencySymbol}${Number(value || 0).toLocaleString("en-IN")}`;

function SplitPaymentProgressCard({
  orderId,
  totalAmount,
  currencySymbol = "",
  payments = [],
  payBeforeText = "Pay Before: {X} Minutes",
  onProcessRemaining,
  onCancelOrder,
  isProcessing = false,
  isCancelling = false,
}) {
  const isBusy = isProcessing || isCancelling;

  return (
    <div className={styles.pageWrap}>
      <div className={styles.card}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>&#8661; Total Amount</span>
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
          <span>Order ID : {orderId}</span>
          <button type="button" className={styles.viewDetailsButton}>
            VIEW DETAILS
          </button>
        </div>
      </div>

      <div className={styles.timerRow}>
        <span className={styles.timerIcon}>⏱</span>
        <span>{payBeforeText}</span>
      </div>

      <button
        type="button"
        className={styles.primaryButton}
        disabled={isBusy}
        onClick={onProcessRemaining}
      >
        {isProcessing ? "PROCESSING..." : "PROCESS REMAINING AMOUNT"}
      </button>
      <button
        type="button"
        className={styles.secondaryButton}
        disabled={isBusy}
        onClick={onCancelOrder}
      >
        {isCancelling ? "CANCELLING..." : "CANCEL ORDER"}
      </button>
    </div>
  );
}

export default SplitPaymentProgressCard;
