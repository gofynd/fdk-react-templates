import React from "react";
import * as styles from "./SplitPaymentSelector.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

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
  splitPaymentLabel = "Advance Payment",
  amountEditable = true,
  isSplitDisabled = false,
  codCharges = 0,
}) {

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <label className={styles.label}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isSelected}
            disabled={isSplitDisabled || disabled || isLoading}
            onChange={(event) => onToggle?.(event.target.checked)}
          />
          <span className={styles.text}>{splitPaymentLabel}</span>
          {isLoading && <span className={styles.spinner} />}
        </label>
      </div>

      {showAmount && isSelected && amountEditable && (
        <div className={styles.amountBlock}>
          <span className={styles.amountLabel}>Advance Amount</span>
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
        </div>
      )}
      {showAmount &&
        isSelected &&
        !amountEditable &&
        !isLoading &&
        amount > 0 && (
          <div className={styles.amountDisplay}>
            <span className={styles.amountDisplayValue}>
              Advance payable amount{" "}
              <strong className={styles.amountDisplayStrong}>
                {currencySymbol}
                {amount}{" "}
              </strong>
            </span>
          </div>
        )}
      {codCharges > 0 && (
        <div className={styles.codInfo}>
          <span className={styles.codInfoIcon}>
            <SvgWrapper svgSrc="infoIcon" />
          </span>
          <span className={styles.codInfoText}>
            <strong>
              +{currencySymbol}{codCharges}{" "}
            </strong>
            will be charged extra for{" "}
            <strong>Cash on Delivery </strong>option.
          </span>
        </div>
      )}
    </div>
  );
}

export default SplitPaymentSelector;
