import React, { useMemo } from "react";
import * as styles from "./credit-note.less";
import { priceFormatCurrencySymbol } from "../../../../helper/utils";

const CreditNote = ({ data = {}, updateStoreCredits = () => {} }) => {
  const show = useMemo(
    () => data && data?.list?.some((option) => option.partial_payment_allowed),
    [data]
  );

  const handleChange = (option) => {
    updateStoreCredits(!option?.balance?.is_applied);
  };

  return (
    <>
      {show && (
        <div className={styles.container}>
          {data?.list?.map((option) => (
            <>
              {option?.partial_payment_allowed && (
                <div
                  className={`${styles.option} ${!option?.balance?.is_eligible ? styles.disable : ""}`}
                  key={option?.aggregator_name}
                >
                  <label className={styles.actionContainer}>
                    <input
                      className={styles.checbox}
                      checked={option?.balance?.is_applied}
                      type="checkbox"
                      onChange={() => handleChange(option)}
                    />
                    <div className={styles.label}>
                      <div className={`${styles.title} ${styles.bold}`}>
                        {option?.display_name}
                      </div>
                      <div className={styles.description}>
                        Use your{" "}
                        <span className={styles.bold}>
                          {priceFormatCurrencySymbol(
                            option?.balance?.account?.redeemable_balance
                              ?.currency,
                            option?.balance?.account?.redeemable_balance?.amount
                          )}
                        </span>{" "}
                        {option?.display_name}
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default CreditNote;
