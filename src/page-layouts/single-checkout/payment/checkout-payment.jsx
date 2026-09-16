import React, { useEffect, useMemo, useState } from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import CheckoutPaymentContent from "./checkout-payment-content";
import * as styles from "./checkout-payment.less";

import CheckoutPaymentFailure from "./checkout-payment-failure";
import CreditNote from "./credit-note/credit-note";
import { useMobile } from "../../../helper/hooks/useMobile";
import { useGlobalTranslation } from "fdk-core/utils";

function CheckoutPayment({
  loader,
  payment,
  showPayment,
  showPaymentOptions,
  breakUpValues,
  onPriceDetailsClick,
  setCancelQrPayment = () => {},
  onFailedGetCartShipmentDetails = () => {},
  customClassName,
  isCouponApplied,
  redirectPaymentOptions,
  isCouponValid,
  setIsCouponValid,
  inValidCouponData,
  splitPaymentConfig,
}) {
  const { t } = useGlobalTranslation("translation");
  const [showFailedMessage, setShowFailedMessage] = useState(false);
  const [paymentErrHeading, setPaymentErrHeading] = useState("");
  const [paymentErrMsg, setPaymentErrMsg] = useState("");
  const [juspayErrorMessage, setJuspayErrorMessage] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const paymentWithUiConfig = useMemo(() => {
    if (!splitPaymentConfig) return payment;

    return {
      ...payment,
      splitPaymentConfig: {
        ...(payment?.splitPaymentConfig || {}),
        ...splitPaymentConfig,
      },
    };
  }, [payment, splitPaymentConfig]);
  const {
    errorMessage,
    setErrorMessage,
    enableLinkPaymentOption,
    getTotalValue,
    isCreditNoteApplied,
    isLoading,
  } = paymentWithUiConfig;
  const isMobile = useMobile();
  const isSplitPaymentActive =
    paymentWithUiConfig?.splitPaymentConfig?.enabled === true &&
    paymentWithUiConfig?.splitPaymentConfig?.defaultSelected === true;
  const shouldDisablePayment =
    getTotalValue?.() === 0 &&
    !isCreditNoteApplied &&
    !isLoading &&
    !isSplitPaymentActive;
  const shouldShowStoreCredit =
    !isSplitPaymentActive &&
    paymentWithUiConfig?.splitPaymentConfig?.hideStoreCredit !== true;
  const shouldHidePaymentContent =
    paymentWithUiConfig?.hidePaymentContentOnError === true;
  const translatedPleaseTryAgainLater = t(
    "resource.checkout.please_try_again_later"
  );
  const pleaseTryAgainLaterText =
    translatedPleaseTryAgainLater === "resource.checkout.please_try_again_later"
      ? "Please try again later"
      : translatedPleaseTryAgainLater;
  const shouldShowPaymentFailedMessage =
    showFailedMessage ||
    (shouldHidePaymentContent && String(errorMessage || "").trim().length > 0);
  const visiblePaymentErrHeading = showFailedMessage
    ? paymentErrHeading
    : pleaseTryAgainLaterText;
  const visiblePaymentErrMsg = showFailedMessage
    ? paymentErrMsg
    : errorMessage;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (errorMessage?.length > 0) {
      handleShowFailedMessage({
        failed: true,
        paymentErrHeading: pleaseTryAgainLaterText,
        paymentErrMsg: errorMessage,
      });
      onFailedGetCartShipmentDetails();
    } else if (urlParams.get("failed") === "true") {
      redirectPaymentOptions();
      handleShowFailedMessage({
        failed: true,
        paymentErrMsg: urlParams?.get("error"),
      });
      onFailedGetCartShipmentDetails();
      setJuspayErrorMessage(true);
    }
  }, [errorMessage]);

  const scrollToTop = () => {
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleShowFailedMessage = (errObj) => {
    if (errObj?.failed) {
      scrollToTop();
      setShowFailedMessage(true);
      setPaymentErrHeading(errObj?.paymentErrHeading || "");
      setPaymentErrMsg(errObj?.paymentErrMsg || "");

      const id = setTimeout(() => {
        setShowFailedMessage(false);
        setPaymentErrHeading("");
        setPaymentErrMsg("");
        // Remove 'failed' and 'error' params from URL
        const newUrlParams = new URLSearchParams(window.location.search);
        newUrlParams.delete("failed");
        newUrlParams.delete("error");

        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${newUrlParams}`
        );
      }, 30000);
      setTimerId(id);
    }
  };
  const hideFailedMessage = () => {
    setShowFailedMessage(false);
    setPaymentErrHeading("");
    setPaymentErrMsg("");
    setErrorMessage("");

    const newUrlParams = new URLSearchParams(window.location.search);
    newUrlParams.delete("failed");
    newUrlParams.delete("error");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${newUrlParams}`
    );

    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  };
  console.log("firstone connected");
  return (
    <>
      <div
        className={`${styles.paymentContainer} ${!showPayment ? styles.hidePayment : ""} ${enableLinkPaymentOption ? styles.unsetMarginTop : ""} ${shouldDisablePayment ? styles.disabledPayment : ""}`}
      >
        {showPayment ? (
          <>
            {shouldShowStoreCredit && (
              <div className={styles.creditNote}>
                <CreditNote
                  data={paymentWithUiConfig?.partialPaymentOption}
                  updateStoreCredits={paymentWithUiConfig?.updateStoreCredits}
                />
              </div>
            )}
            <div
              className={`${styles.paymentHeaderSelect} ${customClassName} ${enableLinkPaymentOption ? styles.unsetBorder : ""}`}
            >
              {!enableLinkPaymentOption && (
                <div className={`${styles.icon} ${styles["view-mobile-up"]}`}>
                  <SvgWrapper svgSrc={"three-number"}></SvgWrapper>
                </div>
              )}
              <div
                className={`${styles.title} ${enableLinkPaymentOption ? styles.unsetPaddingLeft : ""}`}
              >
                {t("resource.checkout.select_payment_method")}
              </div>
            </div>
            {shouldShowPaymentFailedMessage && (
              <div className={styles.paymentFailedHeader}>
                <div className={styles.redSplit}></div>
                <CheckoutPaymentFailure
                  paymentErrHeading={visiblePaymentErrHeading}
                  paymentErrMsg={visiblePaymentErrMsg}
                ></CheckoutPaymentFailure>
              </div>
            )}
            {!shouldHidePaymentContent && (
              <CheckoutPaymentContent
                payment={paymentWithUiConfig}
                loader={loader}
                handleShowFailedMessage={handleShowFailedMessage}
                onPriceDetailsClick={onPriceDetailsClick}
                breakUpValues={breakUpValues}
                removeDialogueError={hideFailedMessage}
                setCancelQrPayment={setCancelQrPayment}
                juspayErrorMessage={juspayErrorMessage}
                isCouponApplied={isCouponApplied}
                isCouponValid={isCouponValid}
                setIsCouponValid={setIsCouponValid}
                inValidCouponData={inValidCouponData}
              ></CheckoutPaymentContent>
            )}
          </>
        ) : (
          <div className={styles.reviewHeaderUnselect}>
            <SvgWrapper svgSrc={"three-number"}></SvgWrapper>
            <div className={styles.title}>
              {t("resource.checkout.select_payment_method")}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CheckoutPayment;
