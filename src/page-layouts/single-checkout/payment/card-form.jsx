import React, { useEffect, useRef } from "react";
import { IMaskInput } from "react-imask";
import * as styles from "./checkout-payment-content.less";
import Modal from "../../../components/core/modal/modal";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import StickyPayNow from "./sticky-pay-now/sticky-pay-now";
import { priceFormatCurrencySymbol } from "../../../helper/utils";

function CardForm({
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
  validateCardNumber,
  nameOnCard,
  handleNameOnCardInput,
  validateNameOnCard,
  validateCardExpiryDate,
  handleCvvNumberInput,
  validateCvv,
  isCardValid,
  cardDetailsData,
  isMobile,
  onPriceDetailsClick = () => {},
  addNewCard,
  isCvvInfo,
  handleCvvInfo,
  validateCardDetails,
  setCardValidity,
  resetCardValidationErrors,
}) {
  const isFormatterSet = useRef(false);

  useEffect(() => {
    if (!isFormatterSet.current) {
      isFormatterSet.current = true;
      resetCardValidationErrors();
      const parentEl = document.getElementById("card-validation");
      const element = document.getElementById("card-number");
      if (parentEl && element) {
        validateCardDetails(parentEl, element, setCardValidity);
      }
    }
  }, []);

  const starPlaceholder = (
    <>
      Expiry Date<span style={{ color: "red" }}>*</span>
    </>
  );

  return (
    <>
      <div className={styles.newCard} id="card-validation">
        <div className={styles.cardInputWrapper}>
          <input
            placeholder="Card Number*"
            className={`${cardNumberError ? styles.error : ""} ${styles.cardNumber}`}
            id="card-number"
            onPaste={handleCardNumberPaste}
            onBlur={validateCardNumber}
          />
          {(cardNumber || cardNumberError) && (
            <span
              className={`${styles.inputName} ${cardNumberError ? styles.errorInputName : ""}`}
            >
              Card Number<span className={styles.required}>*</span>
            </span>
          )}
          {cardDetailsData && cardDetailsData.logo && (
            <img src={cardDetailsData.logo} className={styles.cardNetwork} />
          )}
          {cardNumberError && (
            <div className={`${styles.formError}`}>{cardNumberError}</div>
          )}
        </div>
        <div className={styles.cardInputWrapper}>
          <input
            maxLength="20"
            type="text"
            placeholder="Name on card*"
            className={`${cardNameError ? styles.error : ""} ${styles.cardName}`}
            ref={nameRef}
            contentEditable="true"
            value={nameOnCard}
            onChange={handleNameOnCardInput}
            onBlur={validateNameOnCard}
          />
          {(nameOnCard || cardNameError) && (
            <span
              className={`${styles.inputName} ${cardNameError ? styles.errorInputName : ""}`}
            >
              Name on Card<span className={styles.required}>*</span>
            </span>
          )}
          {cardNameError && (
            <div className={styles.formError}>{cardNameError}</div>
          )}
        </div>
        <div className={styles.cardDateCvvWrapper}>
          <div className={styles.cardInputWrapper}>
            <IMaskInput
              value={cardExpiryDate}
              onAccept={handleNewCardExpiryChange}
              mask="MM{/}YY"
              blocks={{
                MM: {
                  mask: IMask.MaskedRange,
                  from: 1,
                  to: 12,
                },
                YY: {
                  mask: IMask.MaskedRange,
                  from: 0,
                  to: 99,
                },
              }}
              unmask={true}
              definitions={{
                "/": {
                  mask: "/",
                },
              }}
              placeholder="Expiry Date*"
              className={`${cardExpiryError ? styles.error : ""} ${styles.cardExpiry}`}
              onBlur={validateCardExpiryDate}
            />
            {(cardExpiryDate || cardExpiryError) && (
              <span
                className={`${styles.inputName} ${cardExpiryError ? styles.errorInputName : ""}`}
              >
                Expiry Date<span className={styles.required}>*</span>
              </span>
            )}
            {cardExpiryError && (
              <div className={styles.formError}>{cardExpiryError}</div>
            )}
          </div>
          <div className={styles.cardInputWrapper}>
            <input
              value={cvvNumber}
              type="password"
              onKeyPress={keypressCvv}
              maxLength="4"
              placeholder="CVV*"
              className={`${cardCVVError ? styles.error : ""} ${styles.cardCvv}`}
              onChange={handleCvvNumberInput}
              onBlur={validateCvv}
            />
            <SvgWrapper
              svgSrc="cvv"
              className={styles.cvv}
              onClick={() => handleCvvInfo(true)}
            />
            {(cvvNumber || cardCVVError) && (
              <span
                className={`${styles.inputName} ${cardCVVError ? styles.errorInputName : ""}`}
              >
                CVV<span className={styles.required}>*</span>
              </span>
            )}
            {cardCVVError && (
              <div className={styles.formError}>{cardCVVError}</div>
            )}
          </div>
        </div>
        {loggedIn && (
          <div className={styles.rbiGuidelines}>
            <label htmlFor="terms">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={isCardSecure}
                onChange={handleNewCardSaveState}
              />
            </label>
            <div className={styles.rbiGuidelinesText}>
              Save this card as per RBI Guidelines
            </div>
            <span className={styles.infoIcon}>
              <SvgWrapper
                onClick={() => {
                  setOpenGuidelinesModal(true);
                }}
                svgSrc="info-grey"
              />
            </span>
            <Modal
              isOpen={openGuidelinesModal}
              containerClassName={styles.rbiGuidelinesModal}
              closeDialog={() => {
                setOpenGuidelinesModal(false);
              }}
              title={(() => {
                return (
                  <div style={{ display: "flex", padding: "8px" }}>
                    <SvgWrapper svgSrc="card-payment" />
                    <span style={{ paddingLeft: "8px", fontSize: "14px" }}>
                      Improve your card security
                    </span>
                  </div>
                );
              })()}
            >
              <div className={styles.rbiGuidelinesContent}>
                <ul>
                  <li className="fontBody">
                    Your bank/card network will securely save your card info via
                    tokenization if you give consent for the same.
                  </li>
                  <li className="fontBody">
                    In case you choose to not tokenize, you will have to enter
                    the card details every time you pay.
                  </li>
                </ul>
              </div>
            </Modal>
          </div>
        )}
      </div>
      <div>
        {!addNewCard && isMobile ? (
          <StickyPayNow
            disabled={!isCardValid()}
            value={priceFormatCurrencySymbol(
              getCurrencySymbol,
              getTotalValue()
            )}
            onPriceDetailsClick={onPriceDetailsClick}
            proceedToPay={() => payUsingCard()}
          />
        ) : (
          <button
            className={styles.saveNewCard}
            onClick={() => payUsingCard()}
            disabled={!isCardValid()}
          >
            PAY {priceFormatCurrencySymbol(getCurrencySymbol, getTotalValue())}
          </button>
        )}
      </div>
      {isCvvInfo && (
        <Modal isOpen={isCvvInfo} closeDialog={() => handleCvvInfo(false)}>
          <div className={styles.cvvInfo}>
            {cardDetailsData &&
              (!cardDetailsData.card_brand ||
                (cardDetailsData.card_brand &&
                  cardDetailsData.card_brand !== "American Express")) && (
                <div className={styles.type}>
                  <p className={styles.title}>What is CVV Number?</p>
                  <p className={styles.desc}>
                    It is a 3-digit code on the back of your card.
                  </p>
                  <div className={styles.cvImage}>
                    <SvgWrapper svgSrc="non-amex-card-cvv" />
                  </div>
                </div>
              )}
            {cardDetailsData &&
              (!cardDetailsData.card_brand ||
                (cardDetailsData.card_brand &&
                  cardDetailsData.card_brand === "American Express")) && (
                <div className={styles.type}>
                  <p className={styles.title}>Have American Express Card?</p>
                  <p className={styles.desc}>
                    It is a 4-digit number on the front, just above your credit
                    card number.
                  </p>
                  <div className={styles.cvImage}>
                    <SvgWrapper svgSrc="amex-card-cvv" />
                  </div>
                </div>
              )}
          </div>
        </Modal>
      )}
    </>
  );
}

export default CardForm;
