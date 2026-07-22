/**
 * MethodSelection — return method (Home Pickup) + order summary,
 * shown after the customer chose items + reasons. Pickup address is the
 * order's delivery address (dynamic per order), not a hardcoded value.
 */
import React, { useState } from "react";
import * as styles from "./method-selection.less";
import ReturnsActionButton from "../shared/returns-action-button/returns-action-button";

const HOME_PICKUP = "home_pickup";

const MethodSelection = ({
  orderData = null,
  onSubmit = () => {},
  isLoading = false,
  returnFee = 0,
  returnFeeCurrencySymbol = "₹",
}) => {
  const [method, setMethod] = useState(HOME_PICKUP);
  const pickupAddress = orderData?.address || "—";
  const feeAmount = Number(returnFee) || 0;
  const feeLabel =
    feeAmount > 0 ? `${returnFeeCurrencySymbol}${feeAmount}` : "FREE";

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
            Our courier will collect your return from the delivery address on
            this order. Confirm to proceed.
          </p>

          <label
            className={`${styles.methodCard} ${
              method === HOME_PICKUP ? styles.selected : ""
            }`}
          >
            <input
              type="radio"
              name="returnMethod"
              value={HOME_PICKUP}
              checked={method === HOME_PICKUP}
              onChange={(e) => setMethod(e.target.value)}
              className={styles.radio}
              disabled={isLoading}
            />
            <span className={styles.methodLabel}>
              <span className={styles.methodName}>Home Pickup</span>
              <span className={styles.methodPickupAddress}>
                {pickupAddress}
              </span>
              <span className={styles.methodCost}>{feeLabel}</span>
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
