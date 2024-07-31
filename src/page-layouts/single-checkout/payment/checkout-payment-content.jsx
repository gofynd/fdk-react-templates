import React, { useEffect, useRef, useState } from "react";
import * as styles from "./checkout-payment-content.less";
// import PaymentSDK from "./payment-sdk";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import { useSearchParams } from "react-router-dom";
import Loader from "../../../components/loader/loader";
import IMask from "imask";
import cardValidator from "card-validator";

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

function CheckoutPaymentContent({ payment }) {
  const {
    sdkLoaded,
    selectedTab,
    selectedTabData,
    setSdkLoaded,
    proceedToPay,
    getTotalValue,
    sdksToInitialize,
    PaymentOptionsList,
    setSelectedTab,
    getCurrencySymbol,
    loggedIn,
    paymentOption,
    isLoading,
  } = payment;

  //card
  const [addNewCard, setAddNewCard] = useState(false);
  const [selectedCardCVV, setSelectedCardCVV] = useState("");
  const [cvvNumber, setCvvNumber] = useState("");
  const [showError, setShowError] = useState(false);
  const [cardNumberError, setCardNumberError] = useState(false);
  const [cardExpiryError, setCardExpiryError] = useState(false);
  const [cardCVVError, setCardCVVError] = useState(false);
  const [cardNameError, setCardNameError] = useState(false);
  const [isCardSecure, setIsCardSecure] = useState(true);
  const [isSavedCardSecure, setIsSavedCardSecure] = useState(null);
  const [searchParams] = useSearchParams();
  const cart_id = searchParams.get("id");
  const address_id = searchParams.get("address_id");
  const nameRef = useRef(null);
  const cardNumberRef = useRef(null);
  const expirationDateRef = useRef(null);

  const [selectedCard, setSelectedCard] = useState(null);
  // const [selectedCardData, setSelectedCardData] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState({});

  const [vpa, setvpa] = useState("");

  const [selectedNB, setSelectedNB] = useState({});
  const [selectedOtherNB, setSelectedOtherNB] = useState({});

  const [selectedPayLater, setSelectedPayLater] = useState({});

  const [selectedCardless, setSelectedCardless] = useState({});

  const [selectedPaymentPayload, setSelectedPaymentPayload] = useState({
    selectedCard: selectedCard,
    // selectedCardData: selectedCardData,
    isCardSecure: isCardSecure,
    selectedCardless: selectedCardless,
    selectedPayLater: selectedPayLater,
    selectedWallet: selectedWallet,
    selectedOtherNB: selectedOtherNB,
    selectedNB: selectedNB,
    vpa: vpa,
  });

  useEffect(() => {
    setSelectedPaymentPayload({
      selectedCard: selectedCard,
      // selectedCardData: selectedCardData,
      isCardSecure: isCardSecure,
      selectedCardless: selectedCardless,
      selectedPayLater: selectedPayLater,
      selectedWallet: selectedWallet,
      selectedOtherNB: selectedOtherNB,
      selectedNB: selectedNB,
      vpa: vpa,
    });
  }, [
    selectedCard,
    // selectedCardData,
    selectedCardless,
    selectedPayLater,
    selectedWallet,
    selectedOtherNB,
    selectedNB,
    vpa,
    isCardSecure,
  ]);

  const initiateMask = () => {
    name = nameRef.current;
    // Mask the Credit Card Number Input
    cardnumber_mask = new IMask(cardNumberRef.current, {
      mask: CREDIT_CARD_MASK,
      dispatch: function (appended, dynamicMasked) {
        for (let i = 0; i < dynamicMasked.compiledMasks.length; i++) {
          let re = dynamicMasked.compiledMasks[i].cardtype;
          if (
            numberValidation?.card?.type &&
            numberValidation?.card?.type === re &&
            dynamicMasked?.unmaskedValue
          ) {
            return dynamicMasked.compiledMasks[i];
          } else {
            return dynamicMasked.compiledMasks[
              dynamicMasked.compiledMasks.length - 1
            ];
          }
        }
      },
    });

    // Mask the Expiration Date
    expirationdate_mask = new IMask(expirationDateRef.current, {
      mask: "MM{/}YY",
      blocks: {
        YY: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 99,
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
        },
      },
    });

    cardnumber_mask.on("accept", () => {
      numberValidation = cardValidator?.number(cardnumber_mask.value);
    });

    expirationdate_mask.on("accept", () => {});
  };

  const getTrimmedCardNumber = (number) => {
    // Implement the logic to trim the card number
    return number?.substring(number.length - 4);
  };

  const getCardBorder = (card) => {
    // Implement the logic to determine the card border class

    if (selectedCard?.card_id === card?.card_id) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  };

  const handleSavedCardState = (e) => {
    // Implement the logic to handle the saved card state
    setsetisSavedCardSecure(e.target.checked);
  };

  const addNewCardShow = () => {
    setAddNewCard(true);
    initiateMask();
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

  const handleCardSaveState = () => {
    // Implement the logic to handle the card save state
    setIsCardSecure((pre) => !pre);
  };
  const isPayByCardCvv = () => {
    if (!cvvNumber) {
      setCardCVVError("Enter CVV");
      setShowError(true);
      return false;
    } else if (cvvNumber.toString().length > 4) {
      setCardCVVError("Invalid CVV");
      setShowError(true);
      return false;
    }
    return true;
  };

  const checkEmpty = () => {
    let bEmpty = false;
    if (!cardnumber_mask.value) {
      setCardNumberError("This field is required");
      bEmpty = true;
    }
    if (!expirationdate_mask.value) {
      setCardExpiryError("This field is required");
      bEmpty = true;
    }
    if (!name.value) {
      setCardNameError("This field is required");
      bEmpty = true;
    }
    return bEmpty;
  };
  const checkExpiry = () => {
    var d = new Date();
    var currentYear = d.getFullYear();
    var currentMonth = d.getMonth() + 1;

    //get expiry y, m entered
    var expYear = parseInt(expirationdate_mask.value.split("/")[1], 10) + 2000;
    var expMonth = parseInt(expirationdate_mask.value.split("/")[0], 10);

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      //card has expired
      setCardExpiryError("The expiry date has passed");
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
      if (numberValidation?.card === null || !numberValidation?.card) {
        setCardNumberError("Card number is invalid");
        return false;
      }
      //Only if card number is proper and expiry date is proper
      if (expirationdate_mask.masked.isComplete) {
        return !checkExpiry();
      } else {
        setCardExpiryError("Expiry time is invalid");
      }
      return false;
    }
    return false;
  };

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
    const name = nameRef.current;
    let obj = {
      cvv: cvvNumber,
      card_number: cardnumber_mask.value.replace(/\s/g, ""),
      name: name.value,
      exp_month: expirationdate_mask.value.split("/")[0],
      exp_year: expirationdate_mask.value.split("/")[1],
    };
    console.log(obj, "obj");
    // setSelectedCardData(obj);
    return obj;
  };

  const proceedToPayCard = () => {
    if (isCardDetailsValid()) {
      let cardData = getCardDetails();
      const newPayload = {
        ...selectedPaymentPayload,
        selectedCardData: cardData,
      };
      proceedToPay("newCARD", newPayload);
    } else {
      console.error("Card Verification Failed");
    }
  };

  //

  function getWalletdBorder(wlt) {
    if (selectedWallet?.code === wlt?.code) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  }

  function validateVPA() {
    let validPattern = /^.+@.+$/;
    return validPattern.test(vpa);
  }
  const topFiveBank = selectedTabData?.list?.slice(0, 5) ?? [];

  function getNBBorder(nb) {
    if (nb && selectedNB?.code === nb?.code) {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  }
  function getNBOtherBorder() {
    if (selectedNB == "otherNB") {
      return `${styles.selectedBorder}`;
    }
    return `${styles.nonSelectedBorder}`;
  }
  const restBanks = selectedTabData?.list?.slice(5) ?? [];

  function selectBank(item) {
    console.log(item, "item");
    setSelectedOtherNB(JSON.parse(item.target.value));
  }

  const getNormalisedList = (selectedTabData) => {
    let tabData = selectedTabData?.list;
    return tabData.reduce((acc, tab) => {
      if (tab.aggregator_name == "Potlee") {
        let temp = { ...tab };
        temp.isDisabled = true;
        temp.id =
          tab.aggregator_name + tab.code + selectedTabData.payment_mode_id;
        acc.push(temp);
        return acc;
      } else if (tab.aggregator_name == "Simpl") {
        let temp = tab;
        temp.isDisabled = { ...tab };
        temp.id =
          tab.aggregator_name + tab.code + selectedTabData.payment_mode_id;
        acc.push(temp);
        return acc;
      } else if (tab.aggregator_name == "Rupifi") {
        let temp = tab;
        temp.isDisabled = { ...tab };
        temp.id =
          tab.aggregator_name + tab.code + selectedTabData.payment_mode_id;
        acc.push(temp);
        return acc;
      } else {
        acc.push(tab);
        return acc;
      }
    }, []);
  };

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

  useEffect(() => {
    let option = PaymentOptionsList();
    console.log(option);
    if (option?.length) setSelectedTab(option[0].name);
  }, [paymentOption]);

  return (
    <>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <div className={styles.container}>
          {true ? (
            <>
              <div className={styles.navigationLink}>
                {PaymentOptionsList().map((opt, index) => (
                  <div
                    className={styles.linkWrapper}
                    key={opt.display_name}
                    onClick={() => setSelectedTab(opt.name)}
                  >
                    <div
                      className={` ${
                        selectedTab === opt.name ? styles.indicator : ""
                      }`}
                    >
                      &nbsp;
                    </div>
                    <div className={styles.link}>
                      <div className={styles.icon}>
                        {/* <img src={opt.svg} alt="" /> */}
                        <SvgWrapper svgSrc={opt.svg}></SvgWrapper>
                      </div>
                      <div className={styles.modeName}>{opt.display_name}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.navigationTab}>
                {selectedTab === "CARD" && (
                  <div className={styles.cardTab}>
                    <div
                      className={styles.savedCardWrapper}
                      style={{ display: addNewCard ? "none" : "block" }}
                    >
                      <div className={styles.cardHeader}>
                        Saved Credit/Debit Cards
                      </div>
                      <div className={styles.cardList}>
                        {selectedTabData &&
                          selectedTabData.list &&
                          selectedTabData.list.map((card, index) => (
                            <label
                              key={card.card_id}
                              onClick={() => setSelectedCard(card)}
                            >
                              {/* <input
                                type="radio"
                                name="card"
                                value={card}
                                checked={selectedCard === card}
                                onChange={(e) =>
                                  setSelectedCard(e.target.value)
                                }
                              /> */}
                              <div
                                className={`${styles.cardItem} ${getCardBorder(
                                  card
                                )}`}
                              >
                                <div className={styles.cardDetailsWrapper}>
                                  <div className={styles.leftWrapper}>
                                    <div className={styles.cardLeft}>
                                      {(!selectedCard ||
                                        selectedCard.card_id !==
                                          card.card_id) && (
                                        <SvgWrapper
                                          svgSrc={"radio"}
                                        ></SvgWrapper>
                                      )}
                                      {selectedCard &&
                                        selectedCard.card_id ===
                                          card.card_id && (
                                          <SvgWrapper
                                            svgSrc={"radio-selected"}
                                          ></SvgWrapper>
                                        )}
                                    </div>
                                    <div className={styles.cardMiddle}>
                                      <div className={styles.numberLogo}>
                                        <div className={styles.number}>
                                          <span>****</span>
                                          {getTrimmedCardNumber(
                                            card.card_number
                                          )}
                                        </div>
                                        <div className={styles.logo}>
                                          <img
                                            src={card.card_brand_image}
                                            alt={card.nickname}
                                          />
                                        </div>
                                      </div>
                                      {card.compliant_with_tokenisation_guidelines && (
                                        <div className={styles.securedCard}>
                                          <img
                                            src="/public/assets/shield-green.svg"
                                            alt="rbi-icon"
                                          />
                                          <span
                                            className={styles.securedCardText}
                                          >
                                            secured
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className={styles.rightWrapper}>
                                    <input
                                      className={styles.cardRight}
                                      style={{
                                        visibility:
                                          selectedCard &&
                                          selectedCard.card_id === card.card_id
                                            ? "visible"
                                            : "hidden",
                                      }}
                                      value={selectedCardCVV}
                                      onChange={(e) =>
                                        setSelectedCardCVV(e.target.value)
                                      }
                                      type="text"
                                      autoComplete="off"
                                      maxLength="4"
                                      placeholder="CVV*"
                                    />
                                  </div>
                                </div>
                                {!card.compliant_with_tokenisation_guidelines &&
                                  loggedIn && (
                                    <div className={styles.rbiGuidelines}>
                                      <label htmlFor="terms">
                                        <input
                                          type="checkbox"
                                          id="terms"
                                          name="terms"
                                          checked={
                                            card.compliant_with_tokenisation_guidelines
                                          }
                                          onChange={(e) =>
                                            handleSavedCardState(e)
                                          }
                                        />
                                      </label>
                                      <div className={styles.rbiGuidelinesText}>
                                        Save my card as per RBI Guidelines
                                      </div>
                                      {/* <div className={styles.rbiGuidelineIcon}>
                                  <a
                                    href="/help/card-tokenisation"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src="/public/assets/rbi-guidelines-icon.svg"
                                      alt="rbi-icon"
                                    />
                                  </a>
                                </div> */}
                                    </div>
                                  )}
                                {selectedCard &&
                                  selectedCard.card_id === card.card_id && (
                                    <div>
                                      <div>
                                        <button
                                          className={`${styles.commonBtn} ${styles.payBtn}`}
                                          disabled={
                                            selectedCardCVV.length === 0
                                          }
                                          onClick={() =>
                                            proceedToPay(
                                              "CARD",
                                              selectedPaymentPayload
                                            )
                                          }
                                        >
                                          PAY{" "}
                                          {getCurrencySymbol + getTotalValue()}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </label>
                          ))}
                      </div>
                      <div>
                        <button
                          className={styles.addNewCard}
                          onClick={addNewCardShow}
                        >
                          + Add New Card
                        </button>
                      </div>
                    </div>
                    <div
                      className={styles.newCardWrapper}
                      style={{ display: addNewCard ? "block" : "none" }}
                    >
                      <div className={styles.addCardHeader}>
                        <button onClick={hideNewCard}>
                          <SvgWrapper svgSrc={"back"}></SvgWrapper>
                        </button>
                        <div className={styles.newCardHeaderText}>
                          Pay Using Credit/Debit Card
                        </div>
                      </div>
                      <div className={styles.newCard}>
                        <div className={styles.cardInputWrapper}>
                          <input
                            type="text"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            ref={cardNumberRef}
                            placeholder="Card Number*"
                            className={styles.cardNumber}
                            contentEditable="true"
                          />
                          <div
                            className={`${styles.formError} ${styles.lightXxxs}`}
                          >
                            {cardNumberError}
                          </div>
                        </div>
                        <div className={styles.cardInputWrapper}>
                          <input
                            maxLength="20"
                            type="text"
                            placeholder="Name on Card*"
                            className={styles.cardName}
                            ref={nameRef}
                            contentEditable="true"
                          />
                          <div
                            className={`${styles.formError} ${styles.lightXxxs}`}
                          >
                            {cardNameError}
                          </div>
                        </div>
                        <div className={styles.cardDateCvvWrapper}>
                          <div className={styles.cardInputWrapper}>
                            <input
                              type="text"
                              pattern="[0-9]*"
                              inputMode="numeric"
                              ref={expirationDateRef}
                              placeholder="Expiry Date (mm/yy)*"
                              className={styles.cardExpiry}
                              contentEditable="true"
                            />
                            <div
                              className={`${styles.formError} ${styles.lightXxxs}`}
                            >
                              {cardExpiryError}
                            </div>
                          </div>
                          <div className={styles.cardInputWrapper}>
                            <input
                              value={cvvNumber}
                              type="password"
                              onKeyPress={keypressCvv}
                              maxLength="4"
                              placeholder="CVV*"
                              className={styles.cardCvv}
                              onChange={(e) => setCvvNumber(e.target.value)}
                            />
                            <div
                              className={`${styles.error} ${styles.formError} ${
                                styles.lightXxxs
                              } ${showError ? styles.visible : ""}`}
                            >
                              {cardCVVError}
                            </div>
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
                                onChange={handleCardSaveState}
                              />
                            </label>
                            <div className={styles.rbiGuidelinesText}>
                              Save my card as per RBI Guidelines
                            </div>
                            {/* <div className={styles.rbiGuidelineIcon}>
                        <a
                          href="/help/card-tokenisation"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/public/assets/rbi-guidelines-icon.svg"
                            alt="rbi-icon"
                          />
                        </a>
                      </div> */}
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          className={styles.saveNewCard}
                          onClick={() => proceedToPayCard()}
                        >
                          PAY {getCurrencySymbol + getTotalValue()}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  {selectedTab === "WL" && (
                    <div>
                      <div className={styles.walletHeader}>
                        Select Wallet To Pay
                      </div>
                      <div className={styles.walletOption}>
                        {selectedTabData.list.map((wlt, index) => (
                          <label
                            key={index}
                            onClick={(e) => setSelectedWallet(wlt)}
                          >
                            {/* <input
                        type="radio"
                        name="wallet"
                        value={selectedWallet}
                        checked={selectedWallet === wlt}
                      /> */}
                            <div
                              className={`${
                                styles.walletItem
                              } ${getWalletdBorder(wlt)}`}
                            >
                              <div className={styles.walletLeft}>
                                {(!selectedWallet ||
                                  selectedWallet.code !== wlt.code) && (
                                  <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                                )}
                                {selectedWallet &&
                                  selectedWallet.code === wlt.code && (
                                    // <fdk-inline-svg src="radio-selected" />
                                    <SvgWrapper
                                      svgSrc={"radio-selected"}
                                    ></SvgWrapper>
                                  )}
                              </div>
                              <div className={styles.walletMiddle}>
                                <img
                                  src={wlt.logo_url.small}
                                  alt={wlt.display_name}
                                />
                              </div>
                              <div className={styles.walletRight}>
                                {wlt.display_name}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className={styles.walletPay}>
                        {selectedWallet.code && (
                          <button
                            className={styles.payBtn}
                            onClick={() =>
                              proceedToPay("WL", selectedPaymentPayload)
                            }
                          >
                            PAY {getCurrencySymbol + getTotalValue()}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  {selectedTab === "UPI" && (
                    <div className={styles.upiWrapper}>
                      <div className={styles.upiHeader}>Enter UPI ID</div>
                      <div>
                        <label>
                          <input
                            className={styles.upiInput}
                            type="text"
                            placeholder="Enter UPI ID"
                            value={vpa}
                            onChange={(e) => setvpa(e.target.value)}
                          />
                        </label>
                      </div>
                      <div className={styles.upiPay}>
                        {vpa && validateVPA() && (
                          <button
                            className={`${styles.commonBtn} ${styles.payBtn}`}
                            onClick={() =>
                              proceedToPay("UPI", selectedPaymentPayload)
                            }
                          >
                            PAY {getCurrencySymbol + getTotalValue()}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  {selectedTab === "NB" && (
                    <>
                      <div className={styles.nbHeader}>Select a Bank</div>
                      <div className={styles.nbOption}>
                        {topFiveBank.map((nb, index) => (
                          <label
                            key={nb.display_name}
                            onClick={() => setSelectedNB(nb)}
                          >
                            {/* <input
                        type="radio"
                        name="net-banking"
                        value={selectedNB}
                        checked={selectedNB === nb}
                        onChange={(e) => setSelectedNB(e.target.value)}
                      /> */}
                            <div
                              className={`${styles.nbItem} ${getNBBorder(nb)}`}
                            >
                              <div className={styles.nbLeft}>
                                {(!selectedNB ||
                                  selectedNB.code !== nb.code) && (
                                  <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                                )}
                                {selectedNB && selectedNB.code === nb.code && (
                                  <SvgWrapper svgSrc="radio-selected" />
                                )}
                              </div>
                              <div className={styles.nbMiddle}>
                                <img
                                  src={nb.logo_url.small}
                                  alt={nb.display_name}
                                />
                              </div>
                              <div className={styles.nbRight}>
                                {nb.display_name}
                              </div>
                            </div>
                          </label>
                        ))}
                        {restBanks && (
                          <label
                            key="6"
                            onClick={() => setSelectedNB("otherNB")}
                          >
                            <div
                              className={`${
                                styles.nbItem
                              } ${getNBOtherBorder()}`}
                            >
                              <div className={styles.nbLeft}>
                                {(!selectedNB || selectedNB !== "otherNB") && (
                                  <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                                )}
                                {selectedNB && selectedNB === "otherNB" && (
                                  <SvgWrapper
                                    svgSrc={"radio-selected"}
                                  ></SvgWrapper>
                                )}
                              </div>
                              <div className={styles.nbMiddle}>
                                {/* <fdk-inline-svg src="otherNB" /> */}
                                {/* <img src="" alt="other" srcset="" /> */}
                              </div>
                              <div className={styles.nbRight}>Other Banks</div>
                            </div>
                          </label>
                        )}
                        {selectedNB === "otherNB" && (
                          <select
                            className={styles.otherSelect}
                            onChange={selectBank}
                          >
                            {restBanks.map((nb, index) => (
                              <option
                                key={nb.display_name}
                                value={JSON.stringify(nb)}
                              >
                                {nb.display_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      {(selectedNB.code || selectedNB === "otherNB") && (
                        <div className={styles.nbPay}>
                          <button
                            className={`${styles.commonBtn} ${styles.payBtn}`}
                            onClick={() =>
                              proceedToPay("NB", selectedPaymentPayload)
                            }
                          >
                            PAY {getCurrencySymbol + getTotalValue()}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div>
                  {selectedTab === "COD" && (
                    <>
                      <div className={styles.codHeader}>Pay In Cash</div>
                      {selectedTabData && selectedTabData.cod_charges > 0 && (
                        <div className={styles.codInfo}>
                          Additional{" "}
                          <span style={{ fontWeight: 600 }}>
                            ₹{selectedTabData.cod_charges}
                          </span>{" "}
                          will be charged for cash collection
                        </div>
                      )}
                      <div className={styles.codPay}>
                        <button
                          className={`${styles.commonBtn} ${styles.payBtn}`}
                          onClick={() =>
                            proceedToPay("COD", selectedPaymentPayload)
                          }
                        >
                          PAY {getCurrencySymbol + getTotalValue()}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  {selectedTab === "PL" && (
                    <>
                      <div className={styles.payLaterHeader}>
                        Choose An Option
                      </div>
                      <div className={styles.payLaterOption}>
                        {getNormalisedList(selectedTabData).map(
                          (payLater, index) => (
                            <>
                              {!payLater.isDisabled && (
                                <label
                                  key={payLater.id}
                                  id={payLater.id}
                                  onClick={() => setSelectedPayLater(payLater)}
                                >
                                  <div
                                    className={`${
                                      styles.payLaterItem
                                    } ${getPayLaterBorder(payLater)}`}
                                  >
                                    <div className={styles.payLaterLeft}>
                                      {!selectedPayLater ||
                                      selectedPayLater.code !==
                                        payLater.code ? (
                                        <SvgWrapper
                                          svgSrc={"radio"}
                                        ></SvgWrapper>
                                      ) : (
                                        <SvgWrapper
                                          svgSrc={"radio-selected"}
                                        ></SvgWrapper>
                                      )}
                                    </div>
                                    <div className={styles.payLaterMiddle}>
                                      <img
                                        src={payLater.logo_url.small}
                                        alt={payLater.display_name}
                                      />
                                    </div>
                                    <div className={styles.payLaterRight}>
                                      {payLater.display_name}
                                    </div>
                                  </div>
                                </label>
                              )}
                            </>
                          )
                        )}
                      </div>
                      <div className={styles.payLaterPay}>
                        {selectedPayLater.code && (
                          <button
                            className={`${styles.commonBtn} ${styles.payBtn}`}
                            onClick={() =>
                              proceedToPay("PL", selectedPaymentPayload)
                            }
                          >
                            PAY {getCurrencySymbol + getTotalValue()}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  {selectedTab === "CARDLESS_EMI" && (
                    <>
                      <div className={styles.cardlessHeader}>
                        Choose An Option
                      </div>
                      <div className={styles.cardlessOption}>
                        {selectedTabData.list.map((emi, index) => (
                          <label
                            key={emi.display_name}
                            onClick={() => setSelectedCardless(emi)}
                          >
                            {/* <input
                        type="radio"
                        name="cardless"
                        value={emi}
                        checked={selectedCardless === emi}
                        onChange={(e) => setSelectedCardless(e.target.value)}
                      /> */}
                            <div
                              className={`${
                                styles.cardlessItem
                              } ${getCardlessBorder(emi)}`}
                            >
                              <div className={styles.cardlessLeft}>
                                {!selectedCardless ||
                                selectedCardless.code !== emi.code ? (
                                  <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                                ) : (
                                  <SvgWrapper
                                    svgSrc={"radio-selected"}
                                  ></SvgWrapper>
                                )}
                              </div>
                              <div className={styles.cardlessMiddle}>
                                <img
                                  src={emi.logo_url.small}
                                  alt={emi.display_name}
                                />
                              </div>
                              <div className={styles.cardlessRight}>
                                {emi.display_name}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>

                      <div className={styles.cardlessPay}>
                        {selectedCardless.code && (
                          <button
                            className={`${styles.commonBtn} ${styles.payBtn}`}
                            onClick={() =>
                              proceedToPay(
                                "CARDLESS_EMI",
                                selectedPaymentPayload
                              )
                            }
                          >
                            PAY {getCurrencySymbol + getTotalValue()}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <Loader></Loader>
          )}
        </div>
      )}
    </>
  );
}

export default CheckoutPaymentContent;
