import React, { useEffect, useMemo, useRef, useState } from "react";
import * as styles from "./checkout-payment-content.less";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import Modal from "../../../components/core/modal/modal";
// import UktModal from "./ukt-modal";
import StickyPayNow from "./sticky-pay-now/sticky-pay-now";
import CreditNote from "./credit-note/credit-note";
import {
  priceFormatCurrencySymbol,
  translateDynamicLabel,
} from "../../../helper/utils";
import Spinner from "../../../components/spinner/spinner";
import CheckoutPaymentSkeleton from "./checkout-payment-skeleton";
import QrCodePaymet from "../../../components/payment-options/qr-code-pay";
import UpiAppPayment from "../../../components/payment-options/upi-app-pay";
import WalletPayment from "../../../components/payment-options/wallet-pay";
import NetBankingPay from "../../../components/payment-options/net-banking-pay";
import CardPayment from "../../../components/payment-options/card-payment";
import CodPayment from "../../../components/payment-options/cod-payment";
import OtherPay from "../../../components/payment-options/other-pay";
import PayLater from "../../../components/payment-options/pay-later";
import CardLessEmi from "../../../components/payment-options/cardless-emi-pay";
import { useCheckoutPayment } from "../../payment/useCheckoutPayment";

const RAZORPAY_APPLE_PAY_TAG = "razorpay-checkout";
const APPLE_PAY_METHOD = "card";
const APPLE_PAY_APP = { name: "apple_pay" };
const APPLE_PAY_LOAD_TIMEOUT = 10000;

const isApplePayOption = (option = {}) =>
  [option.code, option.name, option.display_name, option.merchant_code].some(
    (value) =>
      value
        ?.toString()
        .toLowerCase()
        .replace(/[\s_-]/g, "") === "applepay",
  );

const findApplePayOption = (options = []) => {
  for (const parent of options || []) {
    const option = parent?.list?.find(isApplePayOption);
    if (option) return { parent, option };
  }
  return null;
};

const parseApplePayConfig = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const getApplePayKey = ({
  applePayPaymentOption,
  paymentOption,
  paymentConfig,
}) => {
  const aggregator = (
    applePayPaymentOption?.option?.aggregator_name ||
    applePayPaymentOption?.parent?.aggregator_name ||
    "razorpay"
  ).toLowerCase();
  const flow = parseApplePayConfig(
    paymentOption?.payment_flows?.[aggregator]?.data ||
      paymentOption?.payment_flows?.razorpay?.data,
  );
  const aggregatorData = parseApplePayConfig(
    paymentOption?.aggregator_details?.find((entry) =>
      [aggregator, "razorpay"].includes(entry?.aggregator_key?.toLowerCase()),
    )?.data,
  );
  const candidates = [
    paymentConfig?.razorpay?.key,
    paymentConfig?.Razorpay?.key,
    flow?.key,
    flow?.merchant_key,
    aggregatorData?.key,
    aggregatorData?.merchant_key,
    paymentConfig?.razorpay?.merchant_key,
    paymentConfig?.Razorpay?.merchant_key,
  ].filter(Boolean);
  return (
    candidates.find((key) => /^rzp_(test|live)_/i.test(key)) ||
    candidates[0] ||
    ""
  );
};

const isRazorpayConstructor = (value) =>
  typeof value === "function" &&
  typeof value.prototype?.canMakePayment === "function" &&
  typeof value.prototype?.createPayment === "function";

const loadApplePaySdk = ({ requireWebComponent = false } = {}) => {
  if (typeof window === "undefined")
    return Promise.reject(
      new Error("Razorpay can only be loaded in a browser."),
    );
  logApplePay("1.2 Reuse existing Custom Checkout Script - wait", {
    require_web_component: requireWebComponent,
  });
  const hasScript = () =>
    [...document.scripts].some((script) =>
      /checkout\.razorpay\.com\/v1\/razorpay\.js/.test(script.src || ""),
    );
  const hasComponent = () =>
    Boolean(window.customElements?.get(RAZORPAY_APPLE_PAY_TAG));
  const getConstructor = () => {
    if (isRazorpayConstructor(window.__rzpApplePay))
      return window.__rzpApplePay;
    if (isRazorpayConstructor(window.Razorpay)) {
      window.__rzpApplePay = window.Razorpay;
      return window.__rzpApplePay;
    }
    return requireWebComponent && typeof window.Razorpay === "function"
      ? window.Razorpay
      : null;
  };
  const isReady = () =>
    Boolean(getConstructor()) &&
    hasScript() &&
    (!requireWebComponent || hasComponent());
  if (isReady()) {
    const Razorpay = getConstructor();
    const diagnostics = {
      apple_pay_constructor_type: typeof window.__rzpApplePay,
      global_razorpay_constructor_type: typeof window.Razorpay,
      selected_constructor_type: typeof Razorpay,
      selected_saved_apple_pay_constructor: Razorpay === window.__rzpApplePay,
      constructors_are_same: window.__rzpApplePay === window.Razorpay,
    };
    console.info(
      "[Apple Pay][Razorpay] Constructor diagnostics - already loaded",
      diagnostics,
    );
    logApplePay("1.2 Reuse existing Custom Checkout Script - already loaded", {
      has_razorpay: Boolean(window.Razorpay || window.__rzpApplePay),
      has_v1_razorpay_script: hasScript(),
      has_web_component: hasComponent(),
      ...diagnostics,
    });
    return Promise.resolve(Razorpay);
  }
  const key = requireWebComponent
    ? "__rzpApplePayComponentLoadPromise"
    : "__rzpApplePayLoadPromise";
  if (window[key]) {
    logApplePay("1.2 Reuse existing Custom Checkout Script - waiting", {
      reason: "existing_load_in_progress",
    });
    return window[key];
  }
  window[key] = new Promise((resolve, reject) => {
    const started = Date.now();
    logApplePay("1.2 Reuse existing Custom Checkout Script - waiting", {
      message:
        "Apple Pay is waiting for the already configured checkout flow to expose Razorpay.",
      has_razorpay: typeof window.Razorpay === "function",
      has_v1_razorpay_script: hasScript(),
      has_web_component: hasComponent(),
      require_web_component: requireWebComponent,
    });
    const timer = window.setInterval(() => {
      if (isReady()) {
        window.clearInterval(timer);
        window[key] = null;
        const Razorpay = getConstructor();
        logApplePay("1.2 Reuse existing Custom Checkout Script - ready", {
          source: "existing_sdk",
          has_razorpay: typeof Razorpay === "function",
          has_v1_razorpay_script: hasScript(),
          has_web_component: hasComponent(),
          require_web_component: requireWebComponent,
        });
        resolve(Razorpay);
      } else if (Date.now() - started >= APPLE_PAY_LOAD_TIMEOUT) {
        window.clearInterval(timer);
        window[key] = null;
        const error = new Error(
          requireWebComponent
            ? "Razorpay Apple Pay web component is not available."
            : "Razorpay Apple Pay headless SDK is not available.",
        );
        logApplePay(
          "1.2 Reuse existing Custom Checkout Script - existing SDK timeout",
          {
            has_razorpay: typeof window.Razorpay === "function",
            has_headless_constructor: isRazorpayConstructor(
              window.__rzpApplePay || window.Razorpay,
            ),
            has_v1_razorpay_script: hasScript(),
            has_web_component: hasComponent(),
            require_web_component: requireWebComponent,
          },
          true,
        );
        reject(error);
      }
    }, 100);
  });
  return window[key];
};

const formatApplePayContact = (contact) => {
  const value = contact?.toString().trim();
  if (!value) return "";
  if (value.startsWith("+")) return value;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length > 10 && digits.length === value.length) return `+${digits}`;
  return value;
};

