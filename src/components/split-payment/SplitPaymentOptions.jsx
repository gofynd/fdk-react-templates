import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import CheckoutPaymentContent from '../../page-layouts/single-checkout/payment/checkout-payment-content';
import CheckoutPaymentFailure from '../../page-layouts/single-checkout/payment/checkout-payment-failure';
import CheckoutPaymentSkeleton from '../../page-layouts/single-checkout/payment/checkout-payment-skeleton';
import * as styles from './SplitPaymentOptions.less';

// ─── Stable no-op references so useCheckoutPayment effects don't re-fire ──────
const STABLE_NOOP = () => {};
const STABLE_ASYNC_NOOP = async () => ({});
const STABLE_CARD_DETAILS_NOOP = async () => ({
  data: { payment: { card_details: { data: {} } } },
});
const STABLE_CHECK_STATUS_NOOP = async () => ({
  data: { checkAndUpdatePaymentStatus: { status: 'pending' } },
});
const STABLE_EMPTY_LIST = () => [];
// status=INACTIVE hides the CreditNote block inside CheckoutPaymentContent.
const STABLE_PARTIAL_PAYMENT_OPTION = {
  list: [{ balance: { account: { status: 'INACTIVE' } } }],
};
// Return shape UPI/QR polling code reads via res?.payload?.data?.checkoutCart
const STABLE_CHECKOUT_RESULT = {
  payload: { data: { checkoutCart: { success: false, data: {} } } },
};

const ERROR_DISMISS_MS = 30000;

// Maps MOP name → SVG icon name used in Firestone's SvgWrapper.
// Matches the PAYMENT_OPTIONS_SVG map in react-starter/usePayment.jsx.
const PAYMENT_SVG_MAP = {
  CARD: 'card-payment',
  WL: 'wallet',
  UPI: 'upi',
  NB: 'nb',
  CARDLESS_EMI: 'emi',
  PL: 'pay-later',
  COD: 'cod',
  QR: 'upi',
  NEFT: 'neft',
  RTGS: 'rtgs',
};

/**
 * Transforms raw payment_option entries from PAYMENT_MODE_ROUTES into the
 * shape CheckoutPaymentContent (via useCheckoutPayment) expects for the
 * navigation tab list:  { name, display_name, svg, subMopIcons, image_src }
 *
 * Mirrors the PaymentOptionsList logic in react-starter/usePayment.jsx.
 */
function toNavOption(opt) {
  const subMopIcons = [];

  if (opt.name === 'CARD') {
    // Card network logos come from supported_methods[].logo
    opt.supported_methods?.slice(0, 3).forEach((m) => {
      if (m.logo) subMopIcons.push(m.logo);
    });
  } else if (opt.name !== 'UPI') {
    // UPI shows hard-coded app icons in the nav — no subMopIcons needed.
    // All other methods use their list[].logo_url.small as sub-icons.
    opt.list?.slice(0, 3).forEach((item) => {
      if (item.logo_url?.small) subMopIcons.push(item.logo_url.small);
    });
  }

  return {
    ...opt,
    svg: PAYMENT_SVG_MAP[opt.name] ?? 'payment-other',
    subMopIcons,
    image_src: null,
  };
}

