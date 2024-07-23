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
}) {
  console.log(address, "address");
  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <SingleAddress
          address={address}
          showShipment={showShipment}
          showPayment={showPayment}
        ></SingleAddress>
        <SinglePageShipment
          shipments={shipments}
          showPaymentOptions={showPaymentOptions}
          showShipment={showShipment}
          showPayment={showPayment}
        ></SinglePageShipment>
        <CheckoutPayment
          payment={payment}
          showPayment={showPayment}
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
