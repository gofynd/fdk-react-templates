import React from "react";
import { useGlobalTranslation } from "fdk-core/utils";
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
  splitPaymentLabel,
  amountEditable = true,
  isSplitDisabled = false,
  codCharges = 0,
  remainingAmount = 0,
}) {
  const { t } = useGlobalTranslation("translation");
  const formatAmount = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? Math.round(num * 100) / 100 : value;
  };

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
          <span className={styles.text}>
            {splitPaymentLabel ||
              t("resource.b2b.components.split_payment.advance_payment")}
          </span>
          {isLoading && <span className={styles.spinner} />}
        </label>
      </div>

      {showAmount && isSelected && amountEditable && (
        <>
          <div className={styles.amountBlock}>
            <span className={styles.amountLabel}>
              {t("resource.b2b.components.split_payment.advance_amount")}
            </span>
            <div className={styles.amountInputRow}>
              <span className={styles.currency}>{currencySymbol}</span>
              <input
                type="number"
                className={styles.amountInput}
                value={amount || ""}
                min={minAmount || 1}
                max={maxAmount || undefined}
                disabled={disabled && !onAmountChange}
                onChange={(event) =>
                  onAmountChange?.(Number(event.target.value))
                }
              />
            </div>
          </div>
          {amount > 0 && (
            <div className={styles.amountDisplay}>
              <span className={styles.amountDisplayValue}>
                {t("resource.b2b.components.split_payment.pay")}{" "}
                <strong className={styles.amountDisplayStrong}>
                  {currencySymbol}
                  {formatAmount(amount)}
                </strong>{" "}
                {t("resource.b2b.components.split_payment.now_to_confirm_order")}
              </span>
              {remainingAmount > 0 && (
                <span className={styles.amountDisplayLabel}>
                  {t("resource.b2b.components.split_payment.remaining")}{" "}
                  <strong>
                    {currencySymbol}
                    {formatAmount(remainingAmount)}
                  </strong>{" "}
                  {t(
                    "resource.b2b.components.split_payment.will_be_collected_as_cod"
                  )}
                </span>
              )}
            </div>
          )}
        </>
      )}
      {showAmount &&
        isSelected &&
        !amountEditable &&
        !isLoading &&
        amount > 0 && (
          <div className={styles.amountDisplay}>
            <span className={styles.amountDisplayValue}>
              {t("resource.b2b.components.split_payment.pay")}{" "}
              <strong className={styles.amountDisplayStrong}>
                {currencySymbol}
                {formatAmount(amount)}
              </strong>{" "}
              {t("resource.b2b.components.split_payment.now_to_confirm_order")}
            </span>
            {remainingAmount > 0 && (
              <span className={styles.amountDisplayLabel}>
                {t("resource.b2b.components.split_payment.remaining")}{" "}
                <strong>
                  {currencySymbol}
                  {formatAmount(remainingAmount)}
                </strong>{" "}
                {t(
                  "resource.b2b.components.split_payment.will_be_collected_at_delivery"
                )}
              </span>
            )}
          </div>
        )}
      {codCharges > 0 && (
        <div className={styles.codInfo}>
          <span className={styles.codInfoIcon}>
            <SvgWrapper svgSrc="infoIcon" />
          </span>
          <span className={styles.codInfoText}>
            <strong>
              +{currencySymbol}
              {formatAmount(codCharges)}{" "}
            </strong>
            {t("resource.b2b.components.split_payment.cod_extra_charge")}
          </span>
        </div>
      )}
    </div>
  );
}

export default SplitPaymentSelector;
