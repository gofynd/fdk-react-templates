import React, { useMemo } from "react";
import * as styles from "./add-to-cart.less";
import ImageGallery from "../image-gallery/image-gallery";
import ProductVariants from "../product-variants/product-variants";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import FyButton from "../../../../components/core/fy-button/fy-button";
import DeliveryInfo from "../delivery-info/delivery-info";
import QuantityControl from "../../../../components/quantity-control/quantity-control";
import FyDropdown from "../../../../components/core/fy-dropdown/fy-dropdown";
import { currencyFormat, formatLocale, isEmptyOrNull } from "../../../../helper/utils";
import CartIcon from "../../../../assets/images/cart.svg";
import BuyNowIcon from "../../../../assets/images/buy-now.svg";
import { useGlobalTranslation, useGlobalStore, useFPI } from "fdk-core/utils";

const AddToCart = ({
  productData = {},
  globalConfig = {},
  pageConfig = {},
  slug = "",
  selectedSize = "",
  deliverInfoProps = {},
  sizeError = false,
  handleSlugChange = (updatedSlug) => { },
  onSizeSelection = () => { },
  handleShowSizeGuide = () => { },
  addProductForCheckout = () => { },
  handleViewMore = () => { },
  handleClose = () => { },
  selectedItemDetails = {},
  isCartUpdating = false,
  isHyperlocal = false,
  cartUpdateHandler = () => { },
  minCartQuantity,
  maxCartQuantity,
  incrementDecrementUnit,
}) => {
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  const { t } = useGlobalTranslation("translation");
  const { product = {}, productPrice = {} } = productData;

  const { button_options, disable_cart, show_price, show_quantity_control } =
    globalConfig;

  const { media, name, short_description, variants, sizes, brand } = product;

  const isMto = product?.custom_order?.is_custom_order || false;
  const { price_per_piece } = productPrice;

  const isSizeSelectionBlock = pageConfig?.size_selection_style === "block";
  const isSingleSize = sizes?.sizes?.length === 1;
  const isSizeCollapsed = pageConfig?.hide_single_size && isSingleSize;
  const preSelectFirstOfMany = pageConfig?.preselect_size;

  const images = [
    {
      alt: "image",
      type: "image",
      url: "https://hdn-1.fynd.com/company/884/applications/000000000000000000000001/theme/pictures/free/original/theme-image-1623307821127.png",
    },
  ];

  const getProductPrice = (key) => {
    const priceDataDefault = sizes?.price;
    if (selectedSize && !isEmptyOrNull(productPrice?.price)) {
      if (productPrice?.set) {
        return currencyFormat(price_per_piece[key]) || "";
      }
      const price = productPrice?.price || "";
      return currencyFormat(
        price?.[key], 
        price?.currency_symbol, 
        formatLocale(locale, countryCode, true)) || "";
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

  // useEffect(() => {
  //   if (isSizeCollapsed || (preSelectFirstOfMany && sizes !== undefined)) {
  //     onSizeSelection(sizes?.sizes?.[0]?.value);
  //   }
  // }, [isSizeCollapsed, preSelectFirstOfMany, sizes?.sizes]);

  const disabledSizeOptions = useMemo(() => {
    return sizes?.sizes
      ?.filter((size) => size?.quantity === 0 && !isMto)
      ?.map((size) => size?.value);
  }, [sizes?.sizes]);

  return (
    <div className={styles.productDescContainer}>
      <div className={styles.left}>
        <div className={styles.imgWrap}>
          <ImageGallery
            key={slug}
            images={slug && media?.length ? media : images}
            product={product}
            globalConfig={globalConfig}
            hiddenDots={true}
            slideTabCentreNone={true}
            hideImagePreview={true}
          />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.productInfo}>
          <div className={styles.product}>
            <div className={styles.crossIcon} onClick={handleClose}>
              <SvgWrapper svgSrc="cross-black" />
            </div>

            {/* ---------- Product Name ----------  */}
            <div className={styles.product__brand}>{brand?.name}</div>
            <h1 className={styles.product__title}>{slug && name}</h1>
            {/* ---------- Product Price ---------- */}
            {show_price && sizes?.sellable && (
              <div className={styles.product__price}>
                <h4 className={styles["product__price--effective"]}>
                  {getProductPrice("effective")}
                </h4>
                {getProductPrice("effective") !== getProductPrice("marked") && (
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
            {pageConfig?.tax_label && show_price && sizes?.sellable && (
              <div className={styles.taxLabel}>({pageConfig?.tax_label})</div>
            )}

            {/* ---------- Short Description ----------  */}
            {short_description?.length > 0 && (
              <p
                className={`${styles.b2} ${styles.fontBody} ${styles.shortDescription}`}
              >
                {slug && short_description}
              </p>
            )}
            {/* ---------- Product Variants ----------  */}
            {slug && variants?.length > 0 && (
              <ProductVariants
                product={product}
                variants={variants}
                currentSlug={slug}
                globalConfig={globalConfig}
                preventRedirect
                setSlug={handleSlugChange}
              />
            )}
            {/* ---------- Size Container ---------- */}
            {isSizeSelectionBlock && !isSizeCollapsed && (
              <div className={styles.sizeSelection}>
                <div className={styles.sizeHeaderContainer}>
                  <p className={`${styles.b2} ${styles.sizeSelection__label}`}>
                    <span>
                      {t("resource.product.style")}: {Boolean(selectedSize) && `${t("resource.common.size")} (${selectedSize})`}
                    </span>
                  </p>
                  {pageConfig?.show_size_guide &&
                    isSizeGuideAvailable() &&
                    sizes?.sellable && (
                      <FyButton
                        variant="text"
                        onClick={handleShowSizeGuide}
                        className={styles["product__size--guide"]}
                        endIcon={
                          <SvgWrapper
                            svgSrc="scale"
                            className={styles.scaleIcon}
                          />
                        }
                      >
                        {t("resource.common.size_guide")}
                      </FyButton>
                    )}
                </div>

                <div className={styles.sizeSelection__wrapper}>
                  {sizes?.sizes?.map((size) => (
                    <button
                      type="button"
                      key={`${size?.display}`}
                      className={`${styles.b2} ${styles.sizeSelection__block} ${
                        size.quantity === 0 &&
                        !isMto &&
                        styles["sizeSelection__block--disable"]
                      } ${
                        (size?.quantity !== 0 || isMto) &&
                        styles["sizeSelection__block--selectable"]
                      } ${
                        selectedSize === size?.value &&
                        styles["sizeSelection__block--selected"]
                      } `}
                      title={size?.value}
                      onClick={() => onSizeSelection(size?.value)}
                    >
                      {size?.display}
                      {size?.quantity === 0 && !isMto && (
                        <svg>
                          <line x1="0" y1="100%" x2="100%" y2="0" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* ---------- Size Dropdown And Action Buttons ---------- */}
            {!isSizeSelectionBlock && !isSizeCollapsed && (
              <div className={styles.sizeCartContainer}>
                <FyDropdown
                  options={sizes?.sizes || []}
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
                {pageConfig?.show_size_guide &&
                  isSizeGuideAvailable() &&
                  sizes?.sellable && (
                    <FyButton
                      variant="text"
                      onClick={handleShowSizeGuide}
                      className={styles["product__size--guide"]}
                      endIcon={
                        <SvgWrapper
                          svgSrc="scale"
                          className={styles.scaleIcon}
                        />
                      }
                    >
                      {t("resource.common.size_guide")}
                    </FyButton>
                  )}
              </div>
            )}
            {sizeError && (
              <div className={styles.sizeError}>
                {t("resource.product.please_select_size")}
              </div>
            )}
            {!isHyperlocal && sizes?.sellable && selectedSize && (
              <DeliveryInfo {...deliverInfoProps} />
            )}

            <div className={styles.viewMore}>
              <span onClick={handleViewMore}>{t("resource.product.view_full_details")}</span>
            </div>
          </div>
          {/* ---------- Buy Now and Add To Cart ---------- */}
          <div className={styles.actionButtons}>
            {!disable_cart && sizes?.sellable && (
              <>
                {button_options?.includes("addtocart") && (
                  <>
                    {selectedItemDetails?.quantity && show_quantity_control ? (
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
                        variant="outlined"
                        size="medium"
                        onClick={(event) =>
                          addProductForCheckout(event, selectedSize, false)
                        }
                        startIcon={<CartIcon className={styles.cartIcon} />}
                      >
                        {t("resource.cart.add_to_cart_caps")}
                      </FyButton>
                    )}
                  </>
                )}
                {button_options?.includes("buynow") && (
                  <FyButton
                    className={styles.buyNow}
                    variant="contained"
                    size="medium"
                    onClick={(event) =>
                      addProductForCheckout(event, selectedSize, true)
                    }
                    startIcon={<BuyNowIcon className={styles.cartIcon} />}
                  >
                    {t("resource.common.buy_now_caps")}
                  </FyButton>
                )}
              </>
            )}
            {!sizes?.sellable && (
              <FyButton variant="outlined" disabled size="medium">
                {t("resource.common.product_not_available")}
              </FyButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
