import React, { useEffect, useState } from "react";
import SinglePageShipment from "../../page-layouts/single-checkout/shipment/single-page-shipment";
import SingleAddress from "../../page-layouts/single-checkout/address/single-address";
import * as styles from "./checkout.less";
import CheckoutPayment from "../../page-layouts/single-checkout/payment/checkout-payment";
import PriceBreakup from "../../components/price-breakup/price-breakup";
import Stepper from "../../components/stepper/stepper";
import Coupon from "../../page-layouts/cart/Components/coupon/coupon";
import Comment from "../../page-layouts/cart/Components/comment/comment";
import { priceFormatCurrencySymbol } from "../../helper/utils";

function Checkout({
  breakupValues,
  cartItemsCount,
  currencySymbol,
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
  isHyperlocal = false,
  convertHyperlocalTat = () => {},
  loader,
  stepperProps,
  onPriceDetailsClick,
  cartCouponProps,
  cartCommentProps,
  buybox = {},
  isGuestUser = false,
}) {
  const [cancelQrPayment, setCancelQrPayment] = useState(null);
  const { onFailedGetCartShipmentDetails } = address;
  return (
    <div className={`${styles.mainContainer} fontBody`}>
      <div className={styles["view-mobile"]}>
        <Stepper {...stepperProps} />
      </div>
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
          isGuestUser={isGuestUser}
        ></SingleAddress>
        <SinglePageShipment
          shipments={shipments}
          showPaymentOptions={showPaymentOptions}
          showShipment={showShipment}
          showPayment={showPayment}
          setShowShipment={setShowShipment}
          setShowPayment={setShowPayment}
          isHyperlocal={isHyperlocal}
          convertHyperlocalTat={convertHyperlocalTat}
          loader={loader}
          buybox={buybox}
          totalValue={priceFormatCurrencySymbol(
            payment?.getCurrencySymbol,
            payment?.getTotalValue()
          )}
          onPriceDetailsClick={onPriceDetailsClick}
        ></SinglePageShipment>
        <CheckoutPayment
          payment={payment}
          showPayment={showPayment}
          loader={loader}
          onPriceDetailsClick={onPriceDetailsClick}
          breakUpValues={breakupValues}
          showPaymentOptions={showPaymentOptions}
          setCancelQrPayment={setCancelQrPayment}
          onFailedGetCartShipmentDetails={onFailedGetCartShipmentDetails}
        ></CheckoutPayment>
      </div>
      <div className={styles.rightContainer}>
        <Coupon
          {...cartCouponProps}
          currencySymbol={currencySymbol}
          handleRemoveQr={cancelQrPayment}
        />
        <Comment {...cartCommentProps} />
        <PriceBreakup
          breakUpValues={breakupValues}
          cartItemCount={cartItemsCount}
          currencySymbol={currencySymbol}
        />
      </div>
    </div>
  );
}

export default Checkout;
