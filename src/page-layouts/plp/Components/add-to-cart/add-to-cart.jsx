import React, { useMemo, useState, useEffect } from "react";
import * as styles from "./add-to-cart.less";
import ImageGallery from "../image-gallery/image-gallery";
import ProductVariants from "../product-variants/product-variants";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import FyButton from "../../../../components/core/fy-button/fy-button";
import DeliveryInfo from "../delivery-info/delivery-info";
import QuantityControl from "../../../../components/quantity-control/quantity-control";
import FyDropdown from "../../../../components/core/fy-dropdown/fy-dropdown";
import { currencyFormat, isEmptyOrNull } from "../../../../helper/utils";
import CartIcon from "../../../../assets/images/cart.svg";
import BuyNowIcon from "../../../../assets/images/buy-now.svg";
import B2BSizeQuantityControl from "../../../../components/b2b-size-quantity-control/b2b-size-quantity-control";
import { useNavigate } from "react-router-dom";
import B2bMOQWrapper from "../../../../components/b2b-size-quantity-control/b2b-moq-wrapper";
import Tooltip from "../../../../components/tool-tip/tool-tip";
import B2bBestPriceWrapper from "../best-price/best-price";
import { useFPI, useGlobalStore } from "fdk-core/utils";

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
  isHyperlocal = false,
  cartUpdateHandler = () => {},
  minCartQuantity = 1,
  maxCartQuantity,
  incrementDecrementUnit,
  showQuantityController = false,
  showBuyNowButton = false,
  showMoq = false,
  isLoading = false,
}) => {
  const [isCartLoading, setIsCartLoading] = useState(false);

  const fpi = useFPI();
  const loggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const { merchant_data } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);

  const keyName = "kyc_status";
  const isKycKeyPresent = merchant_data?.[keyName] !== undefined;
  const isMerchantKycApproved = () => {
    return merchant_data?.[keyName] === "approved";
  };

  useEffect(() => {
    onSizeSelection(selectedSize);
  }, [selectedSize, productData?.product?.slug]);

  const cartQuantity = useMemo(() => {
    return productData?.selectedQuantity;
  }, [productData?.selectedQuantity]);

  const totalAvailableQuantity =
    productData?.productPrice?.total_available_quantity;

  const isOutOfStock = useMemo(() => {
    return (
      maxCartQuantity < minCartQuantity ||
      minCartQuantity === 0 ||
      totalAvailableQuantity === 0
    );
  }, [maxCartQuantity, minCartQuantity, totalAvailableQuantity]);

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(productData?.selectedQuantity || 0);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const [quantityError, setQuantityError] = useState(() => {
    if (isOutOfStock) {
      return { hasError: true, message: "Out of stock" };
    }
    return { hasError: false, message: "" };
  });

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
      return currencyFormat(price?.[key], price?.currency_symbol) || "";
    }
    if (selectedSize && priceDataDefault) {
      return (
        currencyFormat(
          priceDataDefault?.[key]?.min,
          priceDataDefault?.[key]?.currency_symbol
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
            priceDataDefault?.[key]?.currency_symbol
          ) || "";
    }
  };

  const isSizeGuideAvailable = () => {
    const sizeChartHeader = sizes?.size_chart?.headers || {};
    return Object.keys(sizeChartHeader).length > 0 || sizes?.size_chart?.image;
  };

  useEffect(() => {
    if (isSizeCollapsed || (preSelectFirstOfMany && sizes !== undefined)) {
      onSizeSelection(sizes?.sizes?.[0]?.value);
    }
  }, [isSizeCollapsed, preSelectFirstOfMany, sizes?.sizes]);

  const disabledSizeOptions = useMemo(() => {
    return sizes?.sizes
      ?.filter((size) => size?.quantity === 0 && !isMto)
      ?.map((size) => size?.value);
  }, [sizes?.sizes]);

  const validateQuantity = (qty) => {
    if (isOutOfStock) {
      return {
        hasError: true,
        message: "Out of stock",
      };
    }

    if (qty === 0) {
      return { hasError: false, message: "" };
    }

    if (qty < minCartQuantity) {
      return {
        hasError: true,
        message: `Minimum quantity is ${minCartQuantity}`,
      };
    }

    if (qty >= maxCartQuantity) {
      return {
        hasError: true,
        message: `Maximum quantity is ${maxCartQuantity}`,
      };
    }

    return { hasError: false, message: "" };
  };

  const updateQuantity = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleQuantityChange = (e, newQuantity) => {
    const error = validateQuantity(newQuantity);
    setQuantityError(error);
    setQuantity(newQuantity);
  };

  const showWarningForInvalidInput = (inputValue) => {
    setQuantityError({ hasError: false, message: "" });
    const error = validateQuantity(inputValue);
    setQuantityError(error);
  };

  useEffect(() => {
    if (selectedSize) {
      setQuantity(0);
      // Show out of stock error if product is out of stock
      if (isOutOfStock) {
        setQuantityError({ hasError: true, message: "Out of stock" });
      } else {
        setQuantityError({ hasError: false, message: "" });
      }
    }
  }, [selectedSize, isOutOfStock]);

  useEffect(() => {
    if (isOutOfStock) {
      setQuantityError({ hasError: true, message: "Out of stock" });
    } else if (selectedSize) {
      setQuantityError({ hasError: false, message: "" });
    }
  }, [isOutOfStock, selectedSize]);

  useEffect(() => {
    setHasAddedToCart(false);
  }, [slug]);

  useEffect(() => {
    if (!selectedSize) {
      setHasAddedToCart(false);
    }
  }, [selectedSize]);

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

            {productData?.product?.best_price?.is_applicable && (
              <B2bBestPriceWrapper
                loggedIn={loggedIn}
                isBestPriceLoading={productData?.isBestPriceLoading}
                bestPriceDetailsData={productData}
                globalConfig={globalConfig}
                isMerchantKycApproved={isMerchantKycApproved()}
              />
            )}

            {productData?.product?.contract?.is_applicable && (
              <Tooltip
                position="right"
                title={
                  <>
                    Contract applied -{" "}
                    {productData?.product?.contract?.used_count === 0 ? (
                      <>
                        {productData?.product?.contract?.total_count} qty
                        available
                      </>
                    ) : (
                      <>
                        {productData?.product?.contract?.total_count -
                          productData?.product?.contract?.used_count}
                        /{productData?.product?.contract?.total_count}
                        qty available
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

            {productData?.product?.quotation?.is_applicable && (
              <Tooltip
                position="right"
                title={
                  <>
                    Quote applied -{" "}
                    {productData?.product?.quotation?.used_count === 0 ? (
                      <>
                        {productData?.product?.quotation?.total_count} qty
                        available
                      </>
                    ) : (
                      <>
                        {productData?.product?.quotation?.total_count -
                          productData?.product?.quotation?.used_count}
                        /{productData?.product?.quotation?.total_count}
                        qty available
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

            {showMoq && productData?.product?.moq && (
              <B2bMOQWrapper productDetails={productData} />
            )}

            {/* ---------- Size Container ---------- */}
            {isSizeSelectionBlock && !isSizeCollapsed && (
              <div className={styles.sizeSelection}>
                <div className={styles.sizeHeaderContainer}>
                  <p className={`${styles.b2} ${styles.sizeSelection__label}`}>
                    <span>
                      Style: {Boolean(selectedSize) && `Size (${selectedSize})`}
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
                        SIZE GUIDE
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
                {showQuantityController && (
                  <div className={styles.quantityControl}>
                    <B2BSizeQuantityControl
                      minCartQuantity={minCartQuantity}
                      maxCartQuantity={maxCartQuantity}
                      isCartUpdating={isCartUpdating || isCartLoading}
                      placeholder="Qty"
                      count={productData?.selectedQuantity || quantity}
                      onDecrementClick={(e) => {
                        const newQty =
                          (productData?.selectedQuantity || quantity) -
                          (incrementDecrementUnit || minCartQuantity || 1);
                        showWarningForInvalidInput(newQty);
                        cartUpdateHandler(
                          e,
                          -incrementDecrementUnit,
                          "update_item"
                        );
                      }}
                      serviceable={selectedSize && !isOutOfStock}
                      onIncrementClick={(e) => {
                        const newQty =
                          (productData?.selectedQuantity || quantity) +
                          (incrementDecrementUnit || minCartQuantity || 1);
                        showWarningForInvalidInput(newQty);
                        if (cartQuantity === 0) {
                          addProductForCheckout(
                            e,
                            selectedSize,
                            false,
                            setIsCartLoading,
                            incrementDecrementUnit || minCartQuantity || 1
                          );
                        } else {
                          cartUpdateHandler(
                            e,
                            incrementDecrementUnit,
                            "update_item"
                          );
                        }
                      }}
                      onQtyChange={(e, currentNum) => {
                        showWarningForInvalidInput(e.target.value);
                        const clampedQuantity = Math.max(
                          Math.min(currentNum, maxCartQuantity),
                          minCartQuantity
                        );
                        updateQuantity(clampedQuantity);
                        if (cartQuantity === 0) {
                          addProductForCheckout(
                            e,
                            selectedSize,
                            false,
                            setIsCartLoading,
                            clampedQuantity
                          );
                        } else {
                          cartUpdateHandler(e, clampedQuantity, "edit_item");
                        }
                      }}
                      isSizeWrapperVisible={false}
                      sizeType="medium"
                      hasError={quantityError.hasError}
                      errorMessage={quantityError.message}
                      incrementDecrementUnit={incrementDecrementUnit}
                    />
                  </div>
                )}
              </div>
            )}
            {/* ---------- Size Dropdown And Action Buttons ---------- */}
            {!isSizeSelectionBlock && !isSizeCollapsed && (
              <div
                className={`${styles.sizeCartContainer} ${showQuantityController ? styles.withQuantityWrapper : ""}`}
              >
                <FyDropdown
                  options={sizes?.sizes || []}
                  value={selectedSize}
                  onChange={onSizeSelection}
                  placeholder="SELECT SIZE"
                  valuePrefix="Size :"
                  dataKey="value"
                  containerClassName={styles.dropdownContainer}
                  dropdownListClassName={styles.dropdown}
                  valueClassName={styles.sizeValue}
                  disabledOptions={disabledSizeOptions}
                  disabledOptionClassName={styles.disabledOption}
                  disableSearch={true}
                />
                {showQuantityController && (
                  <div>
                    <B2BSizeQuantityControl
                      minCartQuantity={minCartQuantity}
                      maxCartQuantity={maxCartQuantity}
                      isCartUpdating={isCartUpdating || isCartLoading}
                      placeholder="Qty"
                      count={productData?.selectedQuantity || quantity}
                      onDecrementClick={(e) => {
                        const newQty =
                          (productData?.selectedQuantity || quantity) -
                          (incrementDecrementUnit || minCartQuantity || 1);
                        showWarningForInvalidInput(newQty);
                        cartUpdateHandler(
                          e,
                          -incrementDecrementUnit,
                          "update_item"
                        );
                      }}
                      serviceable={selectedSize && !isOutOfStock}
                      onIncrementClick={(e) => {
                        const newQty =
                          (productData?.selectedQuantity || quantity) +
                          (incrementDecrementUnit || minCartQuantity || 1);
                        showWarningForInvalidInput(newQty);
                        if (cartQuantity === 0) {
                          addProductForCheckout(
                            e,
                            selectedSize,
                            false,
                            setIsCartLoading,
                            incrementDecrementUnit || minCartQuantity || 1
                          );
                        } else {
                          cartUpdateHandler(
                            e,
                            incrementDecrementUnit,
                            "update_item"
                          );
                        }
                      }}
                      onQtyChange={(e, currentNum) => {
                        showWarningForInvalidInput(e.target.value);
                        const clampedQuantity = Math.max(
                          Math.min(currentNum, maxCartQuantity),
                          minCartQuantity
                        );
                        updateQuantity(clampedQuantity);
                        if (cartQuantity === 0) {
                          addProductForCheckout(
                            e,
                            selectedSize,
                            false,
                            setIsCartLoading,
                            clampedQuantity
                          );
                        } else {
                          cartUpdateHandler(e, clampedQuantity, "edit_item");
                        }
                      }}
                      isSizeWrapperVisible={false}
                      sizeType="medium"
                      hasError={quantityError.hasError}
                      errorMessage={quantityError.message}
                      incrementDecrementUnit={incrementDecrementUnit}
                    />
                  </div>
                )}
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
                      SIZE GUIDE
                    </FyButton>
                  )}
              </div>
            )}
            {sizeError && (
              <div className={styles.sizeError}>
                Please select size to continue
              </div>
            )}
            {!isHyperlocal && sizes?.sellable && selectedSize && (
              <DeliveryInfo {...deliverInfoProps} />
            )}

            <div className={styles.viewMore}>
              <span onClick={handleViewMore}>View Full details</span>
            </div>
          </div>
          {/* ---------- Buy Now and Add To Cart ---------- */}
          <div className={styles.actionButtons}>
            {!disable_cart && sizes?.sellable && (
              <>
                {/* {button_options?.includes("addtocart") && (
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
                        variant={showViewCartButton ? "contained" : "outlined"}
                        size="medium"
                        onClick={(event) => {
                          setHasAddedToCart(true);
                          addProductForCheckout(
                            event,
                            selectedSize,
                            false,
                            showQuantityController ? quantity : 0
                          );
                          if (showQuantityController) {
                            setQuantity(0);
                            setQuantityError({ hasError: false, message: "" });
                          }
                        }}
                        disabled={showQuantityController && quantity === 0}
                        startIcon={
                          <CartIcon
                            className={`${styles.cartIcon} ${
                              showViewCartButton ? styles.fillSecondary : ""
                            }`}
                          />
                        }
                        className={
                          hasAddedToCart && showViewCartButton
                            ? styles.buttonSecondary
                            : styles.fullWidthButton
                        }
                      >
                        ADD TO CART
                      </FyButton>
                    )}
                  </>
                )} */}

                <FyButton
                  variant={showBuyNowButton ? "contained" : "outlined"}
                  size="medium"
                  onClick={() => {
                    handleClose();
                    navigate("/cart/bag");
                  }}
                  startIcon={
                    <CartIcon
                      className={`${styles.cartIcon} ${
                        showBuyNowButton ? styles.fillSecondary : ""
                      }`}
                    />
                  }
                  className={
                    !showBuyNowButton
                      ? styles.fullWidthButton
                      : styles.buttonSecondary
                  }
                >
                  VIEW CART
                </FyButton>

                {showBuyNowButton && button_options?.includes("buynow") && (
                  <FyButton
                    className={styles.buyNow}
                    variant="contained"
                    size="medium"
                    onClick={(event) =>
                      addProductForCheckout(
                        event,
                        selectedSize,
                        true,
                        setIsCartLoading,
                        showQuantityController
                          ? productData?.selectedQuantity
                          : 0
                      )
                    }
                    startIcon={<BuyNowIcon className={styles.cartIcon} />}
                  >
                    BUY NOW
                  </FyButton>
                )}
              </>
            )}
            {!sizes?.sellable && (
              <FyButton variant="outlined" disabled size="medium">
                PRODUCT NOT AVAILABLE
              </FyButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
