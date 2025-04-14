import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as styles from "./order-tracking-details.less";
import EmptyState from "../../../components/empty-state/empty-state";
import Loader from "../../../components/loader/loader";
import OrderShipment from "../../../components/order-shipment/order-shipment";
import ShipmentItem from "../../../components/shipment-item/shipment-item";
import ShipmentTracking from "../../../components/shipment-tracking/shipment-tracking";
import ShipmentBreakup from "../../../components/shipment-breakup/shipment-breakup";
import FyButton from "../../../components/core/fy-button/fy-button";
import FyInput from "../../../components/core/fy-input/fy-input";

function OrderTrackingDetails({
  invoiceDetails,
  isLoading,
  orderShipments,
  getShipmentDetails,
  selectedShipment,
  isShipmentLoading,
}) {
  const params = useParams();
  const [orderId, setOrderId] = useState(params.orderId);
  const [showError, setShowError] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedShipmentBag, setSelectedShipmentBag] =
    useState(orderShipments);
  const navigate = useNavigate();
  const [isFocussed, setIsFocussed] = useState(false);

  const trackOrder = () => {
    setShowError(false);
    if (orderId.length <= 10) {
      setShowError(true);
      return;
    }
    navigate(`/order-tracking/${orderId}`);
  };

  const toggelInit = (item) => {
    navigate(`/profile/orders/shipment/${selectedShipmentBag?.shipment_id}`);
  };

  useEffect(() => {
    getShipmentDetails();
    return () => {};
  }, [params?.shipmentId]);
  useEffect(() => {
    setSelectedShipmentBag(selectedShipment);
    return () => {};
  }, [selectedShipment]);
  useEffect(() => {
    if (params?.shipmentId) {
      setSelectedShipmentBag(selectedShipment);
    } else {
      setSelectedShipmentBag(orderShipments?.shipments?.[0]);
    }
    return () => {};
  }, [orderShipments?.shipments]);

  const getBag = () => {
    return selectedShipmentBag?.bags;
  };
  const getSlicedGroupedShipmentBags = () => {
    return selectedShipmentBag?.bags?.slice(
      0,
      show ? selectedShipmentBag?.bags?.length : 1 * 2
    );
  };
  const showMore = () => {
    setShow(true);
  };
  const showLess = () => {
    setShow(false);
  };

  return (
    <div
      className={`basePageContainer margin0auto ${styles.orderTrackingDetails}`}
    >
      <div className={`${styles.orderDetails}`}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className={`${styles.trackOrder}`}>
              <FyInput
                label={isFocussed || orderId ? "Enter Order ID" : ""}
                labelVariant="floating"
                value={orderId}
                placeholder={!isFocussed ? "Enter Order ID" : ""}
                maxLength="20"
                error={showError}
                errorMessage="Invalid Order Id"
                onChange={(e) => setOrderId(e.target.value)}
                onFocus={() => setIsFocussed(true)}
                onBlur={() => setIsFocussed(false)}
                className={styles.orderIdInput}
              />
              <FyButton
                className={styles.btn}
                variant="contained"
                size="medium"
                onClick={trackOrder}
              >
                TRACK ORDER
              </FyButton>
            </div>
            {(Object.keys(orderShipments)?.length === 0 ||
              orderShipments?.shipments?.length === 0) && (
              <div className={`${styles.error}`}>
                <EmptyState></EmptyState>
              </div>
            )}
            {Object.keys(orderShipments)?.length !== 0 &&
              orderShipments?.shipments?.length !== 0 && (
                <div className={`${styles.orderShipments}`}>
                  <div className={`${styles.orderShipmentsWrapper}`}>
                    <OrderShipment
                      orderInfo={orderShipments}
                      isBuyAgainEligible={false}
                    ></OrderShipment>
                  </div>
                  {isShipmentLoading ? (
                    <Loader />
                  ) : (
                    <div className={`${styles.shipmentDetails}`}>
                      <div className={`${styles.shipmentBagItem}`}>
                        {getSlicedGroupedShipmentBags()?.map((item, index) => (
                          <ShipmentItem
                            key={item.item.brand.name + index}
                            bag={item}
                            shipment={{
                              traking_no: selectedShipmentBag?.traking_no,
                              track_url: selectedShipmentBag?.track_url,
                            }}
                            type="tracking"
                          />
                        ))}
                      </div>
                      {getBag() && getBag().length > 2 && (
                        <div>
                          {!show && (
                            <div
                              className={`${styles.view}`}
                              onClick={showMore}
                            >
                              {`+${getBag().length - 2} view more`}
                            </div>
                          )}
                          {show && (
                            <div
                              className={`${styles.view}`}
                              onClick={showLess}
                            >
                              view less
                            </div>
                          )}
                        </div>
                      )}
                      <div className={`${styles.shipment}`}>
                        <ShipmentTracking
                          tracking={selectedShipmentBag?.tracking_details}
                          shipmentInfo={selectedShipmentBag}
                          changeinit={toggelInit}
                          invoiceDetails={invoiceDetails}
                        ></ShipmentTracking>
                      </div>
                      <div className={`${styles.shipment} ${styles.noPadding}`}>
                        <ShipmentBreakup
                          fpi={fpi}
                          type="tracking"
                          breakup={selectedShipmentBag?.breakup_values}
                          shipmentInfo={selectedShipmentBag}
                        ></ShipmentBreakup>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrderTrackingDetails;
