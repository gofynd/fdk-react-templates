import React from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import CheckoutPaymentContent from "./checkout-payment-content";
import * as styles from "./checkout-payment.less";

function CheckoutPayment({ payment, showPayment }) {
  return (
    <div className={styles.paymentContainer}>
      {showPayment ? (
        <>
          <div className={styles.paymentHeaderSelect}>
            <div className={styles.icon}>
              <SvgWrapper svgSrc={"three-number"}></SvgWrapper>
            </div>
            <div className={styles.contentData}>
              <div className={styles.head}>Payment Method</div>
              <div className={styles.desc}>Select a payment method</div>
            </div>
          </div>
          <CheckoutPaymentContent payment={payment}></CheckoutPaymentContent>
        </>
      ) : (
        <div className={styles.reviewHeaderUnselect}>
          <SvgWrapper svgSrc={"three-number"}></SvgWrapper>
          <div className={styles.heading}>Payment Method</div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPayment;
