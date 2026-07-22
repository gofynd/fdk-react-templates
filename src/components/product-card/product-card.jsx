/**
 * ProductCard Component
 *
 * This React component renders a product card with various customizable options such as displaying brand, price, sale badges, wishlist icons, and more. It supports responsive design with different layouts for mobile, tablet, and desktop views.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.product - The product data to be displayed.
 * @param {Array} [props.customClass=[]] - Custom CSS classes to apply to the card.
 * @param {string} [props.listingPrice="range"] - Determines the price display format ("min", "max", or "range").
 * @param {boolean} [props.isHdimgUsed=false] - Flag to determine if high-definition images should be used.
 * @param {number} [props.aspectRatio=0.8] - Aspect ratio for the product image.
 * @param {boolean} [props.isBrand=true] - Flag to display the brand name.
 * @param {boolean} [props.isPrice=true] - Flag to display the price.
 * @param {boolean} [props.isSaleBadge=true] - Flag to display a sale badge if applicable.
 * @param {boolean} [props.isWishlistIcon=true] - Flag to display a wishlist icon.
 * @param {boolean} [props.isImageFill=false] - Flag to determine if the image should fill its container.
 * @param {boolean} [props.showImageOnHover=false] - Flag to show a different image on hover.
 * @param {string} [props.imageBackgroundColor=""] - Background color for the image.
 * @param {string} [props.imagePlaceholder=""] - Placeholder image URL.
 * @param {Object} [props.columnCount={ desktop: 4, tablet: 3, mobile: 1 }] - Number of columns for different viewports.
 * @param {Function} [props.WishlistIconComponent=() => <SvgWrapper svgSrc="wishlist-plp" />] - Custom component for the wishlist icon.
 * @param {boolean} [props.isRemoveIcon=false] - Flag to display a remove icon.
 * @param {Function} [props.RemoveIconComponent=() => <SvgWrapper svgSrc="item-close" />] - Custom component for the remove icon.
 * @param {Array} [props.followedIdList=[]] - List of followed product IDs.
 * @param {Function} [props.onWishlistClick=() => {}] - Callback function for wishlist icon click.
 * @param {Function} [props.handleAddToCart=() => {}] - Callback function for add to cart action.
 * @param {Function} [props.onRemoveClick=() => {}] - Callback function for remove icon click.
 * @param {boolean} [props.centerAlign=false] - Flag to center align text.
 * @param {boolean} [props.showAddToCart=false] - Flag to display the add to cart button.
 * @param {Function} [props.onClick=() => {}] - Callback function for card click.
 * @param {boolean} [props.showBadge=true] - Flag to display product badges.
 * @param {boolean} [props.showColorVariants=false] - Flag to display color variant dots.
 * @param {boolean} [props.isSlider=false] - Flag to indicate if card is used in a slider.
 *
 * @returns {JSX.Element} The rendered product card component.
 *
 * Note: Color variants are now clickable and will change the product image using optimized state management.
 */

import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  currencyFormat,
  formatLocale,
  isValidCustomBadge,
} from "../../helper/utils";
import { useMobile } from "../../helper/hooks";
import FyImage from "../core/fy-image/fy-image";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import * as styles from "./product-card.less";
import FyButton from "../core/fy-button/fy-button";
import { useGlobalStore, useFPI, useGlobalTranslation } from "fdk-core/utils";
import ForcedLtr from "../forced-ltr/forced-ltr";

