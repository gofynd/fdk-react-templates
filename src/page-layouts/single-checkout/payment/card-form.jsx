import React, { useEffect, useRef } from "react";
import { IMaskInput } from "react-imask";
import * as styles from "./checkout-payment-content.less";
import Modal from "../../../components/core/modal/modal";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import StickyPayNow from "./sticky-pay-now/sticky-pay-now";
import { priceFormatCurrencySymbol } from "../../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

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
  isTablet,
  onPriceDetailsClick = () => {},
  addNewCard,
  isCvvInfo,
  handleCvvInfo,
  validateCardDetails,
  setCardValidity,
  resetCardValidationErrors,
}) {
  const { t } = useGlobalTranslation("translation");
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
      {t('resource.checkout.expiry_date')}<span style={{ color: "red" }}>*</span>
    </>
  );

  const CvvInfo = () => {
    return (
      <div className={styles.cvvInfoContainer}>
        <div className={styles.cvvInfo}>
          {!isTablet && isCvvInfo ? (
            <SvgWrapper
              svgSrc="paymentTooltipArrow"
              className={styles.upArrowMark}
            />
          ) : (
            <span
              onClick={() => handleCvvInfo(false)}
              className={styles.crossMobile}
            >
              {" "}
              <SvgWrapper svgSrc="closeBold" />{" "}
            </span>
          )}
          {cardDetailsData &&
            (!cardDetailsData.card_brand ||
              (cardDetailsData.card_brand &&
                cardDetailsData.card_brand !== "American Express")) && (
              <div className={styles.type}>
                <p className={styles.title}>{t("resource.checkout.what_is_cvv_number")}</p>
                <p className={styles.desc}>
                  {t("resource.checkout.cvv_description")}
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
                <p className={styles.title}>{t("resource.checkout.have_american_express_card")}</p>
                <p className={styles.desc}>
                  {t("resource.checkout.amex_cvv_description")}
                </p>
                <div className={styles.cvImage}>
                  <SvgWrapper svgSrc="amex-card-cvv" />
                </div>
              </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.newCard} id="card-validation">
        <div className={`${styles.cardInputWrapper} ${styles.cardNumberBox}`}>
          <input
            placeholder={`${t('resource.checkout.card_number')}*`}
            className={`${cardNumberError ? styles.error : ""} ${styles.cardNumber}`}
            id="card-number"
            onPaste={handleCardNumberPaste}
            onBlur={validateCardNumber}
          />
          {(cardNumber || cardNumberError) && (
            <span
              className={`${styles.inputName} ${cardNumberError ? styles.errorInputName : ""}`}
            >
              {t('resource.checkout.card_number')}<span className={styles.required}>*</span>
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
            placeholder={`${t('resource.checkout.name_on_card')}*`}
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
              {t('resource.checkout.name_on_card')}<span className={styles.required}>*</span>
            </span>
          )}
          {cardNameError && (
            <div className={styles.formError}>{cardNameError}</div>
          )}
        </div>
        <div
          className={`${styles.cardDateCvvWrapper} ${!loggedIn ? styles.marginBottom : ""}`}
        >
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
              placeholder={`${t('resource.checkout.expiry_date')}*`}
              className={`${cardExpiryError ? styles.error : ""} ${styles.cardExpiry}`}
              onBlur={validateCardExpiryDate}
            />
            {(cardExpiryDate || cardExpiryError) && (
              <span
                className={`${styles.inputName} ${cardExpiryError ? styles.errorInputName : ""}`}
              >
                {t('resource.checkout.expiry_date')}<span className={styles.required}>*</span>
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
              placeholder={`${t('resource.checkout.cvv')}*`}
              className={`${cardCVVError ? styles.error : ""} ${styles.cardCvv}`}
              onChange={handleCvvNumberInput}
              onBlur={validateCvv}
            />
            <div
              className={`${styles.cvvContainer} ${styles.cvv} ${cardCVVError ? styles.cvvError : ""}`}
              onMouseEnter={() => {
                if (!isTablet) {
                  handleCvvInfo(true);
                }
              }}
              onMouseLeave={() => {
                if (!isTablet) {
                  handleCvvInfo(false);
                }
              }}
            >
              <SvgWrapper
                svgSrc="cvv"
                className={`${styles.cvv}`}
                onClick={() => handleCvvInfo(true)}
              />
              {!isTablet && isCvvInfo && <CvvInfo />}
            </div>
            {(cvvNumber || cardCVVError) && (
              <span
                className={`${styles.inputName} ${cardCVVError ? styles.errorInputName : ""}`}
              >
                {t('resource.checkout.cvv')}<span className={styles.required}>*</span>
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
              {t('resource.checkout.save_this_card_rbi_guidelines')}
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
                    <span style={{ paddingInlineStart: "8px", fontSize: "14px" }}>
                      {t('resource.checkout.improve_your_card_security')}
                    </span>
                  </div>
                );
              })()}
            >
              <div className={styles.rbiGuidelinesContent}>
                <ul>
                  <li className="fontBody">
                    {t('resource.checkout.card_consent_request_1')}
                  </li>
                  <li className="fontBody">
                  {t('resource.checkout.card_consent_request_2')}
                  </li>
                </ul>
              </div>
            </Modal>
          </div>
        )}
      </div>
      <div>
        {!addNewCard && isTablet ? (
          <StickyPayNow
            customClassName={styles.visibleOnTab}
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
            {t("resource.common.pay_caps")} {priceFormatCurrencySymbol(getCurrencySymbol, getTotalValue())}
          </button>
        )}
      </div>
      {isCvvInfo && isTablet && (
        <Modal isOpen={isCvvInfo} hideHeader={true}>
          <CvvInfo />
        </Modal>
      )}
    </>
  );
}

export default CardForm;
