import React from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./single-page-shipment.less";
import SingleShipmentContent from "./single-shipment-content";
import {
  useNavigate,
  useGlobalTranslation,
  useGlobalStore,
} from "fdk-core/utils";
import StickyPayNow from "../payment/sticky-pay-now/sticky-pay-now";
import Shimmer from "../../../components/shimmer/shimmer";

function SinglePageShipment({
  shipments,
  isShipmentLoading,
  setShowPayment,
  setShowShipment,
  showPaymentOptions,
  showShipment,
  showPayment,
  loader,
  buybox = {},
  availableFOCount,
  totalValue = "",
  onPriceDetailsClick = () => {},
  customClassName,
  isCartValid,
  payment,
  getDeliveryPromise,
  redirectPaymentOptions,
}) {
  const { t } = useGlobalTranslation("translation");
  const navigate = useNavigate();
  const { proceedToPay, getTotalValue, isLoading } = payment;
  const getShipmentCount = shipments?.length || 0;

  const editShipment = () => {
    setShowPayment(false);
    setShowShipment(true);
  };

  const gotoCart = () => {
    navigate("/cart/bag");
  };
  return (
    <>
      {showShipment ? (
        <>
          <div className={styles.reviewHeaderSelect}>
            <div className={styles.left}>
              <div className={styles.icon}>
                <SvgWrapper svgSrc={"two-number"}></SvgWrapper>
              </div>
              <div className={styles.headerContainer}>
                <div className={styles.orderSummary}>
                  {t("resource.checkout.order_summary")}
                </div>
                <div className={styles.shipment}>
                  {isShipmentLoading ? (
                    <Shimmer height="12px" width="120px" />
                  ) : (
                    `${getShipmentCount} ${t(getShipmentCount > 1 ? "resource.common.shipments_plural" : "resource.common.shipment")}`
                  )}
                </div>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.editCart} onClick={gotoCart}>
                {t("resource.checkout.edit_cart_lower")}
              </div>
              <div
                className={styles.proceedPay}
                onClick={() => {
                  if (getTotalValue?.() === 0) {
                    proceedToPay("PP", {});
                  } else {
                    redirectPaymentOptions();
                    showPaymentOptions();
                  }
                }}
                style={{
                  opacity: isLoading ? 0.5 : 1,
                  pointerEvents: isLoading ? "none" : "auto",
                }}
              >
                {getTotalValue?.() === 0
                  ? "Place Order "
                  : t("resource.checkout.proceed_to_pay")}
              </div>
            </div>
          </div>
          <SingleShipmentContent
            shipments={shipments}
            isShipmentLoading={isShipmentLoading}
            showPaymentOptions={showPaymentOptions}
            buybox={buybox}
            availableFOCount={availableFOCount}
            isCartValid={isCartValid}
            getTotalValue={getTotalValue}
            proceedToPay={proceedToPay}
            isLoading={isLoading}
            getDeliveryPromise={getDeliveryPromise}
            redirectPaymentOptions={redirectPaymentOptions}
          ></SingleShipmentContent>
          <StickyPayNow
            btnTitle={
              getTotalValue?.() === 0
                ? "PLACE ORDER"
                : t("resource.checkout.proceed_to_pay_caps")
            }
            onPriceDetailsClick={onPriceDetailsClick}
            value={totalValue}
            disabled={isLoading || !isCartValid}
            proceedToPay={() => {
              if (getTotalValue?.() === 0) {
                proceedToPay("PP", {});
              } else {
                redirectPaymentOptions();
                showPaymentOptions();
                window?.scrollTo({
                  top: 0,
                });
              }
            }}
          />
        </>
      ) : (
        <>
          {showPayment ? (
            <div
              className={`${styles.addressSelectedHeaderContainer} ${customClassName}`}
            >
              <div className={styles.leftSelected}>
                <div className={styles.icon}>
                  <SvgWrapper svgSrc="checkmark"></SvgWrapper>
                </div>
                <div className={styles.deliverAdd}>
                  <div className={styles.title}>
                    {t("resource.checkout.order_summary")}
                  </div>
                  <div className={styles.address}>
                    {getShipmentCount > 1
                      ? getShipmentCount +
                        ` ${t("resource.common.shipments_plural")}`
                      : getShipmentCount + ` ${t("resource.common.shipments")}`}
                  </div>
                </div>
              </div>
              <div className={styles.orderEditContainer}>
                <div className={styles.rightSelected} onClick={editShipment}>
                  {t("resource.facets.edit")}
                </div>
                {getTotalValue?.() === 0 && (
                  <button
                    className={`${styles.commonBtn} ${styles.payBtn}`}
                    onClick={() => proceedToPay("PP", {})}
                  >
                    PLACE ORDER
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.reviewHeaderUnselect}>
              <SvgWrapper svgSrc={"two-number"}></SvgWrapper>
              <div className={styles.heading}>
                {t("resource.checkout.order_summary")}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SinglePageShipment;
