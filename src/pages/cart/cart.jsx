import React, { useState, useMemo, useEffect } from "react";
import * as styles from "./cart.less";
import { useNavigate } from "react-router-dom";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import DeliveryLocation from "../../page-layouts/cart/Components/delivery-location/delivery-location";
import Coupon from "../../page-layouts/cart/Components/coupon/coupon";
import Comment from "../../page-layouts/cart/Components/comment/comment";
import GstCard from "../../page-layouts/cart/Components/gst-card/gst-card";
import PriceBreakup from "../../components/price-breakup/price-breakup";
import ChipItem from "../../page-layouts/cart/Components/chip-item/chip-item";
import ShareCart from "../../page-layouts/cart/Components/share-cart/share-cart";
import StickyFooter from "../../page-layouts/cart/Components/sticky-footer/sticky-footer";
import RemoveCartItem from "../../page-layouts/cart/Components/remove-cart-item/remove-cart-item";

const Cart = ({
  isCartUpdating,
  isLoggedIn = false,
  cartData,
  checkoutMode,
  cartItems,
  cartItemsWithActualIndex,
  breakUpValues,
  cartItemCount,
  isAnonymous,
  isValid,
  isNotServicable,
  isOutOfStock,
  currencySymbol,
  onUpdateCartItems,
  deliveryLocationProps,
  cartCouponProps,
  isGstInput = true,
  isPlacingForCustomer,
  isShareCart,
  cartGstProps,
  cartCommentProps,
  cartShareProps,
  isRemoveModalOpen = false,
  isPromoModalOpen = false,
  onGotoCheckout = () => {},
  onRemoveIconClick = () => {},
  onRemoveButtonClick = () => {},
  onWishlistButtonClick = () => {},
  onCloseRemoveModalClick = () => {},
  onPriceDetailsClick = () => {},
  updateCartCheckoutMode = () => {},
  onOpenPromoModal = () => {},
  onClosePromoModal = () => {},
}) => {
  const [sizeModal, setSizeModal] = useState(null);
  const [currentSizeModalSize, setCurrentSizeModalSize] = useState(null);
  const [removeItemData, setRemoveItemData] = useState(null);
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/auth/login");
  };

  const cartItemsArray = Object.keys(cartItems || {});
  const sizeModalItemValue = cartItems && sizeModal && cartItems[sizeModal];

  const totalPrice = useMemo(
    () => breakUpValues?.display?.find((val) => val.key == "total")?.value,
    [breakUpValues]
  );

  function handleRemoveIconClick(data) {
    setRemoveItemData(data);
    onRemoveIconClick();
  }

  return (
    <div className={styles.cartMainContainer}>
      {cartData?.message && cartData?.items && (
        <div className={styles.errContainer}>
          <span className={styles.errorIcon}>
            <SvgWrapper svgSrc="error-info-icon" />
          </span>
          <span className={styles.errMsg}>{cartData.message}</span>
        </div>
      )}
      <div className={styles.cartWrapper}>
        <div className={styles.cartItemDetailsContainer}>
          <DeliveryLocation {...deliveryLocationProps} />
          <div className={styles.cartTitleContainer}>
            <div className={styles.bagDetailsContainer}>
              <span className={styles.bagCountHeading}>Your Bag</span>
              <span className={styles.bagCount}>
                {cartItemsArray?.length || 0} items
              </span>
            </div>
            {isShareCart && (
              <div className={styles.shareCartTablet}>
                <ShareCart {...cartShareProps} />
              </div>
            )}
          </div>
          {cartItemsArray?.length > 0 &&
            cartItemsArray?.map((singleItem, itemIndex) => {
              const singleItemDetails = cartItems[singleItem];
              const productImage =
                singleItemDetails?.product?.images?.length > 0 &&
                singleItemDetails?.product?.images[0]?.url?.replace(
                  "original",
                  "resize-w:250"
                );

              const currentSize = singleItem?.split("_")[1];
              return (
                <ChipItem
                  key={singleItemDetails.key}
                  isCartUpdating={isCartUpdating}
                  singleItemDetails={singleItemDetails}
                  productImage={productImage}
                  onUpdateCartItems={onUpdateCartItems}
                  currentSize={currentSize}
                  itemIndex={itemIndex}
                  sizeModalItemValue={sizeModalItemValue}
                  currentSizeModalSize={currentSizeModalSize}
                  setCurrentSizeModalSize={setCurrentSizeModalSize}
                  setSizeModal={setSizeModal}
                  sizeModal={sizeModal}
                  singleItem={singleItem}
                  cartItems={cartItems}
                  cartItemsWithActualIndex={cartItemsWithActualIndex}
                  onRemoveIconClick={handleRemoveIconClick}
                  isPromoModalOpen={isPromoModalOpen}
                  onOpenPromoModal={onOpenPromoModal}
                  onClosePromoModal={onClosePromoModal}
                />
              );
            })}
        </div>
        {breakUpValues?.display?.length > 0 && (
          <div className={styles.cartItemPriceSummaryDetails}>
            <Coupon {...cartCouponProps} />
            <Comment {...cartCommentProps} />
            {isGstInput && <GstCard {...cartGstProps} key={cartData} />}
            <PriceBreakup
              breakUpValues={breakUpValues?.display || []}
              cartItemCount={cartItemsArray?.length || 0}
              currencySymbol={currencySymbol}
            />
            {isPlacingForCustomer && isLoggedIn && (
              <div className={styles.checkoutContainer}>
                <SvgWrapper
                  onClick={updateCartCheckoutMode}
                  svgSrc={checkoutMode === "other" ? "radio-selected" : "radio"}
                />
                <span> Placing order on behalf of Customer</span>
              </div>
            )}
            {!isLoggedIn ? (
              <>
                <button
                  className={styles.priceSummaryLoginButton}
                  onClick={redirectToLogin}
                >
                  LOGIN
                </button>
                {isAnonymous && (
                  <button
                    className={styles.priceSummaryGuestButton}
                    disabled={!isValid || isOutOfStock || isNotServicable}
                    onClick={onGotoCheckout}
                  >
                    CONTINUE AS GUEST
                  </button>
                )}
              </>
            ) : (
              <button
                className={styles.priceSummaryLoginButton}
                disabled={!isValid || isOutOfStock || isNotServicable}
                onClick={onGotoCheckout}
              >
                checkout
              </button>
            )}
            {isShareCart && (
              <div className={styles.shareCartDesktop}>
                <ShareCart showCard={true} {...cartShareProps} />
              </div>
            )}
          </div>
        )}
      </div>
      <StickyFooter
        {...{
          isLoggedIn,
          isValid,
          isOutOfStock,
          isNotServicable,
          isAnonymous,
          currencySymbol,
          totalPrice,
        }}
        onLoginClick={redirectToLogin}
        onCheckoutClick={onGotoCheckout}
        onPriceDetailsClick={onPriceDetailsClick}
      />
      <RemoveCartItem
        isOpen={isRemoveModalOpen}
        cartItem={removeItemData?.item}
        onRemoveButtonClick={() => onRemoveButtonClick(removeItemData)}
        onWishlistButtonClick={() => onWishlistButtonClick(removeItemData)}
        onCloseDialogClick={onCloseRemoveModalClick}
      />
    </div>
  );
};

export default Cart;
