import React from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./single-page-shipment.less";
import SingleShipmentContent from "./single-shipment-content";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";

function SinglePageShipment({
  shipments,
  setShowPayment,
  setShowShipment,
  showPaymentOptions,
  showShipment,
  showPayment,
  isHyperlocal = false,
  convertHyperlocalTat = () => {},
  loader,
  buybox = {},
  payment,
}) {
  const navigate = useNavigate();
  const { proceedToPay, getTotalValue } = payment;
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
              <div className={styles.proceedPay} onClick={showPaymentOptions}>
                Proceed To Pay
              </div>
            </div>
          </div>
          <SingleShipmentContent
            shipments={shipments}
            showPaymentOptions={showPaymentOptions}
            isHyperlocal={isHyperlocal}
            convertHyperlocalTat={convertHyperlocalTat}
            loader={loader}
            buybox={buybox}
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
              <div className={styles.orderEditContainer}>
                <div className={styles.rightSelected} onClick={editShipment}>
                  Edit
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
              <div className={styles.heading}>Order Summary</div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SinglePageShipment;
