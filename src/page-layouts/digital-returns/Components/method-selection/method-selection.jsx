/**
 * MethodSelection — return method (e.g. Evri Drop Off) + order summary,
 * shown after the customer chose items + reasons.
 */
import React, { useState } from "react";
import * as styles from "./method-selection.less";
import ReturnsActionButton from "../shared/returns-action-button/returns-action-button";

const MethodSelection = ({
  orderData = null,
  onSubmit = () => {},
  isLoading = false,
}) => {
  const [method, setMethod] = useState("evri");

  const handleConfirm = () => {
    if (!method) return;
    onSubmit({ method, orderData });
  };

  return (
    <div className={styles.methodSelection}>
      <div className={styles.grid}>
        <section className={styles.left} aria-labelledby="method-heading">
          <h2 id="method-heading" className={styles.colHeading}>
            RETURN METHOD
          </h2>
          <p className={styles.colSubheading}>
            For online returns by post, choose Evri Drop Off point and select
            confirm to proceed.
          </p>

          <label
            className={`${styles.methodCard} ${
              method === "evri" ? styles.selected : ""
            }`}
          >
            <input
              type="radio"
              name="returnMethod"
              value="evri"
              checked={method === "evri"}
              onChange={(e) => setMethod(e.target.value)}
              className={styles.radio}
              disabled={isLoading}
            />
            <span className={styles.methodLabel}>
              <span className={styles.methodName}>Evri Drop off point</span>
              <span className={styles.methodCost}>FREE</span>
            </span>
          </label>
        </section>

        <aside className={styles.right} aria-labelledby="order-heading">
          <h2 id="order-heading" className={styles.colHeading}>
            ORDER DETAILS
          </h2>

          <dl className={styles.orderDetails}>
            <div className={styles.orderRow}>
              <dt>Order ID</dt>
              <dd>{orderData?.orderId || "—"}</dd>
            </div>
            <div className={styles.orderRow}>
              <dt>Order date</dt>
              <dd>{orderData?.orderDate || "—"}</dd>
            </div>
            <div className={styles.orderRow}>
              <dt>Delivery address</dt>
              <dd className={styles.preLine}>
                {orderData?.address || "—"}
              </dd>
            </div>
            <div className={styles.orderRow}>
              <dt>Email</dt>
              <dd>{orderData?.email || "—"}</dd>
            </div>
          </dl>

          <ReturnsActionButton
            type="button"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading || !method}
            className={styles.confirmAction}
          >
            CONFIRM
          </ReturnsActionButton>
        </aside>
      </div>
    </div>
  );
};

export default MethodSelection;
