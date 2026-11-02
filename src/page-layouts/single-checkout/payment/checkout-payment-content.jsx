import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { useFPI, useGlobalStore } from "fdk-core/utils";

const APPLE_PAY_EMAIL = "rbl@gofynd.com";
const RAZORPAY_APPLE_PAY_TAG_NAME = "razorpay-checkout";
const RAZORPAY_APPLE_PAY_METHOD = "card";
const RAZORPAY_APPLE_PAY_APP = { name: "apple_pay" };
const RAZORPAY_APPLE_PAY_LOAD_TIMEOUT = 10000;

const formatApplePayContact = (contact) => {
  const value = contact?.toString().trim();
  if (!value) return "";
  if (value.startsWith("+")) return value;

  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length > 10 && digits.length === value.length) return `+${digits}`;
  return value;
};

const isRazorpayApplePayConstructor = (Razorpay) =>
  typeof Razorpay === "function" &&
  typeof Razorpay.prototype?.canMakePayment === "function" &&
  typeof Razorpay.prototype?.createPayment === "function";

const loadRazorpayApplePayScript = ({ requireWebComponent = false } = {}) => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only be loaded in a browser."));
  }

  const hasRazorpayApplePayScript = () =>
    [...document.scripts].some((script) =>
      /checkout\.razorpay\.com\/v1\/razorpay\.js/.test(script.src || "")
    );
  const isRazorpayApplePayComponentReady = () =>
    Boolean(window.customElements?.get(RAZORPAY_APPLE_PAY_TAG_NAME));
  const loadPromiseKey = requireWebComponent
    ? "__rzpApplePayComponentLoadPromise"
    : "__rzpApplePayLoadPromise";
  const getRazorpayConstructor = () => {
    if (isRazorpayApplePayConstructor(window.__rzpApplePay)) {
      return window.__rzpApplePay;
    }
    if (isRazorpayApplePayConstructor(window.Razorpay)) {
      window.__rzpApplePay = window.Razorpay;
      return window.__rzpApplePay;
    }
    return requireWebComponent && typeof window.Razorpay === "function"
      ? window.Razorpay
      : null;
  };
  const isRazorpayReady = () =>
    typeof getRazorpayConstructor() === "function" &&
    hasRazorpayApplePayScript() &&
    (!requireWebComponent || isRazorpayApplePayComponentReady());

  if (isRazorpayReady()) {
    const ApplePayRazorpay = getRazorpayConstructor();
    return Promise.resolve(ApplePayRazorpay);
  }
  if (window[loadPromiseKey]) {
    return window[loadPromiseKey];
  }

  window[loadPromiseKey] = new Promise((resolve, reject) => {
    let interval;
    const timeout = window.setTimeout(() => {
      if (interval) {
        window.clearInterval(interval);
      }
      window[loadPromiseKey] = null;
      const error = new Error(
        requireWebComponent
          ? "Razorpay Apple Pay web component is not available."
          : "Razorpay Apple Pay headless SDK is not available."
      );
      reject(error);
    }, RAZORPAY_APPLE_PAY_LOAD_TIMEOUT);

    const finishWhenReady = () => {
      if (!isRazorpayReady()) return false;

      const ApplePayRazorpay = getRazorpayConstructor();
      window.clearTimeout(timeout);
      window[loadPromiseKey] = null;
      resolve(ApplePayRazorpay);
      return true;
    };

    if (finishWhenReady()) {
      return;
    }

    interval = window.setInterval(() => {
      if (finishWhenReady()) {
        window.clearInterval(interval);
      }
    }, 100);
  });

  return window[loadPromiseKey];
};

const getApplePayEmail = () => APPLE_PAY_EMAIL;

const getApplePayAmountInSubunits = (amount) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return 0;
  return Math.round(numericAmount * 100);
};

const isApplePayAvailable = (eligibility) => eligibility?.available === true;

const getApplePayPaymentData = (response = {}) =>
  response?.paymentData ||
  response?.detail?.paymentData ||
  response?.detail?.payment ||
  response?.payment ||
  response;

const parseConfigData = (data) => {
  if (!data) return {};
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
};

const setApplePayDebugState = (state = {}) => {
  if (typeof window === "undefined") return;
  window.__RZP_APPLE_PAY_STATE__ = {
    ...(window.__RZP_APPLE_PAY_STATE__ || {}),
    ...state,
    updated_at: new Date().toISOString(),
  };
};

const isApplePayOption = (option = {}) =>
  [option.code, option.name, option.display_name, option.merchant_code].some(
    (value) =>
      value?.toString().toLowerCase().replace(/[\s_-]/g, "") === "applepay"
  );

const findApplePayOption = (paymentOptions = []) => {
  for (const paymentOption of paymentOptions || []) {
    const option = paymentOption?.list?.find(isApplePayOption);
    if (option) return { parent: paymentOption, option };
  }
  return null;
};

const getApplePayOptionKey = (applePayPaymentOption) =>
  [
    applePayPaymentOption?.parent?.name,
    applePayPaymentOption?.option?.aggregator_name,
    applePayPaymentOption?.option?.merchant_code,
    applePayPaymentOption?.option?.code,
  ]
    .filter(Boolean)
    .join(":");

