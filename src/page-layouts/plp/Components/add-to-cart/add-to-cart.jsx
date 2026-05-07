import React, { useEffect, useMemo, useState } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./add-to-cart.less";
import ImageGallery from "../image-gallery/image-gallery";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import FyButton from "../../../../components/core/fy-button/fy-button";
import FyImage from "../../../../components/core/fy-image/fy-image";
import DeliveryInfo from "../delivery-info/delivery-info";
import QuantityControl from "../../../../components/quantity-control/quantity-control";
import FyDropdown from "../../../../components/core/fy-dropdown/fy-dropdown";
import {
  currencyFormat,
  isEmptyOrNull,
  formatLocale,
} from "../../../../helper/utils";
import RadioIcon from "../../../../assets/images/radio";
import TruckIcon from "../../../../assets/images/truck-icon.svg";
import CartIcon from "../../../../assets/images/cart.svg";
import { useGlobalTranslation, useGlobalStore, useFPI } from "fdk-core/utils";
import Skeleton from "../../../../components/core/skeletons/skeleton";

const QUICK_SHOP_NOTIFICATION_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAI5JREFUeAGFTssNAiEUhJcNCZzWDtYOtANKsBQ88DnSgSVoZ7t2oBe4gfMOJrrZZCcZwsy8nxRAznkspdzxteAopXxora/wX8QFtdYbzKcx5ggeWmtvNDjOBn567xciOnMHa+dcVkrNPJy1CCF0scLXI7ED8t6fsH/ZyJaUkh0QWtwwba0Bpj8VY5yZv94HPCAybUMwcpAAAAAASUVORK5CYII=";

const QUICK_SHOP_FALLBACK_IMAGES = [
  {
    alt: "image",
    type: "image",
    url: "https://hdn-1.fynd.com/company/884/applications/000000000000000000000001/theme/pictures/free/original/theme-image-1623307821127.png",
  },
];

