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
 * @param {boolean} [props.showImageOnHover=false] - Deprecated. Use imageEffects="swap_image" instead.
 * @param {boolean} [props.showMultipleImages=false] - Deprecated. Use imageEffects="show_multiple_images" instead.
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
 * @param {string} [props.imageEffects="none"] - Controls product-image behavior on desktop hover and mobile interaction.
 *
 * @returns {JSX.Element} The rendered product card component.
 *
 * Note: Color variants are now clickable and will change the product image using optimized state management.
 */

import React, { useMemo, useState, useCallback, useEffect ,useRef } from "react";
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

const DOTS_COMPACT_THRESHOLD = 5;
const DOTS_WINDOW_SIZE = 5;

function getDotWindow(total, selectedIndex, { windowSize = 5, threshold = 5 } = {}) {
  if (total <= threshold) {
    return {
      windowStart: 0,
      visibleIndices: Array.from({ length: total }, (_, i) => i),
    };
  }

  const size = Math.min(windowSize, total);
  const maxStart = total - size;
  let windowStart = selectedIndex - Math.floor(size / 2);
  windowStart = Math.max(0, Math.min(windowStart, maxStart));
  const visibleIndices = Array.from(
    { length: size },
    (_, i) => windowStart + i
  );
  return { windowStart, visibleIndices };
}

function getInactiveDotTier(rel, posInWindow) {
  switch (rel) {
    case 0:
      return posInWindow <= 3 ? "large" : "small";
    case 1:
      if (posInWindow === 0) return "medium";
      if (posInWindow === 2) return "large";
      if (posInWindow === 3) return "medium";
      return "small";
    case 2:
      if (posInWindow === 0 || posInWindow === 4) return "small";
      if (posInWindow === 1 || posInWindow === 3) return "medium";
      return "small";
    case 3:
      if (posInWindow === 0) return "small";
      if (posInWindow === 1) return "medium";
      if (posInWindow === 2) return "large";
      return "medium";
    case 4:
      if (posInWindow === 0) return "small";
      return "large";
    default:
      return "small";
  }
}

function getDotSizeTier(slideIndex, { total, selectedIndex, windowStart, windowSize }) {
  if (slideIndex === selectedIndex) {
    return "active";
  }

  const rel = selectedIndex - windowStart;
  const posInWindow = slideIndex - windowStart;
  if (rel < 0 || rel >= windowSize || posInWindow < 0 || posInWindow >= windowSize) {
    return "small";
  }

  return getInactiveDotTier(rel, posInWindow);
}

function getDotTierClass(tier) {
  if (!tier || tier === "active") {
    return null;
  }
  switch (tier) {
    case "large":
      return styles.dotTierLarge;
    case "medium":
      return styles.dotTierMedium;
    case "small":
      return styles.dotTierSmall;
    default:
      return null;
  }
}

const IMAGE_EFFECTS = {
  NONE: "none",
  ZOOM: "zoom_on_hover",
  SWAP: "swap_image",
  MULTIPLE: "show_multiple_images",
};

