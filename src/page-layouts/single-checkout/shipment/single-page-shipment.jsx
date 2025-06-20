import React from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./single-page-shipment.less";
import SingleShipmentContent from "./single-shipment-content";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
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
  isHyperlocal = false,
  convertHyperlocalTat = () => {},
  loader,
  buybox = {},
  totalValue = "",
  onPriceDetailsClick = () => {},
}) {
  const navigate = useNavigate();
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
                <div className={styles.orderSummary}>Order Summary</div>
                <div className={styles.shipment}>
                  {isShipmentLoading ? (
                    <Shimmer height="12px" width="120px" />
                  ) : (
                    `${getShipmentCount} shipment${getShipmentCount > 1 ? "s" : ""}`
                  )}
                </div>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.editCart} onClick={gotoCart}>
                Edit Cart
              </div>
              <div className={styles.proceedPay} onClick={showPaymentOptions}>
                Proceed To Pay
              </div>
            </div>
          </div>
          <SingleShipmentContent
            shipments={shipments}
            isShipmentLoading={isShipmentLoading}
            showPaymentOptions={showPaymentOptions}
            isHyperlocal={isHyperlocal}
            convertHyperlocalTat={convertHyperlocalTat}
            buybox={buybox}
          ></SingleShipmentContent>
          <StickyPayNow
            btnTitle="PROCEED TO PAY"
            onPriceDetailsClick={onPriceDetailsClick}
            value={totalValue}
            proceedToPay={() => {
              showPaymentOptions();
              window?.scrollTo({
                top: 0,
              });
            }}
          />
        </>
      ) : (
        <>
          {showPayment ? (
            <div className={styles.addressSelectedHeaderContainer}>
              <div className={styles.leftSelected}>
                <div className={styles.icon}>
                  <SvgWrapper svgSrc="checkmark"></SvgWrapper>
                </div>
                <div className={styles.deliverAdd}>
                  <div className={styles.title}>Order Summary</div>
                  <div className={styles.address}>
                    {getShipmentCount > 1
                      ? getShipmentCount + " shipments"
                      : getShipmentCount + " shipment"}
                  </div>
                </div>
              </div>
              <div className={styles.rightSelected} onClick={editShipment}>
                Edit
              </div>
            </div>
          ) : (
            <div className={styles.reviewHeaderUnselect}>
              <SvgWrapper svgSrc={"two-number"}></SvgWrapper>
              <div className={styles.heading}>Order Summary</div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SinglePageShipment;
