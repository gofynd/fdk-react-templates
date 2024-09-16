import React, { useMemo } from "react";
import { currencyFormat } from "../../helper/utils";
import { useMobile, useViewport } from "../../helper/hooks";
import FyImage from "../core/fy-image/fy-image";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import * as styles from "./product-card.less";

const ProductCard = ({
  product,
  customClass = [],
  listingPrice = "range",
  isHdimgUsed = false,
  aspectRatio = 0.8,
  isBrand = true,
  isPrice = true,
  isSaleBadge = true,
  isWishlistIcon = true,
  isImageFill = false,
  showImageOnHover = false,
  imageBackgroundColor = "",
  columnCount = { desktop: 4, tablet: 3, mobile: 1 },
  WishlistIconComponent = () => <SvgWrapper svgSrc="wishlist-plp" />,
  isRemoveIcon = false,
  RemoveIconComponent = () => <SvgWrapper svgSrc="item-close" />,
  followedIdList = [],
  onWishlistClick = () => {},
  onRemoveClick = () => {},
}) => {
  const isMobile = useMobile();
  const isTablet = useViewport(481, 768);
  const isMobileStrict = useViewport(0, 480);

  const getListingPrice = (key) => {
    if (!product.price) return "";

    let price = "";
    const priceDetails = product.price[key];

    switch (listingPrice) {
      case "min":
        price = currencyFormat(priceDetails.min, priceDetails.currency_symbol);
        break;
      case "max":
        price = currencyFormat(priceDetails.max, priceDetails.currency_symbol);
        break;
      case "range":
        price =
          priceDetails.min !== priceDetails.max
            ? `${currencyFormat(
                priceDetails.min,
                priceDetails.currency_symbol
              )} - ${currencyFormat(
                priceDetails.max,
                priceDetails.currency_symbol
              )}`
            : currencyFormat(priceDetails.min, priceDetails.currency_symbol);
        break;
      default:
        break;
    }
    return price;
  };

  const getImgSrcSet = () => {
    if (isHdimgUsed) {
      return [
        { breakpoint: { min: 1024 }, width: 600 },
        { breakpoint: { min: 768 }, width: 500 },
        { breakpoint: { min: 481 }, width: 500 },
        { breakpoint: { max: 390 }, width: 400 },
        { breakpoint: { max: 480 }, width: 400 },
      ];
    }
    return [
      { breakpoint: { min: 1024 }, width: 600 },
      { breakpoint: { min: 768 }, width: 300 },
      { breakpoint: { min: 481 }, width: 300 },
      { breakpoint: { max: 390 }, width: 300 },
      { breakpoint: { max: 480 }, width: 300 },
    ];
  };

  const getProductImages = () => {
    return product?.media?.filter((media) => media.type === "image");
  };

  const imageUrl = getProductImages()?.[0]?.url || "";
  const imageAlt =
    getProductImages()?.[0]?.alt ||
    `${product?.brand?.name} | ${product?.name}`;
  const hoverImageUrl = getProductImages()?.[1]?.url || "";
  const hoverImageAlt =
    getProductImages()?.[1]?.alt ||
    `${product?.brand?.name} | ${product?.name}`;

  const shadeVariants = product.variants?.find(
    (variant) => variant.display_type === "color"
  );
  const shadeVariantsCount = shadeVariants?.items?.length - 1 || 0;
  const currentShade = shadeVariants?.items?.find(
    (variant) => product?.slug === variant?.slug
  );
  const variants = shadeVariants?.items
    ?.filter((variant) => variant.slug !== currentShade?.slug)
    .slice(0, 3);

  const hasDiscount =
    getListingPrice("effective") !== getListingPrice("marked");

  const isFollwed = useMemo(() => {
    return !!followedIdList?.includes(product?.uid);
  }, [followedIdList, product]);

  // const getReviewRatingInfo = () => {
  //   const customMeta = product?._custom_meta || [];
  //   return getReviewRatingData(customMeta);
  // };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onWishlistClick({ product, isFollwed });
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onRemoveClick({ product, isFollwed });
  };

  const gridClass = useMemo(() => {
    if (isMobileStrict) {
      switch (columnCount?.mobile) {
        case 2:
          return styles["mob-grid-2-card"];

        case 1:
          return styles["mob-grid-1-card"];

        default:
          return "";
      }
    }
    if (isTablet) {
      switch (columnCount?.tablet) {
        case 2:
          return styles["tablet-grid-2-card"];

        case 3:
          return styles["tablet-grid-3-card"];

        default:
          return "";
      }
    }
    switch (columnCount?.desktop) {
      case 2:
        return styles["desktop-grid-2-card"];

      case 4:
        return styles["desktop-grid-4-card"];

      default:
        return "";
    }
  }, [columnCount, isMobileStrict, isTablet]);

  return (
    <div
      className={`${styles.productCard} ${
        !product.sellable ? styles.disableCursor : ""
      } ${styles[customClass[0]]} ${styles[customClass[1]]} ${
        styles[customClass[2]]
      } ${styles.animate} ${gridClass}`}
    >
      <div className={styles.imageContainer}>
        {!isMobile && showImageOnHover && hoverImageUrl && (
          <FyImage
            src={hoverImageUrl}
            alt={hoverImageAlt}
            aspectRatio={aspectRatio}
            isImageFill={isImageFill}
            backgroundColor={imageBackgroundColor}
            isFixedAspectRatio={true}
            customClass={`${styles.productImage} ${styles.hoverImage}`}
            sources={getImgSrcSet()}
            loading="lazy"
            fetchpriority="low"
          />
        )}
        <FyImage
          src={imageUrl}
          alt={imageAlt}
          aspectRatio={aspectRatio}
          isImageFill={isImageFill}
          backgroundColor={imageBackgroundColor}
          isFixedAspectRatio={true}
          customClass={`${styles.productImage} ${styles.mainImage}`}
          sources={getImgSrcSet()}
        />
        {isWishlistIcon && (
          <button
            className={`${styles.wishlistBtn} ${isFollwed ? styles.active : ""}`}
            onClick={handleWishlistClick}
            title="Wislist Icon"
          >
            <WishlistIconComponent isFollwed={isFollwed} />
          </button>
        )}
        {isRemoveIcon && (
          <button
            className={`${styles.wishlistBtn} ${isFollwed ? styles.active : ""}`}
            onClick={handleRemoveClick}
            title="Remove Icon"
          >
            <RemoveIconComponent />
          </button>
        )}
        {!product.sellable ? (
          <div className={`${styles.badge} ${styles.outOfStock}`}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              Out of stock
            </span>
          </div>
        ) : product.teaser_tag ? (
          <div className={styles.badge}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              {product?.teaser_tag?.substring(0, 14)}
            </span>
          </div>
        ) : isSaleBadge && product.discount && product.sellable ? (
          <div className={`${styles.badge} ${styles.sale}`}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              Sale
            </span>
          </div>
        ) : null}
        {/* {getReviewRatingInfo().avg_ratings && (
          <div className="review caption-semi-bold">
            <span>{getReviewRatingInfo().avg_ratings}</span>
            <SvgWrapper svgSrc={"star"} className="rating-icon" />
          </div>
        )} */}
        {/* <div className="extension">
          <fdk-extension
            templates={getTemplates("bottom_left_corner")}
            v-if={getTemplates("bottom_left_corner").length}
          />
        </div> */}
      </div>
      <div className={styles.productDesc}>
        {isBrand && product.brand && (
          <h3 className={styles.productBrand}>{product.brand.name}</h3>
        )}
        <h5
          className={`${styles.productName} ${styles.b2}`}
          title={product.name}
        >
          {product.name}
        </h5>
        {isPrice && (
          <div className={styles.productPrice}>
            {product?.price?.effective && (
              <span className={`${styles["productPrice--sale"]} ${styles.h4}`}>
                {getListingPrice("effective")}
              </span>
            )}
            {hasDiscount && (
              <span
                className={`${styles["productPrice--regular"]} ${styles.captionNormal}`}
              >
                {getListingPrice("marked")}
              </span>
            )}
            {product.discount && (
              <span
                className={`${styles["productPrice--discount"]} ${styles.captionNormal} `}
              >
                ({product.discount})
              </span>
            )}
          </div>
        )}
        {shadeVariantsCount !== 0 && (
          <div className={styles.productVariants}>
            <div className={`${styles.shade} ${styles.currentShade}`}>
              <div
                className={styles.shadeColor}
                style={{ backgroundColor: `#${currentShade?.color}` }}
              ></div>
              {currentShade.color_name && (
                <p className={styles.shadeName}>{currentShade.color_name}</p>
              )}
            </div>
            <div className={`${styles.shade} ${styles.allShades}`}>
              <div className={styles.variantContainer}>
                {variants &&
                  variants.map((variantItem) => (
                    <div
                      key={variantItem.uid}
                      className={styles.shadeColor}
                      style={{ backgroundColor: `#${variantItem?.color}` }}
                    ></div>
                  ))}
              </div>
              <div className={styles.shadeCount}>{shadeVariantsCount}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
