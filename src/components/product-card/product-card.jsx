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
 *
 * @returns {JSX.Element} The rendered product card component.
 *
 */

import React, { useMemo } from "react";
import { currencyFormat } from "../../helper/utils";
import { useMobile } from "../../helper/hooks";
import FyImage from "../core/fy-image/fy-image";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import * as styles from "./product-card.less";
import FyButton from "../core/fy-button/fy-button";

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
  imagePlaceholder = "",
  columnCount = { desktop: 4, tablet: 3, mobile: 1 },
  WishlistIconComponent = () => <SvgWrapper svgSrc="wishlist-plp" />,
  isRemoveIcon = false,
  RemoveIconComponent = () => <SvgWrapper svgSrc="item-close" />,
  followedIdList = [],
  onWishlistClick = () => {},
  handleAddToCart = () => {},
  onRemoveClick = () => {},
  centerAlign = false,
  showAddToCart = false,
}) => {
  const isMobile = useMobile();

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

  return (
    <div
      className={`${styles.productCard} ${
        !product.sellable ? styles.disableCursor : ""
      } ${styles[customClass[0]]} ${styles[customClass[1]]} ${
        styles[customClass[2]]
      } ${gridClass}`}
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
            defer={false}
          />
        )}
        <FyImage
          src={imageUrl || imagePlaceholder}
          alt={imageAlt}
          aspectRatio={aspectRatio}
          isImageFill={isImageFill}
          backgroundColor={imageBackgroundColor}
          isFixedAspectRatio={true}
          customClass={`${styles.productImage} ${styles.mainImage}`}
          sources={getImgSrcSet()}
          defer={false}
        />
        {isWishlistIcon && (
          <button
            className={`${styles.wishlistBtn} ${isFollowed ? styles.active : ""}`}
            onClick={handleWishlistClick}
            title="Wislist Icon"
          >
            <WishlistIconComponent isFollowed={isFollowed} />
          </button>
        )}
        {isRemoveIcon && (
          <button
            className={`${styles.wishlistBtn} ${isFollowed ? styles.active : ""}`}
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
      </div>
      <div className={styles.productDescContainer}>
        <div className={styles.productDesc}>
          <div>
            {isBrand && product.brand && (
              <h3 className={styles.productBrand}>{product.brand.name}</h3>
            )}
            <h5
              className={`${styles.productName} ${styles.b2} ${centerAlign ? styles.centerAlign : ""}`}
              title={product.name}
            >
              {product.name}
            </h5>
          </div>
          {isPrice && (
            <div
              className={`${styles.productPrice} ${centerAlign ? styles.center : ""}`}
            >
              {product?.price?.effective && (
                <span
                  className={`${styles["productPrice--sale"]} ${styles.h4}`}
                >
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
                {currentShade?.color_name && (
                  <p className={styles.shadeName}>{currentShade?.color_name}</p>
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

        {showAddToCart && (
          <FyButton
            variant="outlined"
            className={styles.addToCart}
            onClick={handleAddToCartClick}
          >
            ADD TO CART
          </FyButton>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
