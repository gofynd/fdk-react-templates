import React, { useEffect, useState } from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import CheckoutPaymentContent from "./checkout-payment-content";
import * as styles from "./checkout-payment.less";


import CheckoutPaymentFailure from "./checkout-payment-failure";
import { useMobile } from "../../../helper/hooks/useMobile";
import { useGlobalTranslation } from "fdk-core/utils";

function CheckoutPayment({
  loader,
  payment,
  showPayment,
  showPaymentOptions,
  breakUpValues,
  onPriceDetailsClick,
  setCancelQrPayment,
  onFailedGetCartShipmentDetails,
}) {
  const { t } = useGlobalTranslation("translation");
  const [showFailedMessage, setShowFailedMessage] = useState(false);
  const [paymentErrHeading, setPaymentErrHeading] = useState("");
  const [paymentErrMsg, setPaymentErrMsg] = useState("");
  const [timerId, setTimerId] = useState(null);
  const { errorMessage, setErrorMessage } = payment;
  const isMobile = useMobile();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (errorMessage?.length > 0) {
      handleShowFailedMessage({
        failed: true,
        paymentErrHeading: t("resource.checkout.please_try_again_later"),
        paymentErrMsg: errorMessage,
      });
      onFailedGetCartShipmentDetails();
    } else if (urlParams.get("failed") === "true") {
      showPaymentOptions();
      handleShowFailedMessage({
        failed: true,
        paymentErrMsg: urlParams?.get("error"),
      });
      onFailedGetCartShipmentDetails();
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

  return (
    <>
      <div
        className={`${styles.paymentContainer} ${!showPayment ? styles.hidePayment : ""}`}
      >
        {showPayment ? (
          <>
            <div className={styles.paymentHeaderSelect}>
              <div className={`${styles.icon} ${styles["view-mobile-up"]}`}>
                <SvgWrapper svgSrc={"three-number"}></SvgWrapper>
              </div>
              <div className={styles.title}>{t("resource.checkout.select_payment_method")}</div>
            </div>
            {showFailedMessage && (
              <div className={styles.paymentFailedHeader}>
                <div className={styles.redSplit}></div>
                <CheckoutPaymentFailure
                  paymentErrHeading={paymentErrHeading}
                  paymentErrMsg={paymentErrMsg}
                ></CheckoutPaymentFailure>
              </div>
            )}
            <CheckoutPaymentContent
              payment={payment}
              loader={loader}
              handleShowFailedMessage={handleShowFailedMessage}
              onPriceDetailsClick={onPriceDetailsClick}
              breakUpValues={breakUpValues}
              removeDialogueError={hideFailedMessage}
              setCancelQrPayment={setCancelQrPayment}
            ></CheckoutPaymentContent>
          </>
        ) : (
          <div className={styles.reviewHeaderUnselect}>
            <SvgWrapper svgSrc={"three-number"}></SvgWrapper>
            <div className={styles.title}>{t("resource.checkout.select_payment_method")}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default CheckoutPayment;
