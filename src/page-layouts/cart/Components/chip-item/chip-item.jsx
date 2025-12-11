import React, { useState, useMemo, useEffect } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./chip-item.less";
import {
  currencyFormat,
  formatLocale,
  numberWithCommas,
  translateDynamicLabel,
} from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import QuantityControl from "../../../../components/quantity-control/quantity-control";
import Modal from "../../../../components/core/modal/modal";
import { useMobile } from "../../../../helper/hooks";
import FreeGiftItem from "../free-gift-item/free-gift-item";
import RadioIcon from "../../../../assets/images/radio";
import Accordion from "../../../../components/accordion/accordion";
import {
  useGlobalStore,
  useFPI,
  useGlobalTranslation,
  useNavigate,
} from "fdk-core/utils";
import ChipImage from "./chip-image";

export default function ChipItem({
  isCartUpdating,
  singleItemDetails,
  onUpdateCartItems,
  currentSize,
  isDeliveryPromise = true,
  imageWidth,
  globalConfig,
  itemIndex,
  sizeModalItemValue,
  currentSizeModalSize,
  setCurrentSizeModalSize,
  setSizeModal,
  sizeModal,
  cartItems,
  cartItemsWithActualIndex,
  singleItem,
  buybox,
  availableFOCount,
  isPromoModalOpen,
  isSoldBy = false,
  onRemoveIconClick = () => {},
  onOpenPromoModal,
  onClosePromoModal,
  getFulfillmentOptions,
  pincode,
  getDeliveryPromise,
  isLimitedStock,
  limitedStockLabel,
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const navigate = useNavigate();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  const { limited_stock_quantity: limitedStockQuantity = 11 } = globalConfig;
  const isMobile = useMobile();
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [showFOModal, setShowFOModal] = useState(false);
  const [sizeModalErr, setSizeModalErr] = useState(null);
  const [activePromoIndex, setActivePromoIndex] = useState(null);
  const [clickedPromoIndex, setClickedPromoIndex] = useState(null);
  const [fulfillmentOptions, setFulfillmentOptions] = useState([]);
  const [selectedFO, setSelectedFO] = useState(
    singleItemDetails?.article?.fulfillment_option
  );
  const [foSellerStoreName, setFOSellerStoreName] = useState("");

  const isOutOfStock = singleItemDetails?.availability?.out_of_stock || false;
  const isServiceable = singleItemDetails?.availability?.deliverable;
  const isCustomOrder =
    singleItemDetails?.custom_order?.is_custom_order || false;
  const couponText = singleItemDetails?.coupon_message || "";
  const moq = singleItemDetails?.moq;
  const incrementDecrementUnit = moq?.increment_unit ?? 1;
  const customizationOptions =
    singleItemDetails?.article?._custom_json?._display || [];

  const [items, setItems] = useState([
    { title: "Customization", content: customizationOptions, open: false },
  ]);

  const isSellerBuyBoxListing = useMemo(() => {
    return (
      buybox?.show_name &&
      buybox?.enable_selection &&
      buybox?.is_seller_buybox_enabled
    );
  }, [buybox]);

  const isStoreBuyboxListing = useMemo(() => {
    return (
      buybox?.show_name &&
      buybox?.enable_selection &&
      !buybox?.is_seller_buybox_enabled
    );
  }, [buybox]);

  const getMaxQuantity = (item) => {
    let maxQuantity = item?.max_quantity?.item || 0;

    if (isSellerBuyBoxListing) {
      maxQuantity = item?.max_quantity?.item_seller || 0;
    } else if (isStoreBuyboxListing) {
      maxQuantity = item?.max_quantity?.item_store || 0;
    }

    return maxQuantity;
  };

  const maxCartQuantity = Math.min(
    moq?.maximum || Number.POSITIVE_INFINITY,
    getMaxQuantity(singleItemDetails) || 0
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

    if (operation === "edit_item" || isSizeUpdate) {
      totalQuantity = quantity;
    }

    if (!itemDetails?.custom_order?.is_custom_order && !isSizeUpdate) {
      if (totalQuantity > maxCartQuantity) {
        totalQuantity = maxCartQuantity;
      }

      setShowQuantityError(totalQuantity >= maxCartQuantity);

      if (totalQuantity < minCartQuantity) {
        if (operation === "edit_item") {
          totalQuantity = minCartQuantity;
        } else if (itemDetails?.quantity > minCartQuantity) {
          totalQuantity = minCartQuantity;
        } else {
          totalQuantity = 0;
        }
      }
    }

    if (
      itemDetails?.quantity !== totalQuantity ||
      operation === "remove_item" ||
      isSizeUpdate
    ) {
      const cartUpdateResponse = await onUpdateCartItems(
        event,
        itemDetails,
        itemSize,
        totalQuantity,
        itemIndex,
        operation === "edit_item" ? "update_item" : operation,
        false,
        true
      );

      if (isSizeUpdate) {
        if (cartUpdateResponse?.success) {
          setCurrentSizeModalSize(null);
          setSizeModal(null);
          setSizeModalErr(null);
        } else {
          setSizeModal(currentSizeModalSize);
          setSizeModalErr(t("resource.cart.size_is_out_of_stock"));
        }
      }
    }
  };

  const promoTitle = useMemo(() => {
    const totalPromo = singleItemDetails?.promotions_applied?.length || 0;
    if (totalPromo === 1) return t("resource.cart.one_offer");
    else if (totalPromo > 1)
      return `${totalPromo} ${t("resource.common.offers")}`;
    else return "";
  }, [singleItemDetails]);

  const sellerStoreName = useMemo(() => {
    const sellerName = singleItemDetails?.article?.seller?.name;
    const storeName = singleItemDetails?.article?.store?.name;

    return [sellerName, storeName].filter(Boolean).join(", ") || "";
  }, [singleItemDetails]);

  const isMaxQuantityAddedInCart = useMemo(() => {
    let productUid = singleItemDetails.product?.uid;
    let articleSize = singleItemDetails.article?.size;

    const filteredItems =
      Object.values(cartItems)?.filter(
        (item) =>
          item?.product?.uid === productUid &&
          item?.article?.size === articleSize
      ) || [];

    if (!filteredItems.length) {
      return false;
    }

    let totalQuantity = 0;
    let maxQuantity = 0;

    if (isSellerBuyBoxListing) {
      const sellerUid = singleItemDetails?.article?.seller?.uid;
      totalQuantity = filteredItems
        .filter((item) => item?.article?.seller?.uid === sellerUid)
        .reduce((sum, item) => sum + item.quantity, 0);
      maxQuantity = singleItemDetails?.max_quantity?.item_seller || 0;
    } else if (isStoreBuyboxListing) {
      const storeUid = singleItemDetails?.article?.store?.uid;
      totalQuantity = filteredItems
        .filter((item) => item?.article?.store?.uid === storeUid)
        .reduce((sum, item) => sum + item.quantity, 0);
      maxQuantity = singleItemDetails?.max_quantity?.item_store || 0;
    } else {
      totalQuantity = filteredItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      maxQuantity = singleItemDetails?.max_quantity?.item || 0;
    }

    return totalQuantity >= maxQuantity;
  }, [
    singleItemDetails,
    cartItems,
    isSellerBuyBoxListing,
    isStoreBuyboxListing,
  ]);

  useEffect(() => {
    if (sellerStoreName) {
      setFOSellerStoreName(sellerStoreName);
    }
  }, [sellerStoreName]);

  const toggleActivePromo = (e, index) => {
    e.stopPropagation();
    if (activePromoIndex === index) setActivePromoIndex(null);
    else setActivePromoIndex(index);
  };

  const toggleFOModal = () => {
    setShowFOModal((modal) => !modal);
  };

  const openFOModal = async () => {
    setFulfillmentOptions([]);
    toggleFOModal();

    let foItems = await getFulfillmentOptions(
      singleItemDetails?.product?.slug,
      currentSize,
      pincode
    );

    setFulfillmentOptions(foItems);
  };

  const onFOSelection = async (foItem) => {
    setSelectedFO(foItem?.fulfillment_option || {});

    const sellerName = foItem?.seller?.name;
    const storeName = foItem?.store?.name;

    const sellerStoreLabel =
      [sellerName, storeName].filter(Boolean).join(", ") || "";

    setFOSellerStoreName(sellerStoreLabel);
  };

  const onFOUpdate = async (e) => {
    await onUpdateCartItems(
      e,
      singleItemDetails,
      currentSize,
      singleItemDetails?.quantity,
      itemIndex,
      "update_item",
      false,
      false,
      selectedFO?.slug
    );

    toggleFOModal();
  };

  const getDeliveryDate = (deliveryPromise) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };

    const { max } = deliveryPromise || {};

    if (!max) return false;

    const dateFormatter = new Intl.DateTimeFormat(undefined, options);
    const maxDate = dateFormatter.format(new Date(max));

    return maxDate;
  };

  const handleItemClick = (index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        open: !updatedItems[index].open,
      };
      return updatedItems;
    });
  };
  return (
    <>
      <div className={styles.cartItemsListContainer} key={itemIndex}>
        {isOutOfStock && (
          <div
            className={`${styles["out-of-stock-chip"]} ${styles["new-cart-red-color"]}`}
          >
            <span>
              {translateDynamicLabel(singleItemDetails?.message, t) ||
                t("resource.common.out_of_stock")}
            </span>
            {isOutOfStock && (
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
                {t("resource.facets.remove_caps")}
              </span>
            )}
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
            <FDKLink
              to={`/product/${singleItemDetails?.product?.slug}`}
              state={{
                product: {
                  ...singleItemDetails,
                  media:
                    singleItemDetails?.product?.images?.map((i) => ({
                      ...i,
                      type: "image",
                    })) || [],
                  ...(singleItemDetails?.product || {}),
                },
              }}
            >
              <ChipImage
                product={singleItemDetails?.product}
                type={singleItemDetails?.item_type}
                imageWidth={imageWidth}
                globalConfig={globalConfig}
              />
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
            {isSoldBy && !isOutOfStock && (
              <div className={styles.itemSellerName}>
                {`${t("resource.common.sold_by")}: ${sellerStoreName}`}
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
                    {`${t("resource.common.size")}: ${currentSize}`}
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
                    isIncrDisabled={isMaxQuantityAddedInCart}
                  />
                )}
                {isOutOfStock && (
                  <div className={styles.outOfStockChip}>
                    {t("resource.common.out_of_stock")}
                  </div>
                )}
                {!isServiceable && (
                  <div className={styles.outOfStockChip}>
                    {t("resource.cart.item_not_deliverable")}
                  </div>
                )}
              </div>
              {maxCartQuantity > 0 &&
                showQuantityError &&
                !isOutOfStock &&
                isServiceable && (
                  <div className={styles.limitedQtyBox}>
                    {` ${t("resource.common.max_quantity")}: ${maxCartQuantity}`}
                  </div>
                )}

              {isLimitedStock &&
                getMaxQuantity(singleItemDetails) > 0 &&
                getMaxQuantity(singleItemDetails) <= limitedStockQuantity &&
                !isOutOfStock &&
                isServiceable &&
                !isCustomOrder &&
                !buybox?.is_seller_buybox_enabled && (
                  <div className={styles.limitedQtyBox}>
                    {limitedStockLabel.replace(
                      /\{\{qty\}\}/g,
                      getMaxQuantity(singleItemDetails)
                    )}
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
                      singleItemDetails?.price?.base?.currency_symbol,
                    formatLocale(locale, countryCode, true)
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
                        singleItemDetails?.price?.base?.currency_symbol,
                      formatLocale(locale, countryCode, true)
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
                singleItemDetails?.delivery_promise?.iso?.max && (
                  <div
                    className={`${styles.deliveryDateWrapper} ${styles["deliveryDateWrapper--desktop"]}`}
                  >
                    <div className={styles.shippingLogo}>
                      <SvgWrapper svgSrc="truck" />
                    </div>
                    <div className={styles.deliveryDate}>
                      {getDeliveryPromise?.(
                        singleItemDetails?.delivery_promise
                      )}
                    </div>
                    {availableFOCount > 1 && (
                      <div className={styles.selectedFO}>
                        {singleItemDetails?.article?.fulfillment_option?.name}
                      </div>
                    )}
                    {/* 
                    <div className={styles.changeFO} onClick={openFOModal}>
                      CHANGE
                    </div> 
                    */}
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
                    setClickedPromoIndex(itemIndex);
                  }}
                >
                  <span>{`${promoTitle} ${t("resource.common.applied")}`}</span>
                  <SvgWrapper svgSrc="applied-promo" className={styles.ml6} />
                </div>
              )}
            {customizationOptions.length > 0 && (
              <div className={styles.productCustomizationContainer}>
                <Accordion items={items} onItemClick={handleItemClick} />
              </div>
            )}
          </div>
          <FreeGiftItem
            item={singleItemDetails}
            currencySymbol={
              singleItemDetails?.price?.converted?.currency_symbol ??
              singleItemDetails?.price?.base?.currency_symbol
            }
          />
        </div>

        {isDeliveryPromise &&
          !isOutOfStock &&
          isServiceable &&
          singleItemDetails?.delivery_promise?.iso?.max && (
            <div
              className={`${styles.deliveryDateWrapper} ${styles["deliveryDateWrapper--mobile"]}`}
            >
              <div className={styles.shippingLogo}>
                <SvgWrapper svgSrc="truck" />
              </div>
              <div className={styles.deliveryDate}>
                {getDeliveryPromise?.(singleItemDetails?.delivery_promise)}
              </div>
              {availableFOCount > 1 && (
                <div className={styles.selectedFO}>
                  {singleItemDetails?.article?.fulfillment_option?.name}
                </div>
              )}
              {/* 
              <div className={styles.changeFO} onClick={openFOModal}>
                CHANGE
              </div> 
              */}
            </div>
          )}

        {isPromoModalOpen && clickedPromoIndex === itemIndex && (
          <Modal
            isOpen={isPromoModalOpen}
            closeDialog={() => {
              onClosePromoModal();
              setClickedPromoIndex(null);
            }}
            modalType={isMobile ? "right-modal" : "center-modal"}
            title={`${promoTitle} ${t("resource.common.applied")}`}
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
                        {promoItem?.offer_label && (
                          <div className={styles.promoLabel}>
                            {promoItem.offer_label}
                          </div>
                        )}
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
                              {t("resource.cart.t&c")}
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
                      ? sizeModalItemValue?.product?.images[0]?.url?.replace(
                          "original",
                          "resize-w:250"
                        )
                      : undefined
                  }
                  alt={sizeModalItemValue?.product?.name || t("resource.common.product_image")}
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
                      sizeModalItemValue?.article?.price?.converted
                        ?.effective ??
                        sizeModalItemValue?.article?.price?.base?.effective
                    ),
                    sizeModalItemValue?.article?.price?.converted
                      ?.currency_symbol ??
                      sizeModalItemValue?.article?.price?.base?.effective,
                    formatLocale(locale, countryCode, true)
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
              ? t("resource.common.select_size")
              : t("resource.cart.product_not_available")}
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
                            }_${singleSize?.value}_${sizeModal?.split("_")[2]}`;
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
              if (
                `${cartItemsWithActualIndex[j]?.key}_${cartItemsWithActualIndex[j]?.article?.store?.uid}_${cartItemsWithActualIndex[j]?.article?.item_index}` ===
                sizeModal
              ) {
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
              cartItemsWithActualIndex[itemIndex]?.quantity || 0,
              itemIndex,
              "update_item",
              true
            );
          }}
        >
          <div className={styles.updateSizeButton}>
            {t("resource.facets.update")}
          </div>
        </button>
      </Modal>

      <Modal
        isOpen={showFOModal}
        closeDialog={toggleFOModal}
        isCancellable={false}
        headerClassName={styles.foModalHeader}
        containerClassName={styles.foModalContainer}
        title={
          <div className={styles.foModalTitle}>Change Delivery Options</div>
        }
      >
        <div className={styles.foModalBody}>
          <div className={styles.foModalWrapper}>
            <div className={styles.foModalImage}>
              <ChipImage
                product={singleItemDetails?.product}
                type={singleItemDetails?.item_type}
                imageWidth={imageWidth}
                globalConfig={globalConfig}
              />
              {/* <FyImage
                src={productImage}
                aspectRatio={0.8}
                mobileAspectRatio={0.8}
                customClass={styles.productImg}
              /> */}
              {/* <img src={productImage} /> */}
            </div>
            <div className={styles.foModalContent}>
              <div className={styles.foModalBrand}>
                {singleItemDetails?.product?.brand?.name}
              </div>
              <div className={styles.foModalName}>
                {singleItemDetails?.product?.name}
              </div>
              <div className={styles.foSellerName}>
                {`Sold by: ${foSellerStoreName}`}
              </div>
            </div>
          </div>
          <div className={styles.foModalOption}>
            <div className={styles.deliveryLabel}>Delivery Options</div>
            <div className={styles.foList}>
              {fulfillmentOptions.map((foItem, index) => (
                <div
                  key={index}
                  className={styles.fulfillmentOption}
                  onClick={() => onFOSelection(foItem)}
                >
                  <RadioIcon
                    checked={
                      foItem?.fulfillment_option?.slug === selectedFO?.slug
                    }
                  />
                  <div className={styles.foDetails}>
                    <p className={styles.promiseLabel}>
                      Get it by {getDeliveryDate(foItem?.delivery_promise)}
                    </p>
                    <p className={styles.foLabel}>
                      {foItem?.fulfillment_option?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          className={`${styles.foModalFooter} ${singleItemDetails?.article?.fulfillment_option?.slug === selectedFO?.slug ? styles.disableBtn : ""}`}
          onClick={(e) => {
            onFOUpdate(e);
          }}
          disabled={
            singleItemDetails?.article?.fulfillment_option?.slug ===
            selectedFO?.slug
          }
        >
          <div className={styles.updateSizeButton}>UPDATE</div>
        </button>
      </Modal>
    </>
  );
}
