import React, { useEffect, useState } from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import CheckoutPaymentContent from "./checkout-payment-content";
import * as styles from "./checkout-payment.less";
import CheckoutPaymentFailure from "./checkout-payment-failure";

function CheckoutPayment({
  loader,
  payment,
  showPayment,
  showPaymentOptions,
  breakUpValues,
  onPriceDetailsClick,
  setCancelQrPayment,
}) {
  const [showFailedMessage, setShowFailedMessage] = useState(false);
  const [paymentErrHeading, setPaymentErrHeading] = useState("");
  const [paymentErrMsg, setPaymentErrMsg] = useState("");
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("failed") === "true") {
      showPaymentOptions();
      handleShowFailedMessage({
        failed: true,
        paymentErrMsg: urlParams?.get("error"),
      });
    }
  }, [window.location.search]);

  const handleShowFailedMessage = (errObj) => {
    if (errObj?.failed) {
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
    <div className={styles.paymentContainer}>
      {showPayment ? (
        <>
          <div className={styles.paymentHeaderSelect}>
            <div className={`${styles.icon} ${styles["view-mobile-up"]}`}>
              <SvgWrapper svgSrc={"three-number"}></SvgWrapper>
            </div>
            <div className={styles.title}>Select Payment Method</div>
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
          <div className={styles.title}>Select Payment Method</div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPayment;
