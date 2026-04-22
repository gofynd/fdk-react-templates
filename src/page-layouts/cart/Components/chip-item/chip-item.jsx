import React, { useState, useMemo, useEffect } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./chip-item.less";
import {
  currencyFormat,
  formatLocale,
  translateDynamicLabel,
} from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import QuantityControl from "../../../../components/quantity-control/quantity-control";
import Modal from "../../../../components/core/modal/modal";
import { useMobile } from "../../../../helper/hooks";
import Skeleton from "../../../../components/core/skeletons/skeleton";
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
import { transformDisplayToAccordionContent } from "../../../../helper/customization-display";

const GET_PRODUCT_SIZES = `query ProductSizes($slug: String!) {
  product(slug: $slug) {
    sizes {
      size_details {
        display
        is_available
        quantity
        value
      }
    }
  }
}`;

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
  onRemoveIconClick = () => { },
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
  const { limited_stock_quantity: limitedStockQuantity = 11 } =
    globalConfig || {};
  const isMobile = useMobile();
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [showFOModal, setShowFOModal] = useState(false);
  const [sizeModalErr, setSizeModalErr] = useState(null);
  const [fetchedSizes, setFetchedSizes] = useState(null);
  const [isSizesLoading, setIsSizesLoading] = useState(false);
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

  // Use the actual backend item_index from the article, not the UI loop index
  // This is critical for cart updates to work correctly, especially with customized items
  const actualItemIndex = singleItemDetails?.article?.item_index ?? itemIndex;
  
  const rawCustomizationOptions =
    singleItemDetails?.article?._custom_json?._display || [];
  const accordionContent = transformDisplayToAccordionContent(
    rawCustomizationOptions
  );

  const [items, setItems] = useState([
    {
      title: "Customization",
      content: accordionContent,
      open: false,
    },
  ]);

  // Sync accordion content when singleItemDetails changes (e.g. after cart refresh following a size update)
  useEffect(() => {
    setItems((prev) => [
      {
        title: "Customization",
        content: transformDisplayToAccordionContent(
          singleItemDetails?.article?._custom_json?._display || []
        ),
        open: prev[0]?.open ?? false,
      },
    ]);
  }, [singleItemDetails?.article?._custom_json]);

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
      // Capture sizeModal before closing it, so we can restore on failure
      const sizeModalBeforeUpdate = isSizeUpdate ? sizeModal : null;

      // Optimistically close the size modal before the API call + fetchCartDetails,
      // preventing a re-indexed item from accidentally re-opening the modal
      if (isSizeUpdate) {
        setCurrentSizeModalSize(null);
        setSizeModal(null);
        setSizeModalErr(null);
      }

      const cartUpdateResponse = await onUpdateCartItems(
        event,
        itemDetails,
        itemSize,
        totalQuantity,
        itemIndex,
        operation === "edit_item" ? "update_item" : operation,
        false,
        isSizeUpdate
      );

      if (isSizeUpdate) {
        if (!cartUpdateResponse?.success) {
          // Restore modal on failure so user can retry
          setSizeModal(sizeModalBeforeUpdate);
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
      actualItemIndex,
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

  const normalizedSize = (size) => {
    return String(size ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

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
                    actualItemIndex,
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
            className={`${styles.itemImageContainer} ${isOutOfStock ? styles.outOfStock : ""
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
                  index: actualItemIndex,
                })
              }
              data-testid="remove-item-button"
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
              className={`${styles.itemName} ${isOutOfStock ? styles.outOfStock : ""
                } `}
              data-testid={`cart-item-row-${singleItemDetails?.product?.item_code}-${normalizedSize(singleItemDetails?.article?.size)}`}
            >
              {singleItemDetails?.product?.name?.length > 24
                ? `${singleItemDetails.product.name.slice(0, 24)}...`
                : singleItemDetails?.product?.name}{" "}
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
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (isCartUpdating) return;
                    setFetchedSizes(null);
                    setSizeModal(singleItem);
                    const slug = singleItemDetails?.product?.slug;
                    if (slug) {
                      setIsSizesLoading(true);
                      try {
                        const res = await fpi.executeGQL(
                          GET_PRODUCT_SIZES,
                          { slug },
                          { skipStoreUpdate: true }
                        );
                        const sizes = res?.data?.product?.sizes?.size_details;
                        setFetchedSizes(sizes?.length ? sizes : null);
                      } finally {
                        setIsSizesLoading(false);
                      }
                    }
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
                        actualItemIndex,
                        "update_item"
                      )
                    }
                    onIncrementClick={(e) =>
                      cartUpdateHandler(
                        e,
                        singleItemDetails,
                        currentSize,
                        incrementDecrementUnit,
                        actualItemIndex,
                        "update_item"
                      )
                    }
                    onQtyChange={(evt, currentNum) =>
                      cartUpdateHandler(
                        evt,
                        singleItemDetails,
                        currentSize,
                        currentNum,
                        actualItemIndex,
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
                  className={`${styles.effectivePrice} ${isOutOfStock ? styles.outOfStock : ""
                    }`}
                >
                  {currencyFormat(
                    singleItemDetails?.price?.converted?.final_price ??
                    singleItemDetails?.price?.base?.final_price,
                    singleItemDetails?.price?.converted?.currency_symbol ??
                    singleItemDetails?.price?.base?.currency_symbol,
                    formatLocale(locale, countryCode, true),
                    singleItemDetails?.price?.converted?.currency_code ??
                    singleItemDetails?.price?.base?.currency_code
                  )}
                </span>
                {singleItemDetails?.price?.converted?.effective <
                  singleItemDetails?.price?.converted?.marked && (
                    <span className={styles.markedPrice}>
                      {currencyFormat(
                        singleItemDetails?.price?.converted?.marked ??
                        singleItemDetails?.price?.base?.marked,
                        singleItemDetails?.price?.converted?.currency_symbol ??
                        singleItemDetails?.price?.base?.currency_symbol,
                        formatLocale(locale, countryCode, true),
                        singleItemDetails?.price?.converted?.currency_code ??
                        singleItemDetails?.price?.base?.currency_code
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
            {accordionContent.length > 0 && (
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
          !!(sizeModal && cartItems[sizeModal] && sizeModal === singleItem)
        }
        closeDialog={(e) => {
          e.stopPropagation();
          setSizeModal(null);
          setCurrentSizeModalSize(null);
          setSizeModalErr(null);
          setFetchedSizes(null);
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
                  alt={
                    sizeModalItemValue?.product?.name ||
                    t("resource.common.product_image")
                  }
                  className={`${globalConfig?.img_fill ? styles.imgCover : styles.imgContain}`}
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
                    sizeModalItemValue?.article?.price?.converted?.effective ??
                      sizeModalItemValue?.article?.price?.base?.effective,
                    sizeModalItemValue?.article?.price?.converted
                      ?.currency_symbol ??
                    sizeModalItemValue?.article?.price?.base?.currency_symbol,
                    formatLocale(locale, countryCode, true),
                    sizeModalItemValue?.article?.price?.converted
                      ?.currency_code ??
                    sizeModalItemValue?.article?.price?.base?.currency_code
                  )}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className={styles.sizeModalBody}>
          {isSizesLoading ? (
            <>
              <Skeleton height={16} width={80} borderRadius={4} />
              <div className={styles.sizeHorizontalList}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} type="rectangle" height={50} width={50} borderRadius={4} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={styles.sizeSelectHeading}>
                {(fetchedSizes ?? sizeModalItemValue?.availability?.available_sizes)?.length > 0
                  ? t("resource.common.select_size")
                  : t("resource.cart.product_not_available")}
              </div>
              <div className={styles.sizeHorizontalList}>
                {(fetchedSizes ?? sizeModalItemValue?.availability?.available_sizes)
                  ?.length > 0 &&
                  (fetchedSizes ?? sizeModalItemValue?.availability?.available_sizes)?.map(
                    (singleSize) => {
                      const isUnavailable = fetchedSizes
                        ? singleSize?.quantity === 0 && !isCustomOrder
                        : !singleSize?.is_available;
                      const isEarlierSelectedSize =
                        !currentSizeModalSize &&
                        sizeModalItemValue?.article?.size === singleSize?.value;
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
                              (isEarlierSelectedSize || isCurrentSelectedSize) ? styles.singleSizeSelected : ""
                            } ${isUnavailable ? styles.sigleSizeDisabled : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isUnavailable) return;

                              const isOriginalSize =
                                singleSize?.value === sizeModalItemValue?.article?.size;

                              if (isOriginalSize) {
                                setSizeModalErr(null);
                                setCurrentSizeModalSize(null);
                              } else if (singleSize?.value) {
                                setSizeModalErr(null);
                                const parts = (sizeModal ?? "").split("_");
                                parts[1] = singleSize?.value;
                                const newSizeModalValue = parts.join("_");
                                setCurrentSizeModalSize(newSizeModalValue);
                              }
                            }}
                          >
                            {singleSize?.display}
                            {isUnavailable && (
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
            </>
          )}
        </div>
        <div className={styles.sizeModalErrCls}>{sizeModalErr}</div>
        <button
          className={`${styles.sizeModalFooter} ${(!currentSizeModalSize || currentSizeModalSize === sizeModal || sizeModalErr || isCartUpdating) && styles.disableBtn}`}
          disabled={
            !currentSizeModalSize ||
            currentSizeModalSize === sizeModal ||
            sizeModalErr ||
            isCartUpdating
          }
          onClick={(e) => {
            // Safety check: prevent update if cart is currently updating
            if (isCartUpdating) {
              console.log("Size update blocked: cart is updating");
              return;
            }
            
            // Safety check: prevent update if no size change
            if (
              !currentSizeModalSize ||
              currentSizeModalSize === sizeModal ||
              sizeModalErr
            ) {
              return;
            }

            // First, try to get the item from the current cartItems (handles frozen state)
            let matchedItem = cartItems[sizeModal];
            
            // If not found in cartItems (shouldn't happen but defensive), search in live array
            if (!matchedItem) {
              for (let j = 0; j < cartItemsWithActualIndex.length; j += 1) {
                if (
                  `${cartItemsWithActualIndex[j]?.key}_${cartItemsWithActualIndex[j]?.article?.store?.uid}_${cartItemsWithActualIndex[j]?.article?.item_index}` ===
                  sizeModal
                ) {
                  matchedItem = cartItemsWithActualIndex[j];
                  break;
                }
              }
            }

            // Safety check: ensure we found the item
            if (!matchedItem) {
              console.error("Failed to find cart item for size update", {
                sizeModal,
                cartItemsKeys: Object.keys(cartItems),
                liveItemsCount: cartItemsWithActualIndex.length
              });
              return;
            }

            const newSize = currentSizeModalSize.split("_")[1];
            const originalSize = sizeModal?.split("_")[1];

            // Additional safety check: only update if size actually changed
            if (newSize === originalSize) {
              return;
            }

            // Use the actual article.item_index from the matched item, not the array index
            cartUpdateHandler(
              e,
              sizeModalItemValue,
              newSize,
              matchedItem?.quantity || 0,
              matchedItem?.article?.item_index,
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
