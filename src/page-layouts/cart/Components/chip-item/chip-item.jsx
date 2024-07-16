import React from "react";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./chip-item.less";

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
}) {
  const isOutOfStock = singleItemDetails?.availability?.out_of_stock || false;
  const isServiceable = singleItemDetails?.availability?.deliverable;
  const isCustomOrder =
    singleItemDetails?.custom_order?.is_custom_order || false;
  return (
    <>
      <div
        className={`${styles.cartItemsListContainer} fontBody`}
        key={itemIndex}
      >
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
        <div className={styles.eachItemContainer}>
          <div
            className={`${styles.itemImageContainer} ${
              isOutOfStock ? styles.outOfStock : ""
            }`}
          >
            <FDKLink to={`/product/${singleItemDetails?.product?.slug}`}>
              <img src={productImage} alt="Product Image" />
            </FDKLink>
          </div>
          <div className={styles.eachItemDetailsContainer}>
            <div
              className={styles.removeItemSvgContainer}
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
              <SvgWrapper
                svgSrc="item-close"
                className={styles.itemRemoveIcon}
              />
            </div>
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
                Sold by: {singleItemDetails?.article?.seller?.name}
              </div>
            )}
            <div className={styles.itemSizeQuantityContainer}>
              <div className={styles.itemSizeQuantitySubContainer}>
                <div
                  className={styles.sizeContainer}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSizeModal(singleItem);
                  }}
                >
                  <div className={styles.sizeName}>
                    Size: &nbsp;
                    {currentSize}
                  </div>
                  <span className={styles.itemSvg}>
                    <SvgWrapper
                      svgSrc="arrow-down"
                      style={{ width: "20px", height: "24px" }}
                    />
                  </span>
                </div>
                {!isOutOfStock && isServiceable && (
                  <div className={styles.quantityIncreaseDecreaseContainer}>
                    <div
                      className={styles.decreaseCount}
                      onClick={(e) =>
                        onUpdateCartItems(
                          e,
                          singleItemDetails,
                          currentSize,
                          -1,
                          itemIndex,
                          "update_item"
                        )
                      }
                    >
                      <div className={styles.svgContainer}>
                        <SvgWrapper svgSrc="decrease" />
                      </div>
                    </div>
                    <div className={styles.count}>
                      {singleItemDetails?.quantity || 0}
                    </div>
                    <div
                      className={styles.increaseCount}
                      onClick={(e) =>
                        onUpdateCartItems(
                          e,
                          singleItemDetails,
                          currentSize,
                          1,
                          itemIndex,
                          "update_item"
                        )
                      }
                    >
                      <div className={styles.svgContainer}>
                        <SvgWrapper svgSrc="increase" />
                      </div>
                    </div>
                  </div>
                )}
                {singleItemDetails?.article?.quantity < 100 &&
                  !isOutOfStock &&
                  isServiceable &&
                  !isCustomOrder && (
                    <div
                      className={`${styles["new-cart-red-color"]} ${styles["limited-qty-box"]} ${styles["ncc-ml-12"]}`}
                    >
                      Hurry! Only {singleItemDetails?.article?.quantity} Left
                    </div>
                  )}
              </div>
            </div>
            <div className={styles.itemPriceContainer}>
              <div className={styles.itemPrice}>
                <span
                  className={`${styles.effectivePrice} ${
                    isOutOfStock ? styles.outOfStock : ""
                  }`}
                >
                  {singleItemDetails?.price?.base?.currency_symbol}
                  {singleItemDetails?.price?.base?.effective}
                </span>
                {singleItemDetails?.price?.base?.effective <
                  singleItemDetails?.price?.base?.marked && (
                  <span className={styles.markedPrice}>
                    {singleItemDetails?.price?.base?.currency_symbol}
                    {singleItemDetails?.price?.base?.marked}
                  </span>
                )}
                <span className={styles.discount}>
                  {singleItemDetails?.discount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${styles.sizeModalContainer} fontBody ${
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
                  {sizeModalItemValue?.article?.price?.base?.currency_symbol}
                  {sizeModalItemValue?.article?.price?.base?.effective}
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
          <div
            className={styles.sizeModalFooter}
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
          </div>
        </div>
      </div>
    </>
  );
}