const AddToCart = ({
  productData = {},
  globalConfig = {},
  pageConfig = {},
  slug = "",
  selectedSize = "",
  deliverInfoProps = {},
  sizeError = false,
  handleSlugChange = (updatedSlug) => {},
  onSizeSelection = () => {},
  handleShowSizeGuide = () => {},
  addProductForCheckout = () => {},
  handleViewMore = () => {},
  handleClose = () => {},
  selectedItemDetails = {},
  isCartUpdating = false,
  cartUpdateHandler = () => {},
  minCartQuantity,
  maxCartQuantity,
  incrementDecrementUnit,
  fulfillmentOptions = [],
  currentFO = {},
  setCurrentFO = () => {},
  availableFOCount,
  getDeliveryPromise,
  isServiceable,
  recommendationProducts = [],
  followedIdList = [],
  onWishlistClick = () => {},
}) => {
  const fpi = useFPI();
  const [foLoading, setFoLoading] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isNotifySubmitted, setIsNotifySubmitted] = useState(false);
  const [notifyActiveTab, setNotifyActiveTab] = useState("notify");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifyConsent, setNotifyConsent] = useState(false);
  const [notifyAudience, setNotifyAudience] = useState("women");
  const [wishlistToastToken, setWishlistToastToken] = useState(0);

  useEffect(() => {
    if (!wishlistToastToken) return undefined;
    const timer = setTimeout(() => setWishlistToastToken(0), 3200);
    return () => clearTimeout(timer);
  }, [wishlistToastToken]);

  const handleCheckout = async (event, isBuyNow) => {
    setIsLoadingCart(true);
    try {
      await addProductForCheckout(event, selectedSize, isBuyNow);
    } finally {
      setIsLoadingCart(false);
    }
  };
  const { language, countryCode } =
    useGlobalStore(fpi.getters.i18N_DETAILS) || {};
  const locale = language?.locale ? language?.locale : "en";
  const { t } = useGlobalTranslation("translation");
  const { product = {}, productPrice = {} } = productData;

  const {
    button_options,
    disable_cart,
    show_price,
    show_quantity_control,
    hide_brand_name,
  } = globalConfig;

  const { media, name, short_description, variants, sizes, brand } = product;

  const isMto = product?.custom_order?.is_custom_order || false;
  const { price_per_piece } = productPrice;
  const showQuickShopTaxLabel = false;
  const showQuickShopShortDescription = false;
  const isQuickShop = true;
  const hasProductIdentity = !!(product?.uid || product?.slug || slug || name);
  const sizeOptions = useMemo(() => sizes?.sizes || [], [sizes?.sizes]);
  const hasAvailableSize = useMemo(
    () => sizeOptions.some((size) => size?.quantity > 0 || isMto),
    [sizeOptions, isMto]
  );
  const isProductLevelOutOfStock =
    hasProductIdentity &&
    !isMto &&
    (sizes?.sellable === false ||
      (sizeOptions.length > 0 && !hasAvailableSize) ||
      (!sizeOptions.length && sizes?.sellable !== true));
  const displaySizeOptions = useMemo(() => {
    if (sizeOptions.length) return sizeOptions;
    if (isProductLevelOutOfStock) {
      return [
        {
          display: "OS",
          value: "OS",
          quantity: 0,
          isSyntheticQuickShopSize: true,
        },
      ];
    }
    return [];
  }, [sizeOptions, isProductLevelOutOfStock]);

  const isSizeSelectionBlock =
    isQuickShop || pageConfig?.size_selection_style === "block";
  const isSingleSize = displaySizeOptions?.length === 1;
  const isSizeCollapsed = pageConfig?.hide_single_size && isSingleSize;
  const preSelectFirstOfMany = pageConfig?.preselect_size;

  const getProductPrice = (key) => {
    const priceDataDefault = sizes?.price || product?.price;
    if (selectedSize && !isEmptyOrNull(productPrice?.price)) {
      if (productPrice?.set) {
        return (
          currencyFormat(
            price_per_piece[key],
            productPrice?.price?.currency_symbol || "",
            formatLocale(locale, countryCode, true)
          ) || ""
        );
      }
      const price = productPrice?.price || "";
      return (
        currencyFormat(
          price?.[key],
          price?.currency_symbol,
          formatLocale(locale, countryCode, true)
        ) || ""
      );
    }
    if (selectedSize && priceDataDefault) {
      return (
        currencyFormat(
          priceDataDefault?.[key]?.min,
          priceDataDefault?.[key]?.currency_symbol,
          formatLocale(locale, countryCode, true)
        ) || ""
      );
    }
    if (priceDataDefault) {
      return priceDataDefault?.[key]?.min !== priceDataDefault?.[key]?.max
        ? `${priceDataDefault?.[key]?.currency_symbol || ""} ${
            currencyFormat(priceDataDefault?.[key]?.min) || ""
          } - ${currencyFormat(priceDataDefault?.[key]?.max) || ""}`
        : currencyFormat(
            priceDataDefault?.[key]?.max,
            priceDataDefault?.[key]?.currency_symbol,
            formatLocale(locale, countryCode, true)
          ) || "";
    }
  };

  const isSizeGuideAvailable = () => {
    const sizeChartHeader = sizes?.size_chart?.headers || {};
    return Object.keys(sizeChartHeader).length > 0 || sizes?.size_chart?.image;
  };

  const disabledSizeOptions = useMemo(() => {
    return sizeOptions
      ?.filter((size) => size?.quantity === 0 && !isMto)
      ?.map((size) => size?.value);
  }, [sizeOptions, isMto]);

  const mobileTruncatedTitle = useMemo(() => {
    if (!name) return "";
    return name.length > 30 ? `${name.slice(0, 30)}...` : name;
  }, [name]);
  const isFollowed = useMemo(() => {
    return !!followedIdList?.includes(product?.uid);
  }, [followedIdList, product?.uid]);
  const quickShopRecommendations = useMemo(() => {
    return (recommendationProducts || [])
      .filter((item) => item?.uid !== product?.uid && item?.slug !== product?.slug)
      .slice(0, 4);
  }, [recommendationProducts, product?.uid, product?.slug]);
  const colorVariant = useMemo(() => {
    return variants?.find((variant) =>
      ["color", "image"].includes(variant?.display_type)
    );
  }, [variants]);
  const selectedColorVariant = useMemo(() => {
    const selectedVariant = colorVariant?.items?.find((variant) =>
      isSelectedVariant(variant, slug, product?.slug)
    );
    return selectedVariant || colorVariant?.items?.[0] || {};
  }, [colorVariant, slug, product?.slug]);
  const quickShopGalleryImages = useMemo(() => {
    const productImages = Array.isArray(media) ? media : [];
    const selectedVariantImages = Array.isArray(selectedColorVariant?.medias)
      ? selectedColorVariant.medias
      : [];
    const allVariantImages = (colorVariant?.items || []).flatMap((variant) =>
      Array.isArray(variant?.medias) ? variant.medias : []
    );
    const candidateImages = selectedVariantImages.length
      ? [...selectedVariantImages, ...productImages]
      : productImages.length
        ? productImages
        : allVariantImages;
    const seenUrls = new Set();
    const dedupedImages = candidateImages.filter((item) => {
      if (!item?.url || seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);
      return !item?.type || item.type === "image";
    });
    return dedupedImages.length
      ? dedupedImages
      : QUICK_SHOP_FALLBACK_IMAGES;
  }, [media, selectedColorVariant, colorVariant]);
  const quickShopGalleryKey = [
    slug || product?.slug || "quick-shop",
    selectedColorVariant?.uid ||
      selectedColorVariant?.slug ||
      getVariantLabel(selectedColorVariant),
    quickShopGalleryImages?.[0]?.url || "",
  ].join("-");
  const selectedSizeItem = useMemo(() => {
    const selectedItem = displaySizeOptions?.find(
      (size) => size?.value === selectedSize
    );
    return (
      selectedItem ||
      (isProductLevelOutOfStock ? displaySizeOptions?.[0] : null)
    );
  }, [displaySizeOptions, selectedSize, isProductLevelOutOfStock]);
  const selectedSizeStockMessage = getSizeStockMessage(
    selectedSizeItem,
    isMto,
    true
  );
  const isSelectedSizeOutOfStock =
    !!selectedSizeItem && !isMto && selectedSizeItem?.quantity === 0;
  const isOutOfStockQuickShop =
    isSelectedSizeOutOfStock || isProductLevelOutOfStock;
  const selectedSizeAvailabilityMessage = isOutOfStockQuickShop
    ? getZeroStockAvailabilityLabel(selectedSizeItem, product)
    : selectedSizeStockMessage;
  const effectiveSelectedSize =
    selectedSize ||
    (isProductLevelOutOfStock
      ? selectedSizeItem?.display || selectedSizeItem?.value || ""
      : "");
  const notifyPhoneDisplay = notifyPhone?.trim()
    ? `+44 ${notifyPhone.trim()}`
    : "+44";
  const canSubmitNotify = !!(notifyEmail.trim() || notifyPhone.trim()) &&
    notifyConsent;
  const handleWishlistClick = (event) => {
    event?.stopPropagation();
    event?.preventDefault();
    if (!isFollowed) {
      setWishlistToastToken(Date.now());
    }
    onWishlistClick({ product, isFollowed });
  };
  const handleNotifyOpen = () => {
    setNotifyActiveTab("notify");
    setIsNotifySubmitted(false);
    setIsNotifyOpen(true);
  };
  const handleNotifyClose = () => {
    setIsNotifyOpen(false);
    setIsNotifySubmitted(false);
  };
  const handleNotifySubmit = () => {
    if (!canSubmitNotify) return;
    setIsNotifySubmitted(true);
  };
  const handleColorSwatchClick = (event, variant, isSelected) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (isSelected || !variant?.slug) return;
    handleSlugChange(variant.slug, variant);
  };

  return (
    <div className={styles.productDescContainer}>
      <div className={styles.left}>
        <div className={styles.imgWrap}>
          <ImageGallery
            key={quickShopGalleryKey}
            images={quickShopGalleryImages}
            product={product}
            globalConfig={globalConfig}
            hiddenDots={true}
            slideTabCentreNone={true}
            hideImagePreview={true}
            isQuickShopGallery={true}
            isFollowed={isFollowed}
            onWishlistClick={handleWishlistClick}
          />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.productInfo}>
          <div className={styles.product}>
            <div className={styles.crossIcon} onClick={handleClose}>
              <SvgWrapper svgSrc="cross-black" />
            </div>
            {!!wishlistToastToken && (
              <div
                className={styles.wishlistToast}
                role="status"
                aria-live="polite"
              >
                <div className={styles.wishlistToastImage}>
                  <FyImage
                    src={getRecommendationImage(product)}
                    alt={name}
                    aspectRatio={2 / 3}
                    sources={[{ width: 140 }]}
                    globalConfig={globalConfig}
                    isImageFill={globalConfig?.img_fill}
                    backgroundColor={
                      globalConfig?.img_container_bg || "oklch(96% 0.006 100)"
                    }
                  />
                </div>
                <div className={styles.wishlistToastCopy}>
                  <strong>ADDED TO WISHLIST</strong>
                  <FDKLink to="/wishlist" className={styles.wishlistToastLink}>
                    Wishlist <span aria-hidden="true">›</span>
                  </FDKLink>
                </div>
                <button
                  type="button"
                  className={styles.wishlistToastClose}
                  aria-label="Dismiss wishlist confirmation"
                  onClick={() => setWishlistToastToken(0)}
                >
                  <SvgWrapper svgSrc="cross-black" />
                </button>
              </div>
            )}
            <div className={styles.productScrollContent}>
              {/* ---------- Product Name ----------  */}
              {!hide_brand_name && (
                <div className={styles.product__brand}>{brand?.name}</div>
              )}
              <h1 className={styles.product__title}>{name}</h1>
              {/* ---------- Product Price ---------- */}
              {show_price && (sizes?.sellable || isOutOfStockQuickShop) && (
                <div className={styles.product__price}>
                  <h4 className={styles["product__price--effective"]}>
                    {getProductPrice("effective")}
                  </h4>
                  {getProductPrice("effective") !==
                    getProductPrice("marked") && (
                    <span className={styles["product__price--marked"]}>
                      {getProductPrice("marked")}
                    </span>
                  )}
                  {sizes?.discount && (
                    <span className={styles["product__price--discount"]}>
                      ({sizes?.discount})
                    </span>
                  )}
                </div>
              )}
              {/* ---------- Product Tax Label ---------- */}
              {showQuickShopTaxLabel &&
                pageConfig?.tax_label &&
                show_price &&
                (sizes?.sellable || isOutOfStockQuickShop) && (
                <div className={styles.taxLabel}>({pageConfig?.tax_label})</div>
              )}

              {/* ---------- Short Description ----------  */}
              {showQuickShopShortDescription && short_description?.length > 0 && (
                <p
                  className={`${styles.b2} ${styles.fontBody} ${styles.shortDescription}`}
                >
                  {slug && short_description}
                </p>
              )}
              {colorVariant?.items?.length > 0 && (
                <div className={styles.quickShopColorSection}>
                  <div className={styles.quickShopColorName}>
                    {getVariantLabel(selectedColorVariant)}
                  </div>
                  <div
                    className={styles.quickShopSwatches}
                    role="radiogroup"
                    aria-label="Colour"
                  >
                    {colorVariant.items.map((variant) => {
                      const isSelected = isSameQuickShopVariant(
                        variant,
                        selectedColorVariant
                      );
                      return (
                        <button
                          type="button"
                          key={variant?.uid || variant?.slug || variant?.value}
                          className={`${styles.quickShopSwatch} ${
                            isSelected ? styles.quickShopSwatchSelected : ""
                          } ${
                            variant?.is_available === false
                              ? styles.quickShopSwatchUnavailable
                              : ""
                          }`}
                          title={getVariantLabel(variant)}
                          aria-label={getVariantLabel(variant)}
                          aria-checked={isSelected}
                          role="radio"
                          onClick={(event) =>
                            handleColorSwatchClick(event, variant, isSelected)
                          }
                        >
                          <span
                            className={styles.quickShopSwatchFill}
                            style={getVariantSwatchStyle(variant)}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* ---------- Size Container ---------- */}
              {isSizeSelectionBlock && !isSizeCollapsed && (
                <div className={styles.sizeSelection}>
                  <div className={styles.sizeHeaderContainer}>
                    <p
                      className={`${styles.b2} ${styles.sizeSelection__label}`}
                    >
                      {isQuickShop && effectiveSelectedSize ? (
                        <>
                          <span>Selected size : </span>
                          <span className={styles.sizeSelection__selectedValue}>
                            {effectiveSelectedSize}
                          </span>
                          {!!selectedSizeAvailabilityMessage && (
                            <span className={styles.sizeSelection__stockText}>
                              {selectedSizeAvailabilityMessage}
                            </span>
                          )}
                        </>
                      ) : (
                        <span>
                          {isQuickShop
                            ? "Select size"
                            : `${t("resource.product.style")}: `}
                          {isQuickShop &&
                            isOutOfStockQuickShop &&
                            !!selectedSizeAvailabilityMessage && (
                              <>
                                <span> : </span>
                                <span className={styles.sizeSelection__stockText}>
                                  {selectedSizeAvailabilityMessage}
                                </span>
                              </>
                            )}
                          {Boolean(selectedSize) &&
                            !isQuickShop &&
                            `${t("resource.common.size")} (${selectedSize})`}
                        </span>
                      )}
                    </p>
                    {(isQuickShop || pageConfig?.show_size_guide) &&
                      (isQuickShop || sizes?.sellable) && (
                        <FyButton
                          variant="text"
                          onClick={handleShowSizeGuide}
                          className={styles["product__size--guide"]}
                          endIcon={
                            <span className={styles.sizeGuideChevron}>›</span>
                          }
                        >
                          {isQuickShop
                            ? "Find my size"
                            : t("resource.common.size_guide")}
                        </FyButton>
                      )}
                  </div>

                  <div className={styles.sizeSelection__wrapper}>
                    {displaySizeOptions?.map((size) => {
                      const isZeroStockSize = size?.quantity === 0 && !isMto;
                      const zeroStockStatus = isZeroStockSize
                        ? getZeroStockAvailabilityLabel(size, product)
                        : "";
                      const stockMessage = isZeroStockSize
                        ? zeroStockStatus
                        : getSizeStockMessage(size, isMto);
                      const sizeLabel = stockMessage
                        ? `${size?.display} - ${stockMessage}`
                        : size?.display;
                      const isSyntheticOutOfStockSize =
                        !!size?.isSyntheticQuickShopSize;
                      const isSelectedSize =
                        selectedSize === size?.value ||
                        (!selectedSize &&
                          isProductLevelOutOfStock &&
                          isSyntheticOutOfStockSize);

                      return (
                        <button
                          type="button"
                          key={`${size?.display}`}
                          className={`${styles.b2} ${styles.sizeSelection__block} ${
                            size.quantity === 0 &&
                            !isMto &&
                            !isQuickShop &&
                            styles["sizeSelection__block--disable"]
                          } ${
                            (size?.quantity !== 0 || isMto || isQuickShop) &&
                            styles["sizeSelection__block--selectable"]
                          } ${
                            isZeroStockSize &&
                            styles["sizeSelection__block--comingSoon"]
                          } ${
                            isSelectedSize &&
                            styles["sizeSelection__block--selected"]
                          } `}
                          title={sizeLabel}
                          aria-label={sizeLabel}
                          onClick={() => {
                            if (isSyntheticOutOfStockSize) return;
                            onSizeSelection(size?.value);
                          }}
                        >
                          <span className={styles.sizeSelection__value}>
                            {size?.display}
                            {isZeroStockSize ? (
                              zeroStockStatus === "Coming soon" ? (
                                <span
                                  className={styles.sizeSelection__comingSoonIcon}
                                  aria-hidden="true"
                                />
                              ) : (
                                <img
                                  className={styles.sizeSelection__notifyIcon}
                                  src={QUICK_SHOP_NOTIFICATION_ICON}
                                  alt=""
                                  aria-hidden="true"
                                />
                              )
                            ) : !!stockMessage && (
                              <span
                                className={styles.sizeSelection__stockDot}
                                aria-hidden="true"
                              />
                            )}
                          </span>
                          {size?.quantity === 0 && !isMto && !isQuickShop && (
                            <svg>
                              <line x1="0" y1="100%" x2="100%" y2="0" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* ---------- Size Dropdown And Action Buttons ---------- */}
              {!isSizeSelectionBlock && !isSizeCollapsed && (
                <div className={styles.sizeCartContainer}>
                  <FyDropdown
                    options={displaySizeOptions || []}
                    value={selectedSize}
                    onChange={onSizeSelection}
                    placeholder={t("resource.common.select_size_caps")}
                    valuePrefix={`${t("resource.common.size")}:`}
                    dataKey="value"
                    containerClassName={styles.dropdownContainer}
                    dropdownListClassName={styles.dropdown}
                    valueClassName={styles.sizeValue}
                    disabledOptions={disabledSizeOptions}
                    disabledOptionClassName={styles.disabledOption}
                    disableSearch={true}
                  />
                  {(isQuickShop || pageConfig?.show_size_guide) &&
                    (isQuickShop || sizes?.sellable) && (
                      <FyButton
                        variant="text"
                        onClick={handleShowSizeGuide}
                        className={styles["product__size--guide"]}
                        endIcon={
                          <span className={styles.sizeGuideChevron}>›</span>
                        }
                      >
                        {isQuickShop
                          ? "Find my size"
                          : t("resource.common.size_guide")}
                      </FyButton>
                    )}
                </div>
              )}
              {sizeError && (
                <div className={styles.sizeError}>
                  {t("resource.product.please_select_size")}
                </div>
              )}
              {sizes?.sellable && selectedSize && !isOutOfStockQuickShop && (
                <DeliveryInfo
                  {...deliverInfoProps}
                  setFoLoading={setFoLoading}
                  mandatoryPincode={pageConfig?.mandatory_pincode}
                />
              )}

              {selectedSize &&
                !isOutOfStockQuickShop &&
                !!fulfillmentOptions.length &&
                availableFOCount > 1 && (
                  <div className={styles.fulfillmentWrapper}>
                    <div className={styles.foList}>
                      {foLoading
                        ? fulfillmentOptions.map((_, index) => (
                            <div
                              key={`fo-skeleton-${index}`}
                              className={styles.fulfillmentOption}
                            >
                              <div
                                style={{ width: "20px" }}
                                className={styles.foIcon}
                              >
                                <Skeleton height={18} width={18} />
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                  width: "100%",
                                }}
                              >
                                <Skeleton height={14} width={200} />
                                <Skeleton height={12} width={120} />
                              </div>
                            </div>
                          ))
                        : fulfillmentOptions.map((foItem, index) => (
                            <FullfillmentOption
                              key={index}
                              foItem={foItem}
                              fulfillmentOptions={fulfillmentOptions}
                              currentFO={currentFO}
                              setCurrentFO={setCurrentFO}
                              getDeliveryPromise={getDeliveryPromise}
                            />
                          ))}
                    </div>
                  </div>
                )}

              <div className={styles.actionButtons}>
                {!disable_cart && isOutOfStockQuickShop && (
                  <FyButton
                    className={styles.addToBagBtn}
                    variant="contained"
                    size="medium"
                    onClick={handleNotifyOpen}
                    endIcon={
                      selectedSizeAvailabilityMessage === "Coming soon" ? (
                        <span
                          className={styles.notifyClockIcon}
                          aria-hidden="true"
                        />
                      ) : (
                        <img
                          className={styles.notifyBellIcon}
                          src={QUICK_SHOP_NOTIFICATION_ICON}
                          alt=""
                          aria-hidden="true"
                        />
                      )
                    }
                  >
                    NOTIFY ME
                  </FyButton>
                )}
                {!disable_cart && !isOutOfStockQuickShop && sizes?.sellable && (
                  <>
                    {(isQuickShop || button_options?.includes("addtocart")) && (
                      <>
                        {selectedItemDetails?.quantity &&
                        show_quantity_control ? (
                          <QuantityControl
                            isCartUpdating={isCartUpdating}
                            count={selectedItemDetails?.quantity || 0}
                            onDecrementClick={(e) =>
                              cartUpdateHandler(
                                e,
                                -incrementDecrementUnit,
                                "update_item"
                              )
                            }
                            onIncrementClick={(e) =>
                              cartUpdateHandler(
                                e,
                                incrementDecrementUnit,
                                "update_item"
                              )
                            }
                            onQtyChange={(e, currentNum) =>
                              cartUpdateHandler(e, currentNum, "edit_item")
                            }
                            maxCartQuantity={
                              selectedItemDetails?.article?.quantity ??
                              maxCartQuantity
                            }
                            minCartQuantity={minCartQuantity}
                            containerClassName={styles.qtyContainer}
                            inputClassName={styles.inputContainer}
                          />
                        ) : (
                          <FyButton
                            className={styles.addToBagBtn}
                            variant="contained"
                            size="medium"
                            onClick={(event) => handleCheckout(event, false)}
                            endIcon={<CartIcon className={styles.cartIcon} />}
                            disabled={isLoadingCart || isServiceable === false}
                          >
                            ADD TO BAG
                          </FyButton>
                        )}
                      </>
                    )}
                  </>
                )}
                {!isQuickShop && !isOutOfStockQuickShop && !sizes?.sellable && (
                  <FyButton variant="outlined" disabled size="medium">
                    {t("resource.common.product_not_available")}
                  </FyButton>
                )}
              </div>

              <div className={styles.viewMore}>
                <span onClick={handleViewMore}>
                  {isQuickShop
                    ? "Product details"
                    : t("resource.product.view_full_details")}
                </span>
              </div>

              {quickShopRecommendations.length > 0 && (
                <div className={styles.quickShopRecommendations}>
                  <h2>You might like</h2>
                  <div className={styles.recommendationGrid}>
                    {quickShopRecommendations.map((item) => (
                      <FDKLink
                        key={item?.uid || item?.slug}
                        to={`/product/${item?.slug}`}
                        className={styles.recommendationItem}
                      >
                        <FyImage
                          src={getRecommendationImage(item)}
                          alt={item?.name}
                          aspectRatio={2 / 3}
                          sources={[{ width: 180 }]}
                          globalConfig={globalConfig}
                          isImageFill={globalConfig?.img_fill}
                          backgroundColor={
                            globalConfig?.img_container_bg ||
                            "oklch(96% 0.006 100)"
                          }
                        />
                      </FDKLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {isNotifyOpen && (
              <QuickShopNotifyPanel
                product={product}
                name={name}
                selectedSize={effectiveSelectedSize}
                selectedColor={getVariantLabel(selectedColorVariant)}
                price={getProductPrice("effective")}
                availabilityStatus={selectedSizeAvailabilityMessage}
                sizes={displaySizeOptions || []}
                activeTab={notifyActiveTab}
                setActiveTab={setNotifyActiveTab}
                isSubmitted={isNotifySubmitted}
                email={notifyEmail}
                phone={notifyPhone}
                phoneDisplay={notifyPhoneDisplay}
                consent={notifyConsent}
                audience={notifyAudience}
                canSubmit={canSubmitNotify}
                onEmailChange={setNotifyEmail}
                onPhoneChange={setNotifyPhone}
                onConsentChange={setNotifyConsent}
                onAudienceChange={setNotifyAudience}
                onSubmit={handleNotifySubmit}
                onClose={handleNotifyClose}
                onKeepShopping={handleClose}
                recommendations={quickShopRecommendations}
                globalConfig={globalConfig}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getRecommendationImage = (product) => {
  const media = product?.media || product?.medias || [];
  return media?.find((item) => item?.type === "image")?.url || media?.[0]?.url || "";
};

const isSelectedVariant = (variant, currentSlug, productSlug) => {
  const variantSlug = `${variant?.slug || ""}`.trim();
  const activeSlug = `${currentSlug || productSlug || ""}`.trim();
  return !!variantSlug && !!activeSlug && variantSlug === activeSlug;
};

const isSameQuickShopVariant = (variant = {}, selectedVariant = {}) => {
  const variantSlug = `${variant?.slug || ""}`.trim();
  const selectedSlug = `${selectedVariant?.slug || ""}`.trim();
  if (variantSlug && selectedSlug) return variantSlug === selectedSlug;

  const variantUid = `${variant?.uid || ""}`.trim();
  const selectedUid = `${selectedVariant?.uid || ""}`.trim();
  if (variantUid && selectedUid) return variantUid === selectedUid;

  const variantValue = `${variant?.value || getVariantLabel(variant)}`.trim();
  const selectedValue = `${selectedVariant?.value || getVariantLabel(selectedVariant)}`.trim();
  return !!variantValue && !!selectedValue && variantValue === selectedValue;
};

const getVariantLabel = (variant = {}) => {
  return variant?.color_name || variant?.name || variant?.value || "";
};

const getVariantImage = (variant = {}) => {
  const medias = variant?.medias || [];
  return medias.find((media) => media?.type === "image")?.url || medias[0]?.url || "";
};

const normalizeSwatchColor = (color = "") => {
  const normalizedColor = `${color}`.trim();
  if (!normalizedColor) return "";
  if (normalizedColor.startsWith("#")) return normalizedColor;
  if (/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(normalizedColor)) {
    return `#${normalizedColor}`;
  }
  return normalizedColor;
};

const getVariantSwatchStyle = (variant = {}) => {
  const color = normalizeSwatchColor(variant?.color);
  if (color) {
    return { backgroundColor: color };
  }

  const image = getVariantImage(variant);
  if (image) {
    return { backgroundImage: `url(${image})` };
  }

  return { backgroundColor: "oklch(96% 0.006 100)" };
};

const getSizeStockMessage = (size = {}, isMto = false, isSelectedLabel = false) => {
  if (isMto || size?.quantity <= 0) return "";
  if (size.quantity === 1) return isSelectedLabel ? "Last one left" : "One left";
  if (size.quantity <= 5) return "Few in stock";
  if (size.quantity <= 10) return "Low in stock";
  return "";
};

const getZeroStockAvailabilityLabel = (size = {}, product = {}) => {
  const statusText = [
    size?.availability_status,
    size?.inventory_status,
    size?.status,
    size?.label,
    product?.availability_status,
    product?.inventory_status,
    product?.status,
    product?.teaser_tag,
    product?.action?.label,
    product?.action?.type,
    product?.custom_meta?.coming_soon,
    product?.custom_meta?.availability,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /coming[\s_-]*soon|pre[\s_-]*launch|launch[\s_-]*soon/.test(statusText)
    ? "Coming soon"
    : "Out of stock";
};

const QuickShopNotifyPanel = ({
  product = {},
  name = "",
  selectedSize = "",
  selectedColor = "",
  price = "",
  availabilityStatus = "Out of stock",
  sizes = [],
  activeTab = "notify",
  setActiveTab = () => {},
  isSubmitted = false,
  email = "",
  phone = "",
  phoneDisplay = "+44",
  consent = false,
  audience = "women",
  canSubmit = false,
  onEmailChange = () => {},
  onPhoneChange = () => {},
  onConsentChange = () => {},
  onAudienceChange = () => {},
  onSubmit = () => {},
  onClose = () => {},
  onKeepShopping = () => {},
  recommendations = [],
  globalConfig = {},
}) => {
  const trendingItems = recommendations.slice(0, 2);
  const storeRows = getStoreAvailabilityRows(sizes, selectedSize);

  return (
    <div
      className={styles.notifyPanel}
      role="dialog"
      aria-label="Notify me"
      aria-modal="false"
    >
      <div className={styles.notifyHeader}>
        <div className={styles.notifyTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "notify"}
            className={`${styles.notifyTab} ${
              activeTab === "notify" ? styles.notifyTabActive : ""
            }`}
            onClick={() => setActiveTab("notify")}
          >
            Notify me
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "store"}
            className={`${styles.notifyTab} ${
              activeTab === "store" ? styles.notifyTabActive : ""
            }`}
            onClick={() => setActiveTab("store")}
          >
            Available in store
          </button>
        </div>
        <button
          type="button"
          className={styles.notifyClose}
          aria-label="Close"
          onClick={onClose}
        >
          <SvgWrapper svgSrc="cross-black" />
        </button>
      </div>

      <div className={styles.notifyPanelBody}>
        {activeTab === "store" ? (
          <div className={styles.notifyStoreContent}>
            <div className={styles.notifyStoreIntro}>
              <p>
                Size : <span>{selectedSize}</span>
              </p>
              <p>
                This item is currently unavailable online, but in stock at
                selected stores near you.
              </p>
              <div className={styles.storeLegend} aria-label="Store stock key">
                <span>
                  <StoreStatusIcon status="in_stock" /> In stock
                </span>
                <span>
                  <StoreStatusIcon status="few_left" /> Few left
                </span>
                <span>
                  <StoreStatusIcon status="out_of_stock" /> Out of stock
                </span>
              </div>
            </div>
            <div className={styles.storeList}>
              {DUMMY_STORES.map((store) => (
                <div className={styles.storeCard} key={store.id}>
                  <div className={styles.storeCardHeader}>
                    <h3>{store.name}</h3>
                    <button type="button" aria-label={`Expand ${store.name}`}>
                      +
                    </button>
                  </div>
                  <p>{store.address}</p>
                  <div className={styles.storeSizeList}>
                    {storeRows.map((size) => (
                      <span key={`${store.id}-${size.size}`}>
                        {size.size}
                        <StoreStatusIcon status={size.status} />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isSubmitted ? (
          <div className={styles.notifyConfirmation}>
            <p className={styles.notifyIntro}>
              We'll notify you if this product comes back in stock:
            </p>
            <div className={styles.notifySummary}>
              {!!email && (
                <div>
                  <span>Email</span>
                  <strong>{email}</strong>
                </div>
              )}
              {!!phone && (
                <div>
                  <span>Phone number</span>
                  <strong>{phoneDisplay}</strong>
                </div>
              )}
            </div>
            <div className={styles.notifyProductCard}>
              <div className={styles.notifyProductImage}>
                <FyImage
                  src={getRecommendationImage(product)}
                  alt={name}
                  aspectRatio={2 / 3}
                  sources={[{ width: 160 }]}
                  globalConfig={globalConfig}
                  isImageFill={globalConfig?.img_fill}
                  backgroundColor={
                    globalConfig?.img_container_bg || "oklch(96% 0.006 100)"
                  }
                />
              </div>
              <div className={styles.notifyProductDetails}>
                <div>
                  <p>{name}</p>
                  <span>{availabilityStatus}</span>
                </div>
                <dl>
                  <div>
                    <dt>Size:</dt>
                    <dd>{selectedSize}</dd>
                  </div>
                  {!!selectedColor && (
                    <div>
                      <dt>Colour:</dt>
                      <dd>{selectedColor}</dd>
                    </div>
                  )}
                </dl>
              </div>
              {!!price && <div className={styles.notifyProductPrice}>{price}</div>}
            </div>
            <button
              type="button"
              className={`${styles.notifyActionButton} ${styles.notifyActionButtonActive}`}
              onClick={onKeepShopping}
            >
              <span>KEEP SHOPPING</span>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : (
          <div className={styles.notifyForm}>
            <p className={styles.notifySizeLine}>
              Size : <span>{selectedSize}</span>
            </p>
            <p className={styles.notifyCopy}>
              Enter your email or phone number.
              <br />
              We'll notify you when this size is back.
            </p>
            <div className={styles.notifyFieldGroup}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder="Email"
                />
              </label>
              <label className={styles.notifyPhoneField}>
                <span>Phone number</span>
                <div>
                  <span className={styles.notifyPhoneCode}>🇬🇧 +44⌄</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(event) => onPhoneChange(event.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </label>
            </div>
            <label className={styles.notifyConsent}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => onConsentChange(event.target.checked)}
              />
              <span>
                I would like to receive personalised promotions from COS a
                brand of the H&M Group via email and text messages. I can
                withdraw this consent at any time. I confirm that I'm 16 years
                old or older. I acknowledge that my personal data will be
                processed by H&M Group in accordance with the{" "}
                <u>privacy notice</u>.
              </span>
            </label>
            {consent && (
              <div className={styles.notifyAudienceGroup}>
                <label>
                  <input
                    type="radio"
                    name="notify-audience"
                    value="women"
                    checked={audience === "women"}
                    onChange={() => onAudienceChange("women")}
                  />
                  <span>Women</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="notify-audience"
                    value="men"
                    checked={audience === "men"}
                    onChange={() => onAudienceChange("men")}
                  />
                  <span>Men</span>
                </label>
              </div>
            )}
            <button
              type="button"
              className={`${styles.notifyActionButton} ${
                canSubmit ? styles.notifyActionButtonActive : ""
              }`}
              disabled={!canSubmit}
              onClick={onSubmit}
            >
              <span>NOTIFY WHEN AVAILABLE</span>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        )}

        {trendingItems.length > 0 && (
          <div className={styles.notifyTrending}>
            <div className={styles.notifyTrendingHeader}>
              <h2>Trending</h2>
              <div aria-hidden="true">
                <span>‹</span>
                <span>›</span>
              </div>
            </div>
            <div className={styles.notifyTrendingGrid}>
              {trendingItems.map((item) => (
                <FDKLink
                  key={item?.uid || item?.slug}
                  to={`/product/${item?.slug}`}
                  className={styles.notifyTrendingItem}
                >
                  {!!item?.teaser_tag && (
                    <span className={styles.notifyTrendingBadge}>
                      {item.teaser_tag}
                    </span>
                  )}
                  <FyImage
                    src={getRecommendationImage(item)}
                    alt={item?.name}
                    aspectRatio={2 / 3}
                    sources={[{ width: 260 }]}
                    globalConfig={globalConfig}
                    isImageFill={globalConfig?.img_fill}
                    backgroundColor={
                      globalConfig?.img_container_bg || "oklch(96% 0.006 100)"
                    }
                  />
                </FDKLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DUMMY_STORES = [
  {
    id: "east-street-1",
    name: "EAST STREET",
    address: (
      <>
        45 East Street
        <br />
        BN1 1HN Brighton
      </>
    ),
  },
  {
    id: "east-street-2",
    name: "EAST STREET",
    address: (
      <>
        45 East Street
        <br />
        BN1 1HN Brighton
      </>
    ),
  },
  {
    id: "east-street-3",
    name: "EAST STREET",
    address: (
      <>
        45 East Street
        <br />
        BN1 1HN Brighton
      </>
    ),
  },
];

const FALLBACK_STORE_SIZES = [
  { size: "32", status: "in_stock" },
  { size: "34", status: "in_stock" },
  { size: "36", status: "out_of_stock" },
  { size: "38", status: "in_stock" },
  { size: "40", status: "out_of_stock" },
  { size: "42", status: "in_stock" },
  { size: "44", status: "out_of_stock" },
];

const getStoreAvailabilityRows = (sizes = [], selectedSize = "") => {
  if (!sizes?.length) return FALLBACK_STORE_SIZES;

  return sizes.map((size, index) => {
    const sizeValue = size?.display || size?.value || "";
    let status = "in_stock";

    if (size?.quantity === 0 && size?.value !== selectedSize) {
      status = "out_of_stock";
    } else if (size?.quantity > 0 && size?.quantity <= 5) {
      status = "few_left";
    }

    if (size?.value === selectedSize) {
      status = index % 3 === 0 ? "few_left" : "in_stock";
    }

    return {
      size: sizeValue,
      status,
    };
  });
};

const StoreStatusIcon = ({ status = "in_stock" }) => {
  const labelMap = {
    in_stock: "In stock",
    few_left: "Few left",
    out_of_stock: "Out of stock",
  };
  const symbolMap = {
    in_stock: "✓",
    few_left: "!",
    out_of_stock: "×",
  };

  return (
    <span
      className={`${styles.storeStatusIcon} ${
        status === "few_left"
          ? styles.storeStatusIconFew
          : status === "out_of_stock"
            ? styles.storeStatusIconOut
            : styles.storeStatusIconIn
      }`}
      aria-label={labelMap[status]}
      role="img"
    >
      {symbolMap[status]}
    </span>
  );
};

const FullfillmentOption = ({
  foItem,
  fulfillmentOptions,
  currentFO,
  setCurrentFO,
  getDeliveryPromise,
}) => {
  const formattedPromise = getDeliveryPromise(foItem?.delivery_promise);
  return (
    <div
      className={styles.fulfillmentOption}
      onClick={() => setCurrentFO(foItem?.fulfillment_option || {})}
    >
      {fulfillmentOptions.length === 1 ? (
        <TruckIcon className={styles.fulfillmentOption} />
      ) : (
        <RadioIcon
          checked={foItem?.fulfillment_option?.slug === currentFO?.slug}
        />
      )}

      <div className={styles.foDetails}>
        {!!formattedPromise && (
          <p className={styles.promiseLabel}>{formattedPromise}</p>
        )}
        <p className={styles.foLabel}>{foItem?.fulfillment_option?.name}</p>
      </div>
    </div>
  );
};

export default AddToCart;
