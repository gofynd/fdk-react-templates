import React from 'react';
import * as styles from './SplitPaymentTimeline.less';

const STATUS_ICON = {
  completed: '✓',
  ongoing: '◎',
  pending: '●',
};

function SplitPaymentTimeline({ payments }) {
  if (!payments?.length) return null;

  return (
    <div className={styles.timeline}>
      {payments.map((payment, index) => (
        <div
          key={index}
          className={`${styles.row} ${styles[payment.status] || ''}`}
        >
          <span className={styles.icon}>
            {STATUS_ICON[payment.status] ?? '●'}
          </span>
          <div className={styles.info}>
            <span className={styles.paymentLabel}>{payment.label}</span>
            {payment.method && (
              <span className={styles.method}>via {payment.method}</span>
            )}
            {payment.status === 'ongoing' && (
              <span className={styles.statusBadge}>Ongoing</span>
            )}
          </div>
          {payment.amount > 0 && (
            <span className={styles.amount}>
              &#8377;{Number(payment.amount).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default SplitPaymentTimeline;
