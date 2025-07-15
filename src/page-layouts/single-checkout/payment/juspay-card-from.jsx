import React, { useEffect, useRef, useState } from "react";
import { injectScript, priceFormatCurrencySymbol } from "../../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";
import * as styles from "./checkout-payment-content.less";
import Shimmer from "../../../components/shimmer/shimmer";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import Modal from "../../../components/core/modal/modal";
import StickyPayNow from "./sticky-pay-now/sticky-pay-now";
import { useMobile } from "../../../helper/hooks/useMobile";

const JuspayCardForm = ({
  paymentResponse,
  paymentOption,
  getCurrencySymbol,
  getTotalValue,
  loggedIn,
  setOpenGuidelinesModal,
  openGuidelinesModal,
  onPriceDetailsClick = () => {},
  handleShowFailedMessage,
  cardDetails,
  setIsJuspayCouponApplied
}) => {
  const [isJuspayLoaded, setIsJuspayLoaded] = useState(false);
  const juspayFormRef = useRef(null);
  const { t } = useGlobalTranslation("translation");
  const isMobile = useMobile();
  const [cardDetailsData, setCardDetailsData] = useState(null);
  const lastFetchedCardIsinRef = useRef(null);
  const [isCardBinValidated, setIsCardBinValidated] = useState(false);

  // Error state for each input field
  const [fieldErrors, setFieldErrors] = useState({
    card_number: "",
    name_on_card: "",
    card_exp_month: "",
    card_exp_year: "",
    security_code: "",
  });

  // Track field completion status
  const [fieldCompleted, setFieldCompleted] = useState({
    card_number: false,
    name_on_card: false,
    card_exp_month: false,
    card_exp_year: false,
    security_code: false,
  });

  useEffect(() => {
    const loadJuspayScript = async () => {
      try {
        await injectScript(
          paymentOption?.payment_flows?.juspay?.data?.sdk_link
        );
        setTimeout(() => {
          if (window.Juspay) {
            setIsJuspayLoaded(true);
          }
        }, 500);
      } catch (error) {
        console.error("Failed to load Juspay script:", error);
      }
    };

    loadJuspayScript();
  }, []);

  useEffect(() => {
    if (isJuspayLoaded && window.Juspay && !juspayFormRef.current) {
      try {
        juspayFormRef.current = window.Juspay.Setup({
          payment_form: "#payment_form",
          success_handler: function (status) {
            console.log("Payment success:", status);
          },
          error_handler: function (
            error_code,
            error_message,
            bank_error_code,
            bank_error_message,
            gateway_id
          ) {
            handleShowFailedMessage({
              failed:true,
              paymentErrHeading: error_message,
              // paymentErrMsg:  bank_error_message,
            });
            console.error("Payment error:", {
              error_code,
              error_message,
              bank_error_code,
              bank_error_message,
              gateway_id
            });
          },
          card_bin_digit_count: 6,

          /* Fingerprint will work only if customer_id and client_auth_token are present in set-up as shown below */
          customer: {
            customer_id: paymentOption?.payment_flows?.juspay?.data?.customer_id,
            client_auth_token: paymentOption?.payment_flows?.juspay?.data?.client_auth_token,
          },
          iframe_elements: {
            card_number: {
              /* Class name of the <div> which will hold the iframe element for card number. */
              container: ".card_number_div",
              attributes: {
                /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
                placeholder: `${t("resource.payment.card_number_placeholder")}*`,
              },
            },
            name_on_card: {
              /* Class name of the <div> which will hold the iframe element for card holder name. */
              container: ".name_on_card_div",
              attributes: {
                /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
                placeholder: `${t("resource.payment.name_on_card_placeholder")}*`,
              },
            },
            card_exp_month: {
              /* Class name of the <div> which will hold the iframe element for card expiry month. */
              container: ".card_exp_month_div",
              attributes: {
                /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
                placeholder: `${t("resource.payment.card_exp_month_placeholder")}*`,
              },
            },
            card_exp_year: {
              /* Class name of the <div> which will hold the iframe element for card expiry year. */
              container: ".card_exp_year_div",
              attributes: {
                /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
                placeholder: `${t("resource.payment.card_exp_year_placeholder")}*`,
              },
            },
            security_code: {
              /* Class name of the <div> which will hold the iframe element for card security code. */
              container: ".security_code_div",
              attributes: {
                /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
                placeholder: `${t("resource.payment.security_code_placeholder")}*`,
              },
            },
          },

          /* Set `auto_tab_enabled` flag to true if you want to enable auto-switching between fields when the user types the valid data (recommended but optional).
           * It will have the following order:`card_exp_month` -> `card_exp_year` ->`security_code`. */
          auto_tab_enabled: true,

          /* Set `auto_tab_from_card_number` to either `card_exp_month` or `name_on_card` based on which field is rendered after card_number (recommended but optional).
           * Note 1: Please set `auto_tab_enabled` to `true` as shown above to enable this functionality. */
          auto_tab_from_card_number: "name_on_card",

          /* Set `tokenize_support` flag to true if you want to check tokenize support response of a particular card bin. */
          tokenize_support: true,

          styles: {
            "input:focus": {
              outline: "none",
            },
          },

          iframe_element_callback: async function (event) {
            console.log("event", event);
            if(event?.target_element === "card_number"){
              if(event?.card_isin && event.card_isin !== lastFetchedCardIsinRef.current){
                lastFetchedCardIsinRef.current = event.card_isin;
                setIsCardBinValidated(async (prev) => {
                  if(prev === event.card_isin){
                    return prev;
                  } else {
                    const cardDetailsResponse = await cardDetails(event.card_isin);
                    setIsJuspayCouponApplied((prev) => !prev);
                    setCardDetailsData(cardDetailsResponse?.data?.payment?.card_details?.data);
                    return event.card_isin;
                  }
                });
              }

              if(!event?.card_isin){
                setCardDetailsData(null);
                lastFetchedCardIsinRef.current = null;
              }
            }

            if (event && event.target_element) {
              const fieldName = event.target_element;
              let errorMessage = "";

              if (event.type === "keyup" || event.type === "blur") {
                // Update field completion status
                setFieldCompleted((prevCompleted) => ({
                  ...prevCompleted,
                  [fieldName]: !event.empty && event.valid !== false,
                }));

                if (event.empty) {
                  errorMessage = getEmptyFieldError(fieldName);
                } else if (event.valid === false) {
                  errorMessage = getInvalidFieldError(fieldName, event);
                }

                // Update error state
                setFieldErrors((prevErrors) => ({
                  ...prevErrors,
                  [fieldName]: errorMessage,
                }));
              }
            }
          },
        });

        console.log("Juspay form initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Juspay form:", error);
      }
    }
  }, [isJuspayLoaded]);

  useEffect(() => {
    return () => {
      if (juspayFormRef.current) {
        juspayFormRef.current = null;
      }
    };
  }, []);

  const getEmptyFieldError = (fieldName) => {
    const errorMessages = {
      card_number: t("resource.payment.card_number_required"),
      name_on_card: t("resource.payment.name_on_card_required"),
      card_exp_month: t("resource.payment.card_exp_month_required"),
      card_exp_year: t("resource.payment.card_exp_year_required"),
      security_code: t("resource.payment.security_code_required"),
    };
    return errorMessages[fieldName] || t("resource.payment.invalid_value");
  };

  const getInvalidFieldError = (fieldName, event) => {
    const errorMessages = {
      card_number: t("resource.payment.invalid_card_number"),
      name_on_card: t("resource.payment.invalid_name_on_card"),
      card_exp_month: t("resource.payment.invalid_card_exp_month"),
      card_exp_year: t("resource.payment.invalid_card_exp_year"),
      security_code: t("resource.payment.invalid_security_code"),
    };

    // Special handling for expiry validation
    if (
      (fieldName === "card_exp_month" || fieldName === "card_exp_year") &&
      event.expiry_valid === false
    ) {
      return t("resource.payment.invalid_expiry_date");
    }

    return errorMessages[fieldName] || t("resource.payment.invalid_value");
  };

  const isCardValid = () => {
    const hasErrors = Object.values(fieldErrors).some((error) => error !== "");
    const allFieldsCompleted = Object.values(fieldCompleted).every(
      (completed) => completed
    );
    return !hasErrors && allFieldsCompleted;
  };

  return (
    <>
      {!isJuspayLoaded ? (
        <Shimmer height="100px" />
      ) : (
        <form className="juspay_inline_form" id="payment_form">
          <input
            type="hidden"
            className="merchant_id"
            value={paymentResponse?.data?.merchant_id}
          />
          <input
            type="hidden"
            className="order_id"
            value={paymentResponse?.data?.order_id}
          />

          <div className={`${styles.cardInputWrapper} ${styles.cardNumberBox} ${styles.juspayCardNumberBox}`}>
            <div className={`card_number_div`}></div>
            {cardDetailsData && cardDetailsData.logo && (
              <img
                src={cardDetailsData.logo}
                className={`${styles.juspayCardNetwork}`}
              />
            )}
            {fieldErrors.card_number && (
              <div className={`${styles.formError}`}>
                {fieldErrors.card_number}
              </div>
            )}
          </div>

          <div className={styles.cardInputWrapper}>
            <div className="name_on_card_div"></div>
            {fieldErrors.name_on_card && (
              <div className={`${styles.formError}`}>
                {fieldErrors.name_on_card}
              </div>
            )}
          </div>

          <div
            className={`${styles.cardDateCvvJuspayWrapper} ${styles.cardInputWrapper} ${!loggedIn && !fieldErrors.card_exp_month && !fieldErrors.card_exp_year && !fieldErrors.security_code ? styles.marginBottom : ""}`}
          >
            <div className="card_exp_month_div"></div>
            <div className="card_exp_year_div"></div>
            <div className="security_code_div"></div>
          </div>
          {(fieldErrors.card_exp_month ||
            fieldErrors.card_exp_year ||
            fieldErrors.security_code) && (
            <div className={`${styles.formError} ${!loggedIn ? styles.marginBottom : ""}`}>
              {fieldErrors.card_exp_month ||
                fieldErrors.card_exp_year ||
                fieldErrors.security_code}
            </div>
          )}

          {loggedIn && (
            <div
              className={`${styles.rbiGuidelines}`}
            >
              <label htmlFor="terms">
                <input
                  type="checkbox"
                  id="save_card terms"
                  name="terms"
                  className={`${styles.checkbox}`}
                />
              </label>
              <div className={styles.rbiGuidelinesText}>
                {t("resource.checkout.save_this_card_rbi_guidelines")}
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
                      <span
                        style={{ paddingInlineStart: "8px", fontSize: "14px" }}
                      >
                        {t("resource.checkout.improve_your_card_security")}
                      </span>
                    </div>
                  );
                })()}
              >
                <div className={styles.rbiGuidelinesContent}>
                  <ul>
                    <li className="fontBody">
                      {t("resource.checkout.card_consent_request_1")}
                    </li>
                    <li className="fontBody">
                      {t("resource.checkout.card_consent_request_2")}
                    </li>
                  </ul>
                </div>
              </Modal>
            </div>
          )}

          <input type="hidden" className="redirect" value="true" />

          <input type="hidden" className="payment_channel" value="WEB" />

          {isMobile ? (
            <StickyPayNow
              disabled={!isCardValid()}
              value={priceFormatCurrencySymbol(getCurrencySymbol, getTotalValue())}
              onPriceDetailsClick={onPriceDetailsClick}
              isJuspay={true}
              />
          ) : (
            <button
              type="submit"
              id="common_pay_btn"
              className={styles.saveNewCard}
              disabled={!isCardValid()}
            >
              {t("resource.common.pay_caps")}{" "}
              {priceFormatCurrencySymbol(getCurrencySymbol, getTotalValue())}
            </button>
          )}
        </form>
      )}
    </>
  );
};

export default JuspayCardForm;
