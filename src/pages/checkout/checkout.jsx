import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SinglePageShipment from "../../page-layouts/single-checkout/shipment/single-page-shipment";
import SingleAddress from "../../page-layouts/single-checkout/address/single-address";
import * as styles from "./checkout.less";
import CheckoutPayment from "../../page-layouts/single-checkout/payment/checkout-payment";
import PriceBreakup from "../../components/price-breakup/price-breakup";
import Stepper from "../../components/stepper/stepper";
import Coupon from "../../page-layouts/cart/Components/coupon/coupon";
import Comment from "../../page-layouts/cart/Components/comment/comment";
import FyButton from "../../components/core/fy-button/fy-button";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import ZeroPayButton from "../../page-layouts/single-checkout/payment/zero-pay-btn/zero-pay-btn";

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
  availableFOCount,
  isGuestUser = false,
  isCartValid = true,
  redirectPaymentOptions,
}) {
  const [cancelQrPayment, setCancelQrPayment] = useState(null);
  const [searchParams] = useSearchParams();
  const cart_id = searchParams.get("id");
  const address_id = searchParams.get("address_id");
  const { isLoading } = payment;
  const handlePlaceOrder = async () => {
    if (payment?.storeCreditApplied?.isFullyApplied) {
      const { merchant_code, code, aggregator_name } =
        payment?.partialPaymentOption?.list[0];

      const paymentModePayload = {
        id: cart_id,
        address_id,
        payment_mode: code,
        aggregator_name,
        payment_identifier: code,
        merchant_code,
      };
      await payment?.selectPaymentMode(paymentModePayload);
      await payment?.proceedToPay("CREDITNOTE");
    }
  };

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
          payment={payment}
          availableFOCount={availableFOCount}
          totalValue={priceFormatCurrencySymbol(
            payment?.getCurrencySymbol,
            payment?.getTotalValue()
          )}
          onPriceDetailsClick={onPriceDetailsClick}
          isCartValid={isCartValid}
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
          redirectPaymentOptions={redirectPaymentOptions}
        ></CheckoutPayment>
      </div>
      <div className={styles.rightContainer}>
        <Coupon
          successCoupon={successCoupon}
          availableCouponList={availableCouponList}
          {...restCouponProps}
          currencySymbol={currencySymbol}
          handleRemoveQr={cancelQrPayment}
        />
        {/* {!!availableCouponList?.length && (
          <Coupon
            successCoupon={successCoupon}
            availableCouponList={availableCouponList}
            {...restCouponProps}
            currencySymbol={currencySymbol}
            handleRemoveQr={cancelQrPayment}
          />
        )} */}
        <Comment {...cartCommentProps} />
        <PriceBreakup
          customClassName={styles.customStyles}
          breakUpValues={breakupValues}
          cartItemCount={cartItemsCount}
          currencySymbol={currencySymbol}
        />
        <ZeroPayButton
          payment={payment}
          showPayment={showPayment}
          onPriceDetailsClick={onPriceDetailsClick}
        />
        {payment?.storeCreditApplied?.isFullyApplied &&
          showPayment &&
          !isLoading && (
            <FyButton
              onClick={handlePlaceOrder}
              className={styles.placeOrderBtn}
              fullWidth
            >
              PLACE ORDER
            </FyButton>
          )}
      </div>
    </div>
  );
}

export default Checkout;
