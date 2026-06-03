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
import { priceFormatCurrencySymbol, translateDynamicLabel } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function PaymentDetailCard({ breakup, paymentDetails }) {
  const { t } = useGlobalTranslation("translation");
  const totalVal = breakup?.find((item) => item.name === "total") || 0;

  return (
    <div className={`${styles.paymentMode}`}>
      <div className={`${styles.header} ${styles.boldsm}`}>{t("resource.common.payment_mode")}</div>
      <div className={styles.paymentDetails}>
        {paymentDetails?.map((paymentInfo) => (
          <div key={paymentInfo?.display_name} className={`${styles.info}`}>
            <div className={`${styles.wrapperflex}`}>
              <span className={`${styles.icon}`}>
                <img src={paymentInfo?.logo} alt={paymentInfo?.display_name} />
              </span>
              <span className={`${styles.desc}`}>
                <span className={`${styles.text} ${styles.regularxs}`}>
                  {translateDynamicLabel(paymentInfo?.display_name, t)}
                </span>
              </span>
            </div>
            <div className={`${styles.wrapperflex}`}>
              <span className={`${styles.values} ${styles.lightsm}`}>
                {!!paymentInfo?.amount &&
                  priceFormatCurrencySymbol(totalVal?.currency_symbol, paymentInfo?.amount)}
                {!paymentInfo?.amount &&
                  totalVal &&
                  priceFormatCurrencySymbol(
                    totalVal?.currency_symbol,
                    totalVal?.value
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
