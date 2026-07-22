import React, { useEffect, useState } from "react";
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
import Skeleton from "../../../components/core/skeletons/skeleton";
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
import { useFPI } from "fdk-core/utils";

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
    isPaymentDisabled = false,
    isPaymentOptionsRefreshing,
    splitPaymentConfig,
    onSplitPaymentChange,
    onSplitPaymentAmountChange,
    onSplitPaymentAmountBlur,
    onSplitCodBack,
    onSplitCodContinue,
  } = payment;
  const shouldDefaultSelectSplitPayment =
    splitPaymentConfig?.defaultSelected === true;
  const isResumeSplitPayment =
    splitPaymentConfig?.isResumeSplitPayment === true ||
    splitPaymentConfig?.is_resume_split_payment === true;
  const [isSplitPaymentSelected, setIsSplitPaymentSelected] = useState(
    shouldDefaultSelectSplitPayment
  );
  const [splitPaymentAmount, setSplitPaymentAmount] = useState("");
  const [splitPaymentAmountError, setSplitPaymentAmountError] = useState("");
  const [
    shouldEnableSplitPaymentAfterCouponRemoval,
    setShouldEnableSplitPaymentAfterCouponRemoval,
  ] = useState(false);
  const [
    isSplitPaymentCouponValidating,
    setIsSplitPaymentCouponValidating,
  ] = useState(false);

  useEffect(() => {
    const isTruthySplitFlag = (value) =>
      value === true || String(value).toLowerCase() === "true";
    const isSplitCodPreviewConfig =
      isTruthySplitFlag(splitPaymentConfig?.is_split_cod_available) &&
      !isTruthySplitFlag(splitPaymentConfig?.isSplitCodPaymentActive);

    setIsSplitPaymentSelected((currentValue) => {
      const shouldKeepCurrentSelection =
        currentValue && splitPaymentConfig?.enabled === true;
      const nextValue =
        shouldDefaultSelectSplitPayment || shouldKeepCurrentSelection;

      if (!nextValue && !isSplitCodPreviewConfig) {
        setSplitPaymentAmount("");
        setSplitPaymentAmountError("");
      }

      return nextValue;
    });
  }, [
    shouldDefaultSelectSplitPayment,
    splitPaymentConfig?.enabled,
    splitPaymentConfig?.is_split_cod_available,
    splitPaymentConfig?.isSplitCodPaymentActive,
  ]);

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
    setCouponValidity,
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

  const uiProps = { styles, t, SvgWrapper, StickyPayNow, isTablet };
  const fpi = useFPI();
  const getPayNowValue =
    typeof payment?.getPayNowValue === "function"
      ? payment.getPayNowValue
      : getTotalValue;
  const isPaymentActionDisabled = Boolean(isPaymentDisabled);
  const amountProps = { getCurrencySymbol, getTotalValue: getPayNowValue };
  const shouldShowFullPaymentSkeleton =
    isLoading && !isPaymentOptionsRefreshing;
  const isSplitPaymentEnabled = splitPaymentConfig?.enabled === true;
  const isSplitPaymentCheckboxDisabled =
    splitPaymentConfig?.checkboxDisabled === true ||
    splitPaymentConfig?.disableCheckbox === true ||
    splitPaymentConfig?.isCheckboxDisabled === true;
  const isSplitPaymentLoading = splitPaymentConfig?.isLoading === true;
  const shouldShowSplitPaymentOptions =
    isSplitPaymentEnabled && isSplitPaymentSelected;
  const shouldShowStoreCredit =
    partialPaymentOption?.list[0]?.balance?.account?.status !== "INACTIVE" &&
    !shouldShowSplitPaymentOptions &&
    splitPaymentConfig?.hideStoreCredit !== true;
  const shouldHidePaymentOptions =
    !getTotalValue() && !shouldShowSplitPaymentOptions;
  const splitPaymentCurrencySymbol =
    splitPaymentConfig?.amountPrefix ||
    (typeof getCurrencySymbol === "function"
      ? getCurrencySymbol()
      : getCurrencySymbol) ||
    "₹";
  const splitPaymentCount =
    splitPaymentConfig?.splitCount || splitPaymentConfig?.availableSplits || 0;
  const splitPaymentLabel = splitPaymentConfig?.label || "Split Payment";
  const splitPaymentAvailabilityLabel =
    splitPaymentConfig?.availabilityLabel ||
    `${splitPaymentCount} splits available`;
  const splitPaymentInputLabel =
    splitPaymentConfig?.inputLabel || "Enter Amount";
  const splitPaymentInputAssistiveText =
    splitPaymentConfig?.assistiveText ||
    "Specify amount that you want to process for the first payment";
  const splitPaymentInputErrorText =
    splitPaymentConfig?.errorText ||
    "Split amount should be less than the total amount";
  const splitPaymentMinAmountErrorText =
    splitPaymentConfig?.minAmountErrorText || "Split amount should be at least";
  const splitPaymentRemainingAmountErrorText =
    splitPaymentConfig?.remainingAmountErrorText ||
    "Split amount should not be greater than remaining amount";
  const shouldAllowFullSplitAmount =
    splitPaymentConfig?.allowFullAmount === true ||
    splitPaymentConfig?.allowFullRemainingAmount === true;
  const isTruthySplitCodFlag = (value) =>
    value === true || String(value).toLowerCase() === "true";
  const isSplitCodAvailable = isTruthySplitCodFlag(
    splitPaymentConfig?.is_split_cod_available ??
      splitPaymentConfig?.isSplitCodAvailable
  );
  const isSplitCodPaymentActive = isTruthySplitCodFlag(
    splitPaymentConfig?.isSplitCodPaymentActive
  );

  const formatSplitPaymentAmount = (amount) =>
    amount
      ? priceFormatCurrencySymbol(
          splitPaymentCurrencySymbol,
          amount,
          "en-IN",
          null,
          true
        )
      : "";

  const getNumericAmount = (amount) => {
    const numericAmount = Number(String(amount || "").replace(/[^\d.]/g, ""));

    return Number.isFinite(numericAmount) ? numericAmount : 0;
  };
  const getRoundedCurrencyAmount = (amount) =>
    Math.round((Number(amount) + Number.EPSILON) * 100) / 100;

  const getFormattedSplitLimitAmount = (amount) =>
    priceFormatCurrencySymbol(
      splitPaymentCurrencySymbol,
      amount,
      "en-IN",
      null,
      true
    );

  const getMinTransactionAmount = (baseAmount) => {
    const minTransactionLimit =
      splitPaymentConfig?.minTransactionLimit ||
      splitPaymentConfig?.min_transaction_limit ||
      {};
    const minTransactionValue = getNumericAmount(
      splitPaymentConfig?.minTransactionAmount ?? minTransactionLimit?.value
    );
    const minTransactionLimitType = String(
      minTransactionLimit?.limit_type || minTransactionLimit?.limitType || ""
    )
      .trim()
      .toLowerCase();
    const minTransactionBaseAmount = getNumericAmount(
      splitPaymentConfig?.minTransactionBaseAmount ??
        splitPaymentConfig?.min_transaction_base_amount
    );

    if (!minTransactionValue) {
      return 0;
    }

    if (minTransactionLimitType === "percentage") {
      return (
        (minTransactionBaseAmount || getNumericAmount(baseAmount)) *
        minTransactionValue
      ) / 100;
    }

    return minTransactionValue;
  };

  const getSplitPaymentAmountError = (amount) => {
    const hasSplitAmount = String(amount ?? "").trim() !== "";
    const splitAmount = getNumericAmount(amount);
    const totalAmount = getNumericAmount(getTotalValue?.());
    const splitPaymentTotalAmount = getNumericAmount(
      splitPaymentConfig?.totalAmount ?? splitPaymentConfig?.total_amount
    );
    const remainingAmount = getNumericAmount(
      splitPaymentConfig?.remainingAmount ??
        splitPaymentConfig?.remaining_amount
    );
    const minTransactionAmount = getMinTransactionAmount(
      splitPaymentTotalAmount || totalAmount
    );

    if (
      hasSplitAmount &&
      minTransactionAmount &&
      splitAmount < minTransactionAmount
    ) {
      return `${splitPaymentMinAmountErrorText} ${getFormattedSplitLimitAmount(
        minTransactionAmount
      )}`;
    }

    if (hasSplitAmount && remainingAmount && splitAmount > remainingAmount) {
      return `${splitPaymentRemainingAmountErrorText} ${getFormattedSplitLimitAmount(
        remainingAmount
      )}`;
    }

    if (
      hasSplitAmount &&
      totalAmount &&
      (shouldAllowFullSplitAmount
        ? splitAmount > totalAmount
        : splitAmount >= totalAmount)
    ) {
      return splitPaymentInputErrorText;
    }

    return "";
  };

  const getDefaultSplitPaymentAmount = () => {
    const configuredAmount = splitPaymentConfig?.defaultAmount;
    const amount = configuredAmount ?? "";

    return amount ? String(amount) : "";
  };

  const normalizeSplitPaymentAmountInput = (value) => {
    const sanitizedValue = String(value || "").replace(/[^\d.]/g, "");
    const decimalPointCount = (sanitizedValue.match(/\./g) || []).length;

    if (decimalPointCount > 1) {
      return null;
    }

    const [wholeAmount = "", decimalAmount = ""] = sanitizedValue.split(".");

    if (!sanitizedValue.includes(".")) {
      return wholeAmount;
    }

    return `${wholeAmount}.${decimalAmount.slice(0, 2)}`;
  };
  const splitPaymentEnteredAmount = getNumericAmount(splitPaymentAmount);
  const splitPaymentCodBaseAmount =
    getNumericAmount(
      splitPaymentConfig?.totalAmount ?? splitPaymentConfig?.total_amount
    ) || getNumericAmount(getTotalValue?.());
  const splitPaymentCodChargeAmount = getNumericAmount(codCharges);
  const splitPaymentCodPayableAmount = getRoundedCurrencyAmount(
    getMinTransactionAmount(splitPaymentCodBaseAmount) ||
      splitPaymentEnteredAmount
  );
  const splitPaymentCodDeliveryAmount = getRoundedCurrencyAmount(
    Math.max(splitPaymentCodBaseAmount - splitPaymentCodPayableAmount, 0) +
      splitPaymentCodChargeAmount
  );
  const hasValidSplitCodAmount = Boolean(
    isSplitCodAvailable && splitPaymentCodPayableAmount > 0
  );
  const shouldShowSplitCodAction = Boolean(
    isSplitCodAvailable && !isSplitCodPaymentActive
  );
  const formattedSplitPaymentCodAmount = hasValidSplitCodAmount
    ? getFormattedSplitLimitAmount(splitPaymentCodPayableAmount)
    : "";
  const formattedSplitPaymentCodDeliveryAmount = hasValidSplitCodAmount
    ? getFormattedSplitLimitAmount(splitPaymentCodDeliveryAmount)
    : "";

  const handleSplitPaymentAmountChange = (event) => {
    const normalizedAmount = normalizeSplitPaymentAmountInput(
      event.target.value
    );

    if (normalizedAmount === null) {
      return;
    }

    const errorMessage = getSplitPaymentAmountError(normalizedAmount);

    setSplitPaymentAmount(normalizedAmount);
    setSplitPaymentAmountError(errorMessage);
    onSplitPaymentAmountChange?.(
      errorMessage ? "" : formatSplitPaymentAmount(normalizedAmount)
    );
  };

  const handleSplitPaymentAmountBlur = () => {
    if (
      !isSplitPaymentSelected ||
      splitPaymentAmountError ||
      !splitPaymentAmount
    ) {
      return;
    }

    onSplitPaymentAmountBlur?.(formatSplitPaymentAmount(splitPaymentAmount));
  };
  const handleSplitCodContinue = () => {
    const splitCodAmount = String(splitPaymentCodPayableAmount || "");
    const errorMessage = splitCodAmount
      ? getSplitPaymentAmountError(splitCodAmount)
      : "";

    setSplitPaymentAmountError(errorMessage);

    if (errorMessage || !splitPaymentCodPayableAmount) {
      return;
    }

    if (typeof onSplitCodContinue === "function") {
      onSplitCodContinue(formatSplitPaymentAmount(splitCodAmount));
      return;
    }

    onSplitPaymentAmountBlur?.(formatSplitPaymentAmount(splitCodAmount));
  };
  const handleSplitCodBack = () => {
    onSplitCodBack?.();
  };
  const splitCodAction = {
    buttonLabel: `Continue To Pay${
      formattedSplitPaymentCodAmount
        ? ` ${formattedSplitPaymentCodAmount}`
        : ""
    }`,
    disabled: !hasValidSplitCodAmount,
    title: hasValidSplitCodAmount
      ? `Pay ${formattedSplitPaymentCodAmount} now & ${formattedSplitPaymentCodDeliveryAmount} on Delivery`
      : "",
    visible: shouldShowSplitCodAction,
    onContinue: handleSplitCodContinue,
  };

  const applySplitPaymentSelection = (nextValue) => {
    const nextAmount = nextValue
      ? splitPaymentAmount || getDefaultSplitPaymentAmount()
      : "";
    const errorMessage = nextValue
      ? getSplitPaymentAmountError(nextAmount)
      : "";

    setIsSplitPaymentSelected(nextValue);
    setSplitPaymentAmount(nextAmount);
    setSplitPaymentAmountError(errorMessage);
    onSplitPaymentChange?.(nextValue);
    onSplitPaymentAmountChange?.(
      errorMessage ? "" : formatSplitPaymentAmount(nextAmount)
    );
  };

  const handleSplitPaymentChange = async () => {
    if (isSplitPaymentCheckboxDisabled || isSplitPaymentCouponValidating) {
      return;
    }

    const nextValue = !isSplitPaymentSelected;

    if (nextValue && isCouponApplied) {
      const validateAppliedCoupon = splitPaymentConfig?.onAppliedCouponValidate;

      if (typeof validateAppliedCoupon === "function") {
        setIsSplitPaymentCouponValidating(true);

        try {
          const response = await validateAppliedCoupon();
          const couponValidity =
            response?.coupon_validity ||
            response?.data?.validateCoupon?.coupon_validity ||
            {};
          const couponHasCode = Boolean(couponValidity?.code);
          const isCouponValidForSplit =
            couponValidity?.valid === true ||
            (!couponHasCode && couponValidity?.valid !== false);

          if (isCouponValidForSplit) {
            applySplitPaymentSelection(true);
            return;
          }

          setCouponValidity({
            title:
              couponValidity?.title ||
              t(
                "resource.dynamic_label.payment_mode_is_not_valid_for_applied_coupon"
              ),
            message:
              couponValidity?.display_message_en ||
              couponValidity?.message ||
              "Split payment cannot be used with the applied coupon. Do you want to remove the coupon and continue?",
            valid: couponValidity?.valid,
          });
          setShouldEnableSplitPaymentAfterCouponRemoval(true);
          setShowCouponValidityModal(true);
          return;
        } finally {
          setIsSplitPaymentCouponValidating(false);
        }
      }

      setCouponValidity({
        title: t(
          "resource.dynamic_label.payment_mode_is_not_valid_for_applied_coupon"
        ),
        message:
          "Split payment cannot be used with the applied coupon. Do you want to remove the coupon and continue?",
      });
      setShouldEnableSplitPaymentAfterCouponRemoval(true);
      setShowCouponValidityModal(true);
      return;
    }

    applySplitPaymentSelection(nextValue);
  };

  const closeCouponValidityModal = () => {
    if (shouldEnableSplitPaymentAfterCouponRemoval) {
      setShouldEnableSplitPaymentAfterCouponRemoval(false);
      setShowCouponValidityModal(false);
      fpi.custom.setValue("isCouponValid", true);
      return;
    }

    if (mop === "CARD" && subMop === "newCARD") {
      hideNewCard();
    }
    setShowCouponValidityModal(false);
    fpi.custom.setValue("isCouponValid", true);
    unsetSelectedSubMop();
  };

  const confirmCouponRemoval = async () => {
    if (shouldEnableSplitPaymentAfterCouponRemoval) {
      const removeAppliedCoupon = splitPaymentConfig?.onAppliedCouponRemove;
      const isCouponRemoved =
        typeof removeAppliedCoupon === "function"
          ? (await removeAppliedCoupon()) !== false
          : false;

      setShouldEnableSplitPaymentAfterCouponRemoval(false);
      setShowCouponValidityModal(false);
      fpi.custom.setValue("isCouponValid", true);

      if (isCouponRemoved) {
        applySplitPaymentSelection(true);
      }
      return;
    }

    removeCoupon();
    setShowCouponValidityModal(false);
    fpi.custom.setValue("isCouponValid", true);
    if (!selectedUpiIntentApp && selectedTab === "UPI" && isTablet) {
      setSelectedUpiIntentApp("gpay");
    }
  };

  const cancelCouponRemoval = () => {
    if (shouldEnableSplitPaymentAfterCouponRemoval) {
      setShouldEnableSplitPaymentAfterCouponRemoval(false);
      setShowCouponValidityModal(false);
      fpi.custom.setValue("isCouponValid", true);
      return;
    }

    if (mop === "CARD" && subMop === "newCARD") {
      hideNewCard();
    }
    setShowCouponValidityModal(false);
    fpi.custom.setValue("isCouponValid", true);
    unsetSelectedSubMop();
  };

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
    isPaymentDisabled: isPaymentActionDisabled,
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
            selectedTabData={selectedTabData}
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
              isPaymentDisabled={isPaymentActionDisabled}
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
            isPaymentDisabled={
              isResumeSplitPayment ? false : isPaymentActionDisabled
            }
            splitCodAction={splitCodAction}
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
              {selectedTabData?.list?.map((op) => (
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
                              getPayNowValue(),
                              "en-IN",
                              null,
                              true
                            )}
                            disabled={
                              mopSelectionLoading || isPaymentActionDisabled
                            }
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
                            disabled={
                              mopSelectionLoading ||
                              isPaymentLoading ||
                              isPaymentActionDisabled
                            }
                          >
                            {!isPaymentLoading ? (
                              <>
                                {t("resource.common.pay_caps")}{" "}
                                {priceFormatCurrencySymbol(
                                  getCurrencySymbol,
                                  getPayNowValue(),
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
            closeDialog={closeCouponValidityModal}
          >
            <div className={styles.couponValidity}>
              <p className={styles.message}>
                {couponValidity.message || inValidCouponData?.message}
              </p>
              <div className={styles.select}>
                <div
                  className={`${styles.commonBtn} ${styles.yesBtn}`}
                  onClick={confirmCouponRemoval}
                >
                  {t("resource.common.yes")}
                </div>
                <div
                  className={`${styles.commonBtn} ${styles.noBtn}`}
                  onClick={cancelCouponRemoval}
                >
                  {t("resource.common.no")}
                </div>
              </div>
            </div>
          </Modal>
        )}

      {shouldShowFullPaymentSkeleton ? (
        <div className={styles.container}>
          <CheckoutPaymentSkeleton />
        </div>
      ) : (
        <div
          className={`${styles.container} ${enableLinkPaymentOption ? styles.unsetBorder : ""}`}
        >
          {true ? (
            <>
              {shouldShowStoreCredit && (
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
                <>
                  {isSplitPaymentEnabled && (
                    <div
                      className={`${styles.splitPaymentOption} ${isSplitPaymentSelected ? styles.selectedSplitPaymentOption : ""}`}
                    >
                      <div className={styles.splitPaymentDetails}>
                        <div className={styles.splitPaymentHeader}>
                          <label
                            className={`${styles.splitPaymentAction} ${
                              isSplitPaymentCheckboxDisabled
                                ? styles.disabledSplitPaymentAction
                                : ""
                            }`}
                          >
                            <input
                              checked={isSplitPaymentSelected}
                              className={styles.splitPaymentCheckbox}
                              disabled={isSplitPaymentCheckboxDisabled}
                              type="checkbox"
                              onChange={handleSplitPaymentChange}
                            />
                            <span
                              className={styles.splitPaymentCheckboxVisual}
                              aria-hidden="true"
                            />
                            <span className={styles.splitPaymentTitle}>
                              {splitPaymentLabel}
                            </span>
                          </label>
                          <span className={styles.splitPaymentBadge}>
                            <svg
                              className={styles.splitPaymentBadgeIcon}
                              aria-hidden="true"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M9.78 11.16 8.36 12.58 5.79 10l2.57-2.58 1.42 1.42L9.62 9H10c1.1 0 2-.9 2-2V4.41l-1.79 1.8L8.8 4.8 13 .59l4.2 4.2-1.41 1.41L14 4.41V7c0 2.21-1.79 4-4 4h-.38l.16.16Zm4.44 1.68 1.42-1.42L18.21 14l-2.57 2.58-1.42-1.42.16-.16H14c-1.1 0-2 .9-2 2v2.59l1.79-1.8 1.41 1.41-4.2 4.21-4.2-4.2 1.41-1.41L10 19.59V17c0-2.21 1.79-4 4-4h.38l-.16-.16Z"
                                fill="currentColor"
                              />
                            </svg>
                            {splitPaymentAvailabilityLabel}
                          </span>
                        </div>
                        {isSplitPaymentSelected && isSplitPaymentLoading && (
                          <div className={styles.splitPaymentAmountField}>
                            <Skeleton type="text" width={96} height={14} />
                            <Skeleton
                              className={styles.splitPaymentInputSkeleton}
                              type="box"
                              height={48}
                            />
                            <Skeleton type="text" width="70%" height={14} />
                          </div>
                        )}
                        {isSplitPaymentSelected && !isSplitPaymentLoading && (
                          <div className={styles.splitPaymentAmountField}>
                            <label className={styles.splitPaymentFieldLabel}>
                              {splitPaymentInputLabel}
                            </label>
                            <div
                              className={`${styles.splitPaymentInputWrapper} ${
                                splitPaymentAmountError
                                  ? styles.splitPaymentInputError
                                  : ""
                              }`}
                            >
                              <span className={styles.splitPaymentPrefix}>
                                {splitPaymentCurrencySymbol}
                              </span>
                              <input
                                className={styles.splitPaymentInput}
                                inputMode="decimal"
                                onBlur={handleSplitPaymentAmountBlur}
                                onChange={handleSplitPaymentAmountChange}
                                type="text"
                                value={splitPaymentAmount}
                              />
                            </div>
                            <p
                              className={`${styles.splitPaymentAssistiveText} ${
                                splitPaymentAmountError
                                  ? styles.splitPaymentErrorText
                                  : ""
                              }`}
                            >
                              {splitPaymentAmountError ||
                                splitPaymentInputAssistiveText}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {isSplitCodPaymentActive && (
                    <div className={styles.splitPaymentBackRow}>
                      <button
                        aria-label="Back to split payment"
                        className={styles.splitPaymentBackButton}
                        onClick={handleSplitCodBack}
                        type="button"
                      >
                        <span className={styles.splitPaymentBackIcon}>
                          <SvgWrapper svgSrc="back" />
                        </span>
                        <span className={styles.splitPaymentBackText}>
                          {splitPaymentLabel}
                        </span>
                      </button>
                    </div>
                  )}

                  {isPaymentOptionsRefreshing ? (
                    <div
                      className={`${styles.paymentOptions} ${shouldHidePaymentOptions ? styles.displayNone : ""}`}
                    >
                      <CheckoutPaymentSkeleton />
                    </div>
                  ) : (
                    <div
                      className={`${styles.paymentOptions} ${shouldHidePaymentOptions ? styles.displayNone : ""}`}
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
                                    ? t(
                                        "resource.checkout.more_payment_options"
                                      )
                                    : t("resource.checkout.pay_online")}
                                </div>
                              </div>
                              <div
                                className={`${styles.arrowContainer}  ${styles.activeIconColor}`}
                              >
                                <SvgWrapper
                                  className={
                                    selectedTab === "Other" &&
                                    activeMop === "Other"
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
                              onClick={async () => {
                                if (shouldShowSplitCodAction) {
                                  removeDialogueError();
                                  toggleMop(codOption.name);
                                  await selectMop(
                                    codOption.name,
                                    codOption.name,
                                    codOption.name
                                  );

                                  return;
                                }

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
                                    <SvgWrapper
                                      svgSrc={codOption.svg}
                                    ></SvgWrapper>
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
