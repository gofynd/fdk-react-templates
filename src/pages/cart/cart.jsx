import React, { useState, useMemo, useEffect } from "react";
import * as styles from "./cart.less";
import { useNavigate } from "react-router-dom";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import PageNotFound from "../../components/page-not-found/page-not-found";
import Coupon from "../../page-layouts/cart/Components/coupon/coupon";
import Comment from "../../page-layouts/cart/Components/comment/comment";
import GstCard from "../../page-layouts/cart/Components/gst-card/gst-card";
import PriceBreakup from "../../components/price-breakup/price-breakup";
import ChipItem from "../../page-layouts/cart/Components/chip-item/chip-item";
import ShareCart from "../../page-layouts/cart/Components/share-cart/share-cart";
import { isValidPincode } from "../../helper/utils";
import Modal from "../../components/core/modal/modal";

const Cart = ({
  isLoggedIn = false,
  pinCode,
  cartData,
  cartItems,
  cartItemsWithActualIndex,
  breakUpValues,
  cartItemCount,
  isAnonymous,
  isValid,
  isNotServicable,
  isOutOfStock,
  currencySymbol,
  emptyCartText = "Your shopping bag is empty",
  addressList,
  onUpdateCartItems,
  onGotoCheckout,
  onPincodeChangeClick,
  onFetchAddress,
  onAddNewAddress,
  onSelectAddress,
  cartCouponProps,
  isGstInput = true,
  cartGstProps,
  cartCommentProps,
  cartShareProps,
  onMoveToWishlistClick,
}) => {
  const [sizeModal, setSizeModal] = useState(null);
  const [currentSizeModalSize, setCurrentSizeModalSize] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [pincodeInputValue, setPincodeInputValue] = useState(pinCode);

  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/auth/login");
  };

  const cartItemsArray = Object.keys(cartItems || {});
  const sizeModalItemValue = cartItems && sizeModal && cartItems[sizeModal];

  const validatePincode = () => {
    if (pinCode === pincodeInputValue) {
      return;
    }
    if (!isValidPincode(pincodeInputValue)) {
      setErrorMsg("Please enter valid pincode");
      setIsError(true);
      return;
    }

    onPincodeChangeClick(pincodeInputValue)
      .then((res) => {
        if (res?.success) {
          setShowModal(false);
        }
      })
      .catch((err) => {
        setErrorMsg(err?.message);
        setIsError(true);
      });
  };

  useEffect(() => {
    if (pinCode) {
      setPincodeInputValue(pinCode);
    }
  }, [pinCode]);

  if (!cartItemsArray.length) {
    return <PageNotFound title={emptyCartText} />;
  }

  return (
    <div className={`${styles.cartMainContainer} fontBody`}>
      {cartData?.message && cartData?.items && (
        <div className={styles.errContainer}>
          <span className={styles.errorIcon}>
            <SvgWrapper svgSrc="error-info-icon" />
          </span>
          <span className={styles.errMsg}>{cartData.message}</span>
        </div>
      )}
      {/* {removedItemMessage.length && (
        <div className={styles.successContainer}>
          src="'green-right-tick'"
          <span class="success-msg flex-grow-1">{removedItemMessage}</span>
          <div
            class="ncc-cursor-pointer"
            onClick={onClearRemovedItemMessageClick}
          >
            src="'cross-bold-success'"                 
          </div>
        </div>
      )} */}
      {/* {wishlistMessage.length && (
        <div className={styles.successContainer}>
            src="'green-right-tick'"                      
          <span class="success-msg flex-grow-1">{wishlistMessage}</span>
          <div class="ncc-cursor-pointer" onClick={removeWishlistMessage}>
            src="'cross-bold-success'"
          </div>
        </div>
      )} */}
      <div className={styles.cartWrapper}>
        <div className={styles.cartItemDetailsContainer}>
          <div className={styles.cartPincodeContainer}>
            <div className={styles.pinCodeDetailsContainer}>
              <span className={styles.pincodeHeading}>
                {pinCode ? "Deliver To:" : "Check delivery time & services"}
              </span>
              <span className={styles.pinCode}>
                &nbsp;
                {pinCode}
              </span>
            </div>
            <div
              className={styles.changePinCodeButton}
              onClick={() => setShowModal(true)}
            >
              {pinCode ? "Change" : "Enter PIN Code"}
            </div>
            <Modal isOpen={showModal} closeDialog={() => setShowModal(false)}>
              <div className={styles.pinCodeModal}>
                <div className={styles.modalHeader}>
                  <div>
                    <div className={styles.modalHeading}>
                      Enter Delivery Pincode
                    </div>
                  </div>
                  <div className={styles.modalCloseIcon}>
                    <span>
                      <SvgWrapper
                        svgSrc="item-close"
                        onClick={() => setShowModal(false)}
                      />
                    </span>
                  </div>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.modalPincodeContainer}>
                    <div className={styles.modalPincodeInput}>
                      <input
                        placeholder="Enter Pincode"
                        value={pincodeInputValue}
                        onChange={(e) => setPincodeInputValue(e.target.value)}
                      />
                    </div>
                    <button
                      className={styles.modalChangePinCodeButton}
                      onClick={validatePincode}
                    >
                      Change
                    </button>
                    {isError && (
                      <div className={styles.errorText}>{errorMsg}</div>
                    )}
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          <div className={styles.cartTitleContainer}>
            <div className={styles.bagDetailsContainer}>
              <span className={styles.bagCountHeading}>Your Bag</span>
              <span className={styles.bagCount}>
                {cartItemCount || 0} items
              </span>
            </div>
            <div className={styles.shareCartTablet}>
              <ShareCart {...cartShareProps} />
            </div>
          </div>
          {cartItemsArray?.length > 0 &&
            cartItemsArray?.map((singleItem, itemIndex) => {
              const singleItemDetails = cartItems[singleItem];
              const productImage =
                singleItemDetails?.product?.images?.length > 0 &&
                singleItemDetails?.product?.images[0]?.url;
              const currentSize = singleItem?.split("_")[1];
              return (
                <ChipItem
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
                  onMoveToWishlistClick={onMoveToWishlistClick}
                />
              );
            })}
        </div>
        {breakUpValues?.display.length > 0 && (
          <div className={styles.cartItemPriceSummaryDetails}>
            <Coupon {...cartCouponProps} />
            <Comment {...cartCommentProps} />
            {isGstInput && <GstCard {...cartGstProps} key={cartData} />}
            <PriceBreakup
              breakUpValues={breakUpValues?.display || []}
              cartItemCount={cartItemsArray?.length || 0}
              currencySymbol={currencySymbol}
            />
            {!isLoggedIn && (
              <button
                className={styles.priceSummaryLoginButton}
                onClick={redirectToLogin}
              >
                LOGIN
              </button>
            )}
            {isAnonymous && (
              <button
                className={styles.priceSummaryGuestButton}
                disabled={!isValid || isOutOfStock || isNotServicable}
                onClick={onGotoCheckout}
              >
                CONTINUE AS GUEST
              </button>
            )}
            {isLoggedIn && (
              <button
                className={styles.priceSummaryLoginButton}
                disabled={!isValid || isOutOfStock || isNotServicable}
                onClick={onGotoCheckout}
              >
                checkout
              </button>
            )}
            <div className={styles.shareCartDesktop}>
              <ShareCart showCard={true} {...cartShareProps} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
