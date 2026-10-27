import React, { useEffect, useRef, useState, useMemo } from "react";
import * as styles from "./checkout-payment-content.less";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import { useSearchParams } from "react-router-dom";
import cardValidator from "card-validator";
import Modal from "../../../components/core/modal/modal";
import { useMobile } from "../../../helper/hooks/useMobile";
import { useViewport } from "../../../helper/hooks";
// import UktModal from "./ukt-modal";
import StickyPayNow from "./sticky-pay-now/sticky-pay-now";
import CreditNote from "./credit-note/credit-note";
import NoPaymentOptionSvg from "../../../assets/images/no-payment-option.svg";
import {
  priceFormatCurrencySymbol,
  translateDynamicLabel,
} from "../../../helper/utils";
import {
  useGlobalStore,
  useGlobalTranslation,
  useFPI,
  useNavigate,
} from "fdk-core/utils";
import Spinner from "../../../components/spinner/spinner";
import FyButton from "../../../components/core/fy-button/fy-button";
import { FDKLink } from "fdk-core/components";

const upiDisplayWrapperStyle = {
  padding: "24px",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const upiHeadingStyle = {
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "140%",
  textAlign: "center",
  color: "var(--textHeading)",
};

const upiVpaStyle = {
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "140%",
  textAlign: "center",
  marginTop: "16px",
  color: "var(--textBody)",
};

const upiLabelWrapperStyle = {
  margin: "16px 0px",
};

const timeDisplayStyle = {
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "140%",
  textAlign: "center",
  color: "var(--textBody)",
  marginBottom: "16px",
};

const timeDisplaySpanStyle = {
  borderRadius: "40px",
  border: "0.5px solid var(--successText)",
  backgroundColor: "var(--successBackground)",
  padding: "2px 7px",
  fontSize: "12px",
  fontWeight: 600,
  lineHeight: "140%",
  color: "var(--successText)",
};

const cancelBtnStyle = {
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
  lineHeight: "140%",
  textTransform: "uppercase",
  textAlign: "center",
  color: "var(--buttonLink)",
};

const UPI_INVALID_VPA_ERROR = "resource.checkout.please_enter_correct_upi_id";
import CardForm from "./card-form";
import Shimmer from "../../../components/shimmer/shimmer";
import CheckoutPaymentSkeleton from "./checkout-payment-skeleton";

export const CREDIT_CARD_MASK = [
  {
    mask: "0000 000000 00000",
    cardtype: "american-express",
  },
  {
    mask: "0000 0000 0000 0000",
    cardtype: "discover",
  },
  {
    mask: "0000 000000 0000",
    cardtype: "diners-club",
  },
  {
    mask: "0000 0000 0000 0000",
    cardtype: "mastercard",
  },

  {
    mask: "0000 000000 00000",
    cardtype: "jcb15",
  },
  {
    mask: "0000 0000 0000 0000",
    cardtype: "jcb",
  },
  {
    mask: "0000 0000 0000 0000",
    cardtype: "maestro",
  },
  {
    mask: "0000 0000 0000 0000",
    cardtype: "visa",
  },
  {
    mask: "0000 0000 0000 0000",
    cardtype: "unionpay",
  },
  {
    mask: "0000 0000 0000 0000",
    cardtype: "rupay",
  },
  {
    mask: "0000 0000 0000 0000",
    cardtype: "Unknown",
  },
];

var cardnumber_mask;
var expirationdate_mask;
var name;
var numberValidation;

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
  setMopPayload,
  isCouponValid,
  setIsCouponValid,
  inValidCouponData,
}) {
  const fpi = useFPI();
  const { language } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  const { t } = useGlobalTranslation("translation");
  const {
    selectedTab,
    selectedTabData,
    proceedToPay,
    getTotalValue,
    currencyCode,
    PaymentOptionsList,
    setSelectedTab,
    getCurrencySymbol,
    loggedIn,
    paymentOption,
    paymentConfig,
    isLoading,
    isQrCodeLoading,
    handleIsQrCodeLoading,
    getUPIIntentApps,
    cardDetails,
    checkAndUpdatePaymentStatus,
    cancelPayment,
    otherOptions,
    setUPIError,
    isUPIError,
    Loader,
    validateCoupon,
    selectPaymentMode,
    showUpiRedirectionModal,
    validateCardDetails,
    setShowUpiRedirectionModal,
    enableLinkPaymentOption,
    partialPaymentOption,
    updateStoreCredits,
    creditUpdating,
    isPaymentLoading,
  } = payment;


  useEffect(() => {
    if (enableLinkPaymentOption && selectedTab) {
      setActiveMop(selectedTab);
    }
  }, [selectedTab]);
  const isChromeOrSafari =
    /Chrome/.test(navigator.userAgent) ||
    /Safari/.test(navigator.userAgent) ||
    /Instagram/.test(navigator.userAgent);

  let paymentOptions = PaymentOptionsList();
  let codOption = paymentOptions?.filter((opt) => opt.name === "COD")[0];
  paymentOptions = paymentOptions?.filter((opt) => opt.name !== "COD");
  const applePayPaymentOption = useMemo(
    () => findApplePayOption(paymentOption?.payment_option),
    [paymentOption]
  );
  let upiSuggestions = paymentOption?.payment_option?.find?.(
    (ele) => ele.name === "UPI"
  )?.suggested_list || ["okhdfcbank", "okicici", "oksbi"];

  //card
  const [addNewCard, setAddNewCard] = useState(false);
  const [cardExpiryDate, setCardExpiryDate] = useState("");
  const [cvvNumber, setCvvNumber] = useState("");
  const [showError, setShowError] = useState(false);
  const [cardNumberError, setCardNumberError] = useState(false);
  const [cardExpiryError, setCardExpiryError] = useState(false);
  const [cardCVVError, setCardCVVError] = useState(false);
  const [cardNameError, setCardNameError] = useState(false);
  const [isCardSecure, setIsCardSecure] = useState(true);
  const [isSavedCardSecure, setIsSavedCardSecure] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cart_id = searchParams.get("id");
  const address_id = searchParams.get("address_id");
  const billing_address_id = searchParams.get("billing_address_id");
  const nameRef = useRef(null);
  const cardNumberRef = useRef(null);
  const expirationDateRef = useRef(null);
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
  const [filteredUPISuggestions, setFilteredUPISuggestions] = useState([]);

  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState({});

  const [vpa, setvpa] = useState("");
  const [selectedUpiIntentApp, setSelectedUpiIntentApp] = useState("");

  const [selectedNB, setSelectedNB] = useState({});
  const [selectedPayLater, setSelectedPayLater] = useState({});

  const [selectedCardless, setSelectedCardless] = useState({});
  const [selectedOtherPayment, setSelectedOtherPayment] = useState({});
  const [savedUPISelect, setSavedUPISelect] = useState(false);
  const [showUPILoader, setUPILoader] = useState(false);
  const [selectedPaymentPayload, setSelectedPaymentPayload] = useState({
    selectedCard: selectedCard,
    isCardSecure: isCardSecure,
    selectedCardless: selectedCardless,
    selectedPayLater: selectedPayLater,
    selectedWallet: selectedWallet,
    selectedNB: selectedNB,
    vpa: vpa,
    selectedOtherPayment: selectedOtherPayment,
    selectedUpiIntentApp: selectedUpiIntentApp,
  });
  const [paymentResponse, setPaymentResponse] = useState(null);

  const [showUPIModal, setshowUPIModal] = useState(false);
  const [showCouponValidityModal, setShowCouponValidityModal] = useState(false);
  const [couponValidity, setCouponValidity] = useState({});
  const [countdownSeconds, setcountdownSeconds] = useState(600);
  const [timer, settimer] = useState(null);
  const [pollInterval, setpollInterval] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds

  const [openGuidelinesModal, setOpenGuidelinesModal] = useState(false);
  const [openMoreWalletModal, setOpenMoreWalletModal] = useState(false);
  const [walletSearchText, setWalletSearchText] = useState("");
  const [openMoreNbModal, setOpenMoreNbModal] = useState(false);
  const [nbSearchText, setNbSearchText] = useState("");
  const [isNavTabOpenMobile, setIsNavTabOpenMobile] = useState(false);
  const [upiApps, setUpiApps] = useState([]);

  const [isQrCodeVisible, setIsQrCodeVisible] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [qrPaymentPayload, setQrPaymentPayload] = useState({});
  const [showUPIAutoComplete, setUPIAutoComplete] = useState(false);
  const [upiSaveForLaterChecked, setUpiSaveForLaterChecked] = useState(true);

  const intervalRef = useRef(null);
  const [isQrMopPresent, setIsQrMopPresent] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardDetailsData, setCardDetailsData] = useState({});

  const [tab, setTab] = useState("");
  const [mop, setMop] = useState("");
  const [subMop, setSubMop] = useState("");
  const [finalMop, setFinalMop] = useState("");
  const selectedUpiRef = useRef(null);
  const [savedUpi, setSavedUpi] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [isUpiSuffixSelected, setIsUpiSuffixSelected] = useState(false);
  const [navigationTitleName, setNavigationTitleName] = useState("");
  const [isCvvNotNeededModal, setIsCvvNotNeededModal] = useState(false);

  const [cvvValues, setCvvValues] = useState({});
  const [isCvvInfo, setIsCvvInfo] = useState(false);
  const [isCodModalOpen, setIsCodModalOpen] = useState(false);
  const [isCardNumberValid, setIsCardNumberValid] = useState(false);
  const [activeMop, setActiveMop] = useState(null);
  const [userOrderId, setUserOrderId] = useState(null);
  const [lastValidatedBin, setLastValidatedBin] = useState("");
  const [isJuspayCouponApplied, setIsJuspayCouponApplied] = useState(false);

  const disbaleCheckout = useGlobalStore(fpi?.getters?.SHIPMENTS);
  const isCouponAppliedSuccess =
    useGlobalStore(fpi?.getters?.CUSTOM_VALUE) ?? {};
  const lastJuspayInitializationRef = useRef(null);

  const toggleMop = (mop) => {
    setActiveMop((prev) => (prev === mop ? null : mop));
  };
  const isTablet = useViewport(0, 768);
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

  const otherPaymentOptions = useMemo(() => otherOptions(), [paymentOption]);
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
          setActiveMop(null);
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
        setActiveMop(null);
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
          setActiveMop(null);
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
          setActiveMop(null);
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

  const setCardValidity = async ({ isValid, card_number }) => {
    setCardNumberError("");
    setCardNumber(card_number);
    const value = card_number.replace(/[^0-9]/g, "");
    setIsCardNumberValid(isValid);
    if (value.length === 6) {
      if (value !== lastValidatedBin) {
        setLastValidatedBin(value);
        const res = await cardDetails(value);
        const { data } = res.data.payment.card_details;
        setCardDetailsData(data);
      }
    } else if (value.length < 6) {
      setCardDetailsData({});
      setLastValidatedBin("");
    }
  };

  const handleCvvInfo = (value) => {
    setIsCvvInfo(value);
  };

  const handleCvvChange = (cardId, value) => {
    setCvvValues((prev) => ({
      ...prev,
      [cardId]: value,
    }));
  };

  const handleCardNumberInput = async (e) => {
    setCardNumberError("");
    let value = e.target.value;
    value = value.replace(/\s+/g, "");
    setCardNumber(value);
    if (value.length === 6) {
      if (value !== lastValidatedBin) {
        setLastValidatedBin(value);
        const res = await cardDetails(value);
        const { data } = res.data.payment.card_details;
        setCardDetailsData(data);
      }
    } else if (value.length < 6) {
      setCardDetailsData({});
      setLastValidatedBin("");
    }
  };

  const validateCardNumber = async (e) => {
    try {
      const value = e.target.value.replace(/[^0-9]/g, "");
      if (!isCardNumberValid) {
        setCardNumberError(t("resource.checkout.invalid_card_number"));
      }
      if (value.length >= 6) {
        const currentBin = value.slice(0, 6);
        if (currentBin !== lastValidatedBin) {
          setLastValidatedBin(currentBin);
          const res = await cardDetails(currentBin);
          const { data } = res.data.payment.card_details;
          if (data || cardNumber) {
            setCardDetailsData(data);
            if (!data?.is_card_valid) {
              setCardNumberError(t("resource.checkout.invalid_card_number"));
            } else if (!cardDetailsData.is_enabled) {
            } else if (!data?.is_enabled) {
              setCardNumberError(
                t("resource.checkout.this_card_network_is_not_supported")
              );
            } else {
              setCardNumberError("");
            }
          } else {
            setCardNumberError(t("resource.common.field_required"));
          }
        }
      } else {
        setCardDetailsData({});
        setLastValidatedBin("");
        if (!cardNumber) {
          setCardNumberError(t("resource.common.field_required"));
        }
      }
    } catch (error) {
      console.log(error, "cardValidation error");
    }
  };
  const handleCardNumberPaste = async (e) => {
    setCardNumberError("");
    let value = e.clipboardData.getData("Text");
    const currentBin = value.slice(0, 6);
    setCardNumber(value);
    value = value.replace(/[^0-9]/g, "");
    if (value.length >= 6) {
      if (currentBin !== lastValidatedBin) {
        setLastValidatedBin(currentBin);
        const res = await cardDetails(currentBin);
        const { data } = res.data.payment.card_details;
        setCardDetailsData(data);
      }
    } else {
      setCardDetailsData({});
      setLastValidatedBin("");
    }
  };

  useEffect(() => {
    if (cardDetailsData?.card_brand) selectMop("CARD", "CARD", "newCARD");
  }, [cardDetailsData?.card_brand]);

  useEffect(() => {
    if (isCouponApplied) {
      selectMop("CARD", "CARD", "CARD");
    }
  }, [isJuspayCouponApplied, isCouponApplied]);

  const resetCardValidationErrors = () => {
    setCardNumberError("");
    setCardNameError("");
    setCardExpiryError("");
    setCardCVVError("");
  };

  const handleNameOnCardInput = (e) => {
    setCardNameError("");
    setNameOnCard(e.target.value);
  };

  const validateNameOnCard = () => {
    if (!nameOnCard.trim()) {
      setCardNameError(t("resource.common.field_required"));
    }
  };

  const validateCardExpiryDate = () => {
    if (expirationdate_mask?.masked?.isComplete) {
      var d = new Date();
      var currentYear = d.getFullYear();
      var currentMonth = d.getMonth() + 1;

      //get expiry y, m entered
      var expYear =
        parseInt(expirationdate_mask?.value.split("/")[1], 10) + 2000;
      var expMonth = parseInt(expirationdate_mask?.value.split("/")[0], 10);

      if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      ) {
        //card has expired
        setCardExpiryError(t("resource.checkout.expiry_date_passed"));
      }
    } else {
      setCardExpiryError(t("resource.checkout.enter_expiry_date"));
    }
  };

  const handleCvvNumberInput = (e) => {
    setCardCVVError("");
    setCvvNumber(e.target.value.replace(/[^0-9]/g, ""));
  };

  const validateCvv = () => {
    if (!cvvNumber) {
      setCardCVVError(t("resource.checkout.enter_cvv"));
    } else if (cvvNumber.toString().length !== cardDetailsData.cvv_length) {
      setCardCVVError(t("resource.checkout.invalid_cvv"));
    }
  };

  const upiAppData = {
    gpay: {
      displayName: t("resource.checkout.google_pay"),
    },
    phonepe: {
      displayName: t("resource.checkout.phonepe_upi"),
    },
    paytm: {
      displayName: t("resource.checkout.paytm_upi"),
    },
    any: {
      displayName: t("resource.checkout.more_apps"),
    },
  };

  // Map API app codes to SVG names
  const getSvgNameForApp = (appCode) => {
    const appCodeMap = {
      "google_pay": "gpay",
      "gpay": "gpay",
      "phonepe": "phonepe",
      "paytm": "paytm",
    };
    return appCodeMap[appCode] || appCode;
  };
  const prevSelectedTabRef = useRef(selectedTab);
  const cancelQrPayment = async () => {
    initializeOrResetQrPayment();
    if (qrPaymentPayload.merchant_order_id) {
      try {
        const res = await cancelPayment({
          order_id: qrPaymentPayload.merchant_order_id,
          request_type: "cancel",
        });
        const { data, success } = res.data.resendOrCancelPayment;
        if (success && data.status == "true") {
          console.log("Payment cancellation successful");
          setQrPaymentPayload({});
        }
      } catch (err) {
        console.log("Payment cancellation failed");
      }
    }
  };
  useEffect(() => {
    cancelQrPayment();
    setCancelQrPayment({ handleQr: cancelQrPayment });
    const savedList = paymentOption?.payment_option?.find?.(
      (ele) => ele.name === selectedTab
    )?.stored_payment_details;
    if (selectedTab === "UPI") {
      setSavedUpi(savedList);
    } else if (selectedTab === "CARD") {
      setSavedCards(savedList);
    }
    if (selectedTab === "UPI" && !upiApps?.length) {
      getUPIIntentApps?.()?.then?.((data) => {
        // Handle case where data might be objects with 'code' property
        const normalizedData = Array.isArray(data) 
          ? data.map(item => typeof item === 'object' && item?.code ? item.code : item)
          : data;
        setUpiApps(normalizedData);
      });
    }
    if (
      prevSelectedTabRef.current === "COD" &&
      selectedTab !== "COD" &&
      !enableLinkPaymentOption
    ) {
      selectPaymentMode({
        id: cart_id,
        address_id: address_id,
        payment_mode: "",
        aggregator_name: "",
      }).then(() => console.log("mop selection"));
    }
    prevSelectedTabRef.current = selectedTab;
  }, [selectedTab]);

  useEffect(() => {
    let timerInterval;
    if (showUPIModal && timeRemaining !== null && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (showUPIModal && timeRemaining === 0) {
      cancelUPIPayment();
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [showUPIModal, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  // showUPIModal: false,
  // countdownSeconds: 600,
  // timer: null,
  // pollInterval: null,

  const initializeOrResetQrPayment = () => {
    setIsQrCodeVisible(false);
    handleIsQrCodeLoading(false);
    stopPolling();
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear the interval
      intervalRef.current = null; // Reset the interval ID
    }
  };

  const startPolling = (payload) => {
    // Initialize the timer only once here
    setTimeRemaining(600); // 10 minutes in seconds
    // Start polling every 2 seconds
    intervalRef.current = setInterval(() => {
      pollPaymentStatus(payload);
    }, 2000);
  };

  useEffect(() => {
    if (countdown > 0 && isQrCodeVisible) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Cleanup countdown interval
      return () => clearInterval(countdownInterval);
    } else if (countdown === 0) {
      initializeOrResetQrPayment();
    }
  }, [countdown]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const paymentModeDetails = (mop, subMop) => {
    const mopData = paymentOption?.payment_option?.find(
      (opt) => opt?.name === mop
    );
    let subMopData;
    if (mop === "CARD") {
      subMopData = mopData?.list?.filter((opt) => opt?.card_id === subMop)[0];
    } else {
      subMopData = mopData?.list?.filter((opt) => opt?.code === subMop)[0];
    }
    return {
      mopData,
      subMopData,
    };
  };

  const checkCouponValidity = async (payload) => {
    if (getTotalValue() === 0) return true;
    const res = await validateCoupon(payload);
    const { coupon_validity } = res.data.validateCoupon || {};
    return coupon_validity;
  };

  const removeCoupon = async () => {
    const { mopData, subMopData } = paymentModeDetails(mop, subMop);

    let paymentModePayload;
    if (mop === "CARD") {
      if (subMop === "newCARD") {
        paymentModePayload = {
          id: cart_id,
          address_id: address_id,
          payment_mode: mop,
          aggregator_name: mopData?.aggregator_name,
        };
      } else {
        paymentModePayload = {
          id: cart_id,
          address_id: address_id,
          payment_mode: mop,
          aggregator_name: subMopData?.aggregator_name,
          payment_identifier: subMopData?.card_id,
        };
      }
    } else {
      paymentModePayload = {
        id: cart_id,
        address_id,
        payment_mode: mop,
        aggregator_name: subMopData?.aggregator_name,
        payment_identifier: subMopData?.code ?? "",
        merchant_code: subMopData?.merchant_code,
      };
    }
    selectPaymentMode(paymentModePayload).then(() => {
      console.log("Payment mode selected");
    });

    if (tab === "COD") {
      setSelectedTab(tab);
      setIsCodModalOpen(true);
    } else if (tab === "CARD") {
      if (subMop !== "newCARD") {
        setSelectedCard(subMopData);
      }
    } else if (tab === "CARDLESS_EMI") {
      setSelectedCardless(subMopData);
    } else if (tab === "UPI") {
      if (mop === "QR") {
        await showQrCode();
      } else if (mop === "UPI") {
        await handleProceedToPayClick();
      }
    } else if (tab === "Other") {
      setSelectedOtherPayment(subMopData);
    } else if (tab === "WL") {
      setSelectedWallet(subMopData);
    } else if (tab === "NB") {
      setSelectedNB(subMopData);
    } else if (tab === "PL") {
      setSelectedPayLater(subMopData);
    }
  };

  const selectMop = async (tab, mop, subMop) => {
    if (!mop) return false;
    setTab(tab);
    setMop(mop);
    setSubMop(subMop);
    const { mopData, subMopData } = paymentModeDetails(mop, subMop);
    let payload;

    if (tab === "CARD") {
      if (subMop === "newCard") {
        payload = {
          id: cart_id,
          addressId: address_id,
          paymentMode: mop,
          aggregatorName: mopData?.aggregator_name,
          cardId: cardDetailsData?.id,
          iin: cardDetailsData?.card_object,
          paymentIdentifier: cardDetailsData?.bank_code,
          merchant_code: cardDetailsData?.bank_code,
          type: cardDetailsData?.type || "debit",
          network: cardDetailsData?.card_brand || subMopData?.card_brand,
        };
      } else {
        payload = {
          id: cart_id,
          addressId: address_id,
          paymentMode: mop,
          aggregatorName:
            subMopData?.aggregator_name ||
            mopData?.aggregator_name ||
            "Razorpay",
          cardId: cardDetailsData?.id,
          iin: cardDetailsData?.card_object,
          paymentIdentifier: cardDetailsData?.bank_code,
          merchant_code: cardDetailsData?.bank_code,
          type: cardDetailsData?.type || "debit",
          network: cardDetailsData?.card_brand || subMopData?.card_brand,
        };
      }
    } else {
      payload = {
        id: cart_id,
        addressId: address_id,
        paymentMode: mop,
        aggregatorName: subMopData?.aggregator_name,
        paymentIdentifier: subMopData?.code ?? "",
        merchantCode: subMopData?.merchant_code,
      };
    }
    if (!enableLinkPaymentOption) {
      if (selectedTab === tab) {
        setMopPayload(payload);
      } else {
        setMopPayload(null);
      }
    }
    let isValid = true;
    if (isCouponApplied && selectedTab === tab) {
      const { code, title, display_message_en, valid } =
        !enableLinkPaymentOption && (await checkCouponValidity(payload));
      isValid = !code || (code && valid);

      if (!isValid) {
        setCouponValidity({
          title,
          message: display_message_en,
          valid,
        });
        setShowCouponValidityModal(true);
        return false;
      }
    }

    let paymentModePayload;

    if (mop === "CARD") {
      if (subMop === "newCARD") {
        paymentModePayload = {
          id: cart_id,
          address_id: address_id,
          payment_mode: mop,
          aggregator_name: mopData?.aggregator_name,
        };
      } else {
        paymentModePayload = {
          id: cart_id,
          address_id: address_id,
          payment_mode: mop,
          aggregator_name: subMopData?.aggregator_name,
          payment_identifier: subMopData?.card_id,
        };
      }
    } else {
      paymentModePayload = {
        id: cart_id,
        address_id,
        payment_mode: mop,
        aggregator_name: subMopData?.aggregator_name,
        payment_identifier: subMopData?.code ?? "",
        merchant_code: subMopData?.merchant_code,
      };
    }

    // selectPaymentMode(paymentModePayload).then(() => {
    //   console.log("Payment mode selected");
    // });

    // Handle tab-specific UI and logic
    if (tab === "COD") {
      selectPaymentMode(paymentModePayload).then(() => {
        console.log("Payment mode selected");
      });

      setSelectedTab(tab);
      setIsCodModalOpen(true);
    } else if (tab === "CARD") {
      if (subMop !== "newCARD") {
        setSelectedCard(subMopData);
      }
    } else if (tab === "CARDLESS_EMI") {
      setSelectedCardless(subMopData);
    } else if (tab === "UPI") {
      if (mop === "QR") {
        await showQrCode();
      } else if (mop === "UPI") {
        await handleProceedToPayClick();
      }
    } else if (tab === "WL") {
      setSelectedWallet(subMopData);
    } else if (tab === "NB") {
      setSelectedNB(subMopData);
    } else if (tab === "PL") {
      setSelectedPayLater(subMopData);
    } else if (tab === "Other") {
      setSelectedOtherPayment(subMopData);
    }
    return true;
  };

  useEffect(() => {
    if (!isCouponAppliedSuccess["isCouponApplied"]) {
      if (
        selectedTab === "Other" &&
        !selectedTabData &&
        paymentOptions.length === 0
      ) {
        selectMop(
          "Other",
          otherPaymentOptions[0]?.name,
          otherPaymentOptions[0]?.list?.[0]?.code ?? ""
        );
      }
      if (
        selectedTabData?.name !== "CARD" &&
        selectedTabData?.name !== "UPI" &&
        paymentOptions[0]?.name === selectedTabData?.name
      ) {
        selectMop(
          selectedTabData?.name,
          selectedTabData?.name,
          selectedTabData?.list[0]?.code ?? ""
        );
      }
    }
  }, [selectedTabData?.list[0]?.code, otherPaymentOptions, selectedTab]);

  async function showQrCode() {
    try {
      const res = await proceedToPay("QR");
      const { data, success } = res?.payload?.data?.checkoutCart || {};
      if (success && data.base64_encoded_qr) {
        setIsQrCodeVisible(true);
        setQrCodeImage(data.base64_encoded_qr);
        setCountdown(data.timeout);
        const payload = {
          aggregator: data?.aggregator,
          method: data?.method,
          merchant_order_id: data?.merchant_order_id,
          virtual_id: data?.virtual_id,
          amount: data?.amount,
          contact: data?.contact,
          currency: data?.currency,
          customer_id: data?.customer_id,
          email: data?.email,
          order_id: data?.order_id,
          merchant_transaction_id: "",
          status: "",
        };
        setQrPaymentPayload({ ...payload, callback_url: data?.callback_url });
        startPolling(payload);
      }
      if (res?.code || res?.message) {
        handleShowFailedMessage({
          failed: true,
          paymentErrHeading: t("resource.checkout.please_try_again_later"),
          paymentErrMsg: res.message,
        });
      }
    } catch (err) {
      handleShowFailedMessage({
        failed: true,
        paymentErrHeading: t("resource.checkout.please_try_again_later"),
        paymentErrMsg: t("resource.checkout.qr_code_generation_failed"),
      });
    }
    handleIsQrCodeLoading(false);
  }

  const pollPaymentStatus = async (qrPaymentPayload) => {
    try {
      const result = await checkAndUpdatePaymentStatus(qrPaymentPayload);
      const status = result?.data?.checkAndUpdatePaymentStatus?.status;
      if (status === "success") {
        stopPolling();
        setshowUPIModal(false);
        const qrParams = {
          success: "true",
          order_id: qrPaymentPayload.merchant_order_id,
          delivery_address_id: address_id,
          billing_address_id: billing_address_id,
        };
        const params = new URLSearchParams();
        for (const key in qrParams) {
          if (qrParams.hasOwnProperty(key)) {
            params.append(key, qrParams[key]);
          }
        }
        const finalUrl = `${window.location.origin}${locale && locale !== "en" ? `/${locale}` : ""}/cart/order-status/?${params.toString()}`;
        window.location.href = finalUrl;
      } else if (status === "failed") {
        setshowUPIModal(false);
        initializeOrResetQrPayment();
        handleShowFailedMessage({
          failed: true,
        });
      } else if (result?.errors?.length > 0) {
        const { message } = result.errors[0];
        setshowUPIModal(false);
        initializeOrResetQrPayment();
        handleShowFailedMessage({
          failed: true,
          paymentErrMsg: message,
        });
      }
    } catch (err) {
      handleShowFailedMessage({
        failed: true,
      });
    }
  };

  useEffect(() => {
    setSelectedPaymentPayload({
      selectedCard: selectedCard,
      isCardSecure: isCardSecure,
      selectedCardless: selectedCardless,
      selectedPayLater: selectedPayLater,
      selectedWallet: selectedWallet,
      selectedNB: selectedNB,
      vpa: savedUPISelect || vpa,
      selectedOtherPayment: selectedOtherPayment,
      selectedUpiIntentApp: selectedUpiIntentApp,
    });
  }, [
    selectedCard,
    selectedCardless,
    selectedPayLater,
    selectedWallet,
    selectedNB,
    vpa,
    isCardSecure,
    selectedOtherPayment,
    selectedUpiIntentApp,
    savedUPISelect,
    vpa,
  ]);

  const handleNewCardNumberChange = (value) => {
    numberValidation = cardValidator.number(value);
    if (cardNumberRef.current) {
      const mask =
        CREDIT_CARD_MASK.find(
          (i) => i.cardtype === numberValidation?.card?.type ?? "unknown"
        )?.mask ?? CREDIT_CARD_MASK[CREDIT_CARD_MASK?.length - 1].mask;
      cardNumberRef?.current?.maskRef?.masked?.updateOptions({ mask });
    }
  };
  const handleNewCardExpiryChange = (value, e) => {
    setCardExpiryError("");
    setCardExpiryDate(value);
    expirationdate_mask = e;
  };

  const getTrimmedCardNumber = (number) => {
    // Implement the logic to trim the card number
    return number?.substring(number.length - 4);
  };

  const onClickAutoComplete = (selectedValue) => {
    setvpa(selectedValue);
    setUPIAutoComplete(false);
  };

  const handleSavedUPISelect = (value) => {
    setUpiSaveForLaterChecked(false);
    setSavedUPISelect(value);
    setSelectedUpiIntentApp("");
    selectedUpiRef.current = null;
    setUPIError(false);
    setvpa("");
  };
  const getCardBorder = (card) => {
    // Implement the logic to determine the card border class

    if (selectedCard?.card_id === card?.card_id) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  };

  const addNewCardShow = () => {
    setAddNewCard(true);
  };
  const handleUPIChange = (event) => {
    setUPIError(false);
    setIsUpiSuffixSelected(false);
    let value = event.target.value
      .replace(/[^a-zA-Z0-9._@-]/g, "")
      .replace(/@{2,}/g, "@")
      .replace(/^([^@]*)@([^@]*)$/, (_, user, domain) => {
        return `${user}@${domain.replace(/[^a-zA-Z0-9]/g, "")}`;
      });
    // Ensure only one '@' character
    const atCount = (value.match(/@/g) || []).length;
    if (atCount > 1) {
      value = value.slice(0, -1);
    }

    setvpa(value);
    setSavedUPISelect("");
    setSelectedUpiIntentApp("");
    selectedUpiRef.current = null;

    if (value.includes("@")) {
      setIsUpiSuffixSelected(true);
      const [prefix, suffix = ""] = value.split("@");

      // Filter suggestions based on what the user typed after '@'
      const filtered =
        suffix.trim() === ""
          ? upiSuggestions
          : upiSuggestions.filter((suggestion) =>
              suggestion.toLowerCase().includes("@" + suffix.toLowerCase())
            );

      setFilteredUPISuggestions(filtered);
      setUPIAutoComplete(true);
    } else {
      setFilteredUPISuggestions([]);
      setUPIAutoComplete(false);
    }
  };
  const handleProceedToPayClick = async () => {
    try {
      let res = await proceedToPay("UPI", {
        ...selectedPaymentPayload,
        selectedUpiIntentApp: selectedUpiRef.current || selectedUpiIntentApp,
        upiSaveForLaterChecked,
      });
      const { order_id } = res?.payload?.data?.checkoutCart || {};
      setUserOrderId(order_id);
      if (res?.isUPIError) {
        setUPIError(true);
        return;
      }
      if (res?.code || res?.message) {
        handleShowFailedMessage({
          failed: true,
          paymentErrMsg: res.message,
        });
        return;
      }
      if (vpa || savedUPISelect) {
        const { data, success, order_id } =
          res?.payload?.data?.checkoutCart || {};

        if (success) {
          const payload = {
            aggregator: res.aggregator_name,
            method: data?.method,
            merchant_order_id: order_id,
            // virtual_id: data?.virtual_id,
            amount: data?.amount,
            contact: data?.contact,
            currency: data?.currency,
            customer_id: data?.customer_id,
            email: data?.email,
            order_id: data?.order_id,
            merchant_transaction_id: "",
            status: "",
          };
          setshowUPIModal(true);
          startPolling(payload);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const hideNewCard = () => {
    setAddNewCard(false);
  };

  const keypressCvv = (event) => {
    // Implement the logic to handle the CVV keypress event
    let re = /^[0-9]+$/;
    let cvv = re.test(event.key);
    if (!cvv) {
      event.preventDefault();
      return false;
    }
    return true;
  };

  const handleNewCardSaveState = (e) => {
    // Implement the logic to handle the card save state
    setIsCardSecure(e?.target.checked);
  };

  const handleSavedCardState = (e) => {
    // Implement the logic to handle the saved card state
    setIsSavedCardSecure(e.target.checked);
  };

  const isPayByCardCvv = () => {
    if (!cvvNumber) {
      setCardCVVError(t("resource.checkout.enter_cvv"));
      setShowError(true);
      return false;
    } else if (cvvNumber.toString().length > 4) {
      setCardCVVError(t("resource.checkout.invalid_cvv"));
      setShowError(true);
      return false;
    }
    return true;
  };

  const checkEmpty = () => {
    let bEmpty = false;
    if (!cardNumber?.length) {
      setCardNumberError(t("resource.common.field_required"));
      bEmpty = true;
    }
    if (!expirationdate_mask?.value) {
      setCardExpiryError(t("resource.common.field_required"));
      bEmpty = true;
    }
    if (!nameOnCard) {
      setCardNameError(t("resource.common.field_required"));
      bEmpty = true;
    }
    return bEmpty;
  };
  const checkExpiry = () => {
    var d = new Date();
    var currentYear = d.getFullYear();
    var currentMonth = d.getMonth() + 1;

    //get expiry y, m entered
    var expYear = parseInt(expirationdate_mask?.value.split("/")[1], 10) + 2000;
    var expMonth = parseInt(expirationdate_mask?.value.split("/")[0], 10);

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      //card has expired
      setCardExpiryError(t("resource.checkout.expiry_date_passed"));
      return true;
    } else {
      //continue
      setCardExpiryError("");
      return false;
    }
  };
  const isValidCardDetails = () => {
    let bIsEmpty = checkEmpty();
    if (!bIsEmpty) {
      if (!cardDetailsData.is_enabled) {
        setCardNumberError(t("resource.checkout.card_network_not_supported"));
        return false;
      }
      if (!cardDetailsData.is_card_valid) {
        setCardNumberError(t("resource.checkout.invalid_card_number"));
        return false;
      }
      if (numberValidation?.card === null || !numberValidation?.card) {
        setCardNumberError(t("resource.checkout.invalid_card_number"));
        return false;
      }
      //Only if card number is proper and expiry date is proper
      if (expirationdate_mask?.masked?.isComplete) {
        return !checkExpiry();
      } else {
        setCardExpiryError(t("resource.checkout.invalid_expiry_time"));
      }
      return false;
    }
    return false;
  };

  const isJuspayEnabled = () => {
    return paymentOption?.payment_option?.find(
      (opt) =>
        opt.aggregator_name?.toLowerCase() === "juspay" && opt.name === "CARD"
    );
  };

  const handlePayment = async () => {
    try {
      const response = await payUsingJuspayCard();

      setPaymentResponse(response);
    } catch (error) {
      setPaymentResponse({ error });
    }
  };

  useEffect(() => {
    const initializeJuspay = async () => {
      if (isJuspayEnabled() && !paymentResponse) {
        const currentInitKey = `${!!paymentResponse}_${!!juspayErrorMessage}_${paymentOption?.payment_option?.length}`;

        if (lastJuspayInitializationRef.current === currentInitKey) {
          return; // Already processed this state combination
        }

        lastJuspayInitializationRef.current = currentInitKey;

        try {
          await handlePayment();
        } catch (error) {
          console.error("Juspay initialization error:", error);
        }
      }
    };

    if (
      juspayErrorMessage &&
      !paymentResponse &&
      paymentOption?.payment_option?.find(
        (opt) =>
          opt.aggregator_name?.toLowerCase() === "juspay" && opt.name === "CARD"
      )
    ) {
      const currentErrorKey = `error_${juspayErrorMessage}_${!!paymentResponse}`;

      if (lastJuspayInitializationRef.current !== currentErrorKey) {
        lastJuspayInitializationRef.current = currentErrorKey;
        handlePayment();
      }
    } else {
      initializeJuspay();
    }
  }, [paymentResponse, juspayErrorMessage, paymentOption]);

  const isCardDetailsValid = () => {
    //reset error
    setCardNumberError("");
    setCardNameError("");
    setCardExpiryError("");
    setCardCVVError("");

    const isValidCvv = isPayByCardCvv();
    const isValidCard = isValidCardDetails();
    return isValidCvv && isValidCard;
  };
  const getCardDetails = () => {
    let obj = {
      cvv: cvvNumber,
      card_number: cardNumber.replace(/[^0-9]/g, ""),
      name: nameOnCard,
      exp_month: expirationdate_mask?.value.split("/")[0],
      exp_year: expirationdate_mask?.value.split("/")[1],
    };
    return obj;
  };

  const isCardValid = () => {
    return (
      isCardNumberValid &&
      nameOnCard &&
      expirationdate_mask?.value &&
      cvvNumber &&
      !cardNumberError &&
      !cardNameError &&
      !cardExpiryError &&
      !cardCVVError
    );
  };

  const payUsingJuspayCard = async () => {
    const newPayload = {
      ...selectedPaymentPayload,
    };
    const res = await proceedToPay("newCARD", newPayload);
    return res;
  };

  const payUsingCard = async () => {
    if (isCardValid()) {
      let cardData = getCardDetails();
      const newPayload = {
        ...selectedPaymentPayload,
        selectedCardData: cardData,
      };
      const res = await proceedToPay("newCARD", newPayload);
      if (res?.code) {
        handleShowFailedMessage({
          failed: true,
          paymentErrMsg: res.message,
        });
      }
    } else {
      handleShowFailedMessage({
        failed: true,
        paymentErrHeading: t("resource.checkout.card_verification_failed"),
      });
    }
  };

  function getWalletdBorder(wlt) {
    if (selectedWallet?.code === wlt?.code) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  }

  function getSavedUpiBorder(upi) {
    if (savedUPISelect === upi) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  }

  function validateVPA() {
    let validPattern = /^.+@.+$/;
    return validPattern.test(vpa);
  }
  function getNBBorder(nb) {
    if (nb && selectedNB?.code === nb?.code) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  }

  const getNormalisedList = (selectedTabData) => {
    let tabData = selectedTabData?.list;
    return tabData.reduce((acc, tab) => {
      // if (tab.aggregator_name == "Potlee") {
      //   let temp = { ...tab };
      //   temp.isDisabled = true;
      //   temp.id =
      //     tab.aggregator_name + tab.code + selectedTabData.payment_mode_id;
      //   acc.push(temp);
      //   return acc;
      // } else if (tab.aggregator_name == "Simpl") {
      //   let temp = { ...tab };
      //   temp.isDisabled = { ...tab };
      //   temp.id =
      //     tab.aggregator_name + tab.code + selectedTabData.payment_mode_id;
      //   acc.push(temp);
      //   return acc;
      // } else if (tab.aggregator_name == "Rupifi") {
      //   let temp = { ...tab };
      //   temp.isDisabled = { ...tab };
      //   temp.id =
      //     tab.aggregator_name + tab.code + selectedTabData.payment_mode_id;
      //   acc.push(temp);
      //   return acc;
      // } else {
      //   acc.push(tab);
      //   return acc;
      // }
      let temp = { ...tab };
      if (tab?.code) {
        temp.id = tab.aggregator_name + tab.code;
      } else {
        temp.id = tab?.aggregator_name ?? "";
      }
      acc.push(temp);
      return acc;
    }, []);
  };

  function cancelUPIPayment() {
    setshowUPIModal(false);
    try {
      stopPolling();
    } catch (e) {
      // Optionally log error if needed
    }
  }

  function getPayLaterBorder(payLater) {
    if (selectedPayLater?.code === payLater?.code) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  }
  function getCardlessBorder(emi) {
    if (selectedCardless?.code === emi?.code) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  }

  function getOPBorder(op) {
    if (op && selectedOtherPayment.code === op.code) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  }
  useEffect(() => {
    const qrPaymentOption = paymentOption?.payment_option?.find(
      (opt) => opt.name === "QR"
    );
    if (qrPaymentOption) {
      setIsQrMopPresent(true);
    }
    if (getTotalValue?.() === 0) {
      setSelectedTab("COD");
    } else if (!enableLinkPaymentOption) {
      if (paymentOptions?.length > 0) {
        setSelectedTab(paymentOptions[0].name);
        setActiveMop(paymentOptions[0].name);
      } else if (otherPaymentOptions?.length > 0) {
        setSelectedTab("Other");
        setActiveMop("Other");
      } else if (codOption?.name) {
        selectMop(codOption?.name, codOption?.name, codOption?.name);
      }
    }
  }, [paymentOption]);

  const handleScrollToTop = (index) => {
    const element = document.getElementById(`nav-title-${index}`);
    if (element) {
      const headerOffset = 400; // Desired offset in pixels
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  const acceptOrder = () => {
    if (disbaleCheckout?.message) {
      handleShowFailedMessage({
        failed: true,
        paymentErrHeading: t("resource.checkout.please_try_again_later"),
        paymentErrMsg: disbaleCheckout?.message,
      });
    }
  };
  const cancelUpiAppPayment = async () => {
    try {
      stopPolling();
      const res = await cancelPayment({
        order_id: userOrderId,
        request_type: "cancel",
      });
      const { data, success } = res?.data?.resendOrCancelPayment;
      if (success && data.status == "true") {
        console.log("Payment cancellation successful");
      }
    } catch (err) {
      console.log("Payment cancellation failed");
    }
  };
  const codCharges =
    breakUpValues?.filter((value) => value.key === "cod_charge")[0]?.value ?? 0;

  const unsetSelectedSubMop = () => {
    setSelectedOtherPayment({});
    setSelectedNB("");
    setSelectedWallet("");
    setSelectedCardless("");
    setSelectedPayLater("");
    setSelectedUpiIntentApp("");
    setSelectedCard("");
    setSavedUPISelect("");
    cancelQrPayment();
    setSubMop("");
    setMop("");
    setCardNumberError("");
    setCardNumber("");
  };

  if (!isLoading && paymentOption?.payment_option?.length < 1) {
    return (
      <div className={styles.noOptionContainer}>
        <NoPaymentOptionSvg />
        <div className={styles.noOptionText}>
          <h3 className="fontHeader">
            {t("resource.checkout.no_payment_methods_available_heading")}
          </h3>
          <p className="fontBody">
            {t("resource.checkout.no_payment_methods_available_desc")}
          </p>
          <FDKLink to="/contact-us" target="_blank">
            <FyButton className={styles.contact_us}>
              {t("resource.common.contact_us")}
            </FyButton>
          </FDKLink>
        </div>
      </div>
    );
  }

  const renderApplePayStickyPayNow = () => (
    <StickyPayNow
      customClassName={`${styles.visibleOnTab} ${styles.applePayStickyFooter}`}
      value={priceFormatCurrencySymbol(getCurrencySymbol, getTotalValue())}
      onPriceDetailsClick={onPriceDetailsClick}
      enableLinkPaymentOption={enableLinkPaymentOption}
      isPaymentLoading={isPaymentLoading || applePayStatus === "submitting"}
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
              applePayStatus === "submitting" ||
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
          ) : applePayStatus !== "ready" && (
            <div
              className={styles.applePayStickyLoader}
              role="status"
              aria-label="Loading Apple Pay"
            >
              {loader}
            </div>
          )}
        </div>
      }
    />
  );

  const navigationTab = () => {
    switch (selectedTab) {
      case "CARD":
        return (
          <div className={styles.cardTab}>
            {(!addNewCard || isTablet) && (
              <div className={styles.savedCardWrapper}>
                {savedCards &&
                savedCards?.length > 0 &&
                !enableLinkPaymentOption ? (
                  <>
                    <div className={styles.savedCardHeaderWrapper}>
                      <div className={styles.cardHeader}>
                        {t("resource.checkout.saved_cards")}
                      </div>
                      <button onClick={addNewCardShow}>
                        {" "}
                        <span>+</span> {t("resource.checkout.new_card")}
                      </button>
                    </div>
                    <div className={styles.modeOption}>
                      {savedCards?.map((card, index) => (
                        <div key={card?.card_id || index}>
                          <div
                            className={`${styles.modeItemWrapper} ${getCardBorder(card)}`}
                          >
                            <div
                              onClick={() =>
                                selectMop("CARD", "CARD", card.card_id)
                              }
                            >
                              <div className={styles.modeItem}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                  }}
                                >
                                  <div className={styles.modeItemLogo}>
                                    <img
                                      src={card?.card_brand_image}
                                      alt={card.card_brand}
                                    />
                                  </div>
                                  <div>
                                    <div className={styles.modeItemName}>
                                      {`${card?.card_issuer} ${card?.card_type} ${t("resource.common.card")}`}
                                    </div>
                                    <div className={styles.number}>
                                      <span>****</span>{" "}
                                      {getTrimmedCardNumber(card.card_number)}
                                    </div>
                                    {selectedCard?.card_id ===
                                      card?.card_id && (
                                      <div className={styles.whyCvvContainer}>
                                        <span className={styles.cvvNotNeeded}>
                                          {t(
                                            "resource.checkout.cvv_not_needed"
                                          )}
                                        </span>
                                        <span
                                          className={styles.why}
                                          onMouseEnter={() =>
                                            setIsCvvNotNeededModal(true)
                                          }
                                          onMouseLeave={() =>
                                            setIsCvvNotNeededModal(false)
                                          }
                                          onClick={() =>
                                            setIsCvvNotNeededModal(true)
                                          }
                                        >
                                          {t("resource.common.why")}
                                        </span>
                                        {isCvvNotNeededModal && !isTablet && (
                                          <div>
                                            <p
                                              className={
                                                styles.cvvNotNeededModal
                                              }
                                            >
                                              <SvgWrapper
                                                svgSrc="paymentTooltipArrow"
                                                className={styles.upArrowMark}
                                              />
                                              {t(
                                                "resource.checkout.card_saved_rbi"
                                              )}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {selectedCard?.card_id &&
                                      selectedCard?.card_id === card?.card_id &&
                                      !card.cvv_less && (
                                        <div
                                          className={styles.savedCardCvvWrapper}
                                        >
                                          <input
                                            value={
                                              cvvValues[card.card_id] || ""
                                            }
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              handleCvvChange(
                                                card.card_id,
                                                e.target.value
                                              );
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            type="text"
                                            autoComplete="off"
                                            maxLength="4"
                                            placeholder={`${t("resource.checkout.cvv")}*`}
                                            className={styles.cvv}
                                          />
                                          <SvgWrapper
                                            svgSrc="cvv"
                                            className={styles.cvvIcon}
                                            onClick={(e) => setIsCvvInfo(true)}
                                          />
                                        </div>
                                      )}
                                  </div>
                                </div>
                                <div
                                  className={`${styles.walletLeft} ${styles.onMobileView}`}
                                >
                                  {(!selectedCard ||
                                    selectedCard.card_id !== card.card_id) && (
                                    <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                                  )}
                                  {selectedCard &&
                                    selectedCard.card_id === card.card_id && (
                                      <SvgWrapper
                                        svgSrc={"radio-selected"}
                                      ></SvgWrapper>
                                    )}
                                </div>
                              </div>
                            </div>

                            <div className={styles.modePay}>
                              {!addNewCard && isTablet ? (
                                <StickyPayNow
                                  customClassName={styles.visibleOnTab}
                                  value={priceFormatCurrencySymbol(
                                    getCurrencySymbol,
                                    getTotalValue()
                                  )}
                                  onPriceDetailsClick={onPriceDetailsClick}
                                  disabled={!selectedCard?.card_id}
                                  enableLinkPaymentOption={
                                    enableLinkPaymentOption
                                  }
                                  isPaymentLoading={isPaymentLoading}
                                  loader={loader}
                                  proceedToPay={() => {
                                    proceedToPay("CARD", {
                                      ...selectedPaymentPayload,
                                      selectedCardCvv:
                                        cvvValues[selectedCard?.card_id],
                                    });
                                    acceptOrder();
                                  }}
                                />
                              ) : (
                                selectedCard?.card_id &&
                                selectedCard?.card_id === card?.card_id && (
                                  <button
                                    className={styles.payBtn}
                                    onClick={() => {
                                      proceedToPay("CARD", {
                                        ...selectedPaymentPayload,
                                        selectedCardCvv:
                                          cvvValues[selectedCard?.card_id],
                                      });
                                      acceptOrder();
                                    }}
                                    disabled={isPaymentLoading}
                                  >
                                    {!isPaymentLoading ? (
                                      <>
                                        {t("resource.common.pay_caps")}{" "}
                                        {priceFormatCurrencySymbol(
                                          getCurrencySymbol,
                                          getTotalValue()
                                        )}
                                      </>
                                    ) : (
                                      loader
                                    )}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                          {isCvvInfo && (
                            <Modal isOpen={isCvvInfo} hideHeader={true}>
                              <span
                                className={styles.crossMobile}
                                onClick={() => setIsCvvInfo(false)}
                              >
                                {" "}
                                <SvgWrapper svgSrc="closeBold" />{" "}
                              </span>
                              <div className={styles.cvvInfo}>
                                {card?.card_brand &&
                                  card.card_brand !== "American Express" && (
                                    <div className={styles.type}>
                                      <div className={styles.closeWrapper}>
                                        <p className={styles.title}>
                                          {t(
                                            "resource.checkout.what_is_cvv_number"
                                          )}
                                        </p>
                                      </div>
                                      <p className={styles.desc}>
                                        {t("resource.checkout.cvv_description")}
                                      </p>
                                      <div className={styles.img}>
                                        <SvgWrapper svgSrc="non-amex-card-cvv" />
                                      </div>
                                    </div>
                                  )}
                                {cardDetailsData &&
                                  card?.card_brand &&
                                  card?.card_brand === "American Express" && (
                                    <div className={styles.type}>
                                      <p className={styles.title}>
                                        {t(
                                          "resource.checkout.have_american_express_card"
                                        )}
                                      </p>
                                      <p className={styles.desc}>
                                        {t(
                                          "resource.checkout.amex_cvv_description"
                                        )}
                                      </p>
                                      <div className={styles.img}>
                                        <SvgWrapper svgSrc="amex-card-cvv" />
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </Modal>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className={styles.newCardWrapper}>
                    <div
                      className={`${styles.walletHeader} ${styles["view-mobile-up"]} ${styles.cardDetailsHeader}`}
                    >
                      {t("resource.checkout.enter_card_details")}
                    </div>
                    <CardForm
                      cardNumberRef={cardNumberRef}
                      handleNewCardNumberChange={handleNewCardNumberChange}
                      cardNumberError={cardNumberError}
                      CREDIT_CARD_MASK={CREDIT_CARD_MASK}
                      nameRef={nameRef}
                      cardNameError={cardNameError}
                      cardExpiryDate={cardExpiryDate}
                      handleNewCardExpiryChange={handleNewCardExpiryChange}
                      cardExpiryError={cardExpiryError}
                      cvvNumber={cvvNumber}
                      keypressCvv={keypressCvv}
                      setCvvNumber={setCvvNumber}
                      showError={showError}
                      cardCVVError={cardCVVError}
                      loggedIn={loggedIn}
                      isCardSecure={isCardSecure}
                      handleNewCardSaveState={handleNewCardSaveState}
                      openGuidelinesModal={openGuidelinesModal}
                      setOpenGuidelinesModal={setOpenGuidelinesModal}
                      payUsingCard={payUsingCard}
                      getCurrencySymbol={getCurrencySymbol}
                      getTotalValue={getTotalValue}
                      cardNumber={cardNumber}
                      handleCardNumberInput={handleCardNumberInput}
                      handleCardNumberPaste={handleCardNumberPaste}
                      nameOnCard={nameOnCard}
                      handleNameOnCardInput={handleNameOnCardInput}
                      cardDetailsData={cardDetailsData}
                      validateCardNumber={validateCardNumber}
                      validateNameOnCard={validateNameOnCard}
                      validateCardExpiryDate={validateCardExpiryDate}
                      validateCvv={validateCvv}
                      handleCvvNumberInput={handleCvvNumberInput}
                      isCardValid={isCardValid}
                      isTablet={isTablet}
                      onPriceDetailsClick={onPriceDetailsClick}
                      isCvvInfo={isCvvInfo}
                      handleCvvInfo={handleCvvInfo}
                      validateCardDetails={validateCardDetails}
                      setCardValidity={setCardValidity}
                      resetCardValidationErrors={resetCardValidationErrors}
                      enableLinkPaymentOption={enableLinkPaymentOption}
                      paymentOption={paymentOption}
                      paymentResponse={paymentResponse}
                      isJuspayEnabled={isJuspayEnabled}
                      handleShowFailedMessage={handleShowFailedMessage}
                      cardDetails={cardDetails}
                      selectMop={selectMop}
                      setIsJuspayCouponApplied={setIsJuspayCouponApplied}
                      loader={loader}
                      isPaymentLoading={isPaymentLoading}
                    />
                  </div>
                )}
              </div>
            )}
            {addNewCard && !isTablet && (
              <div className={styles.newCardWrapper}>
                <div className={styles.addCardHeader}>
                  <button onClick={hideNewCard}>
                    <SvgWrapper svgSrc={"back"}></SvgWrapper>
                  </button>
                  <div className={styles.newCardHeaderText}>
                    {t("resource.checkout.add_new_card")}
                  </div>
                </div>
                <CardForm
                  cardNumberRef={cardNumberRef}
                  handleNewCardNumberChange={handleNewCardNumberChange}
                  cardNumberError={cardNumberError}
                  CREDIT_CARD_MASK={CREDIT_CARD_MASK}
                  nameRef={nameRef}
                  cardNameError={cardNameError}
                  cardExpiryDate={cardExpiryDate}
                  handleNewCardExpiryChange={handleNewCardExpiryChange}
                  cardExpiryError={cardExpiryError}
                  cvvNumber={cvvNumber}
                  keypressCvv={keypressCvv}
                  setCvvNumber={setCvvNumber}
                  showError={showError}
                  cardCVVError={cardCVVError}
                  loggedIn={loggedIn}
                  isCardSecure={isCardSecure}
                  handleNewCardSaveState={handleNewCardSaveState}
                  openGuidelinesModal={openGuidelinesModal}
                  setOpenGuidelinesModal={setOpenGuidelinesModal}
                  payUsingCard={payUsingCard}
                  getCurrencySymbol={getCurrencySymbol}
                  getTotalValue={getTotalValue}
                  cardNumber={cardNumber}
                  handleCardNumberInput={handleCardNumberInput}
                  handleCardNumberPaste={handleCardNumberPaste}
                  nameOnCard={nameOnCard}
                  handleNameOnCardInput={handleNameOnCardInput}
                  cardDetailsData={cardDetailsData}
                  validateCardNumber={validateCardNumber}
                  validateNameOnCard={validateNameOnCard}
                  validateCardExpiryDate={validateCardExpiryDate}
                  validateCvv={validateCvv}
                  handleCvvNumberInput={handleCvvNumberInput}
                  isCardValid={isCardValid}
                  isCvvInfo={isCvvInfo}
                  handleCvvInfo={handleCvvInfo}
                  validateCardDetails={validateCardDetails}
                  setCardValidity={setCardValidity}
                  resetCardValidationErrors={resetCardValidationErrors}
                  enableLinkPaymentOption={enableLinkPaymentOption}
                  paymentOption={paymentOption}
                  paymentResponse={paymentResponse}
                  isJuspayEnabled={isJuspayEnabled}
                  handleShowFailedMessage={handleShowFailedMessage}
                  cardDetails={cardDetails}
                  selectMop={selectMop}
                  setIsJuspayCouponApplied={setIsJuspayCouponApplied}
                  isPaymentLoading={isPaymentLoading}
                  loader={loader}
                />
              </div>
            )}
            {addNewCard && isTablet && (
              <Modal
                isOpen={addNewCard}
                closeDialog={hideNewCard}
                title={t("resource.checkout.add_new_card")}
                headerClassName={styles.newCardModalHeader}
                customClassName={styles.newCardBodyModal}
              >
                <div
                  className={`${styles.newCardWrapper} ${styles.addNewCardModal}`}
                >
                  <CardForm
                    addNewCard={addNewCard}
                    cardNumberRef={cardNumberRef}
                    handleNewCardNumberChange={handleNewCardNumberChange}
                    cardNumberError={cardNumberError}
                    CREDIT_CARD_MASK={CREDIT_CARD_MASK}
                    nameRef={nameRef}
                    cardNameError={cardNameError}
                    cardExpiryDate={cardExpiryDate}
                    handleNewCardExpiryChange={handleNewCardExpiryChange}
                    cardExpiryError={cardExpiryError}
                    cvvNumber={cvvNumber}
                    keypressCvv={keypressCvv}
                    setCvvNumber={setCvvNumber}
                    showError={showError}
                    cardCVVError={cardCVVError}
                    loggedIn={loggedIn}
                    isCardSecure={isCardSecure}
                    handleNewCardSaveState={handleNewCardSaveState}
                    openGuidelinesModal={openGuidelinesModal}
                    setOpenGuidelinesModal={setOpenGuidelinesModal}
                    payUsingCard={payUsingCard}
                    getCurrencySymbol={getCurrencySymbol}
                    getTotalValue={getTotalValue}
                    cardNumber={cardNumber}
                    handleCardNumberInput={handleCardNumberInput}
                    handleCardNumberPaste={handleCardNumberPaste}
                    nameOnCard={nameOnCard}
                    handleNameOnCardInput={handleNameOnCardInput}
                    cardDetailsData={cardDetailsData}
                    validateCardNumber={validateCardNumber}
                    validateNameOnCard={validateNameOnCard}
                    validateCardExpiryDate={validateCardExpiryDate}
                    validateCvv={validateCvv}
                    handleCvvNumberInput={handleCvvNumberInput}
                    isCardValid={isCardValid}
                    isTablet={isTablet}
                    onPriceDetailsClick={onPriceDetailsClick}
                    isCvvInfo={isCvvInfo}
                    handleCvvInfo={handleCvvInfo}
                    validateCardDetails={validateCardDetails}
                    setCardValidity={setCardValidity}
                    resetCardValidationErrors={resetCardValidationErrors}
                    enableLinkPaymentOption={enableLinkPaymentOption}
                    paymentOption={paymentOption}
                    paymentResponse={paymentResponse}
                    isJuspayEnabled={isJuspayEnabled}
                    handleShowFailedMessage={handleShowFailedMessage}
                    cardDetails={cardDetails}
                    selectMop={selectMop}
                    setIsJuspayCouponApplied={setIsJuspayCouponApplied}
                    loader={loader}
                    isPaymentLoading={isPaymentLoading}
                  />
                </div>
              </Modal>
            )}
          </div>
        );
      case "APPLEPAY":
        const applePayLogo = applePayPaymentOption?.option?.logo_url?.small;
        const isApplePayLoading =
          applePayStatus === "waiting_for_sdk" ||
          applePayStatus === "checking" ||
          applePayStatus === "loading" ||
          applePayStatus === "mounting";
        if (isTablet) {
          return null;
        }
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
                {isApplePayLoading && (
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
      case "WL":
        const initialVisibleWalletCount = 3;
        const walletList =
          selectedTabData?.list?.filter((wlt) => !isApplePayOption(wlt)) ?? [];
        const topWallets = walletList?.slice(0, initialVisibleWalletCount) ?? [];
        const restWallets = walletList?.slice(initialVisibleWalletCount) ?? [];
        const filteredWallets = restWallets?.filter((wlt) =>
          wlt?.display_name
            ?.toLowerCase()
            .includes(walletSearchText?.toLowerCase())
        );

        const WalletItem = ({ wlt, key, openMoreWalletModal = false }) => {
          const isSelectedWallet = selectedWallet?.code === wlt?.code;
          return (
            <div
              key={key}
              className={`${styles.modeItemWrapper} ${getWalletdBorder(wlt)}`}
              onClick={async () => {
                removeDialogueError();
                await selectMop("WL", "WL", wlt?.code);
              }}
            >
              <label>
                <div className={styles.modeItem}>
                  <div className={styles.logoNameContainer}>
                    <div className={styles.modeItemLogo}>
                      <img src={wlt?.logo_url?.small} alt={wlt?.display_name} />
                    </div>
                    <div className={styles.modeItemName}>
                      {translateDynamicLabel(wlt?.display_name ?? "", t)}
                    </div>
                  </div>
                  <div
                    className={`${styles.walletLeft} ${styles.onMobileView}`}
                  >
                    {(!selectedWallet || selectedWallet.code !== wlt.code) && (
                      <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                    )}
                    {selectedWallet && selectedWallet.code === wlt.code && (
                      <SvgWrapper svgSrc={"radio-selected"}></SvgWrapper>
                    )}
                  </div>
                </div>
              </label>

              <div className={styles.modePay}>
                {!openMoreWalletModal && isTablet && isSelectedWallet ? (
                  <StickyPayNow
                    customClassName={styles.visibleOnTab}
                    value={priceFormatCurrencySymbol(
                      getCurrencySymbol,
                      getTotalValue()
                    )}
                    onPriceDetailsClick={onPriceDetailsClick}
                    disabled={!selectedWallet.code}
                    enableLinkPaymentOption={enableLinkPaymentOption}
                    isPaymentLoading={isPaymentLoading}
                    loader={loader}
                    proceedToPay={() => {
                      proceedToPay("WL", selectedPaymentPayload);
                      acceptOrder();
                    }}
                  />
                ) : (
                  selectedWallet.code &&
                  selectedWallet.code === wlt.code && (
                    <button
                      className={styles.payBtn}
                      onClick={() => {
                        proceedToPay("WL", selectedPaymentPayload);
                        if (disbaleCheckout?.message) {
                          setOpenMoreWalletModal(false);
                          acceptOrder();
                        }
                      }}
                      disabled={isPaymentLoading}
                    >
                      {!isPaymentLoading ? (
                        <>
                          {t("resource.common.pay_caps")}{" "}
                          {priceFormatCurrencySymbol(
                            getCurrencySymbol,
                            getTotalValue()
                          )}
                        </>
                      ) : (
                        loader
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          );
        };
        return (
          <div>
            <div
              className={`${styles.walletHeader} ${styles["view-mobile-up"]}`}
            >
              {t("resource.checkout.select_wallet")}
            </div>
            <div className={styles.modeOption}>
              {topWallets?.map((wlt, index) => (
                <WalletItem wlt={wlt} key={index} />
              ))}
              {restWallets.length > 0 && (
                <div
                  className={`${styles.modeItemWrapper} ${styles.otherBorder}`}
                  onClick={() => {
                    removeDialogueError();
                    setOpenMoreWalletModal(true);
                  }}
                >
                  <div className={styles.modeItem}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div className={styles.modeItemLogo}>
                        <span className={styles.moreWlIcon}>
                          <SvgWrapper
                            className={styles.svgColor}
                            svgSrc="more-wallets"
                          />
                        </span>
                      </div>
                      <div className={styles.moreModeName}>
                        {t("resource.checkout.other_wallets")}
                      </div>
                    </div>
                    <span className={styles.moreModeIcon}>
                      <SvgWrapper svgSrc="accordion-arrow" />
                    </span>
                  </div>
                </div>
              )}
              <Modal
                containerClassName={styles.moreOptionContainer}
                isOpen={openMoreWalletModal}
                headerClassName={styles.modalHeader}
                bodyClassName={`${styles.modalBody} ${styles.bodyContainer}`}
                closeDialog={() => {
                  setOpenMoreWalletModal(false);
                  setWalletSearchText("");
                }}
                title={t("resource.checkout.select_wallet")}
              >
                <div className={styles.searchBox}>
                  <SvgWrapper svgSrc="search" className={styles.searchIcon} />
                  <input
                    type="text"
                    defaultValue={walletSearchText}
                    onChange={(e) => setWalletSearchText(e?.target?.value)}
                    placeholder={t("resource.checkout.search_for_wallets")}
                  />
                </div>
                {filteredWallets?.length === 0 ? (
                  <p className={styles.noResultFound}>
                    {t("resource.common.empty_state")}
                  </p>
                ) : (
                  filteredWallets.map((wlt, index) => (
                    <WalletItem
                      openMoreWalletModal={openMoreWalletModal}
                      wlt={wlt}
                      key={`mi-${index}`}
                    />
                  ))
                )}
              </Modal>
            </div>
          </div>
        );
      case "UPI":
        return (
          <div className={styles.upiMop}>
            {isTablet && isChromeOrSafari && (
              <div>
                {upiApps?.length > 0 &&
                  upiApps
                    .filter((app) => ["gpay", "google_pay", "phonepe", "paytm"].includes(app))
                    .map((app) => {
                      const svgName = getSvgNameForApp(app);
                      const displayKey = svgName;
                      return (
                        <label
                          key={app}
                          onClick={() => {
                            setSelectedUpiIntentApp(app);
                            selectedUpiRef.current = null;
                            setvpa("");
                            setSavedUPISelect("");
                            setUPIError(false);
                            cancelQrPayment();
                          }}
                          className={`${styles.upiApp} ${!upiApps?.includes("any") ? styles.notBorderBottom : ""} ${selectedUpiIntentApp === app ? styles.selectedUpiApp : ""}`}
                        >
                          <div className={styles.logo}>
                            <SvgWrapper svgSrc={svgName} />
                          </div>
                          <p className={styles.displayName}>
                            {upiAppData[displayKey]?.displayName}
                          </p>
                        {(!selectedUpiIntentApp ||
                          selectedUpiIntentApp !== app) && (
                          <SvgWrapper
                            svgSrc={"radio"}
                            className={styles.onMobileView}
                          />
                        )}
                        {selectedUpiIntentApp &&
                          selectedUpiIntentApp === app && (
                            <SvgWrapper
                              svgSrc={"radio-selected"}
                              className={styles.onMobileView}
                            />
                          )}
                        </label>
                      );
                    })}
                {upiApps?.length > 0 && upiApps?.includes("any") && (
                  <label
                    key="any"
                    onClick={() => {
                      setSelectedUpiIntentApp("any");
                      selectedUpiRef.current = "any";
                      selectMop("UPI", "UPI", "UPI");
                      removeDialogueError();
                      setShowUpiRedirectionModal(true);
                    }}
                    className={styles.moreApps}
                  >
                    <div className={styles.logo}>
                      <SvgWrapper svgSrc="more-upi-apps" />
                    </div>
                    <p className={styles.displayName}>
                      {upiAppData.any?.displayName}
                    </p>
                    <div className={styles.rightArrow}>
                      <SvgWrapper svgSrc="arrow-right" />
                    </div>
                  </label>
                )}
              </div>
            )}
            {!isTablet && upiApps?.length > 0 && (
              <div>
                {upiApps
                  .filter((app) => ["gpay", "google_pay", "phonepe", "paytm"].includes(app))
                  .map((app) => {
                    const svgName = getSvgNameForApp(app);
                    const displayKey = svgName;
                    return (
                      <label
                        key={app}
                        onClick={() => {
                          setSelectedUpiIntentApp(app);
                          selectedUpiRef.current = null;
                          setvpa("");
                          setSavedUPISelect("");
                          setUPIError(false);
                          cancelQrPayment();
                        }}
                        className={`${styles.upiApp} ${!upiApps?.includes("any") ? styles.notBorderBottom : ""} ${selectedUpiIntentApp === app ? styles.selectedUpiApp : ""}`}
                      >
                        <div className={styles.logo}>
                          <SvgWrapper svgSrc={svgName} />
                        </div>
                        <p className={styles.displayName}>
                          {upiAppData[displayKey]?.displayName}
                        </p>
                        {(!selectedUpiIntentApp ||
                          selectedUpiIntentApp !== app) && (
                          <SvgWrapper
                            svgSrc={"radio"}
                            className={styles.onMobileView}
                          />
                        )}
                        {selectedUpiIntentApp &&
                          selectedUpiIntentApp === app && (
                            <SvgWrapper
                              svgSrc={"radio-selected"}
                              className={styles.onMobileView}
                            />
                          )}
                      </label>
                    );
                  })}
                {upiApps?.length > 0 && upiApps?.includes("any") && (
                  <label
                    key="any"
                    onClick={() => {
                      setSelectedUpiIntentApp("any");
                      selectedUpiRef.current = "any";
                      selectMop("UPI", "UPI", "UPI");
                      removeDialogueError();
                      setShowUpiRedirectionModal(true);
                    }}
                    className={styles.moreApps}
                  >
                    <div className={styles.logo}>
                      <SvgWrapper svgSrc="more-upi-apps" />
                    </div>
                    <p className={styles.displayName}>
                      {upiAppData.any?.displayName}
                    </p>
                    <div className={styles.rightArrow}>
                      <SvgWrapper svgSrc="arrow-right" />
                    </div>
                  </label>
                )}
              </div>
            )}
            {!isTablet && isQrMopPresent && (
              <div>
                <p className={styles.upiSectionTitle}>
                  {t("resource.checkout.upi_qr_code_caps")}
                </p>
                <div className={styles.upiQrCodeSection}>
                  <div className={styles.upiQrCodeDescription}>
                    <div>
                      <p className={styles.scanQrTitle}>
                        {t("resource.checkout.scan_qr_to_pay")}
                      </p>
                      <p className={styles.scanQrDescripton}>
                        {t("resource.checkout.scan_qr_upi")}
                      </p>
                    </div>
                    <div className={styles.scanQrApps}>
                      <div className={styles.upiAppLogo}>
                        <SvgWrapper svgSrc="gpay" />
                      </div>
                      <div className={styles.upiAppLogo}>
                        <SvgWrapper svgSrc="phonepe" />
                      </div>
                      <div className={styles.upiAppLogo}>
                        <SvgWrapper svgSrc="bhim" />
                      </div>
                      <div className={styles.upiAppLogo}>
                        <SvgWrapper svgSrc="amazon-pay" />
                      </div>
                      <p className={styles.moreUpiApps}>
                        {t("resource.checkout.and_more")}
                      </p>
                    </div>
                    {isQrCodeVisible && (
                      <span className={styles.expiryText}>
                        {t("resource.checkout.valid_for")}
                        <span className={styles.countDown}>
                          {formatTime(countdown)}
                        </span>
                        <span className={styles.minutes}>
                          {t("resource.common.minutes")}
                        </span>
                      </span>
                    )}
                    {isQrCodeVisible && (
                      <p
                        className={styles.cancel}
                        onClick={() => {
                          cancelQrPayment();
                        }}
                      >
                        {t("resource.facets.cancel_caps")}
                      </p>
                    )}
                  </div>
                  <div className={styles.upiQrCode}>
                    {!isQrCodeVisible && (
                      <SvgWrapper svgSrc="qr-code" className={styles.blurred} />
                    )}
                    {isQrCodeVisible && (
                      <img
                        src={qrCodeImage}
                        className={styles.qrCode}
                        alt={t("resource.checkout.qr_code_image")}
                      />
                    )}
                    {!isQrCodeVisible && isQrCodeLoading && (
                      <div className={styles.qrLoader}></div>
                    )}
                    {!isQrCodeVisible && !isQrCodeLoading && (
                      <p
                        className={styles.showQrButton}
                        onClick={() => {
                          if (disbaleCheckout?.message) {
                            acceptOrder();
                          } else {
                            removeDialogueError();
                          }
                          selectMop("UPI", "QR", "QR");
                          setSavedUPISelect(null);
                        }}
                      >
                        {t("resource.checkout.show_qr")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {((isTablet &&
              isChromeOrSafari &&
              (upiApps?.length > 0 || upiApps?.includes("any"))) ||
              (!isTablet && (upiApps?.length > 0 || isQrMopPresent))) && (
              <div className={styles.upiOrLine}>
                <span className={styles.upiOrText}>
                  {t("resource.common.or")}
                </span>
              </div>
            )}
            {loggedIn && savedUpi?.length > 0 && !enableLinkPaymentOption && (
              <div>
                <div>
                  <div>
                    {!isTablet && (
                      <div
                        className={`${styles.upiHeader} ${styles["view-mobile-up"]}`}
                      >
                        {t("resource.checkout.saved_upi_id")}
                      </div>
                    )}
                    <div className={styles.modeOption}>
                      {savedUpi?.map((item) => (
                        <div
                          className={`${styles.modeItemWrapper} ${getSavedUpiBorder(item.vpa)} ${styles.upiMargin}`}
                          onClick={() => {
                            removeDialogueError();
                            handleSavedUPISelect(item.vpa);
                            cancelQrPayment();
                          }}
                          key={item?.vpa}
                        >
                          <div className={styles.modeItem} key={item.vpa}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <SvgWrapper svgSrc="bhim" />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                }}
                              >
                                <span className={styles.modeItemName}>
                                  {item.vpa}
                                </span>
                                {savedUPISelect &&
                                  isUPIError &&
                                  item.vpa === savedUPISelect && (
                                    <p className={` ${styles.upiError}`}>
                                      {t("resource.checkout.invalid_upi_id")}
                                    </p>
                                  )}
                              </div>
                            </div>
                            {savedUPISelect === item.vpa ? (
                              <SvgWrapper
                                svgSrc="radio-selected"
                                className={styles.onMobileView}
                              />
                            ) : (
                              <SvgWrapper
                                svgSrc="radio"
                                className={styles.onMobileView}
                              />
                            )}
                          </div>
                          {!isTablet &&
                            savedUPISelect &&
                            savedUPISelect === item.vpa && (
                              <div className={styles.modePay}>
                                <button
                                  className={`${styles.commonBtn} ${styles.payBtn}`}
                                  onClick={() => {
                                    if (disbaleCheckout?.message) {
                                      acceptOrder();
                                    } else {
                                      removeDialogueError();
                                    }
                                    cancelQrPayment();
                                    selectMop("UPI", "UPI", "UPI");
                                  }}
                                  disabled={
                                    (savedUPISelect && isUPIError) ||
                                    isPaymentLoading
                                  }
                                >
                                  {!isPaymentLoading ? (
                                    <>
                                      {t("resource.common.pay_caps")}{" "}
                                      {priceFormatCurrencySymbol(
                                        getCurrencySymbol,
                                        getTotalValue()
                                      )}
                                    </>
                                  ) : (
                                    loader
                                  )}
                                </button>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.upiOrLine}>
                  <span className={styles.upiOrText}>
                    {t("resource.common.or")}
                  </span>
                </div>
              </div>
            )}
            <div style={{ position: "relative" }}>
              {!isTablet && (
                <p className={styles.upiSectionTitle}>
                  {t("resource.checkout.upi_id_number")}
                </p>
              )}
              <div className={styles.upiIdWrapper}>
                <input
                  className={`${vpa && isUPIError ? styles.error : ""} ${vpa ? styles.input : ""} ${styles.upiInput}`}
                  type="text"
                  placeholder={t("resource.common.enter_upi_id")}
                  onFocus={() => {
                    setUpiSaveForLaterChecked(true);
                  }}
                  maxLength="55"
                  value={vpa}
                  onChange={handleUPIChange}
                />
                {(vpa || (vpa && isUPIError)) && (
                  <span
                    className={`${styles.inputName} ${isUPIError ? styles.errorInputName : ""}`}
                  >
                    {t("resource.common.enter_upi_id")}
                    <span className={styles.required}>*</span>
                  </span>
                )}
              </div>

              {isUPIError && vpa ? (
                <p className={styles.formError}>{t(UPI_INVALID_VPA_ERROR)}</p>
              ) : null}

              {/* Show suggestions if '@' is present and we have filtered suggestions */}
              {!isTablet &&
                showUPIAutoComplete &&
                filteredUPISuggestions.length > 0 && (
                  <div className={styles.upiSuggestionsDesktop}>
                    <ul className={styles.upiAutoCompleteWrapper}>
                      {filteredUPISuggestions.map((suffix) => (
                        <li
                          key={suffix}
                          className={styles.upiAutoCompleteItem}
                          onClick={() =>
                            onClickAutoComplete(
                              `${vpa.replace(/@.*/, "")}${suffix}`
                            )
                          }
                        >
                          {`${vpa.replace(/@.*/, "")}${suffix}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {isTablet &&
                showUPIAutoComplete &&
                filteredUPISuggestions.length > 0 && (
                  <div>
                    <ul className={styles.upiChipsWrapper}>
                      {filteredUPISuggestions.slice(0, 3).map((suffix) => (
                        <li
                          key={suffix}
                          className={styles.upiChip}
                          onClick={() =>
                            onClickAutoComplete(
                              `${vpa.replace(/@.*/, "")}${suffix}`
                            )
                          }
                        >
                          {suffix}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {loggedIn && !enableLinkPaymentOption && (
                <div>
                  <label
                    htmlFor="upiSaveForLater"
                    // className={
                    //   !!savedUPISelect
                    //     ? styles.disabledUPISaveCheck
                    //     : styles.saveUpi
                    // }
                    className={styles.saveUpi}
                  >
                    <input
                      type="checkbox"
                      name="upiSaveForLater"
                      id="upiSaveForLater"
                      checked={upiSaveForLaterChecked}
                      className={styles.saveForLater}
                      disabled={!vpa || !!savedUPISelect}
                      onChange={(e) => {
                        setUpiSaveForLaterChecked(e.currentTarget.checked);
                      }}
                    />
                    <span
                      className={`${!vpa || !!savedUPISelect ? styles.disableSaveUpiTitle : styles.saveUpiTitle}`}
                    >
                      {t("resource.checkout.save_upi_id")}
                    </span>
                  </label>
                </div>
              )}

              <div className={styles.upiPay}>
                {isTablet ? (
                  <StickyPayNow
                    customClassName={styles.visibleOnTab}
                    disabled={
                      !(
                        isUpiSuffixSelected ||
                        !!selectedUpiIntentApp ||
                        !!savedUPISelect
                      ) ||
                      (savedUPISelect && isUPIError)
                    }
                    value={priceFormatCurrencySymbol(
                      getCurrencySymbol,
                      getTotalValue()
                    )}
                    onPriceDetailsClick={onPriceDetailsClick}
                    enableLinkPaymentOption={enableLinkPaymentOption}
                    isPaymentLoading={isPaymentLoading}
                    loader={loader}
                    proceedToPay={() => {
                      if (disbaleCheckout?.message) {
                        acceptOrder();
                      }
                      selectMop("UPI", "UPI", "UPI");
                    }}
                  />
                ) : (
                  (vpa || selectedUpiIntentApp) && (
                    <button
                      className={`${styles.commonBtn} ${styles.payBtn}`}
                      onClick={() => {
                        if (disbaleCheckout?.message) {
                          acceptOrder();
                        } else {
                          removeDialogueError();
                        }
                        selectMop("UPI", "UPI", "UPI");
                        cancelQrPayment();
                      }}
                      disabled={
                        !(isUpiSuffixSelected || !!selectedUpiIntentApp) ||
                        isPaymentLoading
                      }
                    >
                      {!isPaymentLoading ? (
                        <>
                          {t("resource.common.pay_caps")}{" "}
                          {priceFormatCurrencySymbol(
                            getCurrencySymbol,
                            getTotalValue()
                          )}
                        </>
                      ) : (
                        loader
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        );
      case "NB":
        const initialVisibleBankCount = 4;
        const topBanks =
          selectedTabData?.list?.slice(0, initialVisibleBankCount) ?? [];
        const restBanks =
          selectedTabData?.list?.slice(initialVisibleBankCount) ?? [];
        const filteredBanks = restBanks?.filter((nb) =>
          nb.display_name?.toLowerCase().includes(nbSearchText?.toLowerCase())
        );

        const NbItem = ({ nb, key, openMoreNbModal = false }) => {
          return (
            <div
              key={nb.display_name}
              className={`${styles.modeItemWrapper} ${getNBBorder(nb)}`}
              onClick={() => {
                removeDialogueError();
                selectMop("NB", "NB", nb.code);
              }}
            >
              <label>
                <div className={styles.modeItem}>
                  <div className={styles.logoNameContainer}>
                    <div className={styles.modeItemLogo}>
                      <img src={nb.logo_url.small} alt={nb?.display_name} />
                    </div>
                    <div className={styles.modeItemName}>
                      {translateDynamicLabel(nb?.display_name ?? "", t)}
                    </div>
                  </div>

                  <div className={`${styles.nbLeft} ${styles.onMobileView}`}>
                    {(!selectedNB || selectedNB.code !== nb.code) && (
                      <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                    )}
                    {selectedNB && selectedNB.code === nb.code && (
                      <SvgWrapper svgSrc="radio-selected" />
                    )}
                  </div>
                </div>
              </label>
              <div className={styles.modePay}>
                {!openMoreNbModal && isTablet ? (
                  <StickyPayNow
                    customClassName={styles.visibleOnTab}
                    value={priceFormatCurrencySymbol(
                      getCurrencySymbol,
                      getTotalValue()
                    )}
                    onPriceDetailsClick={onPriceDetailsClick}
                    disabled={!selectedNB.code}
                    enableLinkPaymentOption={enableLinkPaymentOption}
                    isPaymentLoading={isPaymentLoading}
                    loader={loader}
                    proceedToPay={() => {
                      proceedToPay("NB", selectedPaymentPayload);
                      acceptOrder();
                    }}
                  />
                ) : (
                  selectedNB.code &&
                  selectedNB.code === nb.code && (
                    <button
                      className={`${styles.commonBtn} ${styles.payBtn}`}
                      onClick={() => {
                        proceedToPay("NB", selectedPaymentPayload);
                        if (disbaleCheckout?.message) {
                          setOpenMoreNbModal(false);
                          acceptOrder();
                        }
                      }}
                      disabled={isPaymentLoading}
                    >
                      {!isPaymentLoading ? (
                        <>
                          {t("resource.common.pay_caps")}{" "}
                          {priceFormatCurrencySymbol(
                            getCurrencySymbol,
                            getTotalValue()
                          )}
                        </>
                      ) : (
                        <span>{loader}</span>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          );
        };

        return (
          <div>
            <div className={`${styles.nbHeader} ${styles["view-mobile-up"]}`}>
              {t("resource.checkout.select_bank")}
            </div>
            <div className={styles.modeOption}>
              {topBanks?.map((nb, index) => (
                <NbItem nb={nb} key={`nb-${index}`} />
              ))}

              {selectedTabData?.list?.length > initialVisibleBankCount && (
                <div
                  className={`${styles.modeItemWrapper} ${styles.otherBorder}`}
                  onClick={() => {
                    removeDialogueError();
                    setOpenMoreNbModal(true);
                  }}
                >
                  <div className={styles.modeItem}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div className={styles.modeItemLogo}>
                        <span>
                          <SvgWrapper
                            svgSrc="other-banks"
                            className={styles.svgColor}
                          />
                        </span>
                      </div>
                      <div className={styles.moreModeName}>
                        {t("resource.checkout.other_banks")}
                      </div>
                    </div>
                    <span className={styles.moreModeIcon}>
                      <SvgWrapper svgSrc="accordion-arrow" />
                    </span>
                  </div>
                </div>
              )}

              <Modal
                containerClassName={styles.moreOptionContainer}
                isOpen={openMoreNbModal}
                headerClassName={styles.modalHeader}
                bodyClassName={`${styles.modalBody} ${styles.bodyContainer}`}
                closeDialog={() => {
                  setOpenMoreNbModal(false);
                  setNbSearchText("");
                }}
                title={t("resource.checkout.select_bank")}
              >
                <div className={styles.searchBox}>
                  <SvgWrapper svgSrc="search" className={styles.searchIcon} />
                  <input
                    type="text"
                    defaultValue={nbSearchText}
                    onChange={(e) => setNbSearchText(e?.target?.value)}
                    placeholder={t("resource.checkout.search_for_banks")}
                  />
                </div>
                {filteredBanks?.length === 0 ? (
                  <p className={styles.noResultFound}>
                    {t("resource.common.empty_state")}
                  </p>
                ) : (
                  filteredBanks?.map((nb, index) => (
                    <NbItem
                      nb={nb}
                      openMoreNbModal={openMoreNbModal}
                      key={`mi-${index}`}
                    />
                  ))
                )}
              </Modal>
            </div>
          </div>
        );
      case "COD":
        return (
          <div>
            {!isTablet ? (
              <div>
                <div
                  className={`${styles.codHeader} ${styles["view-mobile-up"]}`}
                >
                  {t("resource.checkout.cash_on_delivery")}
                </div>
                <p className={styles.codTitle}>
                  {t("resource.checkout.pay_on_delivery")}
                </p>
                {codCharges > 0 && (
                  <div className={styles.codInfo}>
                    +{priceFormatCurrencySymbol(getCurrencySymbol, codCharges)}{" "}
                    {t("resource.checkout.cod_extra_charge")}
                  </div>
                )}
                <div className={styles.codPay}>
                  <button
                    className={`${styles.commonBtn} ${styles.payBtn}`}
                    onClick={() => proceedToPay("COD", selectedPaymentPayload)}
                    disabled={isPaymentLoading}
                  >
                    {!isPaymentLoading
                      ? t("resource.checkout.place_order")
                      : loader}
                  </button>
                </div>
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        );
      case "PL":
        return (
          <div>
            <div
              className={`${styles.payLaterHeader} ${styles["view-mobile-up"]}`}
            >
              {t("resource.checkout.select_pay_later_option")}
            </div>
            <div className={styles.modeOption}>
              {getNormalisedList(selectedTabData)?.map(
                (payLater, index) =>
                  !payLater.isDisabled && (
                    <div
                      key={payLater.id}
                      className={`${styles.modeItemWrapper} ${getPayLaterBorder(payLater)}`}
                      onClick={() => {
                        removeDialogueError();
                        selectMop("PL", "PL", payLater.code);
                      }}
                    >
                      <label id={payLater.id}>
                        <div className={styles.modeItem}>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div className={styles.modeItemLogo}>
                              <img
                                src={payLater?.logo_url?.small}
                                alt={payLater?.display_name}
                              />
                            </div>
                            <div className={styles.modeItemName}>
                              {translateDynamicLabel(
                                payLater?.display_name ?? "",
                                t
                              )}
                            </div>
                          </div>
                          <div className={styles.onMobileView}>
                            {(!selectedPayLater ||
                              selectedPayLater.code !== payLater.code) && (
                              <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                            )}
                            {selectedPayLater &&
                              selectedPayLater.code === payLater.code && (
                                <SvgWrapper
                                  svgSrc={"radio-selected"}
                                ></SvgWrapper>
                              )}
                          </div>
                        </div>
                      </label>

                      <div className={styles.modePay}>
                        {isTablet ? (
                          <StickyPayNow
                            customClassName={styles.visibleOnTab}
                            value={priceFormatCurrencySymbol(
                              getCurrencySymbol,
                              getTotalValue()
                            )}
                            onPriceDetailsClick={onPriceDetailsClick}
                            disabled={!selectedPayLater.code}
                            enableLinkPaymentOption={enableLinkPaymentOption}
                            isPaymentLoading={isPaymentLoading}
                            loader={loader}
                            proceedToPay={() => {
                              proceedToPay("PL", selectedPaymentPayload);
                              acceptOrder();
                            }}
                          />
                        ) : (
                          selectedPayLater.code &&
                          selectedPayLater.code === payLater.code && (
                            <button
                              className={`${styles.commonBtn} ${styles.payBtn}`}
                              onClick={() => {
                                proceedToPay("PL", selectedPaymentPayload);
                                acceptOrder();
                              }}
                              disabled={isPaymentLoading}
                            >
                              {!isPaymentLoading ? (
                                <>
                                  {t("resource.common.pay_caps")}{" "}
                                  {priceFormatCurrencySymbol(
                                    getCurrencySymbol,
                                    getTotalValue()
                                  )}
                                </>
                              ) : (
                                loader
                              )}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        );
      case "CARDLESS_EMI":
        return (
          <div>
            <div
              className={`${styles.cardlessHeader} ${styles["view-mobile-up"]}`}
            >
              {t("resource.checkout.select_emi_option")}
            </div>
            <div className={styles.modeOption}>
              {selectedTabData.list?.map((emi) => (
                <div
                  key={emi?.display_name}
                  className={`${styles.modeItemWrapper} ${getCardlessBorder(emi)}`}
                  onClick={() => {
                    removeDialogueError();
                    selectMop("CARDLESS_EMI", "CARDLESS_EMI", emi.code);
                  }}
                >
                  <label>
                    <div className={styles.modeItem}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className={styles.modeItemLogo}>
                          <img
                            src={emi?.logo_url?.small}
                            alt={emi?.display_name}
                          />
                        </div>
                        <div className={styles.modeItemName}>
                          {translateDynamicLabel(emi?.display_name ?? "", t)}
                        </div>
                      </div>
                      <div className={styles.onMobileView}>
                        {!selectedCardless ||
                        selectedCardless.code !== emi.code ? (
                          <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                        ) : (
                          <SvgWrapper svgSrc={"radio-selected"}></SvgWrapper>
                        )}
                      </div>
                    </div>
                  </label>
                  {selectedCardless.code === emi.code &&
                    selectedCardless.code && (
                      <div className={styles.modePay}>
                        {isTablet ? (
                          <StickyPayNow
                            customClassName={styles.visibleOnTab}
                            value={priceFormatCurrencySymbol(
                              getCurrencySymbol,
                              getTotalValue()
                            )}
                            onPriceDetailsClick={onPriceDetailsClick}
                            enableLinkPaymentOption={enableLinkPaymentOption}
                            isPaymentLoading={isPaymentLoading}
                            loader={loader}
                            proceedToPay={() => {
                              proceedToPay(
                                "CARDLESS_EMI",
                                selectedPaymentPayload
                              );
                              acceptOrder();
                            }}
                          />
                        ) : (
                          <button
                            className={`${styles.commonBtn} ${styles.payBtn}`}
                            onClick={() => {
                              proceedToPay(
                                "CARDLESS_EMI",
                                selectedPaymentPayload
                              );
                              acceptOrder();
                            }}
                            disabled={isPaymentLoading}
                          >
                            {!isPaymentLoading ? (
                              <>
                                {t("resource.common.pay_caps")}{" "}
                                {priceFormatCurrencySymbol(
                                  getCurrencySymbol,
                                  getTotalValue()
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
      case "Other":
        const OtherItem = ({ other, key }) => {
          return (
            <div
              key={key}
              className={`${styles.modeItemWrapper} ${getOPBorder(other?.list?.[0])}`}
              onClick={() => {
                removeDialogueError();
                if (other?.list?.[0]?.code) {
                  selectMop("Other", other?.name, other?.list?.[0]?.code);
                }
              }}
            >
              <label>
                <div className={styles.modeItem}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className={styles.modeItemLogo}>
                      <img
                        src={other?.list?.[0]?.logo_url?.small}
                        alt={other?.list?.[0]?.display_name}
                      />
                    </div>
                    <div className={styles.modeItemName}>
                      {other?.list?.[0]?.display_name ?? ""}
                    </div>
                  </div>
                  <div className={`${styles.otherLeft} ${styles.onMobileView}`}>
                    {(!selectedOtherPayment ||
                      selectedOtherPayment?.code !==
                        other?.list?.[0]?.code) && (
                      <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                    )}
                    {selectedOtherPayment &&
                      selectedOtherPayment?.code === other?.list?.[0]?.code && (
                        <SvgWrapper svgSrc="radio-selected" />
                      )}
                  </div>
                  {/* <div className={styles.otherMiddle}>
                        <img
                          src={op?.list[0].logo_url?.small}
                          alt={op.display_name}
                        />
                      </div>
                      <div className={styles.otherRight}>{op.display_name}</div> */}
                </div>
              </label>
              <div className={styles.otherPay}>
                {isTablet ? (
                  <StickyPayNow
                    customClassName={styles.visibleOnTab}
                    value={priceFormatCurrencySymbol(
                      getCurrencySymbol,
                      getTotalValue()
                    )}
                    onPriceDetailsClick={onPriceDetailsClick}
                    disabled={!selectedOtherPayment?.code}
                    enableLinkPaymentOption={enableLinkPaymentOption}
                    isPaymentLoading={isPaymentLoading}
                    loader={loader}
                    proceedToPay={() => {
                      proceedToPay("Other", selectedPaymentPayload);
                      acceptOrder();
                    }}
                  />
                ) : (
                  selectedOtherPayment?.code &&
                  selectedOtherPayment.code === other?.list?.[0]?.code && (
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
                            getTotalValue()
                          )}
                        </>
                      ) : (
                        loader
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          );
        };
        return (
          <div>
            <div
              className={`${styles.otherHeader} ${styles["view-mobile-up"]}`}
            >
              {t("resource.common.select_payment_option")}
            </div>
            <div className={styles.modeOption}>
              {otherPaymentOptions?.length &&
                otherPaymentOptions.map((op, index) => (
                  <OtherItem other={op} key={`other-${index}`} />
                ))}
            </div>
          </div>
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
                              getTotalValue()
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
                                  getTotalValue()
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
              {isApplePayNavigationOption && applePayLogoUrl ? (
                <img
                  src={applePayLogoUrl}
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
                  ) : null
                )}
            </div>
          )}
          {isTablet && isApplePayNavigationOption ? (
            <div className={`${styles.arrowContainer} ${styles.activeIconColor}`}>
              <SvgWrapper
                svgSrc={selectedTab === opt.name ? "radio-selected" : "radio"}
              />
            </div>
          ) : (
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
      {showUPIModal && (
        // <UktModal
        //   isOpen={showUPIModal}
        //   modalClass={styles.upiPoll}
        //   isCancelable={true}
        //   showHeader={false}
        //   title="" // hideHeader is simulated by leaving title empty and customizing CSS if needed
        // >

        <Modal
          isOpen={showUPIModal}
          headerClassName={styles.modalHeader}
          bodyClassName={styles.modalBody}
          isCancellable={false}
          title=""
          hideHeader={true}
        >
          <div style={upiDisplayWrapperStyle}>
            <div style={upiHeadingStyle}>
              {t("resource.checkout.complete_your_payment")}
            </div>
            <div style={upiVpaStyle}>
              {t("resource.checkout.sent_to")} {savedUPISelect || vpa}
            </div>
            <div style={upiLabelWrapperStyle}>
              <SvgWrapper svgSrc="upi-payment-popup" />
            </div>
            <div style={timeDisplayStyle}>
              {t("resource.checkout.valid_for")}{" "}
              <span style={timeDisplaySpanStyle}>
                {formatTime(timeRemaining)}
              </span>{" "}
              {t("resource.common.minutes")}
            </div>
            <div style={cancelBtnStyle} onClick={cancelUPIPayment}>
              {t("resource.checkout.cancel_payment_caps")}
            </div>
          </div>
        </Modal>
      )}
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
      {showUpiRedirectionModal && (
        <Modal isOpen={showUpiRedirectionModal} hideHeader={true}>
          <div className={styles.upiRedirectionModal}>
            <div className={styles.loader}></div>
            <p className={styles.title}>
              {t("resource.checkout.finalising_payment")}
            </p>
            <p className={styles.message}>
              {t("resource.checkout.redirecting_upi")}
            </p>
            <div
              style={cancelBtnStyle}
              onClick={() => {
                setShowUpiRedirectionModal(false);
                cancelUpiAppPayment();
              }}
            >
              {t("resource.checkout.cancel_payment_caps")}
            </div>
          </div>
        </Modal>
      )}
      {isCodModalOpen && isTablet && (
        <Modal
          isOpen={isCodModalOpen}
          hideHeader={true}
          closeDialog={() => {
            setIsCodModalOpen(false);
            setTab("");
            setSelectedTab("");
          }}
        >
          <div className={styles.codModal}>
            <div className={styles.codIconsContainer}>
              <SvgWrapper svgSrc="cod-icon"></SvgWrapper>
              <span
                className={styles.closeCodModal}
                onClick={() => {
                  setIsCodModalOpen(false);
                  setTab("");
                  setSelectedTab("");
                }}
              >
                <SvgWrapper svgSrc="closeBold"></SvgWrapper>
              </span>
            </div>
            <div>
              <p className={styles.message}>
                {t("resource.checkout.confirm_cod")}
              </p>
              {codCharges > 0 && (
                <p className={styles.codCharges}>
                  +{priceFormatCurrencySymbol(getCurrencySymbol, codCharges)}{" "}
                  {t("resource.checkout.extra_charges")}
                </p>
              )}
            </div>
            <button
              className={`${styles.commonBtn} ${styles.payBtn}`}
              onClick={() => proceedToPay("COD", selectedPaymentPayload)}
              disabled={isPaymentLoading}
            >
              {!isPaymentLoading ? (
                <>
                  {t("resource.checkout.continue_with_cod")}{" "}
                  {priceFormatCurrencySymbol(
                    getCurrencySymbol,
                    getTotalValue()
                  )}
                </>
              ) : (
                loader
              )}
            </button>
          </div>
        </Modal>
      )}
      {isCvvNotNeededModal && isTablet && (
        <Modal
          isOpen={isCvvNotNeededModal}
          closeDialog={() => setIsCvvNotNeededModal(false)}
          title={t("resource.checkout.cvv_not_needed")}
        >
          <p className={styles.cvvNotNeededModal}>
            {t("resource.checkout.card_saved_rbi")}
          </p>
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
                  <div
                    className={styles.navigationLink}
                    inert={isApplePaySubmitting ? "" : undefined}
                  >
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
                                      codCharges
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
                  {isTablet &&
                    selectedTab === "APPLEPAY" &&
                    renderApplePayStickyPayNow()}
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
    </>
  );
}

export default CheckoutPaymentContent;
