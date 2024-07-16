import React, { useState, useMemo } from "react";
import * as styles from "./cart.less";
import { FDKLink } from "fdk-core/components";
import Loader from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import PageNotFound from "../../components/page-not-found/page-not-found";
import Coupon from "../../page-layouts/cart/Components/coupon/coupon";
import Comment from "../../page-layouts/cart/Components/comment/comment";
import GstCard from "../../page-layouts/cart/Components/gst-card/gst-card";
import PriceBreakup from "../../components/price-breakup/price-breakup";
import { updateGraphQueryWithValue } from "../../helper/utils";
import ChipItem from "../../page-layouts/cart/Components/chip-item/chip-item";

const Cart = ({
  isLoggedIn = false,
  fpi,
  pinCode,
  cartData,
  cartItems,
  cartItemsWithActualIndex,
  breakUpValues,
  cartItemCount,
  coupons,
  appFeatures,
  isLoading,
  addressList,
  onUpdateCartItems,
  onGotoCheckout,
  onApplyCoupon,
  onRemoveCoupon,
  onUpdateComment,
  onApplyGST,
  onRemoveGST,
  onHandlePinCode,
  onChangePinCode,
  onFetchAddress,
  onAddNewAddress,
  onSelectAddress,
}) => {
  const [sizeModal, setSizeModal] = useState(null);
  const [currentSizeModalSize, setCurrentSizeModalSize] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isError, setisError] = useState(false);
  const [errorMsg, seterrorMsg] = useState(false);

  const navigate = useNavigate();

  const handlePinCodeInput = (input) => {
    const regex = /^[0-9]{0,6}$/; // Only allow numbers and maximum 6 digits

    if (regex.test(input)) {
      onChangePinCode(input);
    }
  };

  const redirectToLogin = () => {
    navigate("/auth/login");
  };

  const cartItemsArray = Object.keys(cartItems || {});
  const sizeModalItemValue = cartItems && sizeModal && cartItems[sizeModal];
  // console.log(cartItemCount, cartItems, cartItemsArray, 'Cart');

  const couponAttrs = useMemo(() => {
    let attrs = {
      title: "COUPONS",
    };
    if (breakUpValues?.coupon?.is_applied && breakUpValues?.coupon?.code) {
      attrs = {
        ...attrs,
        code: breakUpValues?.coupon?.code,
        hasCancel: true,
        discount: breakUpValues?.coupon?.value || 0,
        uid: breakUpValues?.coupon?.uid,
      };
    } else {
      attrs = { ...attrs, subtitle: "View all offers" };
    }

    return attrs;
  }, [breakUpValues]);

  const currencySymbol = useMemo(() => cartData?.currency?.symbol, [cartData]);

  if (!cartItemsArray.length && !isLoading) {
    return <PageNotFound title="Your shopping bag is empty" />;
  }

  return (
    <>
      <div className={`${styles.cartMainContainer} fontBody`}>
        <div className={styles.cartWrapper}>
          <div className={styles.cartItemDetailsContainer}>
            <div className={styles.cartPincodeContainer}>
              <div className={styles.pinCodeDetailsContainer}>
                <span className={styles.pincodeHeading}>Deliver To:</span>
                <span className={styles.pinCode}>
                  &nbsp;
                  {`${pinCode || "Enter Pincode"}`}
                </span>
              </div>
              <div
                className={styles.changePinCodeButton}
                onClick={() => setShowModal(true)}
              >
                Change
              </div>
              {showModal && (
                <div className={styles.pinCodeModal}>
                  <div className={styles.modalContainer}>
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
                            value={pinCode}
                            onChange={(e) => handlePinCodeInput(e.target.value)}
                          />
                        </div>
                        <button
                          className={styles.modalChangePinCodeButton}
                          onClick={() => {
                            onHandlePinCode();
                            setShowModal(false);
                          }}
                        >
                          Change
                        </button>
                      </div>
                      {isError && (
                        <div style={{ color: "red" }}> {errorMsg}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.cartItemDetailsContainer}>
              <div className={styles.bagDetailsContainer}>
                <span className={styles.bagCountHeading}>Your Bag</span>
                <span className={styles.bagCount}>
                  {cartItemCount || 0} items
                </span>
              </div>
              <div />
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
                  />
                );
              })}
          </div>
          {(breakUpValues?.display.length > 0 || true) && (
            <div className={styles.cartItemPriceSummaryDetails}>
              <Coupon
                {...couponAttrs}
                coupons={coupons}
                applyCoupon={onApplyCoupon}
                removeCoupon={onRemoveCoupon}
                currencySymbol={currencySymbol}
              />
              <Comment cartData={cartData} updateComment={onUpdateComment} />
              {appFeatures?.cart?.gst_input && (
                <GstCard
                  cartData={cartData}
                  currencySymbol={currencySymbol}
                  applyGST={onApplyGST}
                  removeGST={onRemoveGST}
                />
              )}
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
              {!isLoggedIn && (
                <button
                  className={styles.priceSummaryGuestButton}
                  onClick={onGotoCheckout}
                >
                  CONTINUE AS GUEST
                </button>
              )}
              {isLoggedIn && (
                <button
                  className={styles.priceSummaryLoginButton}
                  onClick={onGotoCheckout}
                >
                  checkout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
};

export default Cart;
