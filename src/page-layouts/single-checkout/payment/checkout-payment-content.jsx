import React from "react";
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