const getApplePayEligibilityKey = ({
  applePayPaymentOption,
  cartId,
  addressId,
  billingAddressId,
  amount,
  currencyCode,
  razorpayKey,
}) =>
  [
    cartId,
    getApplePayOptionKey(applePayPaymentOption),
    addressId,
    billingAddressId || addressId,
    amount,
    currencyCode || "INR",
    razorpayKey,
  ]
    .filter(Boolean)
    .join(":");

const getApplePayRazorpayKeyFromConfig = ({
  applePayPaymentOption,
  paymentOption,
  paymentConfig,
}) => {
  const applePayAggregator =
    applePayPaymentOption?.option?.aggregator_name ||
    applePayPaymentOption?.parent?.aggregator_name ||
    "razorpay";
  const normalizedAggregator = applePayAggregator?.toLowerCase();
  const flowData = parseConfigData(
    paymentOption?.payment_flows?.[normalizedAggregator]?.data ||
      paymentOption?.payment_flows?.razorpay?.data
  );
  const aggregatorData = parseConfigData(
    paymentOption?.aggregator_details?.find(
      (item) =>
        item?.aggregator_key?.toLowerCase() === normalizedAggregator ||
        item?.aggregator_key?.toLowerCase() === "razorpay"
    )?.data
  );
  const candidates = [
    paymentConfig?.razorpay?.key,
    paymentConfig?.Razorpay?.key,
    flowData?.key,
    flowData?.merchant_key,
    aggregatorData?.key,
    aggregatorData?.merchant_key,
    paymentConfig?.razorpay?.merchant_key,
    paymentConfig?.Razorpay?.merchant_key,
  ].filter(Boolean);

  return (
    candidates.find((key) => /^rzp_(test|live)_/i.test(key)) || candidates[0]
  );
};

const getApplePayCheckoutCart = (checkoutResponse) =>
  checkoutResponse?.payload?.data?.checkoutCart ||
  checkoutResponse?.data?.checkoutCart ||
  checkoutResponse?.checkoutCart ||
  checkoutResponse;

const normalizeApplePayOrderData = (checkoutCart = {}, fallbackKey = "") => {
  const orderData = checkoutCart?.data || {};
  const contact = formatApplePayContact(orderData?.contact);
  return {
    ...orderData,
    key: orderData?.key || fallbackKey,
    callback_url: orderData?.callback_url || checkoutCart?.callback_url,
    contact,
    email: getApplePayEmail(orderData?.email),
    app: RAZORPAY_APPLE_PAY_APP,
  };
};

