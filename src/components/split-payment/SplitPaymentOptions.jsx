import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CheckoutPaymentContent from "../../page-layouts/single-checkout/payment/checkout-payment-content";
import CheckoutPaymentFailure from "../../page-layouts/single-checkout/payment/checkout-payment-failure";
import CheckoutPaymentSkeleton from "../../page-layouts/single-checkout/payment/checkout-payment-skeleton";
import * as styles from "./SplitPaymentOptions.less";

// ─── Stable no-op references so useCheckoutPayment effects don't re-fire ──────
const STABLE_NOOP = () => {};
const STABLE_ASYNC_NOOP = async () => ({});
const STABLE_CARD_DETAILS_NOOP = async () => ({
  data: { payment: { card_details: { data: {} } } },
});
const STABLE_CHECK_STATUS_NOOP = async () => ({
  data: { checkAndUpdatePaymentStatus: { status: "pending" } },
});
const STABLE_EMPTY_LIST = () => [];
// status=INACTIVE hides the CreditNote block inside CheckoutPaymentContent.
const STABLE_PARTIAL_PAYMENT_OPTION = {
  list: [{ balance: { account: { status: "INACTIVE" } } }],
};
// Fallback shape for UPI/QR payment code when a split onPay handler does not
// return a payment order response.
const STABLE_CHECKOUT_RESULT = {
  payload: { data: { checkoutCart: { success: false, data: {} } } },
};

const ERROR_DISMISS_MS = 30000;

// Maps MOP name → SVG icon name used in Firestone's SvgWrapper.
// Matches the PAYMENT_OPTIONS_SVG map in react-starter/usePayment.jsx.
const PAYMENT_SVG_MAP = {
  CARD: "card-payment",
  WL: "wallet",
  UPI: "upi",
  NB: "nb",
  CARDLESS_EMI: "emi",
  PL: "pay-later",
  COD: "cod",
  QR: "upi",
  NEFT: "neft",
  RTGS: "rtgs",
};

const normalizeQrImage = (image) => {
  if (!image || typeof image !== "string") return image;

  const trimmedImage = image.trim();
  if (!trimmedImage) return null;

  if (trimmedImage.startsWith("data:")) {
    return trimmedImage.replace(/;\s*base64\s*,\s*/i, ";base64,");
  }

  if (/^(https?:|blob:)/i.test(trimmedImage)) return trimmedImage;

  return `data:image/png;base64,${trimmedImage.replace(/\s+/g, "")}`;
};

const getCreatePaymentOrder = (response) =>
  response?.payload?.data?.createPaymentOrder ||
  response?.payload?.data?.createpaymentorder ||
  response?.data?.createPaymentOrder ||
  response?.data?.createpaymentorder ||
  response?.createPaymentOrder ||
  response?.createpaymentorder ||
  null;

const toCheckoutCartResponse = (response) => {
  const createPaymentOrder = getCreatePaymentOrder(response);
  if (!createPaymentOrder) return response || STABLE_CHECKOUT_RESULT;

  const data = createPaymentOrder?.data || {};
  const checkoutCart = {
    ...createPaymentOrder,
    data: {
      ...data,
      callback_url: data.callback_url || createPaymentOrder.callback_url,
      base64_encoded_qr: normalizeQrImage(data.base64_encoded_qr),
    },
  };

  return {
    ...response,
    payload: {
      ...(response?.payload || {}),
      data: {
        ...(response?.payload?.data || {}),
        checkoutCart,
      },
    },
  };
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

  if (opt.name === "CARD") {
    // Card network logos come from supported_methods[].logo
    opt.supported_methods?.slice(0, 3).forEach((m) => {
      if (m.logo) subMopIcons.push(m.logo);
    });
  } else if (opt.name !== "UPI") {
    // UPI shows hard-coded app icons in the nav — no subMopIcons needed.
    // All other methods use their list[].logo_url.small as sub-icons.
    opt.list?.slice(0, 3).forEach((item) => {
      if (item.logo_url?.small) subMopIcons.push(item.logo_url.small);
    });
  }

  return {
    ...opt,
    svg: PAYMENT_SVG_MAP[opt.name] ?? "payment-other",
    subMopIcons,
    image_src: null,
  };
}

