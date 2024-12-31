import React, { useState, useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./chip-item.less";
import { currencyFormat, numberWithCommas } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import QuantityControl from "../../../../components/quantity-control/quantity-control";
import Modal from "../../../../components/core/modal/modal";
import { useMobile } from "../../../../helper/hooks";

export default function ChipItem({
  isCartUpdating,
  singleItemDetails,
  onUpdateCartItems,
  currentSize,
  isDeliveryPromise = true,
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
  isPromoModalOpen,
  onRemoveIconClick = () => {},
  onOpenPromoModal,
  onClosePromoModal,
}) {
  const isMobile = useMobile();
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [sizeModalErr, setSizeModalErr] = useState(null);
  const [activePromoIndex, setActivePromoIndex] = useState(null);
  const isOutOfStock = singleItemDetails?.availability?.out_of_stock || false;
  const isServiceable = singleItemDetails?.availability?.deliverable;
  const isCustomOrder =
    singleItemDetails?.custom_order?.is_custom_order || false;
  const couponText = singleItemDetails?.coupon_message || "";
  const moq = singleItemDetails?.moq;
  const incrementDecrementUnit = moq?.increment_unit ?? 1;
  const maxCartQuantity = Math.min(
    moq?.maximum || Number.POSITIVE_INFINITY,
    singleItemDetails?.article?.quantity || 0
  );
  const minCartQuantity = moq?.minimum || 1;

  const cartUpdateHandler = async (
    event,
    itemDetails,
    itemSize,
    quantity,
    itemIndex,
    operation,
    isSizeUpdate = false
  ) => {
    let totalQuantity = (itemDetails?.quantity || 0) + quantity;

    if (operation === "edit_item") {
      totalQuantity = quantity;
      operation = "update_item";
    }

    if (!itemDetails?.custom_order?.is_custom_order && !isSizeUpdate) {
      if (totalQuantity > maxCartQuantity) {
        totalQuantity = maxCartQuantity;
        if (itemDetails?.quantity === maxCartQuantity) {
          setShowQuantityError(true);
          return;
        }
      }
      if (totalQuantity < minCartQuantity) {
        if (itemDetails?.quantity > minCartQuantity) {
          totalQuantity = minCartQuantity;
        } else {
          totalQuantity = 0;
        }
      }
    }
    setShowQuantityError(false);
    const cartUpdateResponse = await onUpdateCartItems(
      event,
      itemDetails,
      itemSize,
      totalQuantity,
      itemIndex,
      operation
    );

    if (isSizeUpdate) {
      setSizeModalErr(null);
      if (cartUpdateResponse?.success) {
        setCurrentSizeModalSize(null);
        setSizeModal(null);
      } else {
        setSizeModalErr(cartUpdateResponse?.message || "Something went wrong");
      }
    }
  };

  const promoTitle = useMemo(() => {
    const totalPromo = singleItemDetails?.promotions_applied?.length || 0;
    if (totalPromo === 1) return "1 Offer";
    else if (totalPromo > 1) return `${totalPromo} Offers`;
    else return "";
  }, [singleItemDetails]);

  const toggleActivePromo = (e, index) => {
    e.stopPropagation();
    if (activePromoIndex === index) setActivePromoIndex(null);
    else setActivePromoIndex(index);
  };
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
                cartUpdateHandler(
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
            {!isOutOfStock && isServiceable && (
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
            )}
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
                    isCartUpdating={isCartUpdating}
                    count={singleItemDetails?.quantity || 0}
                    onDecrementClick={(e) =>
                      cartUpdateHandler(
                        e,
                        singleItemDetails,
                        currentSize,
                        -incrementDecrementUnit,
                        itemIndex,
                        "update_item"
                      )
                    }
                    onIncrementClick={(e) =>
                      cartUpdateHandler(
                        e,
                        singleItemDetails,
                        currentSize,
                        incrementDecrementUnit,
                        itemIndex,
                        "update_item"
                      )
                    }
                    onQtyChange={(evt, currentNum) =>
                      cartUpdateHandler(
                        evt,
                        singleItemDetails,
                        currentSize,
                        currentNum,
                        itemIndex,
                        "edit_item"
                      )
                    }
                    maxCartQuantity={maxCartQuantity}
                    minCartQuantity={minCartQuantity}
                  />
                )}
                {isOutOfStock && (
                  <div className={styles.outOfStockChip}>Out Of Stock</div>
                )}
                {!isServiceable && (
                  <div className={styles.outOfStockChip}>
                    Item Not Deliverable
                  </div>
                )}
              </div>
              {showQuantityError && !isOutOfStock && isServiceable && (
                <div className={styles.limitedQtyBox}>
                  {` Max Quantity: ${maxCartQuantity}`}
                </div>
              )}

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
                    numberWithCommas(
                      singleItemDetails?.price?.converted?.effective ??
                        singleItemDetails?.price?.base?.effective
                    ),
                    singleItemDetails?.price?.converted?.currency_symbol ??
                      singleItemDetails?.price?.base?.currency_symbol
                  )}
                </span>
                {singleItemDetails?.price?.converted?.effective <
                  singleItemDetails?.price?.converted?.marked && (
                  <span className={styles.markedPrice}>
                    {currencyFormat(
                      numberWithCommas(
                        singleItemDetails?.price?.converted?.marked ??
                          singleItemDetails?.price?.base?.marked
                      ),
                      singleItemDetails?.price?.converted?.currency_symbol ??
                        singleItemDetails?.price?.base?.currency_symbol
                    )}
                  </span>
                )}
                <span className={styles.discount}>
                  {singleItemDetails?.discount}
                </span>
              </div>
              {isDeliveryPromise &&
                !isOutOfStock &&
                isServiceable &&
                singleItemDetails?.delivery_promise?.formatted?.max && (
                  <div className={styles.deliveryDateWrapper}>
                    <div className={styles.shippingLogo}>
                      <SvgWrapper svgSrc="truck" />
                    </div>
                    <div className={styles.deliveryDate}>
                      {`Delivery by ${singleItemDetails?.delivery_promise?.formatted?.max}`}
                    </div>
                  </div>
                )}
            </div>
            {singleItemDetails?.promotions_applied?.length > 0 &&
              !isOutOfStock &&
              isServiceable && (
                <div
                  className={styles.appliedOfferRibbon}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPromoModal();
                  }}
                >
                  <span>
                    {promoTitle}
                    Applied
                  </span>
                  <SvgWrapper svgSrc="applied-promo" className={styles.ml6} />
                </div>
              )}
          </div>
        </div>
        {isPromoModalOpen && (
          <Modal
            isOpen={isPromoModalOpen}
            closeDialog={onClosePromoModal}
            modalType={isMobile ? "right-modal" : "center-modal"}
            title={`${promoTitle} Applied`}
            isCancellable={false}
            containerClassName={styles.chipModal}
          >
            <div className={`${styles.promoBody}`}>
              {singleItemDetails?.promotions_applied?.map(
                (promoItem, index) => (
                  <div
                    className={styles.promotionWrapper}
                    key={promoItem.promo_id + index}
                  >
                    <div className={styles.promoOffer}>
                      <SvgWrapper svgSrc="applied-promo" />
                      <div className={styles.labelTextWrapper}>
                        <div className={styles.promoLabel}>
                          {promoItem.offer_label}
                        </div>
                        <div className={styles.textToggleWrapper}>
                          <div className={styles.promoText}>
                            {promoItem.offer_text}
                          </div>
                          {promoItem?.offer_description?.length > 0 && (
                            <div
                              className={styles.termCondition}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleActivePromo(e, index);
                              }}
                            >
                              T&C
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {activePromoIndex === index &&
                      promoItem.offer_description &&
                      promoItem.offer_description.length > 0 && (
                        <div
                          className={styles.htmlContent}
                          suppressHydrationWarning
                          dangerouslySetInnerHTML={{
                            __html: promoItem.offer_description,
                          }}
                        />
                      )}
                  </div>
                )
              )}
            </div>
          </Modal>
        )}
      </div>

      <Modal
        isOpen={
          sizeModal && cartItems[sizeModal] !== null && sizeModal === singleItem
        }
        closeDialog={(e) => {
          e.stopPropagation();
          setSizeModal(null);
          setCurrentSizeModalSize(null);
          setSizeModalErr(null);
        }}
        isCancellable={false}
        headerClassName={styles.sizeModalHeader}
        containerClassName={styles.sModalContainer}
        title={
          <div className={styles.sizeModalTitle}>
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
          </div>
        }
      >
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
                        }
                          ${
                            !singleSize?.is_available &&
                            styles.sigleSizeDisabled
                          }
                          `}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!singleSize?.is_available) return;
                          if (singleSize?.value && !isEarlierSelectedSize) {
                            setSizeModalErr(null);
                            const newSizeModalValue = `${
                              sizeModal?.split("_")[0]
                            }_${singleSize?.value}`;
                            setCurrentSizeModalSize(newSizeModalValue);
                          }
                        }}
                      >
                        {singleSize?.display}
                        {!singleSize?.is_available && (
                          <svg>
                            <line x1="0" y1="100%" x2="100%" y2="0" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
        <div className={styles.sizeModalErrCls}>{sizeModalErr}</div>
        <button
          className={`${styles.sizeModalFooter} ${(!currentSizeModalSize || currentSizeModalSize === sizeModal || sizeModalErr) && styles.disableBtn}`}
          disabled={
            !currentSizeModalSize ||
            currentSizeModalSize === sizeModal ||
            sizeModalErr
          }
          onClick={(e) => {
            let itemIndex;
            for (let j = 0; j < cartItemsWithActualIndex.length; j += 1) {
              if (cartItemsWithActualIndex[j]?.key === sizeModal) {
                itemIndex = j;
                break;
              }
            }
            cartUpdateHandler(
              e,
              sizeModalItemValue,
              currentSizeModalSize
                ? currentSizeModalSize.split("_")[1]
                : sizeModal?.split("_")[1],
              cartItems[currentSizeModalSize]?.quantity || 0,
              itemIndex,
              "update_item",
              true
            );
          }}
        >
          <div className={styles.updateSizeButton}>UPDATE</div>
        </button>
      </Modal>
    </>
  );
}
