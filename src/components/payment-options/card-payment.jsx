import React, { useMemo, useCallback } from "react";
import Modal from "../core/modal/modal";
import CardForm from "../../page-layouts/single-checkout/payment/card-form";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import { useViewport } from "../../helper/hooks";

function CardPayment({
  // UI / layout
  styles,
  t,
  SvgWrapper,

  // state
  addNewCard,
  savedCards,
  selectedCard,
  cvvValues,
  isCvvInfo,
  isCvvNotNeededModal,

  // setters / handlers
  addNewCardShow,
  hideNewCard,
  setIsCvvInfo,
  setIsCvvNotNeededModal,
  handleCvvChange,
  handleCvvInfo,

  // helpers
  getCardBorder,
  getTrimmedCardNumber,
  getCurrencySymbol,
  getTotalValue,

  // payment flow
  selectMop,
  proceedToPay,
  acceptOrder,
  selectedPaymentPayload,
  enableLinkPaymentOption,
  isPaymentLoading,
  loader,
  onPriceDetailsClick,
  StickyPayNow,

  // Card form + related props
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
}) {
  const isTablet = useViewport(0, 768);

  // ✅ Single source of truth for CardForm props (reused everywhere)
  const baseCardFormProps = useMemo(
    () => ({
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
      getCurrencySymbol,
      getTotalValue,
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
      isCvvInfo,
      handleCvvInfo,
      validateCardDetails,
      setCardValidity,
      resetCardValidationErrors,
      enableLinkPaymentOption,
      paymentOption,
      paymentResponse,
      isJuspayEnabled,
      handleShowFailedMessage,
      cardDetails,
      selectMop,
      setIsJuspayCouponApplied,
      isPaymentLoading,
      loader,
    }),
    [
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
      getCurrencySymbol,
      getTotalValue,
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
      isCvvInfo,
      handleCvvInfo,
      validateCardDetails,
      setCardValidity,
      resetCardValidationErrors,
      enableLinkPaymentOption,
      paymentOption,
      paymentResponse,
      isJuspayEnabled,
      handleShowFailedMessage,
      cardDetails,
      selectMop,
      setIsJuspayCouponApplied,
      isPaymentLoading,
      loader,
    ]
  );

  // ✅ Reused pay handler (no duplication)
  const payWithSelectedCard = useCallback(() => {
    proceedToPay("CARD", {
      ...selectedPaymentPayload,
      selectedCardCvv: cvvValues[selectedCard?.card_id],
    });
    acceptOrder();
  }, [
    proceedToPay,
    acceptOrder,
    selectedPaymentPayload,
    cvvValues,
    selectedCard?.card_id,
  ]);

  const totalPayValue = priceFormatCurrencySymbol(
    getCurrencySymbol,
    getTotalValue()
  );

  return (
    <>
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
                    <span>+</span> {t("resource.checkout.new_card")}
                  </button>
                </div>

                <div className={styles.modeOption}>
                  {savedCards?.map((card) => (
                    <div key={card?.card_id}>
                      <div
                        className={`${styles.modeItemWrapper} ${getCardBorder(
                          card
                        )}`}
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
                                  {`${card?.card_issuer} ${card?.card_type} ${t(
                                    "resource.common.card"
                                  )}`}
                                </div>

                                <div className={styles.number}>
                                  <span>****</span>{" "}
                                  {getTrimmedCardNumber(card.card_number)}
                                </div>

                                {selectedCard?.card_id === card?.card_id && (
                                  <div className={styles.whyCvvContainer}>
                                    <span className={styles.cvvNotNeeded}>
                                      {t("resource.checkout.cvv_not_needed")}
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
                                        <p className={styles.cvvNotNeededModal}>
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

                                {selectedCard?.card_id === card?.card_id &&
                                  !card.cvv_less && (
                                    <div className={styles.savedCardCvvWrapper}>
                                      <input
                                        value={cvvValues[card.card_id] || ""}
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
                                        placeholder={`${t(
                                          "resource.checkout.cvv"
                                        )}*`}
                                        className={styles.cvv}
                                      />
                                      <SvgWrapper
                                        svgSrc="cvv"
                                        className={styles.cvvIcon}
                                        onClick={() => setIsCvvInfo(true)}
                                      />
                                    </div>
                                  )}
                              </div>
                            </div>

                            <div
                              className={`${styles.walletLeft} ${styles.onMobileView}`}
                            >
                              {selectedCard?.card_id !== card.card_id ? (
                                <SvgWrapper svgSrc="radio" />
                              ) : (
                                <SvgWrapper svgSrc="radio-selected" />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={styles.modePay}>
                          {!addNewCard && isTablet ? (
                            <StickyPayNow
                              customClassName={styles.visibleOnTab}
                              value={totalPayValue}
                              onPriceDetailsClick={onPriceDetailsClick}
                              disabled={!selectedCard?.card_id}
                              enableLinkPaymentOption={enableLinkPaymentOption}
                              isPaymentLoading={isPaymentLoading}
                              loader={loader}
                              proceedToPay={payWithSelectedCard}
                            />
                          ) : (
                            selectedCard?.card_id === card?.card_id && (
                              <button
                                className={styles.payBtn}
                                onClick={payWithSelectedCard}
                                disabled={isPaymentLoading}
                              >
                                {!isPaymentLoading ? (
                                  <>
                                    {t("resource.common.pay_caps")}{" "}
                                    {totalPayValue}
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
                            <SvgWrapper svgSrc="closeBold" />
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
                  {...baseCardFormProps}
                  isTablet={isTablet}
                  onPriceDetailsClick={onPriceDetailsClick}
                />
              </div>
            )}
          </div>
        )}

        {addNewCard && !isTablet && (
          <div className={styles.newCardWrapper}>
            <div className={styles.addCardHeader}>
              <button onClick={hideNewCard}>
                <SvgWrapper svgSrc="back" />
              </button>
              <div className={styles.newCardHeaderText}>
                {t("resource.checkout.add_new_card")}
              </div>
            </div>

            <CardForm {...baseCardFormProps} />
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
                {...baseCardFormProps}
                addNewCard={addNewCard}
                isTablet={isTablet}
                onPriceDetailsClick={onPriceDetailsClick}
              />
            </div>
          </Modal>
        )}
      </div>

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
    </>
  );
}

export default CardPayment;