function SplitPaymentOptions({
  options,
  onPay,
  isLoading = false,
  currencySymbol,
  amount,
  neftFileUpload,
  rtgsFileUpload,
  validateCardDetails = STABLE_NOOP,
  cardDetails = STABLE_CARD_DETAILS_NOOP,
  getUPIIntentApps = STABLE_ASYNC_NOOP,
  checkAndUpdatePaymentStatus = STABLE_CHECK_STATUS_NOOP,
  cancelPayment = STABLE_ASYNC_NOOP,
  getPaymentSuccessRedirectUrl,
}) {
  const [selectedTab, setSelectedTab] = useState("");
  const [showUpiRedirectionModal, setShowUpiRedirectionModal] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isUPIError, setUPIError] = useState(false);

  // Error banner — same pattern as checkout-payment.jsx
  const [showFailedMessage, setShowFailedMessage] = useState(false);
  const [paymentErrHeading, setPaymentErrHeading] = useState("");
  const [paymentErrMsg, setPaymentErrMsg] = useState("");
  const timerRef = useRef(null);
  const paymentInFlightRef = useRef(false);

  // Ref so proceedToPay always reads the latest tab without going stale.
  const selectedTabRef = useRef("");
  useEffect(() => {
    selectedTabRef.current = selectedTab;
  }, [selectedTab]);

  // Auto-select first option when options load.
  useEffect(() => {
    if (!options?.length) return;

    const selectedTabExists = options.some(
      (option) => option?.name === selectedTab
    );

    if (!selectedTab || !selectedTabExists) {
      setSelectedTab(options[0].name);
    }
  }, [options, selectedTab]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleShowFailedMessage = useCallback((errObj) => {
    if (!errObj?.failed) return;
    setShowFailedMessage(true);
    setPaymentErrHeading(errObj?.paymentErrHeading || "");
    setPaymentErrMsg(errObj?.paymentErrMsg || "");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowFailedMessage(false);
      setPaymentErrHeading("");
      setPaymentErrMsg("");
    }, ERROR_DISMISS_MS);
  }, []);

  const removeDialogueError = useCallback(() => {
    setShowFailedMessage(false);
    setPaymentErrHeading("");
    setPaymentErrMsg("");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ─── payment object fields ────────────────────────────────────────────────

  // Raw options kept intact so useCheckoutPayment can do MOP/sub-MOP lookups.
  const paymentOption = useMemo(
    () => ({ payment_option: options ?? [] }),
    [options]
  );

  // Transformed nav items: add svg / subMopIcons so tab icons render correctly.
  // Split payment must render every returned non-split method, including
  // standard extension methods like NEFT and RTGS.
  const PaymentOptionsList = useCallback(
    () => (options ?? []).map(toNavOption),
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
  const getCurrencySymbol = currencySymbol || "₹";

  const getTotalValue = useCallback(() => amount ?? 0, [amount]);

  const payButtonLoader = (
    <span
      className={styles.payButtonLoader}
      aria-label="Processing payment"
    />
  );

  // ─── The single override: intercept every Pay click ───────────────────────
  const proceedToPay = useCallback(
    async (mop, paymentPayload = {}) => {
      if (paymentInFlightRef.current || isLoading) return STABLE_CHECKOUT_RESULT;

      paymentInFlightRef.current = true;
      const tab = selectedTabRef.current;
      const effectiveMop = mop === "newCARD" ? "CARD" : (mop ?? tab);
      const opt =
        (options ?? []).find((o) => o.name === effectiveMop) ??
        (options ?? []).find((o) => o.name === tab) ??
        null;

      setIsPaymentLoading(true);
      try {
        const response = await onPay({
          option: opt,
          mode: mop ?? effectiveMop,
          selectedTab: tab,
          paymentPayload,
        });
        return toCheckoutCartResponse(response);
      } finally {
        paymentInFlightRef.current = false;
        setIsPaymentLoading(false);
      }
    },
    [isLoading, options, onPay]
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
      getUPIIntentApps,
      cardDetails,
      checkAndUpdatePaymentStatus,
      cancelPayment,
      getPaymentSuccessRedirectUrl,
      // otherOptions must be empty — returning options here would show
      // every method in both the nav AND the "More Payment Options" panel.
      otherOptions: STABLE_EMPTY_LIST,
      setUPIError,
      validateCoupon: STABLE_ASYNC_NOOP,
      selectPaymentMode: STABLE_ASYNC_NOOP,
      enableLinkPaymentOption: false,
      setIsPaymentLoading,
      setShowUpiRedirectionModal,
      loggedIn: true,
      isLoading: false,
      isQrCodeLoading: false,
      validateCardDetails,
      showUpiRedirectionModal,
      partialPaymentOption: STABLE_PARTIAL_PAYMENT_OPTION,
      updateStoreCredits: STABLE_NOOP,
      creditUpdating: false,
      isPaymentLoading: isPaymentLoading || isLoading,
      isUPIError,
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
      getUPIIntentApps,
      cardDetails,
      checkAndUpdatePaymentStatus,
      cancelPayment,
      getPaymentSuccessRedirectUrl,
      validateCardDetails,
      showUpiRedirectionModal,
      isPaymentLoading,
      isLoading,
      isUPIError,
    ]
  );

  // Don't mount CheckoutPaymentContent until we have real options and a
  // non-zero amount. Mounting with empty options causes useCheckoutPayment's
  // init effect to see getTotalValue()===0 → setSelectedTab("COD") → blank UI.
  // Once ready, keep mounted — clearing the amount input must not revert to
  // the skeleton (it would show a permanent loading state with no re-fetch).
  const wasReadyRef = useRef(false);
  if ((options?.length ?? 0) > 0 && (amount ?? 0) > 0) {
    wasReadyRef.current = true;
  }
  const isReady = wasReadyRef.current;

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
          loader={payButtonLoader}
          handleShowFailedMessage={handleShowFailedMessage}
          onPriceDetailsClick={STABLE_NOOP}
          breakUpValues={[]}
          removeDialogueError={removeDialogueError}
          setCancelQrPayment={STABLE_NOOP}
          isCouponApplied={false}
          juspayErrorMessage={null}
          isCouponValid={true}
          inValidCouponData={null}
          neftFileUpload={neftFileUpload}
          rtgsFileUpload={rtgsFileUpload}
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
