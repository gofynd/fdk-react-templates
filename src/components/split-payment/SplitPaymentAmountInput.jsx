import React from 'react';
import * as styles from './SplitPaymentAmountInput.less';

const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'];

function SplitPaymentAmountInput({ value, onChange, paymentIndex, maxAmount }) {
  const ordinal = ORDINALS[(paymentIndex ?? 1) - 1] ?? `${paymentIndex}th`;

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Enter Amount</span>
      <div className={styles.inputRow}>
        <span className={styles.currency}>&#8377;</span>
        <input
          type="number"
          className={styles.input}
          value={value || ''}
          min={1}
          max={maxAmount || undefined}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      <span className={styles.helper}>
        Specify amount that you want to process for the {ordinal} payment
      </span>
    </div>
  );
}

export default SplitPaymentAmountInput;
