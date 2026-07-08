import React from 'react';
import * as styles from './SplitPaymentOptions.less';
import SvgWrapper from '../core/svgWrapper/SvgWrapper';

const PAYMENT_SVG = {
  CARD: 'card-payment',
  WL: 'wallet',
  UPI: 'upi',
  NB: 'nb',
  CARDLESS_EMI: 'emi',
  PL: 'pay-later',
  COD: 'cod',
  NEFT: 'neft',
  RTGS: 'rtgs',
};

function SplitPaymentOptions({
  options,
  selectedOption,
  onSelect,
  onPay,
  isLoading,
  amount,
}) {
  const formatAmount = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className={styles.container}>
      <div className={styles.tabList}>
        {(options ?? []).map((opt) => {
          const isSelected = selectedOption?.name === opt.name;
          return (
            <div
              key={opt.name}
              className={`${styles.tab} ${isSelected ? styles.selectedTab : ''}`}
              onClick={() => !isLoading && onSelect(opt)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && !isLoading && onSelect(opt)
              }
            >
              <div className={styles.selectedIndicator} />
              <div className={styles.tabMain}>
                <span className={styles.tabIcon}>
                  <SvgWrapper
                    svgSrc={PAYMENT_SVG[opt.name] ?? 'payment-other'}
                  />
                </span>
                <span
                  className={`${styles.tabName} ${isSelected ? styles.selectedTabName : ''}`}
                >
                  {opt.display_name ?? opt.name}
                </span>
              </div>
              <div className={styles.subIcons}>
                {opt.name === 'UPI' ? (
                  <>
                    <span className={styles.subIcon}>
                      <SvgWrapper svgSrc="gpay" />
                    </span>
                    <span className={styles.subIcon}>
                      <SvgWrapper svgSrc="phonepe" />
                    </span>
                    <span className={styles.subIcon}>
                      <SvgWrapper svgSrc="bhim" />
                    </span>
                  </>
                ) : (
                  opt.list?.slice(0, 3).map((item, i) =>
                    item.logo_url?.small ? (
                      <img
                        key={i}
                        className={styles.subIconImg}
                        src={item.logo_url.small}
                        alt={item.display_name ?? item.name}
                      />
                    ) : null
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.content}>
        {selectedOption ? (
          <div className={styles.payArea}>
            <p className={styles.methodName}>
              {selectedOption.display_name ?? selectedOption.name}
            </p>
            <p className={styles.methodHint}>
              You will be redirected to complete the payment
            </p>
            <button
              className={styles.payBtn}
              onClick={onPay}
              disabled={isLoading || !amount}
            >
              {isLoading ? 'Processing…' : `PAY ${formatAmount(amount)}`}
            </button>
          </div>
        ) : (
          <p className={styles.placeholder}>
            Select a payment method to continue
          </p>
        )}
      </div>
    </div>
  );
}

export default SplitPaymentOptions;
