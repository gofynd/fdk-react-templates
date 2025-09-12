import React, { useState, useEffect } from "react";
import * as styles from "./compare-product-card.less";
import { currencyFormat, formatLocale } from "../../helper/utils";
import Shimmer from "../shimmer/shimmer";

const CompareProductCard = ({
  productItem,
  addProduct = () => {},
  isLoading = false,
}) => {
  const locale = "en";
  const countryCode = "IN";

  const getScreenSize = () => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1200;
    if (width <= 768) return "mobile";
    if (width <= 1024) return "tablet";
    return "desktop";
  };

  const [screenSize, setScreenSize] = useState(getScreenSize());

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  };

  let productName = truncateText(productItem?.name, 78);
  console.log(productName, "productName", productName.length);
  const formatPrice = (value, symbol) => {
    const localeCode = formatLocale(locale, countryCode, true);
    return currencyFormat(value, symbol, localeCode);
  };

  const getFormattedPrice = (product, listingPrice = "range") => {
    if (!product?.price) return "";

    const priceDetails = product.price?.effective;
    if (!priceDetails) return "";

    const symbol = priceDetails.currency_symbol;

    switch (listingPrice) {
      case "min":
        return formatPrice(priceDetails.min, symbol);
      case "max":
        return formatPrice(priceDetails.max, symbol);
      case "range":
      default:
        return priceDetails.min !== priceDetails.max
          ? `${formatPrice(priceDetails.min, symbol)} - ${formatPrice(
              priceDetails.max,
              symbol
            )}`
          : formatPrice(priceDetails.min, symbol);
    }
  };

  const getMarkedPrice = (product) => {
    const priceDetails = product?.price?.marked;
    if (!priceDetails) return "";
    const symbol = priceDetails.currency_symbol;
    return formatPrice(priceDetails.min, symbol);
  };

  const price = getFormattedPrice(productItem);
  const actualPrice = getMarkedPrice(productItem);
  const isEmpty = !productItem;

  if (isLoading || isEmpty) {
    return (
      <div className={styles.shimmerWrapper}>
        <div className={styles.cardContainer}>
          <div className={styles.cardImageContainer}>
            <Shimmer className={styles.imageShimmer} />
          </div>
          <div className={styles.cardDetailWrapper}>
            <Shimmer className={`${styles.lineShimmer} ${styles.firstLine}`} />
            <Shimmer className={`${styles.lineShimmer} ${styles.secondLine}`} />
            <Shimmer className={`${styles.lineShimmer} ${styles.thirdLine}`} />
            <Shimmer className={`${styles.buttonShimmer} ${styles.btnGap}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardImageContainer}>
        <img
          src={productItem?.media?.[0]?.url}
          alt={productItem?.media?.[0]?.alt}
        />
      </div>

      <div className={styles.cardDetailWrapper}>
        <div className={styles.cardDetailContainer}>
          <div className={styles.priceBtnSection}>
            <h5>{productName}</h5>
            <span className={styles.category}>{productItem?.brand?.name}</span>
            <div className={styles.priceInfo}>
              <h4>{price}</h4>
              <span className={styles.actualPrice}>{actualPrice}</span>
              <span className={styles.discount}>
                {productItem?.discount && (
                  <span className={styles.discount}>
                    ({productItem.discount})
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className={styles.actionsWrapper}>
            <button className={styles.addToCartBtnSection} onClick={addProduct}>
              ADD TO COMPARE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareProductCard;
