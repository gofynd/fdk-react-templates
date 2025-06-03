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
  isShipmentLoading,
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
  const { availableCouponList, successCoupon, ...restCouponProps } =
    cartCouponProps;
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
          isGuestUser={isGuestUser}
        ></SingleAddress>
        <SinglePageShipment
          customClassName={styles.customStylesShipment}
          shipments={shipments}
          isShipmentLoading={isShipmentLoading}
          showPaymentOptions={showPaymentOptions}
          showShipment={showShipment}
          showPayment={showPayment}
          setShowShipment={setShowShipment}
          setShowPayment={setShowPayment}
          isHyperlocal={isHyperlocal}
          convertHyperlocalTat={convertHyperlocalTat}
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
          isCouponApplied={successCoupon?.is_applied}
        ></CheckoutPayment>
      </div>
      <div className={styles.rightContainer}>
        {!!availableCouponList?.length && (
          <Coupon
            successCoupon={successCoupon}
            availableCouponList={availableCouponList}
            {...restCouponProps}
            currencySymbol={currencySymbol}
            handleRemoveQr={cancelQrPayment}
          />
        )}
        <Comment {...cartCommentProps} />
        <PriceBreakup
          customClassName={styles.customStyles}
          breakUpValues={breakupValues}
          cartItemCount={cartItemsCount}
          currencySymbol={currencySymbol}
        />
      </div>
    </div>
  );
}

export default Checkout;
