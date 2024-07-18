import React from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./single-page-shipment.less";
import SingleShipmentContent from "./single-shipment-content";
import { useNavigate } from "react-router-dom";

function SinglePageShipment({
  shipments,
  setShowPayment,
  setShowShipment,
  proceedToPay,
  showShipment,
  showPayment,
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
              <div>
                <SvgWrapper svgSrc={"two-number"}></SvgWrapper>
              </div>
              <div className={styles.headerContainer}>
                <div className={styles.orderSummary}>Order Summary</div>
                <div className={styles.shipment}>
                  {getShipmentCount > 1
                    ? getShipmentCount + " shipments"
                    : getShipmentCount + " shipment"}
                </div>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.editCart} onClick={gotoCart}>
                Edit Cart
              </div>
              <div className={styles.proceedPay} onClick={proceedToPay}>
                Proceed To Pay
              </div>
            </div>
          </div>
          <SingleShipmentContent
            shipments={shipments}
            proceedToPay={proceedToPay}
          ></SingleShipmentContent>
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