const createApplePayCheckoutOrder = async ({ proceedToPay, fallbackKey }) => {

  const checkoutResponse = await proceedToPay("APPLEPAY", {
    silent: true,
  });
  const checkoutCart = getApplePayCheckoutCart(checkoutResponse);
  const orderData = normalizeApplePayOrderData(checkoutCart, fallbackKey);

  if (!checkoutCart?.success || !orderData?.order_id) {
    const error = new Error(
      checkoutCart?.message || "Unable to start Apple Pay."
    );
    throw error;
  }

  return {
    checkoutCart: {
      ...checkoutCart,
      data: orderData,
    },
    orderData,
  };
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
  isCouponValid,
  inValidCouponData,
}) {
  const checkoutPayment = useCheckoutPayment({
    payment,
    handleShowFailedMessage,
    breakUpValues,
    setCancelQrPayment,
    isCouponApplied,
    juspayErrorMessage,
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
    mopSelectionLoading,
  } = payment;

  // destructure exactly what the JSX (and the local prop-bundles) needs
  const {
    // translations & environment
    t,
    isTablet,
    isChromeOrSafari,
    // payment data
    paymentOptions: basePaymentOptions,
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
    validateCouponOnCreditNoteApplied,
    handleProceedToPayClick,
  } = checkoutPayment;

  const [searchParams] = useSearchParams();
  const cart_id = searchParams.get("id");
  const address_id = searchParams.get("address_id");
  const billing_address_id = searchParams.get("billing_address_id");
  const fpi = useFPI();
  const paymentConfig = useGlobalStore(fpi?.getters?.AGGREGATORS_CONFIG);
  const cartData = useGlobalStore(fpi?.getters?.CART_ITEMS);
  const currencyCode = cartData?.currency?.code || "INR";
  let paymentOptions = basePaymentOptions;
  const applePayPaymentOption = useMemo(
    () => findApplePayOption(paymentOption?.payment_option),
    [paymentOption]
  );

  const applePayContainerRef = useRef(null);
  const applePayComponentRef = useRef(null);
  const applePayAttemptedOrdersRef = useRef(new Set());
  const applePayInitializationRef = useRef(false);
  const applePayRequestIdRef = useRef(0);
  const applePayCallbackSubmittedRef = useRef(false);
  const applePayPaymentInFlightRef = useRef(false);
  const applePayContextRef = useRef(null);
  const applePayOrderRef = useRef(null);
  const applePayRazorpayRef = useRef(null);
  const applePayEligibilityKeyRef = useRef("");
  const [applePayOrder, setApplePayOrder] = useState(null);
  const [isApplePayScriptLoaded, setIsApplePayScriptLoaded] = useState(false);
  const [applePayStatus, setApplePayStatus] = useState("idle");
  const [applePayMobileEligibility, setApplePayMobileEligibility] =
    useState("idle");
  const [isApplePayViewportReady, setIsApplePayViewportReady] = useState(false);

  useEffect(() => {
    setIsApplePayViewportReady(true);
  }, []);
  const shouldShowApplePayOption =
    Boolean(applePayPaymentOption) &&
    !enableLinkPaymentOption &&
    (!isTablet || applePayMobileEligibility === "available") &&
    applePayStatus !== "unavailable";
  const applePayLogoUrl = applePayPaymentOption?.option?.logo_url?.small;
  if (applePayLogoUrl) {
    paymentOptions = paymentOptions?.map((option) =>
      option?.name === "WL"
        ? {
            ...option,
            subMopIcons: option?.subMopIcons?.filter(
              (icon) => icon !== applePayLogoUrl
            ),
          }
        : option
    );
  }
  const cardOptionIndex = paymentOptions?.findIndex(
    (option) => option.name === "CARD"
  );
  const applePayParentOption =
    shouldShowApplePayOption
      ? {
          display_name: "Apple Pay",
          name: "APPLEPAY",
          svg: "wallet",
          subMopIcons: applePayLogoUrl ? [applePayLogoUrl] : [],
        }
      : null;

  if (applePayParentOption) {
    paymentOptions =
      cardOptionIndex >= 0
        ? [
            ...paymentOptions.slice(0, cardOptionIndex + 1),
            applePayParentOption,
            ...paymentOptions.slice(cardOptionIndex + 1),
          ]
        : [applePayParentOption, ...paymentOptions];
  }

  const applePayAmount = getTotalValue?.();
  const applePayRazorpayKey = getApplePayRazorpayKeyFromConfig({
    applePayPaymentOption,
    paymentOption,
    paymentConfig,
  });
  const applePayEligibilityKey = getApplePayEligibilityKey({
    applePayPaymentOption,
    cartId: cart_id,
    addressId: address_id,
    billingAddressId: billing_address_id,
    amount: applePayAmount,
    currencyCode,
    razorpayKey: applePayRazorpayKey,
  });
  applePayContextRef.current = {
    key: applePayEligibilityKey,
    isTablet,
    isPaymentLoading,
    checkoutError: disbaleCheckout?.message,
  };
  const isApplePaySubmitting = applePayStatus === "submitting";

  const resetApplePay = () => {
    applePayRequestIdRef.current += 1;
    applePayInitializationRef.current = false;
    applePayCallbackSubmittedRef.current = false;
    applePayPaymentInFlightRef.current = false;
    applePayOrderRef.current = null;
    applePayRazorpayRef.current = null;
    applePayEligibilityKeyRef.current = "";
    setApplePayOrder(null);
    setIsApplePayScriptLoaded(false);
    setApplePayStatus("idle");
    setApplePayMobileEligibility("idle");
    setApplePayDebugState({
      status: "idle",
      available: false,
      eligibility: null,
      can_make_payment_request: null,
      can_make_payment_response: null,
      create_payment_request: null,
    });
  };

  const submitApplePayCallback = (response, orderData) => {
    if (applePayCallbackSubmittedRef.current) {
      return;
    }

    const paymentData = getApplePayPaymentData(response);
    const callbackOrderData = orderData || applePayOrderRef.current?.data;
    const requiredFields = [
      "razorpay_payment_id",
      "razorpay_order_id",
      "razorpay_signature",
    ];
    const hasRequiredPaymentData = requiredFields.every(
      (field) => paymentData?.[field]
    );
    const matchesPreparedOrder =
      paymentData?.razorpay_order_id === callbackOrderData?.order_id;

    if (
      !hasRequiredPaymentData ||
      !callbackOrderData?.callback_url ||
      !matchesPreparedOrder
    ) {
      handleShowFailedMessage({
        failed: true,
        paymentErrMsg:
          "Apple Pay completed, but payment confirmation data is incomplete.",
      });
      applePayPaymentInFlightRef.current = false;
      setApplePayStatus("ready");
      return;
    }

    applePayCallbackSubmittedRef.current = true;
    setApplePayStatus("submitting");

    const callbackForm = document.createElement("form");
    callbackForm.method = "POST";
    callbackForm.action = callbackOrderData.callback_url;
    callbackForm.style.display = "none";
    requiredFields.forEach((field) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = field;
      input.value = paymentData[field];
      callbackForm.appendChild(input);
    });
    document.body.appendChild(callbackForm);
    callbackForm.submit();
  };

  const handleApplePayFailure = (response = {}) => {
    if (applePayCallbackSubmittedRef.current) {
      return;
    }
    applePayCallbackSubmittedRef.current = false;
    applePayPaymentInFlightRef.current = false;
    setApplePayStatus("ready");

    const error = response?.error || response;
    const errorCode = error?.code || error?.reason || error?.errorCode;
    const isCancelled =
      errorCode === "PAYMENT_CANCELLED" ||
      errorCode === "payment_cancelled" ||
      error?.reason === "payment_cancelled";
    const message = isCancelled
      ? "Apple Pay was cancelled. You can try again or choose another payment method."
      : error?.description || error?.message || "Apple Pay payment failed.";

    handleShowFailedMessage({
      failed: true,
      paymentErrMsg: message,
    });
  };

  const createApplePayOrderData = async (requestId) => {
    const { checkoutCart, orderData } = await createApplePayCheckoutOrder({
      proceedToPay,
      fallbackKey: applePayRazorpayKey,
    });

    if (applePayRequestIdRef.current !== requestId) return null;

    if (!checkoutCart?.success || !orderData?.order_id) {
      const error = new Error(
        checkoutCart?.message || "Unable to start Apple Pay."
      );
      throw error;
    }

    const missingConfiguration = [
      ["key", orderData.key],
      ["order_id", orderData.order_id],
      ["callback_url", orderData.callback_url],
    ].find(([, value]) => !value)?.[0];

    if (missingConfiguration) {
      const error = new Error(
        `Apple Pay configuration is missing ${missingConfiguration}.`
      );
      throw error;
    }

    const normalizedOrder = {
      ...checkoutCart,
      data: orderData,
    };
    applePayOrderRef.current = normalizedOrder;
    setApplePayOrder(normalizedOrder);
    setApplePayDebugState({
      order_created: true,
      has_order_id: Boolean(orderData.order_id),
      has_callback_url: Boolean(orderData.callback_url),
      key_source: "checkout_order",
    });

    return orderData;
  };

  const createApplePayRazorpayInstance = (Razorpay, orderData) => {
    const contact = formatApplePayContact(orderData.contact);
    if (!contact) {
      setApplePayStatus("waiting_for_contact");
      setApplePayMobileEligibility("waiting_for_contact");
      setApplePayDebugState({
        status: "waiting_for_contact",
        has_contact: false,
        has_prefill_contact: false,
        available: false,
        can_make_payment_request: null,
        can_make_payment_response: null,
      });
      return null;
    }

    const amount = Number(
      orderData.amount || getApplePayAmountInSubunits(applePayAmount)
    );
    const currency = (orderData.currency || currencyCode || "INR")
      .toString()
      .trim()
      .toUpperCase();
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw new Error("Apple Pay requires a positive amount in currency subunits.");
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new Error("Apple Pay currency is invalid.");
    }
    if (
      amount !== getApplePayAmountInSubunits(applePayAmount) ||
      currency !== (currencyCode || "INR").toString().trim().toUpperCase()
    ) {
      throw new Error("Checkout total or currency has changed. Please try again.");
    }

    const email = getApplePayEmail(orderData.email);
    const razorpayOptions = {
      key: orderData.key,
      order_id: orderData.order_id,
      amount,
      currency,
      prefill: { contact, email },
      email,
      on_payment_initiate_create_order: async () => {
        try {
          if (
            applePayContextRef.current?.key !== applePayEligibilityKey ||
            !applePayContextRef.current?.isTablet ||
            applePayRazorpayRef.current !== razorpay
          ) {
            throw new Error("Checkout has changed. Please try Apple Pay again.");
          }
          // The headless SDK invokes this hook even for a prepared order.
          razorpay.set("order_id", orderData.order_id);
          setApplePayDebugState({
            payment_order_attached: true,
            payment_order_id: orderData.order_id,
          });
        } catch (error) {
          if (applePayRazorpayRef.current === razorpay) {
            handleApplePayFailure(error);
          }
          throw error;
        }
      },
      handler: (response) => handleSuccess(response),
    };

    setApplePayDebugState({
      has_contact: Boolean(razorpayOptions.prefill.contact),
      has_prefill_contact: Boolean(razorpayOptions.prefill.contact),
      prefill_contact_type: typeof razorpayOptions.prefill.contact,
      has_prefill_email: Boolean(razorpayOptions.prefill.email),
      prefill_email_type: typeof razorpayOptions.prefill.email,
    });

    const razorpay = new Razorpay(razorpayOptions);

    if (
      typeof razorpay?.canMakePayment !== "function" ||
      typeof razorpay?.createPayment !== "function" ||
      typeof razorpay?.set !== "function" ||
      typeof razorpay?.on !== "function"
    ) {
      throw new Error("Razorpay Apple Pay SDK does not expose the required methods.");
    }
    const handleSuccess = (response) => {
      if (applePayRazorpayRef.current !== razorpay) {
        return;
      }
      submitApplePayCallback(response, orderData);
    };
    const handleFailure = (response) => {
      if (applePayRazorpayRef.current !== razorpay) {
        return;
      }
      handleApplePayFailure(response);
    };
    razorpay.on("payment.success", handleSuccess);
    razorpay.on("payment.failure", handleFailure);
    razorpay.on("payment.error", handleFailure);

    return razorpay;
  };

  const checkMobileApplePayEligibility = async ({ force = false } = {}) => {
    if (applePayPaymentInFlightRef.current) return;
    if (applePayInitializationRef.current) return;
    if (
      applePayMobileEligibility === "available" &&
      applePayEligibilityKeyRef.current === applePayEligibilityKey &&
      !force
    ) {
      return;
    }

    const requestId = applePayRequestIdRef.current + 1;
    applePayRequestIdRef.current = requestId;
    applePayInitializationRef.current = true;
    applePayCallbackSubmittedRef.current = false;
    applePayOrderRef.current = null;
    applePayRazorpayRef.current = null;
    applePayEligibilityKeyRef.current = "";
    setApplePayOrder(null);
    setIsApplePayScriptLoaded(false);
    setApplePayStatus("checking");
    setApplePayMobileEligibility("checking");
    setApplePayDebugState({
      status: "checking",
      mobile_tablet_gate: true,
      using_web_component: true,
      web_component_visible: false,
      web_component_error: null,
      has_backend_option: Boolean(applePayPaymentOption),
      has_amount: Boolean(applePayAmount),
      currency: currencyCode || "INR",
      create_payment_request: null,
      can_make_payment_request: null,
      can_make_payment_response: null,
    });

    try {
      const orderData = await createApplePayOrderData(requestId);
      if (applePayRequestIdRef.current !== requestId) return;

      if (applePayAttemptedOrdersRef.current.has(orderData.order_id)) {
        throw new Error(
          "A fresh Apple Pay order is required. Please refresh checkout before trying again."
        );
      }

      const Razorpay = await loadRazorpayApplePayScript({
        requireWebComponent: true,
      });
      if (applePayRequestIdRef.current !== requestId) return;

      if (typeof Razorpay !== "function") {
        throw new Error("Razorpay Apple Pay SDK is unavailable.");
      }

      const razorpay = createApplePayRazorpayInstance(Razorpay, orderData);
      if (!razorpay) return;

      if (typeof razorpay?.canMakePayment !== "function") {
        throw new Error("Razorpay Apple Pay SDK is unavailable.");
      }

      const canMakePaymentPayload = {
        method: RAZORPAY_APPLE_PAY_METHOD,
        app: RAZORPAY_APPLE_PAY_APP,
      };
      setApplePayDebugState({
        can_make_payment_request: canMakePaymentPayload,
      });

      let eligibility;
      try {
        eligibility = await razorpay.canMakePayment(canMakePaymentPayload);
      } catch (error) {
        if (applePayRequestIdRef.current !== requestId) return;
        setApplePayDebugState({
          can_make_payment_error:
            error?.message || error?.description || error?.toString?.(),
        });
        throw error;
      }
      if (applePayRequestIdRef.current !== requestId) return;

      const available = isApplePayAvailable(eligibility);
      setApplePayDebugState({
        status: available ? "ready" : "unavailable",
        mobile_tablet_gate: true,
        using_web_component: true,
        web_component_visible: false,
        web_component_error: null,
        can_make_payment_request: canMakePaymentPayload,
        can_make_payment_response: eligibility,
        eligibility,
        available,
      });

      if (!available) {
        applePayRazorpayRef.current = null;
        applePayOrderRef.current = null;
        applePayEligibilityKeyRef.current = "";
        setApplePayOrder(null);
        setIsApplePayScriptLoaded(false);
        setApplePayStatus("unavailable");
        setApplePayMobileEligibility("unavailable");
        if (selectedTab === "APPLEPAY") {
          setSelectedTab("");
          setTab("");
          toggleMop(activeMop);
        }
        return;
      }

      applePayEligibilityKeyRef.current = applePayEligibilityKey;
      applePayRazorpayRef.current = razorpay;
      setIsApplePayScriptLoaded(true);
      setApplePayStatus("ready");
      setApplePayMobileEligibility("available");
    } catch (error) {
      if (applePayRequestIdRef.current !== requestId) return;
      applePayRazorpayRef.current = null;
      applePayOrderRef.current = null;
      applePayEligibilityKeyRef.current = "";
      setApplePayOrder(null);
      setIsApplePayScriptLoaded(false);
      setApplePayStatus("error");
      setApplePayMobileEligibility("error");
      setApplePayDebugState({
        status: "error",
        mobile_tablet_gate: true,
        error: error?.message || String(error),
      });
      if (selectedTab === "APPLEPAY") {
        setSelectedTab("");
        setTab("");
        toggleMop(activeMop);
      }
    } finally {
      if (applePayRequestIdRef.current === requestId) {
        applePayInitializationRef.current = false;
      }
    }
  };

  const initializeApplePay = async ({ force = false } = {}) => {
    if (applePayPaymentInFlightRef.current) return;
    if (applePayInitializationRef.current) return;
    if (
      applePayOrderRef.current &&
      (applePayStatus === "ready" || applePayStatus === "mounting") &&
      applePayEligibilityKeyRef.current === applePayEligibilityKey &&
      !force
    ) {
      return;
    }

    const requestId = applePayRequestIdRef.current + 1;
    applePayRequestIdRef.current = requestId;
    applePayInitializationRef.current = true;
    applePayCallbackSubmittedRef.current = false;
    applePayOrderRef.current = null;
    applePayRazorpayRef.current = null;
    setApplePayOrder(null);
    setIsApplePayScriptLoaded(false);
    setApplePayStatus("loading");
    setApplePayDebugState({
      status: "loading",
      has_backend_option: Boolean(applePayPaymentOption),
      has_amount: Boolean(applePayAmount),
      currency: currencyCode || "INR",
    });

    try {
      const orderData = await createApplePayOrderData(requestId);
      if (applePayRequestIdRef.current !== requestId) return;

      setApplePayDebugState({
        has_config_key: Boolean(orderData.key),
        has_order_id: Boolean(orderData.order_id),
        amount: orderData.amount || getApplePayAmountInSubunits(applePayAmount),
        using_web_component: true,
      });

      await loadRazorpayApplePayScript({ requireWebComponent: true });
      if (applePayRequestIdRef.current !== requestId) return;

      applePayEligibilityKeyRef.current = applePayEligibilityKey;
      setIsApplePayScriptLoaded(true);
      setApplePayStatus("mounting");
    } catch (error) {
      if (applePayRequestIdRef.current !== requestId) return;
      applePayRazorpayRef.current = null;
      applePayOrderRef.current = null;
      applePayEligibilityKeyRef.current = "";
      setApplePayOrder(null);
      setIsApplePayScriptLoaded(false);
      setApplePayStatus("error");
      setApplePayDebugState({
        status: "error",
        error: error?.message || String(error),
      });
    } finally {
      if (applePayRequestIdRef.current === requestId) {
        applePayInitializationRef.current = false;
      }
    }
  };

  useEffect(() => {
    const container = applePayContainerRef.current;
    const orderData = applePayOrder?.data;
    if (
      selectedTab !== "APPLEPAY" ||
      !container ||
      !isApplePayScriptLoaded ||
      !orderData
    ) {
      return undefined;
    }

    const checkoutElement = document.createElement(
      RAZORPAY_APPLE_PAY_TAG_NAME
    );
    const componentContextKey = applePayEligibilityKey;
    const isCurrentComponent = () =>
      applePayComponentRef.current === checkoutElement &&
      applePayContextRef.current?.key === componentContextKey &&
      applePayContextRef.current?.isTablet === isTablet &&
      applePayOrderRef.current?.data === orderData;
    let eligibilityTimer;
    let receivedTerminalEvent = false;
    const stopReadinessTimer = () => window.clearInterval(eligibilityTimer);
    checkoutElement.id = "checkout";
    checkoutElement.setAttribute("key", orderData.key);
    checkoutElement.setAttribute("order-id", orderData.order_id);
    checkoutElement.setAttribute("contact", orderData.contact);
    checkoutElement.setAttribute("email", orderData.email || APPLE_PAY_EMAIL);
    checkoutElement.setAttribute(
      "method",
      orderData.method || RAZORPAY_APPLE_PAY_METHOD
    );
    checkoutElement.setAttribute(
      "app-name",
      orderData.app?.name?.replace("applepay", "apple_pay") ||
        RAZORPAY_APPLE_PAY_APP.name
    );
    checkoutElement.setAttribute("button-label", "pay");
    checkoutElement.setAttribute("button-theme", "dark");
    checkoutElement.setAttribute("button-width", isTablet ? "100%" : "148px");
    checkoutElement.setAttribute("button-height", isTablet ? "48px" : "32px");
    if (isTablet) {
      checkoutElement.style.display = "block";
      checkoutElement.style.width = "100%";
    }

    const handleClick = (event) => {
      const isPaymentButtonClick = event
        .composedPath()
        .some((element) => element?.tagName === "APPLE-PAY-BUTTON");
      if (!isPaymentButtonClick) return;

      if (
        !isCurrentComponent() ||
        applePayPaymentInFlightRef.current ||
        applePayCallbackSubmittedRef.current ||
        applePayContextRef.current?.isPaymentLoading
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (applePayContextRef.current?.checkoutError) {
        event.preventDefault();
        event.stopImmediatePropagation();
        handleShowFailedMessage({
          failed: true,
          paymentErrHeading: t("resource.checkout.please_try_again_later"),
          paymentErrMsg: applePayContextRef.current.checkoutError,
        });
        return;
      }

      removeDialogueError();
      stopReadinessTimer();
      applePayPaymentInFlightRef.current = true;
      applePayAttemptedOrdersRef.current.add(orderData.order_id);
      setApplePayStatus("submitting");
      const input = {
        method: checkoutElement.getAttribute("method"),
        app: { name: checkoutElement.getAttribute("app-name") },
        order_id: checkoutElement.getAttribute("order-id"),
        has_contact: Boolean(checkoutElement.getAttribute("contact")),
        has_email: Boolean(checkoutElement.getAttribute("email")),
      };
      setApplePayDebugState({
        status: "submitting",
        using_web_component: true,
        create_payment_request: null,
        web_component_input: input,
      });
      // The trusted click continues to Razorpay's own button handler.
    };

    const handleSuccess = (event) => {
      if (!isCurrentComponent()) return;
      receivedTerminalEvent = true;
      stopReadinessTimer();
      submitApplePayCallback(event, orderData);
    };

    const handleFailure = (event) => {
      if (!isCurrentComponent() || applePayCallbackSubmittedRef.current) return;
      receivedTerminalEvent = true;
      stopReadinessTimer();
      const error = event?.detail?.error || event?.detail || event || {};
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
      const isUnavailable =
        errorText.includes("not available") ||
        errorText.includes("unsupported") ||
        errorText.includes("cannot make payment") ||
        errorText.includes("can not make payment");

      if (isUnavailable) {
        applePayPaymentInFlightRef.current = false;
        setApplePayStatus("unavailable");
        if (isTablet) setApplePayMobileEligibility("unavailable");
        setApplePayDebugState({
          status: "unavailable",
          web_component_error: errorText,
        });
        if (selectedTab === "APPLEPAY") {
          setSelectedTab("");
          setTab("");
          toggleMop(activeMop);
        }
        return;
      }

      const wasSubmitting = applePayPaymentInFlightRef.current;
      handleApplePayFailure(error);
      if (isTablet) {
        setApplePayStatus("error");
        if (wasSubmitting) {
          checkMobileApplePayEligibility({ force: true });
        }
      }
    };

    checkoutElement.addEventListener("paymentsuccess", handleSuccess);
    checkoutElement.addEventListener("payment.success", handleSuccess);
    checkoutElement.addEventListener("paymentfailure", handleFailure);
    checkoutElement.addEventListener("payment.failure", handleFailure);
    checkoutElement.addEventListener("error", handleFailure);
    checkoutElement.addEventListener("click", handleClick, true);
    applePayComponentRef.current = checkoutElement;
    if (isTablet) setApplePayStatus("mounting");
    container.replaceChildren(checkoutElement);

    let attempts = 0;
    eligibilityTimer = window.setInterval(() => {
      if (
        !isCurrentComponent() ||
        receivedTerminalEvent ||
        applePayPaymentInFlightRef.current
      ) {
        stopReadinessTimer();
        return;
      }
      attempts += 1;
      if (checkoutElement.getBoundingClientRect().height > 0) {
        window.clearInterval(eligibilityTimer);
        setApplePayStatus("ready");
        setApplePayDebugState({
          status: "ready",
          web_component_visible: true,
        });
        return;
      }

      if (attempts >= 150) {
        window.clearInterval(eligibilityTimer);
        setApplePayStatus("unavailable");
        setApplePayDebugState({
          status: "unavailable",
          web_component_visible: false,
        });
        if (selectedTab === "APPLEPAY") {
          setSelectedTab("");
          setTab("");
          toggleMop(activeMop);
        }
      }
    }, 100);

    return () => {
      stopReadinessTimer();
      checkoutElement.removeEventListener("paymentsuccess", handleSuccess);
      checkoutElement.removeEventListener("payment.success", handleSuccess);
      checkoutElement.removeEventListener("paymentfailure", handleFailure);
      checkoutElement.removeEventListener("payment.failure", handleFailure);
      checkoutElement.removeEventListener("error", handleFailure);
      checkoutElement.removeEventListener("click", handleClick, true);
      if (applePayComponentRef.current === checkoutElement) {
        applePayComponentRef.current = null;
      }
      if (container.contains(checkoutElement)) {
        container.replaceChildren();
      }
    };
  }, [
    applePayOrder,
    isApplePayScriptLoaded,
    isTablet,
    selectedTab,
    applePayEligibilityKey,
  ]);

  useEffect(() => {
    if (!isApplePayViewportReady || isApplePaySubmitting) return;

    if (!applePayPaymentOption || enableLinkPaymentOption || !applePayAmount) {
      resetApplePay();
      return;
    }

    if (isTablet) {
      checkMobileApplePayEligibility();
    } else {
      initializeApplePay();
    }

    return () => {
      // Invalidated requests cannot publish an order or unlock a newer request.
      applePayRequestIdRef.current += 1;
      applePayInitializationRef.current = false;
    };
  }, [
    applePayEligibilityKey,
    enableLinkPaymentOption,
    isTablet,
    isApplePayViewportReady,
    isApplePaySubmitting,
  ]);

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
    mopSelectionLoading,
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

  const renderApplePayStickyPayNow = () => (
    <StickyPayNow
      customClassName={`${styles.visibleOnTab} ${styles.applePayStickyFooter}`}
      value={priceFormatCurrencySymbol(getCurrencySymbol, getTotalValue())}
      onPriceDetailsClick={onPriceDetailsClick}
      enableLinkPaymentOption={enableLinkPaymentOption}
      isPaymentLoading={isPaymentLoading || applePayStatus === "submitting"}
      loader={loader}
      paymentButton={
        <div className={styles.applePayStickyButton} aria-busy={applePayStatus !== "ready"}>
          <div
            ref={applePayContainerRef}
            className={styles.applePayStickyComponent}
            inert={applePayStatus === "submitting" || applePayStatus === "error" || isPaymentLoading ? "" : undefined}
          />
          {applePayStatus === "error" ? (
            <button type="button" className={styles.applePayRetryButton} onClick={() => checkMobileApplePayEligibility({ force: true })}>
              Retry Apple Pay
            </button>
          ) : applePayStatus !== "ready" ? (
            <div className={styles.applePayStickyLoader} role="status" aria-label="Loading Apple Pay">{loader}</div>
          ) : null}
        </div>
      }
    />
  );

  const navigationTab = () => {
    switch (selectedTab) {
      case "APPLEPAY": {
        if (isTablet) return null;
        const applePayLogo = applePayPaymentOption?.option?.logo_url?.small;
        const isApplePayLoading = ["waiting_for_sdk", "checking", "loading", "mounting"].includes(applePayStatus);
        return (
          <div className={styles.modeOption}>
            <div className={`${styles.modeItemWrapper} ${styles.selectedBorder} ${styles.applePayModeItemWrapper}`} onClick={removeDialogueError}>
              <label>
                <div className={styles.modeItem}>
                  <div className={styles.logoNameContainer}>
                    <div className={styles.modeItemLogo}>{applePayLogo ? <img src={applePayLogo} alt="Apple Pay" /> : <SvgWrapper svgSrc="wallet" />}</div>
                    <div className={styles.modeItemName}>Apple Pay</div>
                  </div>
                  <div className={`${styles.walletLeft} ${styles.onMobileView}`}><SvgWrapper svgSrc="radio-selected" /></div>
                </div>
              </label>
              <div className={`${styles.modePay} ${styles.applePayModePay}`}>
                {isApplePayLoading && <div className={styles.applePayLoader}>{loader}</div>}
                <div ref={applePayContainerRef} className={styles.applePayWrapper} />
              </div>
            </div>
          </div>
        );
      }
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
            selectedTabData={{ ...selectedTabData, list: selectedTabData?.list?.filter((option) => !isApplePayOption(option)) }}
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
              selectedTab={selectedTab}
              handleProceedToPayClick={handleProceedToPayClick}
              isCouponApplied={isCouponApplied}
              isCouponValid={isCouponValid}
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
            isCouponValid={isCouponValid}
            mopSelectionLoading={mopSelectionLoading}
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
                              "en-IN",
                              null,
                              true
                            )}
                            disabled={mopSelectionLoading}
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
                            disabled={mopSelectionLoading || isPaymentLoading}
                          >
                            {!isPaymentLoading ? (
                              <>
                                {t("resource.common.pay_caps")}{" "}
                                {priceFormatCurrencySymbol(
                                  getCurrencySymbol,
                                  getTotalValue(),
                                  "en-IN",
                                  null,
                                  true
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
    return (
      <div
        className={`${styles.linkWrapper} ${selectedTab === opt.name && !isTablet ? styles.selectedNavigationTab : styles.linkWrapper} ${selectedTab === opt.name && isTablet ? styles.headerHightlight : ""}`}
        key={opt?.display_name}
        id={`nav-title-${index}`}
      >
        <div
          className={styles["linkWrapper-row1"]}
          onClick={() => {
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
            if (selectedTab !== opt.name) {
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
              <SvgWrapper svgSrc={opt.svg}></SvgWrapper>
            </div>
            <div
              className={`${styles.modeName} ${selectedTab === opt.name ? styles.selectedModeName : ""}`}
            >
              {translateDynamicLabel(opt?.display_name ?? "", t)}
            </div>
          </div>
          {opt.subMopIcons && (
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
                  ) : null
                )}
            </div>
          )}
          <div
            className={`${styles.arrowContainer} ${styles.activeIconColor} `}
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
        </div>
        {isTablet && activeMop === opt.name && (
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
              fpi.custom.setValue("isCouponValid", true);
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
                    fpi.custom.setValue("isCouponValid", true);
                    if (
                      !selectedUpiIntentApp &&
                      selectedTab === "UPI" &&
                      isTablet
                    ) {
                      setSelectedUpiIntentApp("gpay");
                    }
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
                    fpi.custom.setValue("isCouponValid", true);
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
                    validateCouponOnCreditNoteApplied={
                      validateCouponOnCreditNoteApplied
                    }
                    isCouponApplied={isCouponApplied}
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
                    {paymentOptions?.map((opt, index) =>
                      navigationTitle(opt, index)
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
                              codOption.name
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
                                    t
                                  )}
                                </div>
                                {isTablet && codCharges > 0 && (
                                  <div className={styles.codCharge}>
                                    +
                                    {priceFormatCurrencySymbol(
                                      getCurrencySymbol,
                                      codCharges,
                                      "en-IN",
                                      null,
                                      true
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
      {isTablet && selectedTab === "APPLEPAY" && renderApplePayStickyPayNow()}
    </>
  );
}

export default CheckoutPaymentContent;
