import React from 'react';
import * as styles from './SplitPaymentCheckbox.less';

function SplitPaymentCheckbox({ isSelected, onToggle, isLoading, splitsCount }) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isSelected}
          disabled={isLoading}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className={styles.text}>Split Payment</span>
        {isLoading && <span className={styles.spinner} />}
      </label>
    </div>
  );
}

export default SplitPaymentCheckbox;
