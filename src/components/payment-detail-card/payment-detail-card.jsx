/**
 * PaymentDetailCard is a React functional component that displays payment details.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.breakup - An array of objects representing the payment breakup details.
 * @param {Object} props.paymentInfo - An object containing additional payment information.
 *
 * @returns {JSX.Element} A JSX element representing the payment detail card.
 *
 */

import React from "react";
import * as styles from "./payment-detail-card.less";
import { priceFormatCurrencySymbol } from "../../helper/utils";

function PaymentDetailCard({ breakup, paymentDetails }) {
  const totalVal = breakup?.find((item) => item.name === "total") || 0;
  const getPriceFormat = (symbol, price) => {
    return priceFormatCurrencySymbol(symbol, price);
  };
  return (
    <div className={`${styles.paymentMode}`}>
      <div className={`${styles.header} ${styles.boldsm}`}>PAYMENT MODE</div>
      <div className={styles.paymentDetails}>
        {paymentDetails?.map((paymentInfo) => (
          <div key={paymentInfo?.display_name} className={`${styles.info}`}>
            <div className={`${styles.wrapperflex}`}>
              <span className={`${styles.icon}`}>
                <img src={paymentInfo.logo} alt={paymentInfo.display_name} />
              </span>
              <span className={`${styles.desc}`}>
                <span className={`${styles.text} ${styles.regularxs}`}>
                  {paymentInfo.display_name}
                </span>
              </span>
            </div>
            <div className={`${styles.wrapperflex}`}>
              <span className={`${styles.values} ${styles.lightsm}`}>
                {paymentInfo.amount &&
                  getPriceFormat(
                    "₹",
                    Number(paymentInfo.amount.toString().replace(/,/g, ""))
                  )}
                {!paymentInfo.amount &&
                  totalVal &&
                  getPriceFormat(
                    totalVal.currency_symbol,
                    Number(totalVal.value.toString().replace(/,/g, ""))
                  )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentDetailCard;
