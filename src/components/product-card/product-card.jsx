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
 * @param {boolean} [props.isSlider=false] - Flag to indicate if card is used in a slider.
 *
 * @returns {JSX.Element} The rendered product card component.
 *
 * Note: Color variants are now clickable and will change the product image using optimized state management.
 */

import React, { useMemo, useState, useCallback } from "react";
import { currencyFormat, formatLocale } from "../../helper/utils";
import { useMobile } from "../../helper/hooks";
import FyImage from "../core/fy-image/fy-image";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import * as styles from "./product-card.less";
import FyButton from "../core/fy-button/fy-button";
import { useGlobalStore, useFPI, useGlobalTranslation } from "fdk-core/utils";
import ForcedLtr from "../forced-ltr/forced-ltr";
import Tooltip from "../tool-tip/tool-tip";
import { useNavigate } from "react-router-dom";

const DefaultProductPrice = ({
  loggedIn,
  product,
  centerAlign,
  getListingPrice,
  hasDiscount,
  showMarkedPriceForGuest,
  showDiscountForGuest,
  showLoginOption,
  showDiscountForNonKyc,
  showKycCompletionBadge,
  isKycKeyPresent,
  isMerchantKycApproved,
  kycBadgeText,
}) => {
  const navigate = useNavigate();

  const handleNavigateToLogin = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const currentUrl = window.location.pathname + window.location.search;
    navigate(`/auth/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
  };

  //? Guest user Settings
  if (!loggedIn) {
    //? if none of the three conditions are met, then show empty fragment
    if (!showMarkedPriceForGuest && !showDiscountForGuest && !showLoginOption) {
      return <></>;
    }

    //? if only login option is enabled
    if (showLoginOption && !showMarkedPriceForGuest && !showDiscountForGuest) {
      return (
        <FyButton
          variant="outlined"
          className={styles.loginToViewPricing}
          onClick={handleNavigateToLogin}
          startIcon={<SvgWrapper svgSrc="lock-icon" />}
        >
          Login to view pricing
        </FyButton>
      );
    }
    //? If marked Price option is enabled, and discount is disabled
    if (showMarkedPriceForGuest && !showDiscountForGuest && !loggedIn) {
      return (
        <>
          <div
            className={`${styles.productPrice} ${centerAlign ? styles.center : ""}`}
          >
            <span className={`${styles["productPrice--sale"]} ${styles.h4}`}>
              {getListingPrice("marked")}
            </span>
          </div>
          {showLoginOption && (
            <FyButton
              variant="outlined"
              className={styles.loginToViewPricing}
              onClick={handleNavigateToLogin}
              startIcon={<SvgWrapper svgSrc="lock-icon" />}
            >
              Login to view offers
            </FyButton>
          )}
        </>
      );
    }
  }

  //? Non-KYC user Settings
  if (loggedIn && !isMerchantKycApproved) {
    //? Only show marked price for non KYC
    if (!showDiscountForNonKyc) {
      return (
        <>
          <div
            className={`${styles.productPrice} ${centerAlign ? styles.center : ""}`}
          >
            <span className={`${styles["productPrice--sale"]} ${styles.h4}`}>
              <ForcedLtr text={getListingPrice("marked")} />
            </span>
          </div>

          {showKycCompletionBadge && !isKycKeyPresent && (
            <div className={styles.kycCompletionBadge}>
              <span className={styles.kycCompletionBadgeIcon}>
                <SvgWrapper svgSrc="info-white" />
              </span>
              <span className={styles.kycCompletionBadgeText}>
                {kycBadgeText}
              </span>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <div
          className={`${styles.productPrice} ${centerAlign ? styles.center : ""}`}
        >
          {product?.price?.effective && (
            <span className={`${styles["productPrice--sale"]} ${styles.h4}`}>
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
              className={`${styles["productPrice--discount"]} ${styles.captionNormal} `}
            >
              ({product.discount?.toString().toLowerCase()})
            </span>
          )}
        </div>
        {showKycCompletionBadge && !isKycKeyPresent && (
          <div className={styles.kycCompletionBadge}>
            <span className={styles.kycCompletionBadgeIcon}>
              <SvgWrapper svgSrc="info-white" />
            </span>
            <span className={styles.kycCompletionBadgeText}>
              {kycBadgeText}
            </span>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`${styles.productPrice} ${centerAlign ? styles.center : ""}`}
    >
      {product?.price?.effective && (
        <span className={`${styles["productPrice--sale"]} ${styles.h4}`}>
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
          className={`${styles["productPrice--discount"]} ${styles.captionNormal} `}
        >
          ({product.discount?.toString().toLowerCase()})
        </span>
      )}
    </div>
  );
};

const AvailableOfferButton = ({
  handleB2bAvailableOfferClick,
  showDiscountForNonKyc,
  showAvailableOfferButton,
  isMerchantKycApproved,
}) => {
  if (!isMerchantKycApproved && !showDiscountForNonKyc) {
    return <></>;
  }

  return (
    <>
      {showAvailableOfferButton && (
        <FyButton
          variant="outlined"
          className={styles.addToCart}
          onClick={handleB2bAvailableOfferClick}
        >
          Available Offers
        </FyButton>
      )}
    </>
  );
};

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
  isSlider = false,
  onClick = () => {},
  globalConfig = {},
  productsInWishlist = [],
}) => {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const i18nDetails = useGlobalStore(fpi?.getters?.i18N_DETAILS) || {};
  const locale = i18nDetails?.language?.locale || "en";
  const countryCode = i18nDetails?.countryCode || "IN";
  const isMobile = useMobile();

  const loggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const { merchant_data } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);

  const keyName = "kyc_status";
  const isKycKeyPresent = merchant_data?.[keyName] !== undefined;

  const isMerchantKycApproved = () => {
    return merchant_data?.[keyName] === "approved";
  };

  const wishlistStatus = useMemo(() => {
    if (!productsInWishlist || !product?.slug) {
      return { isInWishlist: false, wishlistCount: 0 };
    }

    const matchingSlug = Object.keys(productsInWishlist).find((key) =>
      key.startsWith(product.slug)
    );

    const count = matchingSlug ? productsInWishlist[matchingSlug].length : 0;

    return {
      isInWishlist: count > 0,
      wishlistCount: count,
      matchingSlug,
    };
  }, [productsInWishlist, product?.slug]);

  const {
    show_available_offer_button,
    show_marked_price_guest,
    show_discount_guest,
    show_login_for_guest,
    show_discount_non_kyc,
    show_kyc_completion_badge,
    kyc_badge_text,
  } = globalConfig;

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

    return {
      url: currentImages[0]?.url || fallbackImages[0]?.url || imagePlaceholder,
      alt:
        currentImages[0]?.alt ||
        fallbackImages[0]?.alt ||
        `${product?.brand?.name} | ${product?.name}`,
      hoverUrl: currentImages[1]?.url || fallbackImages[1]?.url || "",
      hoverAlt:
        currentImages[1]?.alt ||
        fallbackImages[1]?.alt ||
        `${product?.brand?.name} | ${product?.name}`,
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

  // =================== END OPTIMIZED VARIANT FUNCTIONALITY ===================

  const hasDiscount =
    getListingPrice("effective") !== getListingPrice("marked");

  const isFollowed = useMemo(() => {
    return !!followedIdList?.includes(product?.uid);
  }, [followedIdList, product]);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onWishlistClick(product);
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

  const handleB2bAvailableOfferClick = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    fpi.custom.setValue("b2bAvailableOffers", {
      slug: product?.slug,
      isModalOpen: true,
    });
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

  return (
    <div
      className={`${styles.productCard} ${
        !product.sellable ? styles.disableCursor : ""
      } ${styles[customClass[0]]} ${styles[customClass[1]]} ${
        styles[customClass[2]]
      } ${styles.animate} ${gridClass} ${isSlider ? styles.sliderCard : ""}`}
      onClick={onClick}
    >
      <div className={`${styles.imageContainer} ${customImageContainerClass}`}>
        {!isMobile && showImageOnHover && imageData.hoverUrl && (
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
        {isWishlistIcon && loggedIn && isMerchantKycApproved() && (
          <button
            className={`${styles.wishlistBtn} ${wishlistStatus.isInWishlist ? styles.active : ""}`}
            onClick={handleWishlistClick}
            title={t("resource.product.wishlist_icon")}
          >
            <WishlistIconComponent isFollowed={wishlistStatus.isInWishlist} />
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
        ) : product.teaser_tag && showBadge ? (
          <div className={styles.badge}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              {product?.teaser_tag?.substring(0, 14)}
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
            <>
              {product?.contract || product?.quotation ? (
                <>
                  {product.contract && (
                    <Tooltip
                      position="bottom"
                      title={
                        <>
                          Contract applied -{" "}
                          {product?.contract?.used_count === 0 ? (
                            <>{product?.contract?.total_count} qty available</>
                          ) : (
                            <>
                              {product?.contract?.total_count -
                                product?.contract?.used_count}
                              /{product?.contract?.total_count} qty available
                            </>
                          )}
                        </>
                      }
                    >
                      <div className={styles.badge_section}>
                        <div className={styles.badge}>
                          <span>Contract Price</span>
                          <span className={styles.info_icon}>
                            <SvgWrapper svgSrc="info-white" />
                          </span>
                        </div>
                      </div>
                    </Tooltip>
                  )}

                  {product?.quotation && (
                    <Tooltip
                      position="bottom"
                      title={
                        <>
                          Quote Price -{" "}
                          {product?.quotation?.used_count === 0 ? (
                            <>{product?.quotation?.total_count} qty available</>
                          ) : (
                            <>
                              {product?.quotation?.total_count -
                                product?.quotation?.used_count}
                              /{product?.quotation?.total_count} qty available
                            </>
                          )}
                        </>
                      }
                    >
                      <div className={styles.badge_section}>
                        <div className={styles.badge}>
                          <span>Quoted Price</span>
                          <span className={styles.info_icon}>
                            <SvgWrapper svgSrc="info-white" />
                          </span>
                        </div>
                      </div>
                    </Tooltip>
                  )}
                  <div
                    className={`${styles.productPrice} ${centerAlign ? styles.center : ""}`}
                  >
                    <span
                      className={`${styles["productPrice--sale"]} ${styles.h4}`}
                    >
                      {currencyFormat(
                        product.best_price.price,
                        product.best_price.currency_symbol
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <DefaultProductPrice
                  loggedIn={loggedIn}
                  product={product}
                  centerAlign={centerAlign}
                  hasDiscount={hasDiscount}
                  getListingPrice={getListingPrice}
                  showMarkedPriceForGuest={show_marked_price_guest}
                  showDiscountForGuest={show_discount_guest}
                  showLoginOption={show_login_for_guest}
                  showDiscountForNonKyc={show_discount_non_kyc}
                  showKycCompletionBadge={show_kyc_completion_badge}
                  isKycKeyPresent={isKycKeyPresent}
                  isMerchantKycApproved={isMerchantKycApproved()}
                  kycBadgeText={kyc_badge_text}
                />
              )}
            </>
          )}

          {/* OPTIMIZED COLOR VARIANTS SECTION */}
          {colorVariants.hasVariants && (
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

        {showAddToCart &&
          ((!loggedIn && show_discount_guest) ||
            (loggedIn && isMerchantKycApproved()) ||
            (loggedIn &&
              !isMerchantKycApproved() &&
              show_discount_non_kyc)) && (
            <FyButton
              variant="outlined"
              className={styles.addToCart}
              onClick={handleAddToCartClick}
            >
              {actionButtonText ?? t("resource.common.add_to_cart")}
            </FyButton>
          )}

        {show_available_offer_button &&
          ((!loggedIn && show_discount_guest) ||
            (loggedIn && isMerchantKycApproved()) ||
            (loggedIn &&
              !isMerchantKycApproved() &&
              show_discount_non_kyc)) && (
            <AvailableOfferButton
              handleB2bAvailableOfferClick={handleB2bAvailableOfferClick}
              showDiscountForNonKyc={show_discount_non_kyc}
              showAvailableOfferButton={show_available_offer_button}
              isKycKeyPresent={isKycKeyPresent}
              isMerchantKycApproved={isMerchantKycApproved()}
            />
          )}
      </div>
    </div>
  );
};

export default ProductCard;
