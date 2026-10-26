import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import cardValidator from "card-validator";
import { useViewport } from "../../helper/hooks";
import {
  useGlobalStore,
  useGlobalTranslation,
  useFPI,
  useNavigate,
} from "fdk-core/utils";

export const CREDIT_CARD_MASK = [
  { mask: "0000 000000 00000", cardtype: "american-express" },
  { mask: "0000 0000 0000 0000", cardtype: "discover" },
  { mask: "0000 000000 0000", cardtype: "diners-club" },
  { mask: "0000 0000 0000 0000", cardtype: "mastercard" },
  { mask: "0000 000000 00000", cardtype: "jcb15" },
  { mask: "0000 0000 0000 0000", cardtype: "jcb" },
  { mask: "0000 0000 0000 0000", cardtype: "maestro" },
  { mask: "0000 0000 0000 0000", cardtype: "visa" },
  { mask: "0000 0000 0000 0000", cardtype: "unionpay" },
  { mask: "0000 0000 0000 0000", cardtype: "rupay" },
  { mask: "0000 0000 0000 0000", cardtype: "Unknown" },
];

export function useCheckoutPayment({
  payment,
  handleShowFailedMessage,
  breakUpValues,
  setCancelQrPayment,
  isCouponApplied,
  juspayErrorMessage,
  setMopPayload,
  styles,
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
    PaymentOptionsList,
    setSelectedTab,
    paymentOption,
    handleIsQrCodeLoading,
    getUPIIntentApps,
    cardDetails,
    checkAndUpdatePaymentStatus,
    cancelPayment,
    otherOptions,
    setUPIError,
    validateCoupon,
    selectPaymentMode,
    enableLinkPaymentOption,
  } = payment;

  // env / derived
  const isChromeOrSafari =
    /Chrome/.test(navigator.userAgent) ||
    /Safari/.test(navigator.userAgent) ||
    /Instagram/.test(navigator.userAgent);

  const isTablet = useViewport(0, 768);

  let paymentOptions = PaymentOptionsList ? PaymentOptionsList() : [];
  let codOption = paymentOptions?.filter((opt) => opt.name === "COD")[0];
  paymentOptions = paymentOptions?.filter((opt) => opt.name !== "COD");

  const otherPaymentOptions = useMemo(
    () => (otherOptions ? otherOptions() : []),
    [paymentOption]
  );

  const isUpiEnabled = !!paymentOption?.payment_option?.find(
    (opt) => opt?.name === "UPI"
  );
  const isQrEnabled = !!paymentOption?.payment_option?.find(
    (opt) => opt?.name === "QR"
  );

  // UPI/QR visibility rules
  if (isUpiEnabled && isQrEnabled) {
    paymentOptions = paymentOptions?.filter((opt) => opt?.name !== "QR");
  }
  if (isUpiEnabled && !isQrEnabled && !isTablet) {
    paymentOptions = paymentOptions?.filter((opt) => opt?.name !== "UPI");
  }
  if (isQrEnabled && !isUpiEnabled && isTablet) {
    paymentOptions = paymentOptions?.filter((opt) => opt?.name !== "QR");
  }

  // -------- state --------
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

  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState({});
  const [vpa, setvpa] = useState("");
  const [selectedUpiIntentApp, setSelectedUpiIntentApp] = useState("");
  const [selectedNB, setSelectedNB] = useState({});
  const [selectedPayLater, setSelectedPayLater] = useState({});
  const [selectedCardless, setSelectedCardless] = useState({});
  const [selectedOtherPayment, setSelectedOtherPayment] = useState({});
  const [savedUPISelect, setSavedUPISelect] = useState(false);

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
  const [timeRemaining, setTimeRemaining] = useState(0);

  const [openGuidelinesModal, setOpenGuidelinesModal] = useState(false);
  const [openMoreWalletModal, setOpenMoreWalletModal] = useState(false);
  const [walletSearchText, setWalletSearchText] = useState("");
  const [openMoreNbModal, setOpenMoreNbModal] = useState(false);
  const [nbSearchText, setNbSearchText] = useState("");
  const [upiApps, setUpiApps] = useState([]);

  const [isQrCodeVisible, setIsQrCodeVisible] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [qrPaymentPayload, setQrPaymentPayload] = useState({});
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
  const [savedCards, setSavedCards] = useState([]);
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

  // previously module-globals -> refs
  const expirationdate_mask_ref = useRef(null);

  // keep in sync (original behaviour)
  useEffect(() => {
    if (enableLinkPaymentOption && selectedTab) {
      setActiveMop(selectedTab);
    }
  }, [enableLinkPaymentOption, selectedTab]);

  const toggleMop = (m) => {
    setActiveMop((prev) => (prev === m ? null : m));
  };

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

  const handleCvvInfo = (value) => setIsCvvInfo(value);

  const handleCvvChange = (cardId, value) => {
    setCvvValues((prev) => ({ ...prev, [cardId]: value }));
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
              // intentionally blank (same as your code)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDetailsData?.card_brand]);

  useEffect(() => {
    if (isCouponApplied) {
      selectMop("CARD", "CARD", "CARD");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const expirationdate_mask = expirationdate_mask_ref.current;

    if (expirationdate_mask?.masked?.isComplete) {
      var d = new Date();
      var currentYear = d.getFullYear();
      var currentMonth = d.getMonth() + 1;

      var expYear =
        parseInt(expirationdate_mask?.value.split("/")[1], 10) + 2000;
      var expMonth = parseInt(expirationdate_mask?.value.split("/")[0], 10);

      if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      ) {
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
    gpay: { displayName: t("resource.checkout.google_pay") },
    phonepe: { displayName: t("resource.checkout.phonepe_upi") },
    paytm: { displayName: t("resource.checkout.paytm_upi") },
    any: { displayName: t("resource.checkout.more_apps") },
  };

  const getSvgNameForApp = (appCode) => {
    const appCodeMap = {
      google_pay: "gpay",
      gpay: "gpay",
      phonepe: "phonepe",
      paytm: "paytm",
    };
    return appCodeMap[appCode] || appCode;
  };

  const prevSelectedTabRef = useRef(selectedTab);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const initializeOrResetQrPayment = () => {
    setIsQrCodeVisible(false);
    handleIsQrCodeLoading(false);
    stopPolling();
  };

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
          setQrPaymentPayload({});
        }
      } catch (err) {
        console.log("Payment cancellation failed");
      }
    }
  };

  const startPolling = (payload) => {
    setTimeRemaining(600);
    intervalRef.current = setInterval(() => {
      pollPaymentStatus(payload);
    }, 2000);
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  useEffect(() => {
    cancelQrPayment();
    setCancelQrPayment?.({ handleQr: cancelQrPayment });

    const savedList = paymentOption?.payment_option?.find?.(
      (ele) => ele.name === selectedTab
    )?.stored_payment_details;

    if (selectedTab === "CARD") setSavedCards(savedList);

    if (selectedTab === "UPI" && !upiApps?.length) {
      getUPIIntentApps?.()?.then?.((data) => {
        const normalizedData = Array.isArray(data)
          ? data.map((item) =>
              typeof item === "object" && item?.code ? item.code : item
            )
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const paymentModeDetails = (m, s) => {
    const mopData = paymentOption?.payment_option?.find(
      (opt) => opt?.name === m
    );
    let subMopData;
    if (m === "CARD") {
      subMopData = mopData?.list?.filter((opt) => opt?.card_id === s)[0];
    } else {
      subMopData = mopData?.list?.filter((opt) => opt?.code === s)[0];
    }
    return { mopData, subMopData };
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
      if (subMop !== "newCARD") setSelectedCard(subMopData);
    } else if (tab === "CARDLESS_EMI") {
      setSelectedCardless(subMopData);
    } else if (tab === "UPI") {
      if (mop === "QR") await showQrCode();
      else if (mop === "UPI") await handleProceedToPayClick();
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

  const selectMop = async (tabIn, mopIn, subMopIn) => {
    if (!mopIn) return;
    setTab(tabIn);
    setMop(mopIn);
    setSubMop(subMopIn);

    const { mopData, subMopData } = paymentModeDetails(mopIn, subMopIn);
    let payload;

    if (tabIn === "CARD") {
      if (subMopIn === "newCard") {
        payload = {
          id: cart_id,
          addressId: address_id,
          paymentMode: mopIn,
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
          paymentMode: mopIn,
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
        paymentMode: mopIn,
        aggregatorName: subMopData?.aggregator_name,
        paymentIdentifier: subMopData?.code ?? "",
        merchantCode: subMopData?.merchant_code,
      };
    }

    if (!enableLinkPaymentOption) {
      if (selectedTab === tabIn) setMopPayload(payload);
      else setMopPayload(null);
    }

    let isValid = true;
    if (isCouponApplied && selectedTab === tabIn) {
      const { code, title, display_message_en, valid } =
        !enableLinkPaymentOption && (await checkCouponValidity(payload));
      isValid = !code || (code && valid);

      if (!isValid) {
        setCouponValidity({ title, message: display_message_en, valid });
        setShowCouponValidityModal(true);
        return;
      }
    }

    let paymentModePayload;
    if (mopIn === "CARD") {
      if (subMopIn === "newCARD") {
        paymentModePayload = {
          id: cart_id,
          address_id: address_id,
          payment_mode: mopIn,
          aggregator_name: mopData?.aggregator_name,
        };
      } else {
        paymentModePayload = {
          id: cart_id,
          address_id: address_id,
          payment_mode: mopIn,
          aggregator_name: subMopData?.aggregator_name,
          payment_identifier: subMopData?.card_id,
        };
      }
    } else {
      paymentModePayload = {
        id: cart_id,
        address_id,
        payment_mode: mopIn,
        aggregator_name: subMopData?.aggregator_name,
        payment_identifier: subMopData?.code ?? "",
        merchant_code: subMopData?.merchant_code,
      };
    }

    if (tabIn === "COD") {
      selectPaymentMode(paymentModePayload).then(() =>
        console.log("Payment mode selected")
      );
      setSelectedTab(tabIn);
      setIsCodModalOpen(true);
    } else if (tabIn === "CARD") {
      if (subMopIn !== "newCARD") setSelectedCard(subMopData);
    } else if (tabIn === "CARDLESS_EMI") {
      setSelectedCardless(subMopData);
    } else if (tabIn === "UPI") {
      if (mopIn === "QR") await showQrCode();
      else if (mopIn === "UPI") await handleProceedToPayClick();
    } else if (tabIn === "WL") {
      setSelectedWallet(subMopData);
    } else if (tabIn === "NB") {
      setSelectedNB(subMopData);
    } else if (tabIn === "PL") {
      setSelectedPayLater(subMopData);
    } else if (tabIn === "Other") {
      setSelectedOtherPayment(subMopData);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabData?.list?.[0]?.code, otherPaymentOptions, selectedTab]);

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

  const pollPaymentStatus = async (qrPayload) => {
    try {
      const result = await checkAndUpdatePaymentStatus(qrPayload);
      const status = result?.data?.checkAndUpdatePaymentStatus?.status;

      if (status === "success") {
        stopPolling();
        setshowUPIModal(false);

        const qrParams = {
          success: "true",
          order_id: qrPayload.merchant_order_id,
          delivery_address_id: address_id,
          billing_address_id: billing_address_id,
        };

        const params = new URLSearchParams();
        for (const key in qrParams) params.append(key, qrParams[key]);

        const finalUrl = `${window.location.origin}${
          locale && locale !== "en" ? `/${locale}` : ""
        }/cart/order-status/?${params.toString()}`;

        window.location.href = finalUrl;
      } else if (status === "failed") {
        setshowUPIModal(false);
        initializeOrResetQrPayment();
        handleShowFailedMessage({ failed: true });
      } else if (result?.errors?.length > 0) {
        const { message } = result.errors[0];
        setshowUPIModal(false);
        initializeOrResetQrPayment();
        handleShowFailedMessage({ failed: true, paymentErrMsg: message });
      }
    } catch (err) {
      handleShowFailedMessage({ failed: true });
    }
  };

  useEffect(() => {
    setSelectedPaymentPayload({
      selectedCard,
      isCardSecure,
      selectedCardless,
      selectedPayLater,
      selectedWallet,
      selectedNB,
      vpa: savedUPISelect || vpa,
      selectedOtherPayment,
      selectedUpiIntentApp,
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
  ]);

  const handleNewCardNumberChange = (value) => {
    const numberValidation = cardValidator.number(value);
    if (cardNumberRef.current) {
      const mask =
        CREDIT_CARD_MASK.find(
          (i) => i.cardtype === (numberValidation?.card?.type ?? "unknown")
        )?.mask ?? CREDIT_CARD_MASK[CREDIT_CARD_MASK.length - 1].mask;

      cardNumberRef?.current?.maskRef?.masked?.updateOptions({ mask });
    }
  };

  const handleNewCardExpiryChange = (value, e) => {
    setCardExpiryError("");
    setCardExpiryDate(value);
    expirationdate_mask_ref.current = e;
  };

  const getTrimmedCardNumber = (number) => number?.substring(number.length - 4);

  const addNewCardShow = () => setAddNewCard(true);
  const hideNewCard = () => setAddNewCard(false);

  const keypressCvv = (event) => {
    let re = /^[0-9]+$/;
    let ok = re.test(event.key);
    if (!ok) {
      event.preventDefault();
      return false;
    }
    return true;
  };

  const handleNewCardSaveState = (e) => setIsCardSecure(e?.target.checked);

  const isJuspayEnabled = () => {
    return paymentOption?.payment_option?.find(
      (opt) =>
        opt.aggregator_name?.toLowerCase() === "juspay" && opt.name === "CARD"
    );
  };

  const payUsingJuspayCard = async () => {
    const newPayload = { ...selectedPaymentPayload };
    const res = await proceedToPay("newCARD", newPayload);
    return res;
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

        if (lastJuspayInitializationRef.current === currentInitKey) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentResponse, juspayErrorMessage, paymentOption]);

  const getCardDetails = () => ({
    cvv: cvvNumber,
    card_number: cardNumber.replace(/[^0-9]/g, ""),
    name: nameOnCard,
    exp_month: expirationdate_mask_ref.current?.value?.split("/")?.[0],
    exp_year: expirationdate_mask_ref.current?.value?.split("/")?.[1],
  });

  const isCardValid = () =>
    isCardNumberValid &&
    nameOnCard &&
    expirationdate_mask_ref.current?.value &&
    cvvNumber &&
    !cardNumberError &&
    !cardNameError &&
    !cardExpiryError &&
    !cardCVVError;

  const payUsingCard = async () => {
    if (isCardValid()) {
      const cardData = getCardDetails();
      const newPayload = {
        ...selectedPaymentPayload,
        selectedCardData: cardData,
      };
      const res = await proceedToPay("newCARD", newPayload);
      if (res?.code) {
        handleShowFailedMessage({ failed: true, paymentErrMsg: res.message });
      }
    } else {
      handleShowFailedMessage({
        failed: true,
        paymentErrHeading: t("resource.checkout.card_verification_failed"),
      });
    }
  };

  const handleProceedToPayClick = async () => {
    try {
      let res = await proceedToPay("UPI", {
        ...selectedPaymentPayload,
        selectedUpiIntentApp: selectedUpiRef.current || selectedUpiIntentApp,
      });

      const { order_id } = res?.payload?.data?.checkoutCart || {};
      setUserOrderId(order_id);

      if (res?.isUPIError) {
        setUPIError(true);
        return;
      }
      if (res?.code || res?.message) {
        handleShowFailedMessage({ failed: true, paymentErrMsg: res.message });
        return;
      }

      if (vpa || savedUPISelect) {
        const {
          data,
          success,
          order_id: oid,
        } = res?.payload?.data?.checkoutCart || {};

        if (success) {
          const payload = {
            aggregator: res.aggregator_name,
            method: data?.method,
            merchant_order_id: oid,
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

  function cancelUPIPayment() {
    setshowUPIModal(false);
    stopPolling();
  }

  const getCardBorder = (card) => {
    if (selectedCard?.card_id === card?.card_id)
      return `${styles.selectedBorder}`;
    return `${styles.nonSelectedBorder}`;
  };

  function getWalletdBorder(wlt) {
    if (selectedWallet?.code === wlt?.code) return `${styles.selectedBorder}`;
    return `${styles.nonSelectedBorder}`;
  }

  function getNBBorder(nb) {
    if (nb && selectedNB?.code === nb?.code) return `${styles.selectedBorder}`;
    return `${styles.nonSelectedBorder}`;
  }

  const getNormalisedList = (selectedTabDataArg) => {
    let tabData = selectedTabDataArg?.list ?? [];
    return tabData.reduce((acc, tabItem) => {
      let temp = { ...tabItem };
      if (tabItem?.code) temp.id = tabItem.aggregator_name + tabItem.code;
      else temp.id = tabItem?.aggregator_name ?? "";
      acc.push(temp);
      return acc;
    }, []);
  };

  function getPayLaterBorder(payLater) {
    if (selectedPayLater?.code === payLater?.code)
      return `${styles.selectedBorder}`;
    return `${styles.nonSelectedBorder}`;
  }

  function getCardlessBorder(emi) {
    if (selectedCardless?.code === emi?.code) return `${styles.selectedBorder}`;
    return `${styles.nonSelectedBorder}`;
  }

  function getOPBorder(op) {
    if (op && selectedOtherPayment.code === op.code)
      return `${styles.selectedBorder}`;
    return `${styles.nonSelectedBorder}`;
  }

  useEffect(() => {
    const qrPaymentOption = paymentOption?.payment_option?.find(
      (opt) => opt.name === "QR"
    );
    if (qrPaymentOption) setIsQrMopPresent(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentOption]);

  const handleScrollToTop = (index) => {
    const element = document.getElementById(`nav-title-${index}`);
    if (element) {
      const headerOffset = 400;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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

  return {
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
  };
}
