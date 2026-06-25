import React from "react";
import * as styles from "./SplitPaymentSelector.less";

function SplitPaymentSelector({
  isSelected,
  onToggle,
  isLoading,
  splitsCount,
  amount,
  onAmountChange,
  maxAmount,
  minAmount,
  disabled = false,
  showAmount = false,
  paymentIndex = 1,
  helperText,
  currencySymbol = "",
}) {
  const ordinalMap = ["first", "second", "third", "fourth", "fifth"];
  const ordinal = ordinalMap[paymentIndex - 1] || `${paymentIndex}th`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <label className={styles.label}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isSelected}
            disabled={disabled || isLoading}
            onChange={(event) => onToggle?.(event.target.checked)}
          />
          <span className={styles.text}>Split Payment</span>
          {isLoading && <span className={styles.spinner} />}
        </label>
        {splitsCount > 0 && (
          <span className={styles.badge}>
            &#8661; {splitsCount} splits available
          </span>
        )}
      </div>

      {showAmount && isSelected && (
        <div className={styles.amountBlock}>
          <span className={styles.amountLabel}>Enter Amount</span>
          <div className={styles.amountInputRow}>
            <span className={styles.currency}>{currencySymbol}</span>
            <input
              type="number"
              className={styles.amountInput}
              value={amount || ""}
              min={minAmount || 1}
              max={maxAmount || undefined}
              disabled={disabled && !onAmountChange}
              onChange={(event) => onAmountChange?.(Number(event.target.value))}
            />
          </div>
          <span className={styles.helper}>
            {helperText ||
              `Specify amount that you want to process for the ${ordinal} payment`}
          </span>
        </div>
      )}
    </div>
  );
}

export default SplitPaymentSelector;