const getApplePayCheckoutCart = (response) =>
  response?.payload?.data?.checkoutCart ||
  response?.data?.checkoutCart ||
  response?.checkoutCart ||
  response;

const logApplePay = (step, data = {}, error = false) => {
  if (typeof console === "undefined") return;
  const method = error ? "error" : "info";
  console[method](`[Apple Pay][Razorpay] ${step}`, data);
};

function CheckoutPaymentContent({
  payment,
  loader,
  handleShowFailedMessage,
  onPriceDetailsClick = () => {},
  breakUpValues,
  removeDialogueError,
  setCancelQrPayment,
  isCouponApplied,
  juspayErrorMessage,
  setMopPayload,
  isCouponValid,
  setIsCouponValid,
  inValidCouponData,
}) {
  const checkoutPayment = useCheckoutPayment({
    payment,
    handleShowFailedMessage,
    breakUpValues,
    setCancelQrPayment,
    isCouponApplied,
    juspayErrorMessage,
    setMopPayload,
    styles,
  });

  const {
    selectedTab,
    selectedTabData,
    proceedToPay,
    getTotalValue,
    setSelectedTab,
    getCurrencySymbol,
    loggedIn,
    paymentOption,
    paymentConfig,
    currencyCode = "INR",
    applePayEmail,
    isLoading,
    isQrCodeLoading,
    cardDetails,
    setUPIError,
    showUpiRedirectionModal,
    validateCardDetails,
    setShowUpiRedirectionModal,
    enableLinkPaymentOption,
    partialPaymentOption,
    updateStoreCredits,
    creditUpdating,
    isPaymentLoading,
    isUPIError,
  } = payment;

  // destructure exactly what the JSX (and the local prop-bundles) needs
  const {
    // translations & environment
    t,
    isTablet,
    isChromeOrSafari,
    // payment data
    paymentOptions,
    otherPaymentOptions,
    codOption,
    // for coupon modal (your return uses these)
    showCouponValidityModal,
    setShowCouponValidityModal,
    couponValidity,
    // card state
    addNewCard,
    getCardBorder,
    savedCards,
    cardExpiryDate,
    setCardExpiryDate,
    cvvNumber,
    setCvvNumber,
    showError,
    cardNumberError,
    cardExpiryError,
    cardCVVError,
    cardNameError,
    isCardSecure,
    openGuidelinesModal,
    setOpenGuidelinesModal,
    CREDIT_CARD_MASK,
    cardNumber,
    nameOnCard,
    setNameOnCard,
    cardDetailsData,
    setLastValidatedBin,
    // refs
    nameRef,
    cardNumberRef,
    selectedUpiRef,
    // selections
    selectedCard,
    selectedWallet,
    selectedNB,
    selectedPayLater,
    selectedCardless,
    selectedOtherPayment,
    selectedPaymentPayload,
    setSelectedPaymentPayload,
    setSelectedOtherPayment,
    setSavedUPISelect,
    // upi/qr
    setvpa,
    upiApps,
    selectedUpiIntentApp,
    setSelectedUpiIntentApp,
    showUPIModal,
    timeRemaining,
    isQrMopPresent,
    isQrCodeVisible,
    qrCodeImage,
    countdown,
    setTab,
    mop,
    subMop,
    activeMop,
    toggleMop,
    isCodModalOpen,
    setIsCodModalOpen,
    // store / disable / charges
    disbaleCheckout,
    codCharges,
    // search modals lists
    openMoreWalletModal,
    setOpenMoreWalletModal,
    walletSearchText,
    setWalletSearchText,
    openMoreNbModal,
    setOpenMoreNbModal,
    nbSearchText,
    setNbSearchText,
    // cvv helpers
    cvvValues,
    isCvvInfo,
    isCvvNotNeededModal,
    setIsCvvInfo,
    setIsCvvNotNeededModal,
    handleCvvChange,
    handleCvvInfo,
    // actions
    selectMop,
    removeCoupon,
    unsetSelectedSubMop,
    acceptOrder,
    cancelQrPayment,
    cancelUpiAppPayment,
    cancelUPIPayment,
    // card handlers
    addNewCardShow,
    hideNewCard,
    handleNewCardNumberChange,
    handleNewCardExpiryChange,
    keypressCvv,
    handleNewCardSaveState,
    handleCardNumberInput,
    handleCardNumberPaste,
    handleNameOnCardInput,
    validateCardNumber,
    validateNameOnCard,
    validateCardExpiryDate,
    validateCvv,
    handleCvvNumberInput,
    setCardValidity,
    resetCardValidationErrors,
    getTrimmedCardNumber,
    isCardValid,
    payUsingCard,
    // juspay
    paymentResponse,
    isJuspayEnabled,
    setIsJuspayCouponApplied,
    // upi
    getSvgNameForApp,
    upiAppData,
    formatTime,
    // borders / list helpers
    getWalletdBorder,
    getNBBorder,
    getNormalisedList,
    getPayLaterBorder,
    getCardlessBorder,
    getOPBorder,
    handleScrollToTop,
    vpa,
  } = checkoutPayment;

  const applePayPaymentOption = useMemo(
    () => findApplePayOption(paymentOption?.payment_option),
    [paymentOption],
  );
  const applePayContainerRef = useRef(null);
  const applePayComponentRef = useRef(null);
  const applePayRenderLogKeyRef = useRef("");
  const applePayRazorpayRef = useRef(null);
  const applePayOrderRef = useRef(null);
  const applePayRequestIdRef = useRef(0);
  const applePayInitializationRef = useRef(false);
  const applePayPaymentInFlightRef = useRef(false);
  const applePayCallbackSubmittedRef = useRef(false);
  const applePayAttemptedOrdersRef = useRef(new Set());
  const [applePayOrder, setApplePayOrder] = useState(null);
  const [applePaySdkReady, setApplePaySdkReady] = useState(false);
  const [applePayStatus, setApplePayStatus] = useState("idle");
  const [applePayMobileEligibility, setApplePayMobileEligibility] =
    useState("idle");
  const [isApplePayViewportReady, setIsApplePayViewportReady] =
    useState(false);
  useEffect(() => {
    setIsApplePayViewportReady(true);
  }, []);
  const applePayFallbackKey = getApplePayKey({
    applePayPaymentOption,
    paymentOption,
    paymentConfig,
  });
  const applePayAmount = getTotalValue?.();
  const applePayUrlParams =
    typeof window === "undefined"
      ? new URLSearchParams()
      : new URLSearchParams(window.location.search);
  const applePayContextKey = [
    applePayUrlParams.get("id"),
    applePayUrlParams.get("address_id"),
    applePayUrlParams.get("billing_address_id"),
    applePayPaymentOption?.parent?.name,
    applePayPaymentOption?.option?.aggregator_name,
    applePayPaymentOption?.option?.merchant_code,
    applePayAmount,
    currencyCode,
    applePayFallbackKey,
  ]
    .filter(Boolean)
    .join(":");
  const applePayContextKeyRef = useRef("");
  const applePaySubmitting = applePayStatus === "submitting";
  const shouldShowApplePayOption =
    Boolean(applePayPaymentOption) &&
    !enableLinkPaymentOption &&
    (!isTablet || applePayMobileEligibility === "available") &&
    applePayStatus !== "unavailable";
  useEffect(() => {
    if (!shouldShowApplePayOption) return;
    const renderLogKey = [
      isTablet ? "mobile-tablet" : "desktop",
      selectedTab,
      activeMop,
      applePayStatus,
    ].join(":");
    if (applePayRenderLogKeyRef.current === renderLogKey) return;
    applePayRenderLogKeyRef.current = renderLogKey;
    logApplePay("1.5 Render the Button - payment option rendered", {
      is_mobile_or_tablet: isTablet,
      selected_tab: selectedTab,
      active_mop: activeMop,
      apple_pay_status: applePayStatus,
      sticky_pay_now_expected: false,
      sticky_apple_pay_button_expected: isTablet && selectedTab === "APPLEPAY",
      web_component_expected: selectedTab === "APPLEPAY",
    });
  }, [shouldShowApplePayOption, isTablet, selectedTab, activeMop, applePayStatus]);
  const applePayLogo = applePayPaymentOption?.option?.logo_url?.small;
  const applePayContextRef = useRef(null);
  applePayContextRef.current = {
    key: applePayContextKey,
    isTablet,
    isPaymentLoading,
    error: disbaleCheckout?.message,
  };

  const createApplePayOrder = async (requestId) => {
    logApplePay("1.1 Create an Order on Your Server - request", {
      mode: "APPLEPAY",
      silent: true,
      has_fallback_key: Boolean(applePayFallbackKey),
    });
    const response = await proceedToPay("APPLEPAY", { silent: true });
    if (applePayRequestIdRef.current !== requestId) return null;
    const checkoutCart = getApplePayCheckoutCart(response);
    const source = checkoutCart?.data || {};
    const orderData = {
      ...source,
      key: source?.key || applePayFallbackKey,
      contact: formatApplePayContact(source?.contact),
      email: applePayEmail,
      method: APPLE_PAY_METHOD,
      app: APPLE_PAY_APP,
    };
    const orderDebugData = {
      success: Boolean(checkoutCart?.success),
      order_id: orderData.order_id,
      amount: orderData.amount,
      currency: orderData.currency,
      method: orderData.method,
      app: orderData.app,
      has_order_id: Boolean(orderData.order_id),
      has_key: Boolean(orderData.key),
      has_contact: Boolean(orderData.contact),
      has_email: Boolean(orderData.email),
      has_callback_url: Boolean(orderData.callback_url || checkoutCart?.callback_url),
      server_response_has_email: Boolean(checkoutCart?.data?.email?.trim?.()),
      payment_email_source: "configured_apple_pay_email",
    };
    logApplePay("1.1 Create an Order on Your Server - response", {
      ...orderDebugData,
      has_checkout_cart: Boolean(checkoutCart),
    });
    if (!checkoutCart?.success || !orderData.order_id) {
      const error = new Error(
        checkoutCart?.message || "Unable to start Apple Pay.",
      );
      logApplePay(
        "1.1 Create an Order on Your Server - failed",
        { ...orderDebugData, message: error.message },
        true,
      );
      throw error;
    }
    const missingConfiguration = [
      ["key", orderData.key],
      ["order_id", orderData.order_id],
      ["callback_url", orderData.callback_url || checkoutCart.callback_url],
    ].find(([, value]) => !value)?.[0];
    if (missingConfiguration) {
      const error = new Error(
        `Apple Pay configuration is missing ${missingConfiguration}.`,
      );
      logApplePay("1.1 Create an Order on Your Server - missing configuration", {
        ...orderDebugData,
        missing_configuration: missingConfiguration,
      }, true);
      throw error;
    }
    orderData.callback_url =
      orderData.callback_url || checkoutCart.callback_url;
    const prepared = { ...checkoutCart, data: orderData, applePayContextKey };
    applePayOrderRef.current = prepared;
    setApplePayOrder(prepared);
    logApplePay("1.1 Create an Order on Your Server - ready", {
      ...orderDebugData,
      key_source: "checkout_order",
    });
    return orderData;
  };

  const submitApplePayCallback = (event, orderData) => {
    if (applePayCallbackSubmittedRef.current) {
      logApplePay("1.6 Handle the Payment Response - duplicate ignored");
      return;
    }
    const response =
      event?.paymentData ||
      event?.detail?.paymentData ||
      event?.detail?.payment ||
      event?.payment ||
      event?.detail ||
      event ||
      {};
    const fields = [
      "razorpay_payment_id",
      "razorpay_order_id",
      "razorpay_signature",
    ];
    const complete = fields.every((field) => response?.[field]);
    const orderMatches = response?.razorpay_order_id === orderData?.order_id;
    logApplePay("1.6 Handle the Payment Response - success event", {
      has_payment_id: Boolean(response?.razorpay_payment_id),
      has_order_id: Boolean(response?.razorpay_order_id),
      has_signature: Boolean(response?.razorpay_signature),
      order_matches: orderMatches,
    });
    if (!complete || !orderData?.callback_url || !orderMatches) {
      applePayPaymentInFlightRef.current = false;
      setApplePayStatus("error");
      handleShowFailedMessage({
        failed: true,
        paymentErrMsg: "Apple Pay confirmation data is incomplete.",
      });
      logApplePay(
        "1.6 Handle the Payment Response - incomplete payment data",
        {
          complete,
          order_matches: orderMatches,
          has_callback_url: Boolean(orderData?.callback_url),
        },
        true,
      );
      return;
    }
    applePayCallbackSubmittedRef.current = true;
    setApplePayStatus("submitting");
    const form = document.createElement("form");
    form.method = "POST";
    form.action = orderData.callback_url;
    form.style.display = "none";
    fields.forEach((field) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = field;
      input.value = response[field];
      form.appendChild(input);
    });
    document.body.appendChild(form);
    logApplePay("1.6 Handle the Payment Response - post callback", {
      callback_url_present: Boolean(orderData.callback_url),
      submitted_fields: fields,
    });
    form.submit();
  };

  const handleApplePayFailure = (event, { retry = true } = {}) => {
    if (applePayCallbackSubmittedRef.current) {
      logApplePay("1.6 Handle the Payment Response - late failure ignored");
      return;
    }
    const error =
      event?.detail?.error || event?.detail || event?.error || event || {};
    const code = error?.code || error?.reason || error?.errorCode;
    const cancelled =
      ["PAYMENT_CANCELLED", "payment_cancelled"].includes(code) ||
      error?.reason === "payment_cancelled";
    const message = cancelled
      ? "Apple Pay was cancelled. You can try again or choose another payment method."
      : error?.description || error?.message || "Apple Pay payment failed.";
    applePayPaymentInFlightRef.current = false;
    setApplePayStatus("error");
    logApplePay(
      "1.6 Handle the Payment Response - failure event",
      { code, reason: error?.reason, cancelled, message },
      true,
    );
    handleShowFailedMessage({ failed: true, paymentErrMsg: message });
    if (retry && isTablet) {
      logApplePay("1.5 Retry Payment - prepare fresh checkout order", {
        previous_order_id: applePayOrderRef.current?.data?.order_id,
      });
      checkMobileApplePayEligibility({ force: true });
    }
  };

  const checkMobileApplePayEligibility = async ({ force = false } = {}) => {
    if (applePayInitializationRef.current || applePayPaymentInFlightRef.current)
      return;
    if (
      applePayMobileEligibility === "available" &&
      !force &&
      applePayOrderRef.current
    )
      return;
    const requestId = ++applePayRequestIdRef.current;
    applePayInitializationRef.current = true;
    applePayCallbackSubmittedRef.current = false;
    applePayPaymentInFlightRef.current = false;
    applePayOrderRef.current = null;
    setApplePayOrder(null);
    setApplePaySdkReady(false);
    setApplePayStatus("checking");
    setApplePayMobileEligibility("checking");
    try {
      const order = await createApplePayOrder(requestId);
      if (!order || applePayRequestIdRef.current !== requestId) return;
      if (applePayAttemptedOrdersRef.current.has(order.order_id))
        throw new Error("A fresh Apple Pay order is required.");
      const Razorpay = await loadApplePaySdk({ requireWebComponent: true });
      if (applePayRequestIdRef.current !== requestId) return;
      const contact = formatApplePayContact(order.contact);
      if (!contact) {
        setApplePayStatus("waiting_for_contact");
        setApplePayMobileEligibility("waiting_for_contact");
        logApplePay("1.3 Initialise the SDK - waiting for customer contact", {
          reason: "missing_customer_contact",
          has_prefill_contact: false,
        });
        return;
      }
      const amount = Number(
        order.amount || Math.round(Number(applePayAmount) * 100),
      );
      const currency = (order.currency || currencyCode || "INR")
        .toString()
        .trim()
        .toUpperCase();
      if (!Number.isSafeInteger(amount) || amount <= 0)
        throw new Error(
          "Apple Pay requires a positive amount in currency subunits.",
        );
      if (!/^[A-Z]{3}$/.test(currency))
        throw new Error("Apple Pay currency is invalid.");
      if (
        amount !== Math.round(Number(applePayAmount) * 100) ||
        currency !== (currencyCode || "INR").toString().trim().toUpperCase()
      )
        throw new Error(
          "Checkout total or currency has changed. Please try again.",
        );
      const options = {
        key: order.key,
        order_id: order.order_id,
        amount,
        currency,
        email: order.email,
        prefill: { contact: String(contact), email: order.email },
      };
      const constructorDiagnostics = {
        apple_pay_constructor_type: typeof window.__rzpApplePay,
        global_razorpay_constructor_type: typeof window.Razorpay,
        selected_constructor_type: typeof Razorpay,
        selected_saved_apple_pay_constructor: Razorpay === window.__rzpApplePay,
        constructors_are_same: window.__rzpApplePay === window.Razorpay,
      };
      console.info(
        "[Apple Pay][Razorpay] Constructor diagnostics - instance constructor",
        constructorDiagnostics,
      );
      logApplePay("1.3 Initialise the SDK - request", {
        ...constructorDiagnostics,
        has_key: Boolean(options.key),
        order_id: options.order_id,
        amount: options.amount,
        currency: options.currency,
        has_contact: Boolean(options.prefill.contact),
        prefill_contact_type: typeof options.prefill.contact,
        has_email: Boolean(options.email),
        has_prefill_email: Boolean(options.prefill.email),
        prefill_email_type: typeof options.prefill.email,
        method: APPLE_PAY_METHOD,
        app: APPLE_PAY_APP,
      });
      const instance = new Razorpay(options);
      if (
        typeof instance?.canMakePayment !== "function" ||
        typeof instance?.createPayment !== "function"
      )
        throw new Error("Razorpay Apple Pay eligibility is unavailable.");
      applePayRazorpayRef.current = instance;
      logApplePay("1.3 Initialise the SDK - response", {
        has_instance: Boolean(instance),
        has_canMakePayment: typeof instance.canMakePayment === "function",
        has_createPayment: typeof instance.createPayment === "function",
      });
      const eligibilityRequest = {
        method: APPLE_PAY_METHOD,
        app: APPLE_PAY_APP,
      };
      logApplePay(
        "1.4 Check Apple Pay Eligibility - canMakePayment request",
        eligibilityRequest,
      );
      let result;
      try {
        result = await instance.canMakePayment(eligibilityRequest);
        logApplePay(
          "1.4 Check Apple Pay Eligibility - canMakePayment response",
          result,
        );
      } catch (error) {
        logApplePay(
          "1.4 Check Apple Pay Eligibility - canMakePayment error",
          { message: error?.message },
          true,
        );
        throw error;
      }
      if (applePayRequestIdRef.current !== requestId) return;
      applePayRazorpayRef.current = null;
      if (result?.available !== true) {
        logApplePay("1.5 Render the Button - skipped", {
          reason: "canMakePayment_false",
          available: result?.available === true,
        });
        applePayOrderRef.current = null;
        setApplePayOrder(null);
        setApplePayStatus("unavailable");
        setApplePayMobileEligibility("unavailable");
        if (selectedTab === "APPLEPAY") setSelectedTab("");
        return;
      }
      setApplePaySdkReady(true);
      setApplePayStatus("ready");
      setApplePayMobileEligibility("available");
      logApplePay("1.5 Render the Button - Apple Pay option available", {
        is_mobile_or_tablet: isTablet,
        status: "ready",
      });
    } catch (error) {
      if (applePayRequestIdRef.current !== requestId) return;
      applePayRazorpayRef.current = null;
      applePayOrderRef.current = null;
      setApplePayOrder(null);
      setApplePayStatus("error");
      setApplePayMobileEligibility("error");
      logApplePay(
        "1.4 Check Apple Pay Eligibility - failed before response",
        { message: error?.message },
        true,
      );
    } finally {
      if (applePayRequestIdRef.current === requestId)
        applePayInitializationRef.current = false;
    }
  };

  const initializeDesktopApplePay = async ({ force = false } = {}) => {
    if (applePayInitializationRef.current || applePayPaymentInFlightRef.current)
      return;
    if (!force && applePayOrderRef.current) return;
    const requestId = ++applePayRequestIdRef.current;
    applePayInitializationRef.current = true;
    applePayCallbackSubmittedRef.current = false;
    applePayOrderRef.current = null;
    setApplePayOrder(null);
    setApplePaySdkReady(false);
    setApplePayStatus("loading");
    logApplePay("Apple Pay desktop web-component flow - start", {
      is_mobile_or_tablet: isTablet,
      selected_tab: selectedTab,
    });
    try {
      const order = await createApplePayOrder(requestId);
      if (!order || applePayRequestIdRef.current !== requestId) return;
      await loadApplePaySdk({ requireWebComponent: true });
      if (applePayRequestIdRef.current !== requestId) return;
      setApplePaySdkReady(true);
      setApplePayStatus("ready");
      logApplePay(
        "1.5 Render the Button and Initiate Payment - web component pending",
        {
          order_id: order.order_id,
          is_mobile_or_tablet: isTablet,
        },
      );
    } catch (error) {
      if (applePayRequestIdRef.current !== requestId) return;
      setApplePayStatus("error");
      logApplePay(
        "Apple Pay desktop web-component flow - failed",
        { message: error?.message },
        true,
      );
    } finally {
      if (applePayRequestIdRef.current === requestId)
        applePayInitializationRef.current = false;
    }
  };

  useEffect(() => {
    if (!isApplePayViewportReady || applePaySubmitting) return;

    if (applePayContextKeyRef.current !== applePayContextKey) {
      applePayContextKeyRef.current = applePayContextKey;
      applePayOrderRef.current = null;
      applePayRazorpayRef.current = null;
      applePayPaymentInFlightRef.current = false;
      applePayCallbackSubmittedRef.current = false;
      setApplePayOrder(null);
      setApplePaySdkReady(false);
      setApplePayStatus("idle");
      setApplePayMobileEligibility("idle");
    }
    if (!applePayPaymentOption || enableLinkPaymentOption || !applePayAmount) {
      applePayRequestIdRef.current += 1;
      applePayOrderRef.current = null;
      applePayRazorpayRef.current = null;
      applePayPaymentInFlightRef.current = false;
      applePayCallbackSubmittedRef.current = false;
      setApplePayOrder(null);
      setApplePaySdkReady(false);
      setApplePayStatus("idle");
      setApplePayMobileEligibility("idle");
      return undefined;
    }
    if (isTablet) checkMobileApplePayEligibility();
    else initializeDesktopApplePay();
    return () => {
      applePayRequestIdRef.current += 1;
      applePayInitializationRef.current = false;
    };
  }, [
    applePayContextKey,
    Boolean(applePayPaymentOption),
    enableLinkPaymentOption,
    isTablet,
    isApplePayViewportReady,
    applePaySubmitting,
    applePayAmount,
    currencyCode,
  ]);

  useEffect(() => {
    const container = applePayContainerRef.current;
    const order = applePayOrder?.data;
    if (selectedTab !== "APPLEPAY" || !container || !applePaySdkReady || !order)
      return undefined;
    const element = document.createElement(RAZORPAY_APPLE_PAY_TAG);
    applePayComponentRef.current = element;
    let finished = false;
    const componentContextKey = applePayContextKey;
    const isCurrent = () =>
      applePayComponentRef.current === element &&
      applePayContextRef.current?.key === componentContextKey &&
      applePayOrderRef.current?.data === order;
    element.id = "checkout";
    element.setAttribute("key", order.key);
    element.setAttribute("order-id", order.order_id);
    element.setAttribute(
      "contact",
      String(formatApplePayContact(order.contact)),
    );
    element.setAttribute("email", order.email);
    element.setAttribute("method", APPLE_PAY_METHOD);
    element.setAttribute("app-name", APPLE_PAY_APP.name);
    element.setAttribute("button-label", "pay");
    element.setAttribute("button-theme", "dark");
    element.setAttribute("button-width", isTablet ? "100%" : "148px");
    element.setAttribute("button-height", isTablet ? "48px" : "32px");
    logApplePay(
      "1.5 Render the Button and Initiate Payment - attach web component",
      {
      has_key: Boolean(order.key),
      has_order_id: Boolean(order.order_id),
      has_contact: Boolean(order.contact),
      has_email: Boolean(order.email),
      method: APPLE_PAY_METHOD,
      app_name: APPLE_PAY_APP.name,
      button_label: "pay",
      button_theme: "dark",
      is_mobile_or_tablet: isTablet,
      location: isTablet ? "sticky_footer" : "desktop_payment_panel",
      request_origin:
        "application attributes; SDK-generated request is not directly observable",
      },
    );
    if (window.__RZP_APPLE_PAY_DEBUG__)
      logApplePay(
        "1.5 Initiate Payment - exact web component input attributes",
        {
        key: element.getAttribute("key"),
        order_id: element.getAttribute("order-id"),
        contact: element.getAttribute("contact"),
        email: element.getAttribute("email"),
        method: element.getAttribute("method"),
        app_name: element.getAttribute("app-name"),
        },
      );
    const onClick = (event) => {
      if (
        !event
          .composedPath?.()
          .some((node) => node?.tagName === "APPLE-PAY-BUTTON")
      )
        return;
      if (
        !isCurrent() ||
        applePayPaymentInFlightRef.current ||
        applePayCallbackSubmittedRef.current ||
        applePayContextRef.current?.isPaymentLoading
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (applePayContextRef.current?.error) {
        event.preventDefault();
        event.stopImmediatePropagation();
        handleShowFailedMessage({
          failed: true,
          paymentErrMsg: applePayContextRef.current.error,
        });
        return;
      }
      removeDialogueError();
      applePayPaymentInFlightRef.current = true;
      applePayAttemptedOrdersRef.current.add(order.order_id);
      setApplePayStatus("submitting");
      logApplePay("1.5 Initiate Payment - native Apple Pay button click", {
        method: element.getAttribute("method"),
        app_name: element.getAttribute("app-name"),
        has_order_id: Boolean(element.getAttribute("order-id")),
        has_contact: Boolean(element.getAttribute("contact")),
        has_email: Boolean(element.getAttribute("email")),
        payment_initiation: "razorpay-checkout web component",
        source: "web_component",
        is_mobile_or_tablet: isTablet,
      });
    };
    const onSuccess = (event) => {
      if (!isCurrent()) {
        logApplePay(
          "1.6 Handle the Payment Response - obsolete success ignored",
        );
        return;
      }
      if (finished) return;
      finished = true;
      logApplePay("1.6 Handle the Payment Response - success event fired", {
        source: "web_component",
      });
      submitApplePayCallback(event, order);
    };
    const onFailure = (event) => {
      if (!isCurrent()) {
        logApplePay(
          "1.6 Handle the Payment Response - obsolete failure ignored",
        );
        return;
      }
      if (finished || applePayCallbackSubmittedRef.current)
        return;
      finished = true;
      const error =
        event?.detail?.error || event?.detail || event?.error || event || {};
      logApplePay(
        "1.6 Handle the Payment Response - failure event fired",
        { message: error?.message, code: error?.code, reason: error?.reason },
        true,
      );
      const errorText = [
        error?.code,
        error?.reason,
        error?.description,
        error?.message,
        error?.errorCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (
        [
          "not available",
          "unsupported",
          "cannot make payment",
          "can not make payment",
        ].some((part) => errorText.includes(part))
      ) {
        applePayPaymentInFlightRef.current = false;
        setApplePayStatus("unavailable");
        setApplePayMobileEligibility("unavailable");
        if (selectedTab === "APPLEPAY") {
          setSelectedTab("");
          setTab("");
          toggleMop("APPLEPAY");
        }
        return;
      }
      const wasSubmitting = applePayPaymentInFlightRef.current;
      handleApplePayFailure(event, { retry: wasSubmitting });
    };
    ["paymentsuccess", "payment.success"].forEach((name) =>
      element.addEventListener(name, onSuccess),
    );
    ["paymentfailure", "payment.failure", "error"].forEach((name) =>
      element.addEventListener(name, onFailure),
    );
    element.addEventListener("click", onClick, true);
    container.replaceChildren(element);
    let tries = 0;
    const timer = window.setInterval(() => {
      if (!isCurrent() || finished || applePayPaymentInFlightRef.current) {
        window.clearInterval(timer);
        return;
      }
      if (element.getBoundingClientRect().height > 0) {
        setApplePayStatus("ready");
        logApplePay(
          "1.5 Render the Button and Initiate Payment - web component visible",
          { height: element.getBoundingClientRect().height },
        );
        window.clearInterval(timer);
      } else if (++tries >= 150) {
        setApplePayStatus("unavailable");
        setApplePayMobileEligibility("unavailable");
        logApplePay(
          "1.5 Render the Button and Initiate Payment - web component hidden",
          { reason: "component_height_zero", attempts: tries },
        );
        window.clearInterval(timer);
      }
    }, 100);
    return () => {
      window.clearInterval(timer);
      ["paymentsuccess", "payment.success"].forEach((name) =>
        element.removeEventListener(name, onSuccess),
      );
      ["paymentfailure", "payment.failure", "error"].forEach((name) =>
        element.removeEventListener(name, onFailure),
      );
      element.removeEventListener("click", onClick, true);
      if (applePayComponentRef.current === element)
        applePayComponentRef.current = null;
      if (container.contains(element)) container.replaceChildren();
    };
  }, [
    selectedTab,
    applePayOrder,
    applePaySdkReady,
    isTablet,
    applePayContextKey,
  ]);

  const renderApplePaySticky = () => (
    <StickyPayNow
      customClassName={`${styles.visibleOnTab} ${styles.applePayStickyFooter}`}
      value={priceFormatCurrencySymbol(getCurrencySymbol, getTotalValue())}
      onPriceDetailsClick={onPriceDetailsClick}
      enableLinkPaymentOption={enableLinkPaymentOption}
      isPaymentLoading={isPaymentLoading || applePaySubmitting}
      loader={loader}
      paymentButton={
        <div
          className={styles.applePayStickyButton}
          aria-busy={applePayStatus !== "ready"}
        >
          <div
            ref={applePayContainerRef}
            className={styles.applePayStickyComponent}
            inert={
              applePaySubmitting ||
              applePayStatus === "error" ||
              isPaymentLoading
                ? ""
                : undefined
            }
          />
          {applePayStatus === "error" ? (
            <button
              type="button"
              className={styles.applePayRetryButton}
              onClick={() => checkMobileApplePayEligibility({ force: true })}
            >
              Retry Apple Pay
            </button>
          ) : applePayStatus !== "ready" ? (
            <div
              className={styles.applePayStickyLoader}
              role="status"
              aria-label="Loading Apple Pay"
            >
              {loader}
            </div>
          ) : null}
        </div>
      }
    />
  );

  const visiblePaymentOptions = (() => {
    const options = paymentOptions || [];
    if (!shouldShowApplePayOption) return options;
    const cardIndex = options.findIndex((option) => option.name === "CARD");
    const applePayNav = {
      name: "APPLEPAY",
      display_name: "Apple Pay",
      svg: "wallet",
      subMopIcons: applePayLogo ? [applePayLogo] : [],
    };
    return cardIndex >= 0
      ? [
          ...options.slice(0, cardIndex + 1),
          applePayNav,
          ...options.slice(cardIndex + 1),
        ]
      : [applePayNav, ...options];
  })();

  const uiProps = { styles, t, SvgWrapper, StickyPayNow, isTablet };

  const amountProps = { getCurrencySymbol, getTotalValue };

  const paymentFlowProps = {
    selectMop,
    proceedToPay,
    acceptOrder,
    selectedPaymentPayload,
    enableLinkPaymentOption,
    isPaymentLoading,
    loader,
    onPriceDetailsClick,
  };

  // Card specific (keeps the case block small)
  const cardProps = {
    // state
    addNewCard,
    savedCards,
    selectedCard,
    cvvValues,
    isCvvInfo,
    isCvvNotNeededModal,

    // handlers
    addNewCardShow,
    hideNewCard,
    setIsCvvInfo,
    setIsCvvNotNeededModal,
    handleCvvChange,
    handleCvvInfo,

    // helpers
    getCardBorder,
    getTrimmedCardNumber,

    // CardForm related
    cardNumberRef,
    handleNewCardNumberChange,
    cardNumberError,
    CREDIT_CARD_MASK,
    nameRef,
    cardNameError,
    cardExpiryDate,
    handleNewCardExpiryChange,
    cardExpiryError,
    cvvNumber,
    keypressCvv,
    setCvvNumber,
    showError,
    cardCVVError,
    loggedIn,
    isCardSecure,
    handleNewCardSaveState,
    openGuidelinesModal,
    setOpenGuidelinesModal,
    payUsingCard,
    cardNumber,
    handleCardNumberInput,
    handleCardNumberPaste,
    nameOnCard,
    handleNameOnCardInput,
    cardDetailsData,
    validateCardNumber,
    validateNameOnCard,
    validateCardExpiryDate,
    validateCvv,
    handleCvvNumberInput,
    isCardValid,
    validateCardDetails,
    setCardValidity,
    resetCardValidationErrors,
    paymentOption,
    paymentResponse,
    isJuspayEnabled,
    handleShowFailedMessage,
    cardDetails,
    setIsJuspayCouponApplied,
  };

  const navigationTab = () => {
    switch (selectedTab) {
      case "APPLEPAY":
        if (isTablet) return null;
        return (
          <div className={styles.modeOption}>
            <div
              className={`${styles.modeItemWrapper} ${styles.selectedBorder} ${styles.applePayModeItemWrapper}`}
              onClick={removeDialogueError}
            >
              <label>
                <div className={styles.modeItem}>
                  <div className={styles.logoNameContainer}>
                    <div className={styles.modeItemLogo}>
                      {applePayLogo ? (
                        <img src={applePayLogo} alt="Apple Pay" />
                      ) : (
                        <SvgWrapper svgSrc="wallet" />
                      )}
                    </div>
                    <div className={styles.modeItemName}>Apple Pay</div>
                  </div>
                  <div
                    className={`${styles.walletLeft} ${styles.onMobileView}`}
                  >
                    <SvgWrapper svgSrc="radio-selected" />
                  </div>
                </div>
              </label>
              <div className={`${styles.modePay} ${styles.applePayModePay}`}>
                {applePayStatus === "loading" && (
                  <div className={styles.applePayLoader}>{loader}</div>
                )}
                <div
                  ref={applePayContainerRef}
                  className={styles.applePayWrapper}
                />
              </div>
            </div>
          </div>
        );
      case "CARD":
        return (
          <CardPayment
            {...uiProps}
            {...amountProps}
            {...paymentFlowProps}
            {...cardProps}
          />
        );

      case "WL":
        return (
          <WalletPayment
            {...uiProps}
            {...amountProps}
            {...paymentFlowProps}
            selectedTabData={{
              ...selectedTabData,
              list: selectedTabData?.list?.filter(
                (option) => !isApplePayOption(option),
              ),
            }}
            walletSearchText={walletSearchText}
            setWalletSearchText={setWalletSearchText}
            selectedWallet={selectedWallet}
            removeDialogueError={removeDialogueError}
            setShowMoreWalletModal={setOpenMoreWalletModal}
            openMoreWalletModal={openMoreWalletModal}
            disbaleCheckout={disbaleCheckout}
            setOpenMoreWalletModal={setOpenMoreWalletModal}
            translateDynamicLabel={translateDynamicLabel}
            getWalletdBorder={getWalletdBorder}
          />
        );

      case "UPI":
      case "QR":
        return (
          <>
            <UpiAppPayment
              {...uiProps}
              {...amountProps}
              {...paymentFlowProps}
              isChromeOrSafari={isChromeOrSafari}
              upiApps={upiApps}
              selectedUpiIntentApp={selectedUpiIntentApp}
              setSelectedUpiIntentApp={setSelectedUpiIntentApp}
              selectedUpiRef={selectedUpiRef}
              setvpa={setvpa}
              setUPIError={setUPIError}
              cancelQrPayment={cancelQrPayment}
              getSvgNameForApp={getSvgNameForApp}
              upiAppData={upiAppData}
              selectMop={selectMop}
              removeDialogueError={removeDialogueError}
              setShowUpiRedirectionModal={setShowUpiRedirectionModal}
              showUpiRedirectionModal={showUpiRedirectionModal}
              cancelUpiAppPayment={cancelUpiAppPayment}
              timeRemaining={timeRemaining}
              showUPIModal={showUPIModal}
              cancelUPIPayment={cancelUPIPayment}
              isPaymentLoading={isPaymentLoading}
              isUPIError={isUPIError}
              acceptOrder={acceptOrder}
              disbaleCheckout={disbaleCheckout}
              vpa={vpa}
            />

            <QrCodePaymet
              {...uiProps}
              isQrMopPresent={isQrMopPresent}
              isQrCodeVisible={isQrCodeVisible}
              qrCodeImage={qrCodeImage}
              isQrCodeLoading={isQrCodeLoading}
              countdown={countdown}
              formatTime={formatTime}
              selectMop={selectMop}
              cancelQrPayment={cancelQrPayment}
              disbaleCheckout={disbaleCheckout}
              acceptOrder={acceptOrder}
              removeDialogueError={removeDialogueError}
              setSavedUPISelect={setSavedUPISelect}
              showUpiRedirectionModal={showUpiRedirectionModal}
              cancelUpiAppPayment={cancelUpiAppPayment}
            />
          </>
        );

      case "NB":
        return (
          <NetBankingPay
            {...uiProps}
            {...amountProps}
            {...paymentFlowProps}
            selectedTabData={selectedTabData}
            selectedNB={selectedNB}
            nbSearchText={nbSearchText}
            setNbSearchText={setNbSearchText}
            openMoreNbModal={openMoreNbModal}
            setOpenMoreNbModal={setOpenMoreNbModal}
            removeDialogueError={removeDialogueError}
            disbaleCheckout={disbaleCheckout}
            translateDynamicLabel={translateDynamicLabel}
            getNBBorder={getNBBorder}
          />
        );

      case "COD":
        return (
          <CodPayment
            {...uiProps}
            {...amountProps}
            codCharges={codCharges}
            proceedToPay={proceedToPay}
            selectedPaymentPayload={selectedPaymentPayload}
            isPaymentLoading={isPaymentLoading}
            loader={loader}
            isCodModalOpen={isCodModalOpen}
            setIsCodModalOpen={setIsCodModalOpen}
            setTab={setTab}
            setSelectedTab={setSelectedTab}
            Spinner={Spinner}
          />
        );

      case "PL":
        return (
          <PayLater
            {...uiProps}
            {...amountProps}
            {...paymentFlowProps}
            selectedTabData={selectedTabData}
            selectedPayLater={selectedPayLater}
            getNormalisedList={getNormalisedList}
            getPayLaterBorder={getPayLaterBorder}
            translateDynamicLabel={translateDynamicLabel}
            removeDialogueError={removeDialogueError}
          />
        );

      case "CARDLESS_EMI":
        return (
          <CardLessEmi
            {...uiProps}
            {...amountProps}
            {...paymentFlowProps}
            selectedTabData={selectedTabData}
            selectedCardless={selectedCardless}
            getCardlessBorder={getCardlessBorder}
            translateDynamicLabel={translateDynamicLabel}
            removeDialogueError={removeDialogueError}
          />
        );

      case "Other":
        return (
          <OtherPay
            {...uiProps}
            {...amountProps}
            {...paymentFlowProps}
            otherPaymentOptions={otherPaymentOptions}
            selectedOtherPayment={selectedOtherPayment}
            getOPBorder={getOPBorder}
            removeDialogueError={removeDialogueError}
          />
        );

      default: {
        return (
          <div>
            <div
              className={`${styles.otherHeader} ${styles["view-mobile-up"]}`}
            >
              {t("resource.checkout.choose_an_option")}
            </div>
            <div className={styles.modeOption}>
              {selectedTabData?.list?.map((op, index) => (
                <div
                  key={op.display_name}
                  className={`${styles.modeItemWrapper} ${getOPBorder()}`}
                  onClick={() => {
                    removeDialogueError();
                    setSelectedOtherPayment(op);
                  }}
                >
                  <label>
                    <div className={styles.modeItem}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className={styles.modeItemLogo}>
                          <img
                            src={op?.logo_url?.small}
                            alt={op?.display_name}
                          />
                        </div>
                        <div className={styles.modeItemName}>
                          {op?.display_name ?? ""}
                        </div>
                      </div>
                      <div className={styles.onMobileView}>
                        {(!selectedOtherPayment ||
                          selectedOtherPayment.code !== op.code) && (
                          <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                        )}
                        {selectedOtherPayment &&
                          selectedOtherPayment.code === op.code && (
                            <SvgWrapper svgSrc="radio-selected" />
                          )}
                      </div>
                    </div>
                  </label>

                  {selectedOtherPayment.code &&
                    selectedOtherPayment.code === op.code && (
                      <div className={styles.otherPay}>
                        {isTablet ? (
                          <StickyPayNow
                            customClassName={styles.visibleOnTab}
                            value={priceFormatCurrencySymbol(
                              getCurrencySymbol,
                              getTotalValue(),
                            )}
                            onPriceDetailsClick={onPriceDetailsClick}
                            enableLinkPaymentOption={enableLinkPaymentOption}
                            isPaymentLoading={isPaymentLoading}
                            loader={loader}
                            proceedToPay={() => {
                              proceedToPay("Other", selectedPaymentPayload);
                              acceptOrder();
                            }}
                          />
                        ) : (
                          <button
                            className={`${styles.commonBtn} ${styles.payBtn}`}
                            onClick={() => {
                              proceedToPay("Other", selectedPaymentPayload);
                              acceptOrder();
                            }}
                            disabled={isPaymentLoading}
                          >
                            {!isPaymentLoading ? (
                              <>
                                {t("resource.common.pay_caps")}{" "}
                                {priceFormatCurrencySymbol(
                                  getCurrencySymbol,
                                  getTotalValue(),
                                )}
                              </>
                            ) : (
                              loader
                            )}
                          </button>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  const navigationTitle = (opt, index) => {
    const isApplePayNavigationOption = opt.name === "APPLEPAY";
    return (
      <div
        className={`${styles.linkWrapper} ${selectedTab === opt.name && !isTablet ? styles.selectedNavigationTab : styles.linkWrapper} ${selectedTab === opt.name && isTablet ? styles.headerHightlight : ""}`}
        key={opt?.display_name}
        id={`nav-title-${index}`}
      >
        <div
          className={styles["linkWrapper-row1"]}
          onClick={() => {
            const isSelectingPaymentOption = selectedTab !== opt.name;
            if (isTablet) {
              handleScrollToTop(index);
              setSelectedTab((prev) => (prev === opt.name ? "" : opt.name));
              setTab(opt.name);
            } else {
              setSelectedTab(opt.name);
              setTab(opt.name);
            }
            removeDialogueError();
            setTab(opt.name);
            toggleMop(opt.name);
            if (isSelectingPaymentOption) {
              if (isTablet) {
                setSelectedPaymentPayload({});
              }
              setNameOnCard("");
              setCardExpiryDate("");
              setCvvNumber("");
              hideNewCard();
              setvpa("");
              setLastValidatedBin("");
              unsetSelectedSubMop();
            }
          }}
        >
          <div
            className={`${selectedTab === opt.name ? styles.indicator : ""} ${styles.onDesktopView}`}
          >
            &nbsp;
          </div>
          <div className={styles.link}>
            <div className={`${styles.icon} ${styles.mopIcon}`}>
              {/* <img src={opt.svg} alt="" /> */}
              {isApplePayNavigationOption && applePayLogo ? (
                <img
                  src={applePayLogo}
                  alt=""
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <SvgWrapper svgSrc={opt.svg}></SvgWrapper>
              )}
            </div>
            <div
              className={`${styles.modeName} ${selectedTab === opt.name ? styles.selectedModeName : ""}`}
            >
              {isTablet && isApplePayNavigationOption
                ? "Apple PAY"
                : translateDynamicLabel(opt?.display_name ?? "", t)}
            </div>
          </div>
          {opt.subMopIcons && !(isTablet && isApplePayNavigationOption) && (
            <div className={styles.subMopIcons}>
              {opt.name === "UPI" && (
                <>
                  <span className={`${styles.subMopIcon} ${styles.upiIcon}`}>
                    <SvgWrapper svgSrc="gpay" />
                  </span>
                  <span className={`${styles.subMopIcon} ${styles.upiIcon}`}>
                    <SvgWrapper svgSrc="phonepe" />
                  </span>
                  <span className={`${styles.subMopIcon} ${styles.upiIcon}`}>
                    <SvgWrapper svgSrc="bhim" />
                  </span>
                </>
              )}
              {opt.subMopIcons !== "UPI" &&
                opt.subMopIcons?.map((subMopIcon) =>
                  subMopIcon ? (
                    <img
                      className={styles.subMopIcon}
                      src={subMopIcon}
                      alt={t("resource.checkout.no_image")}
                      key={subMopIcon}
                    />
                  ) : null,
                )}
            </div>
          )}
          {isTablet && isApplePayNavigationOption ? (
            <div
              className={`${styles.arrowContainer} ${styles.activeIconColor}`}
            >
              <SvgWrapper
                svgSrc={selectedTab === opt.name ? "radio-selected" : "radio"}
              />
            </div>
          ) : (
            <div
              className={`${styles.arrowContainer} ${styles.activeIconColor}`}
            >
              <SvgWrapper
                className={
                  selectedTab === opt.name && activeMop === opt.name
                    ? styles.upsideDown
                    : ""
                }
                svgSrc="accordion-arrow"
              />
            </div>
          )}
        </div>
        {isTablet && activeMop === opt.name && !isApplePayNavigationOption && (
          <div>{selectedTab === opt.name && navigationTab()}</div>
        )}
      </div>
    );
  };

  return (
    <>
      {!enableLinkPaymentOption &&
        (!isCouponValid || showCouponValidityModal) && (
          <Modal
            customClassName={styles.couponValidityModal}
            isOpen={showCouponValidityModal || !isCouponValid}
            title={couponValidity.title || inValidCouponData?.title}
            notCloseOnclickOutside={true}
            closeDialog={() => {
              if (mop === "CARD" && subMop === "newCARD") {
                hideNewCard();
              }
              setShowCouponValidityModal(false);
              setIsCouponValid(true);
              unsetSelectedSubMop();
            }}
          >
            <div className={styles.couponValidity}>
              <p className={styles.message}>
                {couponValidity.message || inValidCouponData?.message}
              </p>
              <div className={styles.select}>
                <div
                  className={`${styles.commonBtn} ${styles.yesBtn}`}
                  onClick={() => {
                    removeCoupon();
                    setShowCouponValidityModal(false);
                    setIsCouponValid(true);
                  }}
                >
                  {t("resource.common.yes")}
                </div>
                <div
                  className={`${styles.commonBtn} ${styles.noBtn}`}
                  onClick={() => {
                    if (mop === "CARD" && subMop === "newCARD") {
                      hideNewCard();
                    }
                    setShowCouponValidityModal(false);
                    setIsCouponValid(true);
                    unsetSelectedSubMop();
                  }}
                >
                  {t("resource.common.no")}
                </div>
              </div>
            </div>
          </Modal>
        )}

      {isLoading ? (
        <div className={styles.container}>
          <CheckoutPaymentSkeleton />
        </div>
      ) : (
        <div
          className={`${styles.container} ${enableLinkPaymentOption ? styles.unsetBorder : ""}`}
        >
          {true ? (
            <>
              {partialPaymentOption?.list[0]?.balance?.account?.status !==
                "INACTIVE" && (
                <div className={styles.creditNote}>
                  <CreditNote
                    data={partialPaymentOption}
                    updateStoreCredits={updateStoreCredits}
                  />
                </div>
              )}

              {creditUpdating ? (
                <CheckoutPaymentSkeleton />
              ) : (
                <div
                  className={`${styles.paymentOptions} ${!getTotalValue() ? styles.displayNone : ""}`}
                >
                  <div className={styles.navigationLink}>
                    {visiblePaymentOptions?.map((opt, index) =>
                      navigationTitle(opt, index),
                    )}
                    {otherPaymentOptions?.length > 0 && (
                      <div
                        className={`${styles.linkWrapper} ${selectedTab === "Other" && !isTablet ? styles.selectedNavigationTab : styles.linkWrapper} ${selectedTab === "Other" && isTablet ? styles.headerHightlight : ""}`}
                      >
                        <div
                          className={styles["linkWrapper-row1"]}
                          onClick={() => {
                            setTab("Other");
                            setSelectedTab("Other");
                            toggleMop("Other");
                          }}
                        >
                          <div
                            className={`${selectedTab === "Other" ? styles.indicator : ""} ${styles.onDesktopView}`}
                          >
                            &nbsp;
                          </div>
                          <div className={styles.link}>
                            <div className={styles.icon}>
                              {/* <img src={opt.svg} alt="" /> */}
                              <SvgWrapper svgSrc="payment-other"></SvgWrapper>
                            </div>
                            <div
                              className={`${styles.modeName} ${selectedTab === "Other" ? styles.selectedModeName : ""}`}
                            >
                              {paymentOptions?.length > 0 &&
                              otherPaymentOptions?.length > 0
                                ? t("resource.checkout.more_payment_options")
                                : t("resource.checkout.pay_online")}
                            </div>
                          </div>
                          <div
                            className={`${styles.arrowContainer}  ${styles.activeIconColor}`}
                          >
                            <SvgWrapper
                              className={
                                selectedTab === "Other" && activeMop === "Other"
                                  ? styles.upsideDown
                                  : ""
                              }
                              svgSrc="accordion-arrow"
                            />
                          </div>
                        </div>
                        {isTablet && activeMop === "Other" && (
                          <div className={` ${styles.onMobileView}`}>
                            {selectedTab === "Other" && navigationTab()}
                          </div>
                        )}
                      </div>
                    )}
                    {codOption && (
                      <div style={{ display: "flex", flex: "1" }}>
                        <div
                          className={`${styles.linkWrapper} ${selectedTab === codOption.name && !isTablet ? styles.selectedNavigationTab : styles.linkWrapper} ${selectedTab === codOption.name && isTablet ? styles.headerHightlight : ""}`}
                          key={codOption?.display_name ?? ""}
                          onClick={() => {
                            selectMop(
                              codOption.name,
                              codOption.name,
                              codOption.name,
                            );
                          }}
                        >
                          <div className={styles["linkWrapper-row1"]}>
                            <div
                              className={` ${selectedTab === codOption.name ? styles.indicator : ""} ${styles.onDesktopView}`}
                            >
                              &nbsp;
                            </div>
                            <div className={styles.link}>
                              <div className={styles.icon}>
                                <SvgWrapper svgSrc={codOption.svg}></SvgWrapper>
                              </div>
                              <div>
                                <div
                                  className={`${styles.modeName} ${selectedTab === codOption.name ? styles.selectedModeName : ""}`}
                                >
                                  {translateDynamicLabel(
                                    codOption?.display_name ?? "",
                                    t,
                                  )}
                                </div>
                                {isTablet && codCharges > 0 && (
                                  <div className={styles.codCharge}>
                                    +
                                    {priceFormatCurrencySymbol(
                                      getCurrencySymbol,
                                      codCharges,
                                    )}{" "}
                                    {t("resource.checkout.extra_charges")}
                                  </div>
                                )}
                              </div>
                            </div>
                            {codOption?.image_src && (
                              <div className={styles["payment-icons"]}>
                                <img
                                  src={codOption?.image_src}
                                  alt={codOption?.svg}
                                />
                              </div>
                            )}
                            <div
                              className={`${styles.arrowContainer} ${styles.activeIconColor} ${styles.codIconContainer}`}
                            >
                              <SvgWrapper svgSrc="accordion-arrow" />
                            </div>
                          </div>
                          {isTablet && (
                            <div>
                              {selectedTab === codOption.name &&
                                navigationTab()}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {!isTablet && (
                    <div
                      className={`${styles.navigationTab} ${styles.onDesktopView}`}
                    >
                      {navigationTab()}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className={styles.container}>
              <CheckoutPaymentSkeleton />
            </div>
          )}
        </div>
      )}
      {isTablet &&
        selectedTab === "APPLEPAY" &&
        shouldShowApplePayOption &&
        renderApplePaySticky()}
    </>
  );
}

export default CheckoutPaymentContent;
