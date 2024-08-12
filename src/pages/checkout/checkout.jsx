import React from "react";
import SinglePageShipment from "../../page-layouts/single-checkout/shipment/single-page-shipment";
import SingleAddress from "../../page-layouts/single-checkout/address/single-address";
import * as styles from "./checkout.less";
import CheckoutPayment from "../../page-layouts/single-checkout/payment/checkout-payment";
import PriceBreakup from "../../components/price-breakup/price-breakup";

function Checkout({
  breakupValues,
  cartItemsCount,
  address,
  showShipment,
  showPayment,
  shipments,
  payment,
  showPaymentOptions,
  setShowShipment,
  setShowPayment,
  mapApiKey,
  showGoogleMap,
  loader,
}) {
  return (
    <div className={`${styles.mainContainer} fontBody`}>
      <div className={styles.leftContainer}>
        <SingleAddress
          address={address}
          showShipment={showShipment}
          showPayment={showPayment}
          setShowShipment={setShowShipment}
          setShowPayment={setShowPayment}
          mapApiKey={mapApiKey}
          showGoogleMap={showGoogleMap}
          loader={loader}
        ></SingleAddress>
        <SinglePageShipment
          shipments={shipments}
          showPaymentOptions={showPaymentOptions}
          showShipment={showShipment}
          showPayment={showPayment}
          loader={loader}
        ></SinglePageShipment>
        <CheckoutPayment
          payment={payment}
          showPayment={showPayment}
          loader={loader}
        ></CheckoutPayment>
      </div>
      <div className={styles.rightContainer}>
        <PriceBreakup
          breakUpValues={breakupValues}
          cartItemCount={cartItemsCount}
        />
      </div>
    </div>
  );
}

export default Checkout;