function SplitPaymentOptions({
  options,
  onPay,
  isLoading,
  currencySymbol,
  amount,
}) {
  const [selectedTab, setSelectedTab] = useState('');
  const [showUpiRedirectionModal, setShowUpiRedirectionModal] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Error banner — same pattern as checkout-payment.jsx
  const [showFailedMessage, setShowFailedMessage] = useState(false);
  const [paymentErrHeading, setPaymentErrHeading] = useState('');
  const [paymentErrMsg, setPaymentErrMsg] = useState('');
  const timerRef = useRef(null);

  // Ref so proceedToPay always reads the latest tab without going stale.
  const selectedTabRef = useRef('');
  useEffect(() => { selectedTabRef.current = selectedTab; }, [selectedTab]);

  // Auto-select first option when options load.
  useEffect(() => {
    if (!selectedTab && options?.length > 0) {
      setSelectedTab(options[0].name);
    }
  }, [options, selectedTab]);

  useEffect(
    () => () => { if (timerRef.current) clearTimeout(timerRef.current); },
    []
  );

  const handleShowFailedMessage = useCallback((errObj) => {
    if (!errObj?.failed) return;
    setShowFailedMessage(true);
    setPaymentErrHeading(errObj?.paymentErrHeading || '');
    setPaymentErrMsg(errObj?.paymentErrMsg || '');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowFailedMessage(false);
      setPaymentErrHeading('');
      setPaymentErrMsg('');
    }, ERROR_DISMISS_MS);
  }, []);

  const removeDialogueError = useCallback(() => {
    setShowFailedMessage(false);
    setPaymentErrHeading('');
    setPaymentErrMsg('');
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  // ─── payment object fields ────────────────────────────────────────────────

  // Raw options kept intact so useCheckoutPayment can do MOP/sub-MOP lookups.
  const paymentOption = useMemo(
    () => ({ payment_option: options ?? [] }),
    [options]
  );

  // Transformed nav items: add svg / subMopIcons so tab icons render correctly.
  // Only 'custom' flow options belong in the main nav (same filter as usePayment.jsx).
  const PaymentOptionsList = useCallback(
    () =>
      (options ?? [])
        .filter((o) => !o.flow || o.flow === 'custom')
        .map(toNavOption),
    [options]
  );

  // selectedTabData must come from raw options so sub-components get list[]/
  // stored_payment_details for card/wallet/NB selection.
  const selectedTabData = useMemo(
    () => (options ?? []).find((o) => o.name === selectedTab) ?? null,
    [options, selectedTab]
  );

  // getCurrencySymbol must be a plain string — priceFormatCurrencySymbol
  // concatenates it directly with the formatted amount.
  const getCurrencySymbol = currencySymbol || '₹';

  const getTotalValue = useCallback(() => amount ?? 0, [amount]);

  // ─── The single override: intercept every Pay click ───────────────────────
  const proceedToPay = useCallback(
    async (mop) => {
      const tab = selectedTabRef.current;
      const effectiveMop = mop === 'newCARD' ? 'CARD' : (mop ?? tab);
      const opt =
        (options ?? []).find((o) => o.name === effectiveMop) ??
        (options ?? []).find((o) => o.name === tab) ??
        null;

      setIsPaymentLoading(true);
      try {
        await onPay(opt);
      } finally {
        setIsPaymentLoading(false);
      }
      return STABLE_CHECKOUT_RESULT;
    },
    [options, onPay]
  );

  const payment = useMemo(
    () => ({
      selectedTab,
      setSelectedTab,
      selectedTabData,
      proceedToPay,
      getTotalValue,
      getCurrencySymbol,
      PaymentOptionsList,
      paymentOption,
      // Cart-side stubs — not needed in split flow.
      handleIsQrCodeLoading: STABLE_NOOP,
      getUPIIntentApps: STABLE_ASYNC_NOOP,
      cardDetails: STABLE_CARD_DETAILS_NOOP,
      checkAndUpdatePaymentStatus: STABLE_CHECK_STATUS_NOOP,
      cancelPayment: STABLE_ASYNC_NOOP,
      // otherOptions must be empty — returning options here would show
      // every method in both the nav AND the "More Payment Options" panel.
      otherOptions: STABLE_EMPTY_LIST,
      setUPIError: STABLE_NOOP,
      validateCoupon: STABLE_ASYNC_NOOP,
      selectPaymentMode: STABLE_ASYNC_NOOP,
      enableLinkPaymentOption: false,
      setIsPaymentLoading,
      setShowUpiRedirectionModal,
      loggedIn: true,
      isLoading: false,
      isQrCodeLoading: false,
      validateCardDetails: STABLE_NOOP,
      showUpiRedirectionModal,
      partialPaymentOption: STABLE_PARTIAL_PAYMENT_OPTION,
      updateStoreCredits: STABLE_NOOP,
      creditUpdating: false,
      isPaymentLoading: isPaymentLoading || isLoading,
      isUPIError: false,
      mopSelectionLoading: false,
      creditPaymentData: null,
    }),
    [
      selectedTab,
      selectedTabData,
      proceedToPay,
      getTotalValue,
      PaymentOptionsList,
      paymentOption,
      showUpiRedirectionModal,
      isPaymentLoading,
      isLoading,
    ]
  );

  // Don't mount CheckoutPaymentContent until we have real options and a
  // non-zero amount. Mounting with empty options causes useCheckoutPayment's
  // init effect to see getTotalValue()===0 → setSelectedTab("COD") → blank UI.
  const isReady = (options?.length ?? 0) > 0 && (amount ?? 0) > 0;

  return (
    <div className={styles.splitPaymentOptionsWrapper}>
      {showFailedMessage && (
        <div className={styles.paymentFailedHeader}>
          <div className={styles.redSplit} />
          <CheckoutPaymentFailure
            paymentErrHeading={paymentErrHeading}
            paymentErrMsg={paymentErrMsg}
          />
        </div>
      )}

      {isReady ? (
        <CheckoutPaymentContent
          payment={payment}
          loader={<CheckoutPaymentSkeleton />}
          handleShowFailedMessage={handleShowFailedMessage}
          onPriceDetailsClick={STABLE_NOOP}
          breakUpValues={[]}
          removeDialogueError={removeDialogueError}
          setCancelQrPayment={STABLE_NOOP}
          isCouponApplied={false}
          juspayErrorMessage={null}
          isCouponValid={true}
          inValidCouponData={null}
        />
      ) : (
        <div className={styles.skeletonWrapper}>
          <CheckoutPaymentSkeleton />
        </div>
      )}
    </div>
  );
}

export default SplitPaymentOptions;
