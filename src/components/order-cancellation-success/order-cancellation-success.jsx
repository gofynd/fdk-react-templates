import React from "react";
import FyButton from "../core/fy-button/fy-button";
import * as styles from "./order-cancellation-success.less";

function CancelIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59Z"
        fill="var(--errorText)"
      />
    </svg>
  );
}

function defaultContinueShopping() {
  if (typeof window !== "undefined") {
    window.location.assign("/");
  }
}

function OrderCancellationSuccess({
  onContinueShopping = defaultContinueShopping,
  title = "Cancelled By Customer",
  message = "Your order has been successfully cancelled. Any deducted amount will be refunded automatically within 5-7 business days.",
  continueShoppingLabel = "Continue shopping",
}) {
  return (
    <section
      className={styles.cancellationSuccess}
      aria-labelledby="order-cancellation-success-title"
      aria-describedby="order-cancellation-success-message"
    >
      <div className={styles.iconWrapper}>
        <CancelIcon />
      </div>
      <div className={styles.textBlock}>
        <h2 className={styles.title} id="order-cancellation-success-title">
          {title}
        </h2>
        <p className={styles.message} id="order-cancellation-success-message">
          {message}
        </p>
      </div>
      <FyButton
        type="button"
        variant="contained"
        color="primary"
        size="medium"
        className={styles.continueButton}
        onClick={onContinueShopping}
      >
        {continueShoppingLabel}
      </FyButton>
    </section>
  );
}

export default OrderCancellationSuccess;
