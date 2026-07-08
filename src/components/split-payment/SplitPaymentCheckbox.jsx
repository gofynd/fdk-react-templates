import React from 'react';
import { useGlobalTranslation } from 'fdk-core/utils';
import * as styles from './SplitPaymentCheckbox.less';

function SplitPaymentCheckbox({ isSelected, onToggle, isLoading, splitsCount }) {
  const { t } = useGlobalTranslation('translation');
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
        <span className={styles.text}>
          {t('resource.b2b.components.split_payment.split_payment')}
        </span>
        {isLoading && <span className={styles.spinner} />}
      </label>
    </div>
  );
}

export default SplitPaymentCheckbox;
