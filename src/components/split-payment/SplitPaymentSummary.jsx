import React from "react";
import SplitPaymentTimeline from "./SplitPaymentTimeline";
import * as styles from "./SplitPaymentSummary.less";

const formatAmount = (value, currencySymbol = "₹") =>
  `${currencySymbol}${Number(value || 0).toLocaleString("en-IN")}`;

function SplitPaymentSummary({
  currencySymbol = "",
  itemCount = 0,
  totalMrp = 0,
  discount = 0,
  subtotal = 0,
  paidAmount = 0,
  remainingAmount = 0,
  payments = [],
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.title}>Price Summary ({itemCount} Items)</h3>
        <div className={styles.row}>
          <span>Total MRP</span>
          <strong>{formatAmount(totalMrp, currencySymbol)}</strong>
        </div>
        <div className={styles.row}>
          <span>Discount</span>
          <strong className={styles.success}>
            -{formatAmount(Math.abs(discount), currencySymbol)}
          </strong>
        </div>
        <div className={styles.row}>
          <span>Subtotal</span>
          <strong>{formatAmount(subtotal, currencySymbol)}</strong>
        </div>
        {paidAmount > 0 && (
          <div className={styles.row}>
            <span>Payment 1</span>
            <strong className={styles.success}>
              -{formatAmount(paidAmount, currencySymbol)}
            </strong>
          </div>
        )}
        <div className={styles.divider} />
        <div className={styles.totalRow}>
          <span>Remaining Amount Payable</span>
          <strong>{formatAmount(remainingAmount, currencySymbol)}</strong>
        </div>
      </div>

      <div className={styles.card}>
        <SplitPaymentTimeline payments={payments} />
      </div>
    </div>
  );
}

export default SplitPaymentSummary;