function resolveImageEffect(imageEffects, { showImageOnHover, showMultipleImages }) {
  const validEffects = Object.values(IMAGE_EFFECTS);

  if (validEffects.includes(imageEffects)) {
    return imageEffects;
  }

  if (showMultipleImages) {
    return IMAGE_EFFECTS.MULTIPLE;
  }

  if (showImageOnHover) {
    return IMAGE_EFFECTS.SWAP;
  }

  return IMAGE_EFFECTS.NONE;
}

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
  showMultipleImages = false,
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
  imageEffects,
  onClick = () => {},
  isServiceable = true,
}) => {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const i18nDetails = useGlobalStore(fpi?.getters?.i18N_DETAILS) || {};
  const locale = i18nDetails?.language?.locale || "en";
  const countryCode = i18nDetails?.countryCode || "IN";
  const isMobile = useMobile();
  const touchStartXRef = useRef(null);
  const didSwipeRef = useRef(false);

  const [isMobileView, setIsMobileView] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);

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

  // Current active variant with fallback
  const currentShade = selectedVariant || colorVariants.defaultVariant;

  // Optimized image processing with memoization
  const getProductImages = useCallback(
    (variant = null) => {
      // Priority: variant medias -> product media -> empty array
      if (variant?.medias?.length) {
        return variant.medias.filter((media) => media.type === "image");
      }
      return product?.media?.filter((media) => media.type === "image") || [];
    },
    [product?.media]
  );

  // Memoized image data to prevent unnecessary recalculations
  const imageData = useMemo(() => {
    const currentImages = getProductImages(currentShade);
    const fallbackImages = getProductImages();
    const images = currentImages.length ? currentImages : fallbackImages;

    return {
      images,
      url: images[0]?.url || imagePlaceholder,
      alt: images[0]?.alt || `${product?.brand?.name} | ${product?.name}`,
    };
  }, [
    currentShade,
    getProductImages,
    imagePlaceholder,
    product?.brand?.name,
    product?.name,
  ]);

  // Optimized variant display order with memoization
  const orderedVariants = useMemo(() => {
    if (!colorVariants.hasVariants) return [];

    const { items, defaultVariant } = colorVariants;
    const otherVariants = items.filter((v) => v.uid !== defaultVariant?.uid);

    return defaultVariant ? [defaultVariant, ...otherVariants] : items;
  }, [colorVariants]);

  const resolvedImageEffect = useMemo(() => {
    return resolveImageEffect(imageEffects, {
      showImageOnHover,
      showMultipleImages,
    });
  }, [imageEffects, showImageOnHover, showMultipleImages]);

  const imageList = useMemo(() => {
    if (imageData.images?.length) {
      return imageData.images;
    }

    return [
      {
        url: imageData.url,
        alt: imageData.alt,
      },
    ];
  }, [imageData]);

  const imageSignature = useMemo(
    () => imageList.map((image) => image?.url).join("|"),
    [imageList]
  );

  const hasDiscount =
    getListingPrice("effective") !== getListingPrice("marked");
  const hasSecondaryImage = Boolean(imageList[1]?.url);
  const hasMultipleImages = imageList.length > 1;
  const isZoomEffect = resolvedImageEffect === IMAGE_EFFECTS.ZOOM;
  const isSwapEffect = resolvedImageEffect === IMAGE_EFFECTS.SWAP;
  const isMultipleImagesEffect =
    resolvedImageEffect === IMAGE_EFFECTS.MULTIPLE && hasMultipleImages;
  const activeImage = imageList[activeImageIndex] || imageList[0];

  useEffect(() => {
    setActiveImageIndex(0);
    setIsImageHovered(false);
    touchStartXRef.current = null;
    didSwipeRef.current = false;
  }, [imageSignature, resolvedImageEffect]);

  useEffect(() => {
    if (!isMultipleImagesEffect || isMobile || !isImageHovered) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveImageIndex((previousIndex) =>
        previousIndex === imageList.length - 1 ? 0 : previousIndex + 1
      );
    }, 1200);

    return () => window.clearInterval(intervalId);
  }, [imageList.length, isImageHovered, isMobile, isMultipleImagesEffect]);

  const isFollowed = useMemo(() => {
    return !!followedIdList?.includes(product?.uid);
  }, [followedIdList, product]);

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
      `${columnCount?.mobile === 2 ? styles["mob-grid-2-card"] : styles["mob-grid-1-card"]} ${columnCount?.tablet === 2 ? styles["tablet-grid-2-card"] : styles["tablet-grid-3-card"]} ${columnCount?.desktop === 2 ? styles["desktop-grid-2-card"] : styles["desktop-grid-4-card"]}`,
    [columnCount?.desktop, columnCount?.tablet, columnCount?.mobile]
  );

  const handleAddToCartClick = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    handleAddToCart(product?.slug);
  };

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

  const handleImageMouseEnter = () => {
    if (!isMobile && isMultipleImagesEffect) {
      setIsImageHovered(true);
    }
  };

  const handleImageMouseLeave = () => {
    if (!isMobile && isMultipleImagesEffect) {
      setIsImageHovered(false);
      setActiveImageIndex(0);
    }
  };

  const handleImageTouchStart = (event) => {
    if (!isMobile || !isMultipleImagesEffect) {
      return;
    }

    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    didSwipeRef.current = false;
  };

  const handleImageTouchEnd = (event) => {
    if (!isMobile || !isMultipleImagesEffect) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? null;

    if (touchStartXRef.current === null || touchEndX === null) {
      return;
    }

    const deltaX = touchStartXRef.current - touchEndX;
    const swipeThreshold = 35;

    if (Math.abs(deltaX) < swipeThreshold) {
      touchStartXRef.current = null;
      return;
    }

    didSwipeRef.current = true;
    setActiveImageIndex((previousIndex) => {
      if (deltaX > 0) {
        return previousIndex === imageList.length - 1 ? 0 : previousIndex + 1;
      }

      return previousIndex === 0 ? imageList.length - 1 : previousIndex - 1;
    });
    touchStartXRef.current = null;
  };

  const handleImageClickCapture = (event) => {
    if (!didSwipeRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    didSwipeRef.current = false;
  };

  const handleDotClick = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex(index);
  };

  const isCompactDots = imageList.length > DOTS_COMPACT_THRESHOLD;
  
  const dotWindowData = useMemo(() => {
    return getDotWindow(imageList.length, activeImageIndex, {
      windowSize: DOTS_WINDOW_SIZE,
      threshold: DOTS_COMPACT_THRESHOLD,
    });
  }, [imageList.length, activeImageIndex]);

  const renderImage = (image, additionalClass = "", { defer = false } = {}) => (
    <FyImage
      src={image?.url || imagePlaceholder}
      alt={image?.alt || `${product?.brand?.name} | ${product?.name}`}
      aspectRatio={aspectRatio}
      isImageFill={isImageFill}
      backgroundColor={imageBackgroundColor}
      isFixedAspectRatio={true}
      customClass={`${styles.productImage} ${additionalClass}`.trim()}
      sources={imgSrcSet}
      defer={defer}
    />
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
      <div
        className={`${styles.imageContainer} ${customImageContainerClass} ${
          !product.sellable ? styles.outOfStockContainer : ""
        } ${!isMobile && isZoomEffect ? styles.zoomOnHover : ""} ${
          !isMobile && isSwapEffect && hasSecondaryImage
            ? styles.hoverSwapEnabled
            : ""
        }`}
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
        onTouchStart={handleImageTouchStart}
        onTouchEnd={handleImageTouchEnd}
        onClickCapture={handleImageClickCapture}
      >
        {isMultipleImagesEffect ? (
          <>
            <div className={styles.desktopSlideshowContainer}>
              <div
                className={styles.slidesWrapper}
                style={{
                  transform: `translateX(-${activeImageIndex * 100}%)`,
                }}
              >
                {imageList.map((image, index) => (
                  <div className={styles.slide} key={image?.url || index}>
                    {renderImage(image, styles.mainImage, {
                      defer: index !== activeImageIndex,
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className={`${styles.dotsContainer} ${isCompactDots ? styles.dotsCompact : ""}`}>
              {!isCompactDots &&
                imageList.map((image, index) => (
                  <span
                    key={`dot-${image?.url || index}`}
                    role="button"
                    tabIndex={0}
                    className={`${styles.dot} ${
                      activeImageIndex === index ? styles.activeDot : ""
                    }`}
                    onClick={(event) => handleDotClick(event, index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        handleDotClick(event, index);
                      }
                    }}
                    aria-label={`Show image ${index + 1}`}
                  />
                ))}
              {isCompactDots &&
                dotWindowData.visibleIndices.map((index) => {
                  const tier = getDotSizeTier(index, {
                    total: imageList.length,
                    selectedIndex: activeImageIndex,
                    windowStart: dotWindowData.windowStart,
                    windowSize: dotWindowData.visibleIndices.length,
                  });
                  const isActive = index === activeImageIndex;
                  const tierClass = isCompactDots ? getDotTierClass(tier) : null;
                  return (
                    <span
                      key={`dot-${imageList[index]?.url || index}`}
                      role="button"
                      tabIndex={0}
                      className={`${styles.dot} ${tierClass || ""} ${
                        isActive ? styles.activeDot : ""
                      }`}
                      onClick={(event) => handleDotClick(event, index)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          handleDotClick(event, index);
                        }
                      }}
                      aria-label={`Show image ${index + 1}`}
                    />
                  );
                })}
            </div>
          </>
        ) : !isMobile && isSwapEffect && hasSecondaryImage ? (
          <>
            {renderImage(imageList[1], styles.hoverImage, { defer: true })}
            {renderImage(imageList[0], styles.mainImage)}
          </>
        ) : (
          renderImage(activeImage, styles.mainImage)
        )}

        {isWishlistIcon && (
          <button
            className={`${styles.wishlistBtn} ${isFollowed ? styles.active : ""}`}
            onClick={handleWishlistClick}
            title={t("resource.product.wishlist_icon")}
          >
            <WishlistIconComponent isFollowed={isFollowed} />
          </button>
        )}
        {isRemoveIcon && (
          <button
            className={`${styles.wishlistBtn} ${isFollowed ? styles.active : ""}`}
            onClick={handleRemoveClick}
            title={t("resource.product.wishlist_icon")}
          >
            <RemoveIconComponent />
          </button>
        )}
        {!product.sellable ? (
          <div className={`${styles.badge} ${styles.outOfStock}`}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              {t("resource.common.out_of_stock")}
            </span>
          </div>
        ) : isCustomBadge && isValidCustomBadge(product.teaser_tag) && showBadge ? (
          <div className={styles.badge}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              {isMobileView
                ? `${product?.teaser_tag?.substring(0, 8)}...`
                : product?.teaser_tag?.substring(0, 14)}
            </span>
          </div>
        ) : isSaleBadge && showBadge && product.discount && product.sellable ? (
          <div className={`${styles.badge} ${styles.sale}`}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              {t("resource.common.sale")}
            </span>
          </div>
        ) : null}
      </div>
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

          {/* OPTIMIZED COLOR VARIANTS SECTION */}
          {colorVariants.hasVariants && showColorVariants && (
            <div className={styles.productVariants}>
              <div className={styles.colorVariants}>
                {orderedVariants.slice(0, 4).map((variant) => {
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

                {colorVariants.count > 4 && (
                  <span className={styles.moreColors}>
                    +{colorVariants.count - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {showAddToCart && (
          <FyButton
            variant="outlined"
            className={styles.addToCart}
            onClick={handleAddToCartClick}
          >
            {actionButtonText ?? t("resource.common.add_to_cart")}
          </FyButton>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
