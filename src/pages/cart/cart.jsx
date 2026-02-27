import React, { useState, useMemo } from "react";
import * as styles from "./cart.less";
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
import { useNavigate, useGlobalTranslation } from "fdk-core/utils";

const Cart = ({
  isCartUpdating,
  isLoggedIn = false,
  cartData,
  checkoutMode,
  cartItems,
  cartItemsWithActualIndex,
  breakUpValues,
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
  isRemoving = false,
  isMovingToWishlist = false,
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
  const { t } = useGlobalTranslation("translation");
  const [sizeModal, setSizeModal] = useState(null);
  const [currentSizeModalSize, setCurrentSizeModalSize] = useState(null);
  const [removeItemData, setRemoveItemData] = useState(null);
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/auth/login");
  };

  const cartItemsArray = Object.keys(cartItems || {});
  const sizeModalItemValue = cartItems && sizeModal && cartItems[sizeModal];

  const totalPrice = useMemo(() => {
    if (!breakUpValues?.display) return 0;
    // Use "total" key which represents the final payable amount after all discounts
    // This is the amount the user will actually pay
    const total = breakUpValues.display.find((val) => val.key === "total");
    return total?.value ?? 0;
  }, [breakUpValues]);

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
              <span className={styles.bagCountHeading}>
                {t("resource.section.cart.your_bag")}
              </span>
              <span className={styles.bagCount}>
                {cartItemsArray?.length || 0} {t("resource.common.items")}
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
                  globalConfig={globalConfig}
                />
              );
            })}
        </div>
        {breakUpValues?.display?.length > 0 && (
          <div className={styles.cartItemPriceSummaryDetails}>
            <Coupon {...cartCouponProps} />
            <Comment {...cartCommentProps} />
            {isGstInput && <GstCard {...cartGstProps} key={cartData} />}
            <div className={styles.priceBreakupCartWrapper}>
              <PriceBreakup
                breakUpValues={breakUpValues?.display || []}
                cartItemCount={cartItemsArray?.length || 0}
                currencySymbol={currencySymbol}
              />
            </div>
            {isPlacingForCustomer && isLoggedIn && (
              <div className={styles.checkoutContainer}>
                <SvgWrapper
                  onClick={updateCartCheckoutMode}
                  svgSrc={checkoutMode === "other" ? "radio-selected" : "radio"}
                />
                <span> {t("resource.section.cart.order_on_behalf")}</span>
              </div>
            )}
            {!isLoggedIn ? (
              <>
                <button
                  className={styles.priceSummaryLoginButton}
                  onClick={redirectToLogin}
                >
                  {t("resource.auth.login.login_caps")}
                </button>
                {isAnonymous && (
                  <button
                    className={styles.priceSummaryGuestButton}
                    disabled={!isValid || isOutOfStock || isNotServicable}
                    onClick={onGotoCheckout}
                  >
                    {t("resource.section.cart.continue_as_guest_caps")}
                  </button>
                )}
              </>
            ) : (
              <button
                className={styles.priceSummaryLoginButton}
                disabled={!isValid || isOutOfStock || isNotServicable}
                onClick={onGotoCheckout}
              >
                {t("resource.section.cart.checkout_button")}
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
        isRemoving={isRemoving}
        isMovingToWishlist={isMovingToWishlist}
        onRemoveButtonClick={() => onRemoveButtonClick(removeItemData)}
        onWishlistButtonClick={() => onWishlistButtonClick(removeItemData)}
        onCloseDialogClick={onCloseRemoveModalClick}
      />
    </div>
  );
};

export default Cart;
