import React, { useState, useEffect } from "react";
import { detectMobileWidth, currencyFormat } from "../../helper/utils";
import FyImage from "../core/fy-image/fy-image";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import * as styles from "./product-card.less";

const ProductCard = ({
  product,
  isWishListPage,
  customClass = [],
  listingPrice = "range",
  isHdimgUsed = false,
  aspectRatio = 0.8,
  isBrandDisplayed = true,
  isPriceDisplayed = true,
  isSaleBadgeDisplayed = true,
  isWishlistDisplayed = true,
  onWishlistClick = () => {},
}) => {
  const [isMobile, setIsMobile] = useState(true);

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
        { breakpoint: { min: 1024 }, width: 1100 },
        { breakpoint: { min: 768 }, width: 800 },
        { breakpoint: { min: 481 }, width: 700 },
        { breakpoint: { max: 390 }, width: 700 },
        { breakpoint: { max: 480 }, width: 900 },
      ];
    }
    return [
      { breakpoint: { min: 1024 }, width: 550 },
      { breakpoint: { min: 768 }, width: 460 },
      { breakpoint: { min: 481 }, width: 350 },
      { breakpoint: { max: 390 }, width: 380 },
      { breakpoint: { max: 480 }, width: 460 },
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
  const shadeVariantsCount = shadeVariants?.total - 1 || 0;
  const currentShade = shadeVariants?.items?.find(
    (variant) => product?.slug === variant?.slug
  );
  const variants = shadeVariants?.items
    ?.filter((variant) => variant.slug !== currentShade?.slug)
    .slice(0, 2);

  const hasDiscount =
    getListingPrice("effective") !== getListingPrice("marked");

  // const getReviewRatingInfo = () => {
  //   const customMeta = product?._custom_meta || [];
  //   return getReviewRatingData(customMeta);
  // };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onWishlistClick(product);
  };

  return (
    <div
      className={`${styles.productCard} ${
        !product.sellable ? styles.disableCursor : ""
      } ${styles[customClass[0]]} ${styles[customClass[1]]} ${
        styles[customClass[2]]
      }`}
    >
      <div className={styles.imageContainer}>
        {!isMobile && hoverImageUrl && (
          <FyImage
            src={hoverImageUrl}
            alt={hoverImageAlt}
            aspectRatio={aspectRatio}
            isImageFill={true}
            isFixedAspectRatio={true}
            customClass={`${styles.productImage} ${styles.hoverImage}`}
            sources={getImgSrcSet()}
          />
        )}
        <FyImage
          src={imageUrl}
          alt={imageAlt}
          aspectRatio={aspectRatio}
          isImageFill={true}
          isFixedAspectRatio={true}
          customClass={`${styles.productImage} ${styles.mainImage}`}
          sources={getImgSrcSet()}
        />
        {isWishlistDisplayed && (
          <button
            className={`${styles.wishlistBtn} ${product.follow ? styles.active : ""}`}
            onClick={handleWishlistClick}
          >
            <SvgWrapper svgSrc="wishlist-plp" />
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
        ) : isSaleBadgeDisplayed && product.discount && product.sellable ? (
          <div className={`${styles.badge} ${styles.sale}`}>
            <span className={`${styles.text} ${styles.captionNormal}`}>
              Sale
            </span>
          </div>
        ) : null}
        {/* {getReviewRatingInfo().avg_ratings && (
          <div className="review caption-semi-bold font-body">
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
        {isBrandDisplayed && product.brand && (
          <h5 className={styles.productBrand}>{product.brand.name}</h5>
        )}
        <h3
          className={`${styles.productName} ${styles.b2}`}
          title={product.name}
        >
          {product.name}
        </h3>
        {isPriceDisplayed && (
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
                style={{ backgroundColor: `#${currentShade.color}` }}
              ></div>
              <p
                className="shade-name font-body"
                v-if={currentShade.color_name}
              >
                {currentShade.color_name}
              </p>
            </div>
            <div className={`${styles.shade} ${styles.allShades}`}>
              <div className={styles.variantContainer}>
                {variants &&
                  variants.map((variantItem) => (
                    <div
                      key={variantItem.uid}
                      className={styles.shadeColor}
                      style={{ backgroundColor: `#${variantItem.color}` }}
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
