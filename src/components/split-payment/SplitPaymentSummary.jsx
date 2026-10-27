import React from "react";
import { useGlobalTranslation } from "fdk-core/utils";
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
  const { t } = useGlobalTranslation("translation");
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.title}>
          {t("resource.b2b.components.split_payment.price_summary_items", {
            count: itemCount,
          })}
        </h3>
        <div className={styles.row}>
          <span>{t("resource.b2b.components.split_payment.total_mrp")}</span>
          <strong>{formatAmount(totalMrp, currencySymbol)}</strong>
        </div>
        <div className={styles.row}>
          <span>{t("resource.b2b.components.split_payment.discount")}</span>
          <strong className={styles.success}>
            -{formatAmount(Math.abs(discount), currencySymbol)}
          </strong>
        </div>
        <div className={styles.row}>
          <span>{t("resource.b2b.components.split_payment.subtotal")}</span>
          <strong>{formatAmount(subtotal, currencySymbol)}</strong>
        </div>
        {paidAmount > 0 && (
          <div className={styles.row}>
            <span>
              {t("resource.b2b.components.split_payment.payment_number", {
                number: 1,
              })}
            </span>
            <strong className={styles.success}>
              -{formatAmount(paidAmount, currencySymbol)}
            </strong>
          </div>
        )}
        <div className={styles.divider} />
        <div className={styles.totalRow}>
          <span>
            {t("resource.b2b.components.split_payment.remaining_amount_payable")}
          </span>
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
