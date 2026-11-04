import React, { useState } from "react";

import CancelOrderModal from "../cancel-order-modal/cancel-order-modal";
import OrderCancellationSuccess from "../order-cancellation-success/order-cancellation-success";
import * as styles from "./split-payment-order-card.less";

const defaultPayments = [
  {
    amount: "₹1,500.00",
    method: "via UPI",
    status: "complete",
    title: "Payment 1",
  },
  {
    amount: "₹1,500.00",
    method: "via Credit / Debit card",
    status: "complete",
    title: "Payment 2",
  },
  {
    amount: "₹1,500.00",
    status: "pending",
    title: "Payment 3",
  },
];

function RouteIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path
        d="M9.78 11.16 8.36 12.58 5.79 10l2.57-2.58 1.42 1.42L9.62 9H10c1.1 0 2-.9 2-2V4.41l-1.79 1.8L8.8 4.8 13 .59l4.2 4.2-1.41 1.41L14 4.41V7c0 2.21-1.79 4-4 4h-.38l.16.16Zm4.44 1.68 1.42-1.42L18.21 14l-2.57 2.58-1.42-1.42.16-.16H14c-1.1 0-2 .9-2 2v2.59l1.79-1.8 1.41 1.41-4.2 4.21-4.2-4.2 1.41-1.41L10 19.59V17c0-2.21 1.79-4 4-4h.38l-.16-.16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path
        d="m9.55 17.3-5.1-5.1 1.4-1.4 3.7 3.7 8.6-8.6 1.4 1.4-10 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path
        d="M11 6h2v7h-2V6Zm1 14a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0 2C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path
        d="M9 1h6v2H9V1Zm2 11.82V6h2v7.65l4.08 2.42-1.02 1.72L11 14.82v-2ZM12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-2a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SplitPaymentOrderCard({
  onCancelOrder,
  onContinueShopping,
  onProcessRemainingAmount,
  orderId = "",
  payments = defaultPayments,
  payBefore = "",
  totalAmount = "",
}) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancellationSuccessVisible, setIsCancellationSuccessVisible] =
    useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  const openCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleCancelConfirm = async () => {
    if (isCancellingOrder) {
      return;
    }

    setIsCancellingOrder(true);

    try {
      if (onCancelOrder) {
        await onCancelOrder();
      }
      closeCancelModal();
      setIsCancellationSuccessVisible(true);
    } catch (error) {
      // The caller owns the user-facing error state.
    } finally {
      setIsCancellingOrder(false);
    }
  };

  if (isCancellationSuccessVisible) {
    return <OrderCancellationSuccess onContinueShopping={onContinueShopping} />;
  }

  const getPaymentAmount = (amount) => {
    const displayAmount = String(amount || "").trim();

    return displayAmount === "..." ? "" : displayAmount;
  };

  return (
    <>
      <section className={styles.card} aria-label="Split payment order status">
        <div className={styles.summary}>
          <div className={styles.totalRow}>
            <span className={styles.totalIcon}>
              <RouteIcon />
            </span>
            <span className={styles.totalLabel}>Total Amount</span>
            <span className={styles.totalAmount}>{totalAmount}</span>
          </div>

          <div className={styles.details}>
            <div className={styles.paymentsList}>
              {payments.map((payment) => {
                const isComplete = payment.status === "complete";
                const paymentAmount = getPaymentAmount(payment.amount);

                return (
                  <div className={styles.paymentItem} key={payment.title}>
                    <span
                      className={`${styles.statusIcon} ${
                        isComplete ? styles.completeIcon : styles.pendingIcon
                      }`}
                    >
                      {isComplete ? <CheckIcon /> : <PendingIcon />}
                    </span>
                    <span className={styles.paymentContent}>
                      <span className={styles.paymentTitle}>
                        {payment.title}
                      </span>
                      {payment.method && (
                        <span className={styles.paymentMethod}>
                          {payment.method}
                        </span>
                      )}
                    </span>
                    <span className={styles.paymentAmount}>
                      {paymentAmount}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className={styles.orderRow}>
              <span className={styles.orderIdLabel}>Order ID :</span>
              <span className={styles.orderIdValue}>{orderId}</span>
            </div>
          </div>
        </div>

        {payBefore && (
          <div className={styles.timerRow}>
            <span className={styles.timerIcon}>
              <TimerIcon />
            </span>
            <span>Pay Before: {payBefore}</span>
          </div>
        )}

        <button
          className={styles.primaryButton}
          type="button"
          onClick={onProcessRemainingAmount}
        >
          Process remaining amount
        </button>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={openCancelModal}
        >
          Cancel order
        </button>
      </section>

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleCancelConfirm}
        confirmLabel={isCancellingOrder ? "Cancelling..." : "yes"}
      />
    </>
  );
}

export default SplitPaymentOrderCard;
