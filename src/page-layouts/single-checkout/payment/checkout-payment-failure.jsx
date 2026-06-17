import React from "react";
import * as styles from "./checkout-payment-failure.less";
import { useGlobalTranslation } from "fdk-core/utils";
import { translateDynamicLabel } from "../../../helper/utils";

function CheckoutPaymentFailure({ paymentErrHeading, paymentErrMsg }) {
  const { t } = useGlobalTranslation("translation");
  return (
    <div className={styles.paymentFailedContainer}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.paymentErrHeading}>
            {paymentErrHeading || t("resource.checkout.payment_failed")}
          </div>
          <div className={styles.paymentErrMsg}>
            {translateDynamicLabel(paymentErrMsg, t) ||
              t("resource.checkout.payment_retry_message")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPaymentFailure;
