import React from "react";
import * as styles from "./checkout-payment-failure.less";

function CheckoutPaymentFailure({ paymentErrHeading, paymentErrMsg }) {
  return (
    <div className={styles.paymentFailedContainer}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.paymentErrHeading}>
            {paymentErrHeading || "Payment Failed"}
          </div>
          <div className={styles.paymentErrMsg}>
            {paymentErrMsg ||
              "Please try again or use a different payment method to complete payment."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPaymentFailure;
