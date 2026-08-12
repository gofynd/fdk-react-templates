import React from "react";
import { useGlobalTranslation } from "fdk-core/utils";
import * as styles from "./SplitPaymentTimeline.less";

const STATUS_ICON = {
  completed: "✓",
  ongoing: "◎",
  pending: "●",
};

const formatMethod = (method) => {
  if (!method) return "";
  if (typeof method === "string") return method;
  return method.display_name || method.name || method.mode || method.mop || "";
};

function SplitPaymentTimeline({ payments, currencySymbol = "" }) {
  const { t } = useGlobalTranslation("translation");
  if (!payments?.length) return null;

  return (
    <div className={styles.timeline}>
      {payments.map((payment, index) => (
        <div
          key={index}
          className={`${styles.row} ${styles[payment.status] || ""}`}
        >
          <span className={styles.icon}>
            {STATUS_ICON[payment.status] ?? "●"}
          </span>
          <div className={styles.info}>
            <span className={styles.paymentLabel}>{payment.label}</span>
            {formatMethod(payment.method) && (
              <span className={styles.method}>
                {t("resource.b2b.components.split_payment.via", {
                  method: formatMethod(payment.method),
                })}
              </span>
            )}
            {payment.status === "ongoing" && (
              <span className={styles.statusBadge}>
                {t("resource.b2b.components.split_payment.current")}
              </span>
            )}
          </div>
          {payment.amount > 0 && (
            <span className={styles.amount}>
              {currencySymbol}
              {Number(payment.amount).toLocaleString("en-IN")}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default SplitPaymentTimeline;