const ProductCard = ({
  product,
  customClass = [],
  listingPrice = "range",
  imgSrcSet = [
    { breakpoint: { min: 1024 }, width: 600 },
    { breakpoint: { min: 768 }, width: 300 },
    { breakpoint: { min: 481 }, width: 300 },
    { breakpoint: { max: 390 }, width: 300 },
    { breakpoint: { max: 480 }, width: 300 },
  ],
  aspectRatio = 0.8,
  isBrand = true,
  isPrice = true,
  isSaleBadge = true,
  isWishlistIcon = true,
  isCustomBadge = true,
  isImageFill = false,
  showImageOnHover = false,
  customImageContainerClass = "",
  imageBackgroundColor = "",
  customeProductDescContainerClass = "",
  imagePlaceholder = "",
  columnCount = { desktop: 4, tablet: 3, mobile: 1 },
  WishlistIconComponent = () => <SvgWrapper svgSrc="wishlist-plp" />,
  isRemoveIcon = false,
  RemoveIconComponent = () => (
    <SvgWrapper svgSrc="item-close" className={styles.removeIcon} />
  ),
  actionButtonText,
  followedIdList = [],
  onWishlistClick = () => {},
  handleAddToCart = () => {},
  onRemoveClick = () => {},
  centerAlign = false,
  showAddToCart = false,
  showBadge = true,
  showColorVariants = false,
  isSlider = false,
  onClick = () => {},
}) => {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const i18nDetails = useGlobalStore(fpi?.getters?.i18N_DETAILS) || {};
  const locale = i18nDetails?.language?.locale || "en";
  const countryCode = i18nDetails?.countryCode || "IN";
  const isMobile = useMobile();

  const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  const getListingPrice = (key) => {
    if (!product.price) return "";

    let price = "";
    const priceDetails = product.price[key];

    switch (listingPrice) {
      case "min":
        price = currencyFormat(
          priceDetails.min,
          priceDetails.currency_symbol,
          formatLocale(locale, countryCode, true)
        );
        break;
      case "max":
        price = currencyFormat(
          priceDetails.max,
          priceDetails.currency_symbol,
          formatLocale(locale, countryCode, true)
        );
        break;
      case "range":
        price =
          priceDetails.min !== priceDetails.max
            ? `${currencyFormat(
                priceDetails.min,
                priceDetails.currency_symbol,
                formatLocale(locale, countryCode, true)
              )} - ${currencyFormat(
                priceDetails.max,
                priceDetails.currency_symbol,
                formatLocale(locale, countryCode, true)
              )}`
            : currencyFormat(
                priceDetails.min,
                priceDetails.currency_symbol,
                formatLocale(locale, countryCode, true)
              );
        break;
      default:
        break;
    }
    return price;
  };

  // =================== OPTIMIZED COLOR VARIANT FUNCTIONALITY ===================

  // Memoized variant processing for better performance
  const colorVariants = useMemo(() => {
    const variants = product.variants?.find(
      (variant) =>
        variant.display_type === "color" || variant.display_type === "image"
    );

    if (!variants?.items?.length) {
      return { items: [], count: 0, defaultVariant: null, hasVariants: false };
    }

    const defaultVariant = variants.items.find(
      (variant) => product.slug === variant.slug
    );

    return {
      items: variants.items,
      count: variants.items.length,
      defaultVariant,
      hasVariants: true,
    };
  }, [product.variants, product.slug]);

  // Optimized state management for selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Current active variant with fallback
  const currentShade = selectedVariant || colorVariants.defaultVariant;

  const getImageMedia = useCallback((mediaList = []) => {
    if (!Array.isArray(mediaList)) return [];
    return mediaList.filter((media) => media?.type === "image" && media?.url);
  }, []);

  const getVariantImages = useCallback(
    (variant = null) => getImageMedia(variant?.medias || variant?.media || []),
    [getImageMedia]
  );

  // Optimized image processing with memoization
  const getProductImages = useCallback(
    (variant = null) => {
      // Priority: variant medias -> product media -> empty array
      const variantImages = getVariantImages(variant);
      if (variantImages.length) return variantImages;
      return getImageMedia(product?.media || product?.medias || []);
    },
    [getImageMedia, getVariantImages, product?.media, product?.medias]
  );

  // Memoized image data to prevent unnecessary recalculations
  const imageData = useMemo(() => {
    const currentImages = getProductImages(currentShade);
    const fallbackImages = getProductImages();
    const variantImages = colorVariants.items.flatMap((variant) =>
      getVariantImages(variant)
    );
    const sourceImages = currentImages.length
      ? [...currentImages, ...fallbackImages, ...variantImages]
      : [...fallbackImages, ...variantImages];
    const seenUrls = new Set();
    const images = sourceImages.reduce((acc, media, index) => {
      if (!media?.url || seenUrls.has(media.url)) return acc;

      seenUrls.add(media.url);
      acc.push({
        url: media.url,
        alt:
          media.alt ||
          `${product?.brand?.name || ""} | ${product?.name || ""} ${index + 1}`.trim(),
      });
      return acc;
    }, []);

    if (!images.length && imagePlaceholder) {
      images.push({
        url: imagePlaceholder,
        alt: `${product?.brand?.name || ""} | ${product?.name || ""}`.trim(),
      });
    }

    const activeImage = images[activeImageIndex] || images[0] || {};

    return {
      images,
      url: activeImage.url || imagePlaceholder,
      alt: activeImage.alt || `${product?.brand?.name} | ${product?.name}`,
      hoverUrl: images[1]?.url || "",
      hoverAlt: images[1]?.alt || `${product?.brand?.name} | ${product?.name}`,
    };
  }, [
    activeImageIndex,
    colorVariants.items,
    currentShade,
    getVariantImages,
    getProductImages,
    imagePlaceholder,
    product?.brand?.name,
    product?.name,
  ]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [currentShade?.uid, product?.uid]);

  // Optimized variant display order with memoization
  const orderedVariants = useMemo(() => {
    if (!colorVariants.hasVariants) return [];

    const { items, defaultVariant } = colorVariants;
    const otherVariants = items.filter((v) => v.uid !== defaultVariant?.uid);

    return defaultVariant ? [defaultVariant, ...otherVariants] : items;
  }, [colorVariants]);

  // =================== END OPTIMIZED VARIANT FUNCTIONALITY ===================

  const hasDiscount =
    getListingPrice("effective") !== getListingPrice("marked");

  const isFollowed = useMemo(() => {
    return !!followedIdList?.includes(product?.uid);
  }, [followedIdList, product]);

  const isMiniGrid = columnCount?.desktop === 10;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onWishlistClick({ product, isFollowed });
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onRemoveClick({ product, isFollowed });
  };

  const gridClass = useMemo(
    () =>
      `${columnCount?.mobile === 2 ? styles["mob-grid-2-card"] : styles["mob-grid-1-card"]} ${columnCount?.tablet === 2 ? styles["tablet-grid-2-card"] : styles["tablet-grid-3-card"]} ${
        columnCount?.desktop === 1
          ? styles["desktop-grid-1-card"]
          : columnCount?.desktop === 2
          ? styles["desktop-grid-2-card"]
          : columnCount?.desktop === 10
            ? styles["desktop-grid-mini-card"]
            : styles["desktop-grid-4-card"]
      }`,
    [columnCount?.desktop, columnCount?.tablet, columnCount?.mobile]
  );

  const stopProductCardInteraction = (event) => {
    event?.stopPropagation();
  };

  const handleAddToCartClick = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    event?.nativeEvent?.stopImmediatePropagation?.();
    handleAddToCart(product?.slug, product);
  };

  const hasImageSlider = imageData.images.length > 1;
  const teaserTagText =
    typeof product?.teaser_tag === "string" ? product.teaser_tag.trim() : "";
  const productTags = Array.isArray(product?.tags)
    ? product.tags
    : typeof product?.tags === "string"
      ? product.tags.split(",")
      : [];
  const hasNewSignal =
    productTags.some((tag) => `${tag}`.trim().toLowerCase().includes("new")) ||
    !!product?.product_online_date;
  const badgeText = teaserTagText || (hasNewSignal ? "NEW" : "");
  const isNewBadge = badgeText.toLowerCase() === "new";
  const shouldShowCustomBadge =
    !isMiniGrid &&
    showBadge &&
    isValidCustomBadge(badgeText) &&
    (isCustomBadge || isNewBadge);
  const badgeHeight = Math.max(50, badgeText.length * 8);

  const handleImageSlide = useCallback(
    (event, direction) => {
      event?.preventDefault();
      event?.stopPropagation();

      const total = imageData.images.length;
      if (total <= 1) return;

      setActiveImageIndex((currentIndex) =>
        (currentIndex + direction + total) % total
      );
    },
    [imageData.images.length]
  );

  // Optimized variant click handler with useCallback
  const handleVariantClick = useCallback(
    (event, variant) => {
      event?.preventDefault();
      event?.stopPropagation();

      // Only update if different variant is selected
      if (variant.uid !== currentShade?.uid) {
        setSelectedVariant(variant);
      }
    },
    [currentShade?.uid]
  );

  return (
    <div
      className={`${styles.productCard} ${
        !product.sellable ? styles.disableCursor : ""
      } ${styles[customClass[0]]} ${styles[customClass[1]]} ${
        styles[customClass[2]]
      } ${styles.animate} ${gridClass} ${isSlider ? styles.sliderCard : ""}`}
      onClick={onClick}
    >
      <div className={`${styles.imageContainer} ${customImageContainerClass} ${!product.sellable ? styles.outOfStockContainer : ""}`}>
        {!isMiniGrid && !hasImageSlider && !isMobile && showImageOnHover && imageData.hoverUrl && (
          <FyImage
            src={imageData.hoverUrl}
            alt={imageData.hoverAlt}
            aspectRatio={aspectRatio}
            isImageFill={isImageFill}
            backgroundColor={imageBackgroundColor}
            isFixedAspectRatio={true}
            customClass={`${styles.productImage} ${styles.hoverImage}`}
            sources={imgSrcSet}
            defer={true}
          />
        )}
        <FyImage
          src={imageData.url}
          alt={imageData.alt}
          aspectRatio={aspectRatio}
          isImageFill={isImageFill}
          backgroundColor={imageBackgroundColor}
          isFixedAspectRatio={true}
          customClass={`${styles.productImage} ${styles.mainImage}`}
          sources={imgSrcSet}
          defer={false}
        />
        {!isMiniGrid && hasImageSlider && (
          <>
            <div className={styles.productImageSliderControls}>
              <button
                type="button"
                className={`${styles.productImageSliderBtn} ${styles.productImageSliderPrev}`}
                aria-label="Previous product image"
                onClick={(event) => handleImageSlide(event, -1)}
              />
              <button
                type="button"
                className={`${styles.productImageSliderBtn} ${styles.productImageSliderNext}`}
                aria-label="Next product image"
                onClick={(event) => handleImageSlide(event, 1)}
              />
            </div>
            <div
              className={styles.productImageSliderTrack}
              style={{
                gridTemplateColumns: `repeat(${imageData.images.length}, minmax(0, 1fr))`,
              }}
              aria-hidden="true"
            >
              {imageData.images.map((image, index) => (
                <span
                  key={`${image.url}-${index}`}
                  className={`${styles.productImageSliderSegment} ${
                    index === activeImageIndex ? styles.active : ""
                  }`}
                />
              ))}
            </div>
          </>
        )}
        {!isMiniGrid && isWishlistIcon && (
          <button
            className={`${styles.wishlistBtn} ${isFollowed ? styles.active : ""}`}
            onClick={handleWishlistClick}
            title={t("resource.product.wishlist_icon")}
          >
            <WishlistIconComponent isFollowed={isFollowed} />
          </button>
        )}
        {!isMiniGrid && showAddToCart && (
          <FyButton
            type="button"
            data-product-card-interactive="true"
            variant="outlined"
            className={styles.addToCart}
            onPointerDown={stopProductCardInteraction}
            onMouseDown={stopProductCardInteraction}
            onTouchStart={stopProductCardInteraction}
            onClick={handleAddToCartClick}
          >
            {actionButtonText ?? t("resource.common.add_to_cart")}
          </FyButton>
        )}
        {!isMiniGrid && isRemoveIcon && (
          <button
            className={`${styles.wishlistBtn} ${isFollowed ? styles.active : ""}`}
            onClick={handleRemoveClick}
            title={t("resource.product.wishlist_icon")}
          >
            <RemoveIconComponent />
          </button>
        )}
        {!isMiniGrid && !product.sellable ? (
          <div className={`${styles.badge} ${styles.outOfStock}`}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              {t("resource.common.out_of_stock")}
            </span>
          </div>
        ) : shouldShowCustomBadge ? (
          <div
            className={styles.badge}
            style={{ "--plp-badge-height": `${badgeHeight}px` }}
          >
            <span className={`${styles.text} ${styles.captionNormal}`}>
              {isMobileView
                ? `${badgeText.substring(0, 8)}${
                    badgeText.length > 8 ? "..." : ""
                  }`
                : badgeText.substring(0, 14)}
            </span>
          </div>
        ) : !isMiniGrid && isSaleBadge && showBadge && product.discount && product.sellable ? (
          <div className={`${styles.badge} ${styles.sale}`}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              {t("resource.common.sale")}
            </span>
          </div>
        ) : null}
      </div>
      {!isMiniGrid && (
        <div
          className={`${styles.productDescContainer} ${customeProductDescContainerClass}`}
        >
          <div className={styles.productDesc}>
            {isBrand && product.brand && (
              <h3 className={styles.productBrand}>{product.brand.name}</h3>
            )}
            <h5
              className={`${styles.productName} ${styles.b2} ${centerAlign ? styles.centerAlign : ""}`}
              title={product.name}
            >
              {product.name}
            </h5>
            {isPrice && (
              <div
                className={`${styles.productPrice} ${centerAlign ? styles.center : ""}`}
              >
                {product?.price?.effective && (
                  <span
                    className={`${styles["productPrice--sale"]} ${styles.h4}`}
                  >
                    <ForcedLtr text={getListingPrice("effective")} />
                  </span>
                )}
                {hasDiscount && (
                  <span
                    className={`${styles["productPrice--regular"]} ${styles.captionNormal}`}
                  >
                    <ForcedLtr text={getListingPrice("marked")} />
                  </span>
                )}
                {product.discount && (
                  <span
                    className={`${styles["productPrice--discount"]} ${styles.captionNormal}   ${centerAlign ? styles["productPrice--textCenter"] : ""}`}
                  >
                    ({product.discount})
                  </span>
                )}
              </div>
            )}

            {/* OPTIMIZED COLOR VARIANTS SECTION
                COS Figma match:
                - When the product has <= 3 variants, show all of them side by side.
                - When > 3 variants, show 2 visible swatches + "+N" (N = remaining count).
                Each visible swatch is clickable and selects that variant directly.
                Clicking "+N" cycles to the next hidden variant. The product image
                swaps based on the selected variant's medias. */}
            {colorVariants.hasVariants && showColorVariants && (() => {
              const total = colorVariants.count;
              const visibleCount = total <= 3 ? total : 2;
              const visibleVariants = orderedVariants.slice(0, visibleCount);
              const hiddenVariants = orderedVariants.slice(visibleCount);
              const hiddenCount = hiddenVariants.length;

              // "+N" cycles through hidden variants; if the current selection is
              // already in the hidden pool, advance to the next hidden variant,
              // otherwise jump to the first hidden variant.
              const currentIdx = orderedVariants.findIndex(
                (v) => v.uid === currentShade?.uid
              );
              const nextHiddenVariant = (() => {
                if (hiddenCount === 0) return null;
                if (currentIdx >= visibleCount) {
                  const localIdx = currentIdx - visibleCount;
                  return hiddenVariants[(localIdx + 1) % hiddenCount];
                }
                return hiddenVariants[0];
              })();

              return (
                <div className={styles.productVariants}>
                  <div className={styles.colorVariants}>
                    {visibleVariants.map((variant) => {
                      const isSelected = currentShade?.uid === variant.uid;
                      return (
                        <div
                          key={variant.uid}
                          className={`${styles.colorDot} ${isSelected ? styles.currentColor : ""}`}
                          style={{ "--color": `#${variant.color}` }}
                          title={variant.color_name || "Color variant"}
                          onClick={(e) => handleVariantClick(e, variant)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Select ${variant.color_name || "color variant"}`}
                        />
                      );
                    })}

                    {hiddenCount > 0 && nextHiddenVariant && (
                      <span
                        className={styles.moreColors}
                        onClick={(e) => handleVariantClick(e, nextHiddenVariant)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Show ${hiddenCount} more colors`}
                      >
                        +{hiddenCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
