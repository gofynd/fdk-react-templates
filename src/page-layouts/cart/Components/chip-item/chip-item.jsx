import React, { useState, useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./chip-item.less";
import { currencyFormat, numberWithCommas } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import QuantityControl from "../../../../components/quantity-control/quantity-control";

export default function ChipItem({
  singleItemDetails,
  onUpdateCartItems,
  currentSize,
  productImage,
  itemIndex,
  sizeModalItemValue,
  currentSizeModalSize,
  setCurrentSizeModalSize,
  setSizeModal,
  sizeModal,
  cartItems,
  cartItemsWithActualIndex,
  singleItem,
  onRemoveIconClick = () => {},
}) {
  const isOutOfStock = singleItemDetails?.availability?.out_of_stock || false;
  const isServiceable = singleItemDetails?.availability?.deliverable;
  const isCustomOrder =
    singleItemDetails?.custom_order?.is_custom_order || false;
  const couponText = singleItemDetails?.coupon_message || "";

  return (
    <>
      <div className={styles.cartItemsListContainer} key={itemIndex}>
        {isOutOfStock && (
          <div
            className={`${styles["out-of-stock-chip"]} ${styles["new-cart-red-color"]}`}
          >
            <span>{singleItemDetails?.message || "Out Of Stock"}</span>
            <span
              className={styles.removeAction}
              onClick={(e) =>
                onUpdateCartItems(
                  e,
                  singleItemDetails,
                  currentSize,
                  0,
                  itemIndex,
                  "remove_item"
                )
              }
            >
              {" "}
              REMOVE
            </span>
          </div>
        )}
        {couponText.length > 0 && (
          <div className={styles.appliedCouponRibbon}>
            <SvgWrapper svgSrc="applied-coupon-small" />
            <span className={styles.couponText}>{couponText}</span>
          </div>
        )}
        <div className={styles.eachItemContainer}>
          <div
            className={`${styles.itemImageContainer} ${
              isOutOfStock ? styles.outOfStock : ""
            }`}
          >
            <FDKLink to={`/product/${singleItemDetails?.product?.slug}`}>
              <img src={productImage} alt={singleItemDetails?.product?.name} />
            </FDKLink>
          </div>
          <div className={styles.eachItemDetailsContainer}>
            <button
              className={styles.removeItemSvgContainer}
              onClick={() =>
                onRemoveIconClick({
                  item: singleItemDetails,
                  size: currentSize,
                  index: itemIndex,
                })
              }
            >
              <SvgWrapper
                svgSrc="item-close"
                className={styles.itemRemoveIcon}
              />
            </button>
            <div className={styles.itemBrand}>
              {singleItemDetails?.product?.brand?.name}
            </div>
            <div
              className={`${styles.itemName} ${
                isOutOfStock ? styles.outOfStock : ""
              } `}
            >
              {singleItemDetails?.product?.name}
            </div>
            {!isOutOfStock && (
              <div className={styles.itemSellerName}>
                {`Sold by: ${singleItemDetails?.article?.seller?.name}`}
              </div>
            )}
            <div className={styles.itemSizeQuantityContainer}>
              <div className={styles.itemSizeQuantitySubContainer}>
                <button
                  className={styles.sizeContainer}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSizeModal(singleItem);
                  }}
                >
                  <div className={styles.sizeName}>
                    {`Size: ${currentSize}`}
                  </div>
                  <span className={styles.itemSvg}>
                    <SvgWrapper
                      svgSrc="arrow-down"
                      style={{ width: "20px", height: "24px" }}
                    />
                  </span>
                </button>
                {!isOutOfStock && isServiceable && (
                  <QuantityControl
                    count={singleItemDetails?.quantity || 0}
                    onDecrementClick={(e) =>
                      onUpdateCartItems(
                        e,
                        singleItemDetails,
                        currentSize,
                        -1,
                        itemIndex,
                        "update_item"
                      )
                    }
                    onIncrementClick={(e) =>
                      onUpdateCartItems(
                        e,
                        singleItemDetails,
                        currentSize,
                        1,
                        itemIndex,
                        "update_item"
                      )
                    }
                  />
                )}
              </div>

              {singleItemDetails?.article?.quantity < 11 &&
                !isOutOfStock &&
                isServiceable &&
                !isCustomOrder && (
                  <div className={styles.limitedQtyBox}>
                    {` Hurry! Only ${singleItemDetails?.article?.quantity} Left`}
                  </div>
                )}
            </div>
            <div className={styles.itemTotalContainer}>
              <div className={styles.itemPrice}>
                <span
                  className={`${styles.effectivePrice} ${
                    isOutOfStock ? styles.outOfStock : ""
                  }`}
                >
                  {currencyFormat(
                    numberWithCommas(singleItemDetails?.price?.base?.effective),
                    singleItemDetails?.price?.base?.currency_symbol
                  )}
                </span>
                {singleItemDetails?.price?.base?.effective <
                  singleItemDetails?.price?.base?.marked && (
                  <span className={styles.markedPrice}>
                    {currencyFormat(
                      numberWithCommas(singleItemDetails?.price?.base?.marked),
                      singleItemDetails?.price?.base?.currency_symbol
                    )}
                  </span>
                )}
                <span className={styles.discount}>
                  {singleItemDetails?.discount}
                </span>
              </div>
              {!isOutOfStock &&
                isServiceable &&
                singleItemDetails?.delivery_promise?.formatted.max && (
                  <div className={styles.deliveryDateWrapper}>
                    <div className={styles.shippingLogo}>
                      <SvgWrapper svgSrc="truck" />
                    </div>
                    <div className={styles.deliveryDate}>
                      {`Delivery by ${singleItemDetails.delivery_promise.formatted.max}`}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${styles.sizeModalContainer} ${
          sizeModal && cartItems[sizeModal] !== null ? styles.selected : ""
        }`}
      >
        <div className={styles.modalContainer}>
          <div className={styles.sizeModalHeader}>
            <div className={styles.sizeModalDiv}>
              <div className={styles.sizeModalImage}>
                <img
                  src={
                    sizeModalItemValue?.product?.images?.length > 0
                      ? sizeModalItemValue?.product?.images[0]?.url
                      : undefined
                  }
                />
              </div>
              <div className={styles.sizeModalContent}>
                <div>
                  <div className={styles.sizeModalBrand}>
                    {sizeModalItemValue?.product?.brand?.name}
                  </div>
                  <div className={styles.sizeModalName}>
                    {sizeModalItemValue?.product?.name}
                  </div>
                </div>
                <div className={styles.sizeDiscount}>
                  {currencyFormat(
                    numberWithCommas(
                      sizeModalItemValue?.article?.price?.base?.effective
                    ),
                    sizeModalItemValue?.article?.price?.base?.currency_symbol
                  )}
                </div>
              </div>
            </div>
            <div
              className={styles.modalCloseIcon}
              onClick={(e) => {
                e.stopPropagation();
                setSizeModal(null);
                setCurrentSizeModalSize(null);
              }}
            >
              <span>
                <SvgWrapper
                  svgSrc="item-close"
                  className={styles.itemRemoveIcon}
                />
              </span>
            </div>
          </div>
          <div className={styles.sizeModalBody}>
            <div className={styles.sizeSelectHeading}>
              {sizeModalItemValue?.availability?.available_sizes?.length > 0
                ? "Select Size"
                : "This Product is not available"}
            </div>
            <div className={styles.sizeHorizontalList}>
              {sizeModalItemValue?.availability?.available_sizes?.length > 0 &&
                sizeModalItemValue?.availability?.available_sizes?.map(
                  (singleSize) => {
                    const isEarlierSelectedSize =
                      !currentSizeModalSize &&
                      sizeModal?.split("_")[1] === singleSize?.value;
                    const isCurrentSelectedSize =
                      currentSizeModalSize?.split("_")[1] === singleSize?.value;
                    return (
                      <div
                        key={singleSize?.display}
                        className={`${styles.singleSize}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div
                          className={`${styles.singleSizeDetails} ${
                            (isEarlierSelectedSize || isCurrentSelectedSize) &&
                            styles.singleSizeSelected
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (singleSize?.value && !isEarlierSelectedSize) {
                              const newSizeModalValue = `${
                                sizeModal?.split("_")[0]
                              }_${singleSize?.value}`;
                              setCurrentSizeModalSize(newSizeModalValue);
                            }
                          }}
                        >
                          {singleSize?.display}
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
          <button
            className={`${styles.sizeModalFooter} ${(!currentSizeModalSize || currentSizeModalSize === sizeModal) && styles.disableBtn}`}
            disabled={
              !currentSizeModalSize || currentSizeModalSize === sizeModal
            }
            onClick={(e) => {
              let itemIndex;
              for (let j = 0; j < cartItemsWithActualIndex.length; j += 1) {
                if (cartItemsWithActualIndex[j]?.key === sizeModal) {
                  itemIndex = j;
                  break;
                }
              }
              onUpdateCartItems(
                e,
                sizeModalItemValue,
                currentSizeModalSize
                  ? currentSizeModalSize.split("_")[1]
                  : sizeModal?.split("_")[1],
                cartItems[sizeModal]?.quantity,
                itemIndex,
                "update_item"
              );
              setCurrentSizeModalSize(null);
              setSizeModal(null);
            }}
          >
            <div className={styles.updateSizeButton}>UPDATE</div>
          </button>
        </div>
      </div>
    </>
  );
}
