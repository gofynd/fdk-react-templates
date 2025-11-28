import React, { useMemo, useState, useEffect } from "react";
import * as styles from "./add-to-cart.less";
import ImageGallery from "../image-gallery/image-gallery";
import ProductVariants from "../product-variants/product-variants";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import FyButton from "../../../../components/core/fy-button/fy-button";
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
import BuyNowIcon from "../../../../assets/images/buy-now.svg";
import B2BSizeQuantityControl from "../../../../components/b2b-size-quantity-control/b2b-size-quantity-control";
import B2bMOQWrapper from "../../../../components/b2b-size-quantity-control/b2b-moq-wrapper";
import Tooltip from "../../../../components/tool-tip/tool-tip";
import B2bBestPriceWrapper from "../best-price/best-price";
import {
  useGlobalTranslation,
  useGlobalStore,
  useFPI,
  useNavigate,
} from "fdk-core/utils";

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
  minCartQuantity = 1,
  maxCartQuantity,
  incrementDecrementUnit,
  fulfillmentOptions = [],
  currentFO = {},
  setCurrentFO = () => {},
  availableFOCount,
  getDeliveryPromise,
  showQuantityController = false,
  showBuyNowButton = false,
  showMoq = false,
}) => {
  const [isCartLoading, setIsCartLoading] = useState(false);

  const extractSizeFromSellerIdentifier = (sellerIdentifier) => {
    if (!sellerIdentifier) return "";
    const parts = sellerIdentifier.split("-");
    return parts[parts.length - 1];
  };

  const fpi = useFPI();
  const { language, countryCode } =
    useGlobalStore(fpi.getters.i18N_DETAILS) || {};
  const locale = language?.locale ? language?.locale : "en";
  const { t } = useGlobalTranslation("translation");
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

  // Function to get marked price based on pricing type (quotation, contract, ladder, pricing_tier)
  const getMarkedPrice = () => {
    const currentQuantity = productData?.selectedQuantity || quantity || 0;
    const quotation = product?.quotation;
    const contract = product?.contract;
    const ladder = product?.ladder;
    const pricingTier = product?.pricing_tier;
    const bestPrice = product?.best_price;

    // Check for pricing_tier - show best_price.price
    if (pricingTier?.is_applicable && bestPrice?.price) {
      return currencyFormat(
        bestPrice.price,
        bestPrice?.currency_symbol ||
          productPrice?.price?.currency_symbol ||
          "",
        formatLocale(locale, countryCode, true)
      );
    }

    // Check for quotation
    if (quotation?.is_applicable) {
      const remainingCount = quotation.total_count - quotation.used_count;
      if (
        currentQuantity > 0 &&
        currentQuantity <= remainingCount &&
        bestPrice?.price
      ) {
        return currencyFormat(
          bestPrice.price,
          bestPrice?.currency_symbol ||
            productPrice?.price?.currency_symbol ||
            "",
          formatLocale(locale, countryCode, true)
        );
      }
    }

    // Check for contract
    if (contract?.is_applicable) {
      const remainingCount = contract.total_count - contract.used_count;
      if (
        currentQuantity > 0 &&
        currentQuantity <= remainingCount &&
        bestPrice?.price
      ) {
        return currencyFormat(
          bestPrice.price,
          bestPrice?.currency_symbol ||
            productPrice?.price?.currency_symbol ||
            "",
          formatLocale(locale, countryCode, true)
        );
      }
    }

    // Check for ladder - find matching slab based on quantity
    if (ladder?.is_applicable && ladder?.price_slabs?.length > 0) {
      const activeSlabs = ladder.price_slabs.filter(
        (slab) => slab.is_active && slab.status === "success"
      );

      if (activeSlabs.length > 0) {
        // Sort slabs by min_qty to find the matching one
        const sortedSlabs = [...activeSlabs].sort(
          (a, b) => (a.min_qty || 0) - (b.min_qty || 0)
        );

        // Find the slab that matches the current quantity
        let matchingSlab = null;
        for (let i = sortedSlabs.length - 1; i >= 0; i--) {
          const slab = sortedSlabs[i];
          const minQty = slab.min_qty || 0;
          const maxQty =
            slab.max_qty !== null && slab.max_qty !== undefined
              ? slab.max_qty
              : Infinity;

          if (currentQuantity >= minQty && currentQuantity <= maxQty) {
            matchingSlab = slab;
            break;
          }
        }

        // If no exact match, use the highest applicable slab (where quantity >= min_qty)
        if (!matchingSlab) {
          for (let i = sortedSlabs.length - 1; i >= 0; i--) {
            const slab = sortedSlabs[i];
            if (currentQuantity >= (slab.min_qty || 0)) {
              matchingSlab = slab;
              break;
            }
          }
        }

        if (matchingSlab?.offer_price) {
          return currencyFormat(
            matchingSlab.offer_price,
            productPrice?.price?.currency_symbol || "",
            formatLocale(locale, countryCode, true)
          );
        }
      }
    }

    // Default: return regular marked price
    return getProductPrice("effective");
  };

  console.log(
    getMarkedPrice(),
    "getMarkedPrice",
    getProductPrice("effective") !== getMarkedPrice(),
    getMarkedPrice("effective")
  );

  const isSizeGuideAvailable = () => {
    const sizeChartHeader = sizes?.size_chart?.headers || {};
    return Object.keys(sizeChartHeader).length > 0 || sizes?.size_chart?.image;
  };

  const getFirstAvailableSize = (sizes) => {
    if (!sizes?.sizes?.length) return null;
    const availableSize = sizes?.sizes?.find((size) => size?.is_available);
    return availableSize || sizes?.sizes?.[0];
  };

  useEffect(() => {
    if (isSizeCollapsed || (preSelectFirstOfMany && sizes !== undefined)) {
      const firstAvailableSize = getFirstAvailableSize(sizes);

      if (firstAvailableSize) {
        const preselectedSizeValue = firstAvailableSize?.value;
        onSizeSelection(preselectedSizeValue);
      } else {
        const preselectedSizeValue = sizes?.sizes?.[0]?.value;
        onSizeSelection(preselectedSizeValue);
      }
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
            {!hide_brand_name && (
              <div className={styles.product__brand}>{brand?.name}</div>
            )}
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
                    {t("resource.b2b.components.add_to_cart.contract_applied")}{" "}
                    -{" "}
                    {productData?.product?.contract?.used_count === 0 ? (
                      <>
                        {productData?.product?.contract?.total_count}{" "}
                        {t("resource.b2b.components.add_to_cart.qty_available")}
                      </>
                    ) : (
                      <>
                        {productData?.product?.contract?.total_count -
                          productData?.product?.contract?.used_count}
                        /{productData?.product?.contract?.total_count}
                        {t("resource.b2b.components.add_to_cart.qty_available")}
                      </>
                    )}
                  </>
                }
              >
                <div className={styles.badge_section}>
                  <div className={styles.badge}>
                    <span>
                      {t("resource.b2b.components.add_to_cart.contract_price")}
                    </span>
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
                    {t("resource.b2b.components.add_to_cart.quote_applied")} -{" "}
                    {productData?.product?.quotation?.used_count === 0 ? (
                      <>
                        {productData?.product?.quotation?.total_count}{" "}
                        {t("resource.b2b.components.add_to_cart.qty_available")}
                      </>
                    ) : (
                      <>
                        {productData?.product?.quotation?.total_count -
                          productData?.product?.quotation?.used_count}
                        /{productData?.product?.quotation?.total_count}
                        {t("resource.b2b.components.add_to_cart.qty_available")}
                      </>
                    )}
                  </>
                }
              >
                <div className={styles.badge_section}>
                  <div className={styles.badge}>
                    <span>
                      {t("resource.b2b.components.add_to_cart.quoted_price")}
                    </span>
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
                  {getMarkedPrice()}
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
                      {t("resource.product.style")}:{" "}
                      {Boolean(selectedSize) &&
                        `${t("resource.common.size")} (${selectedSize})`}
                    </span>
                  </p>
                  {pageConfig?.show_size_guide &&
                    // isSizeGuideAvailable() &&
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
                {isSizeSelectionBlock &&
                  productData.productPrice?._custom_json?.child_details &&
                  selectedSize && (
                    <div className={styles.childDetailsContainer}>
                      {productData.productPrice._custom_json.child_details.map(
                        (child, index) => {
                          const childSize = extractSizeFromSellerIdentifier(
                            child.seller_identifier
                          );
                          return (
                            <div key={index} className={styles.childDetailBox}>
                              <span className={styles.childSize}>
                                {childSize}
                              </span>
                              <span className={styles.childSeparator}>-</span>
                              <span className={styles.childQuantity}>
                                {child.required_quantity} Pcs
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                {showQuantityController && (
                  <div className={styles.quantityControl}>
                    <B2BSizeQuantityControl
                      minCartQuantity={minCartQuantity}
                      maxCartQuantity={maxCartQuantity}
                      isCartUpdating={isCartUpdating || isCartLoading}
                      deliveryErrorMessage={
                        deliverInfoProps?.pincodeErrorMessage
                      }
                      pincode={deliverInfoProps?.pincode}
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
                {showQuantityController && (
                  <div>
                    <B2BSizeQuantityControl
                      minCartQuantity={minCartQuantity}
                      maxCartQuantity={maxCartQuantity}
                      isCartUpdating={isCartUpdating || isCartLoading}
                      placeholder="Qty"
                      pincodeErrorMessage={
                        deliverInfoProps?.pincodeErrorMessage
                      }
                      pincode={deliverInfoProps?.pincode}
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
                  // isSizeGuideAvailable() &&
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
            {!isSizeSelectionBlock &&
              productData.productPrice?._custom_json?.child_details &&
              selectedSize && (
                <div className={styles.childDetailsContainer}>
                  {productData.productPrice._custom_json.child_details.map(
                    (child, index) => {
                      const childSize = extractSizeFromSellerIdentifier(
                        child.seller_identifier
                      );
                      return (
                        <div key={index} className={styles.childDetailBox}>
                          <span className={styles.childSize}>{childSize}</span>
                          <span className={styles.childSeparator}>-</span>
                          <span className={styles.childQuantity}>
                            {child.required_quantity} Pcs
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            {sizeError && (
              <div className={styles.sizeError}>
                {t("resource.product.please_select_size")}
              </div>
            )}
            {sizes?.sellable && selectedSize && (
              <DeliveryInfo {...deliverInfoProps} />
            )}

            {selectedSize &&
              !!fulfillmentOptions.length &&
              availableFOCount > 1 && (
                <div className={styles.fulfillmentWrapper}>
                  <div className={styles.foList}>
                    {fulfillmentOptions.map((foItem, index) => (
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

            <div className={styles.viewMore}>
              <span onClick={handleViewMore}>
                {t("resource.product.view_full_details")}
              </span>
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
                        {t("resource.cart.add_to_cart_caps")}
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
                  disabled={productData?.selectedQuantity === 0}
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
                  {t("resource.b2b.components.size_wrapper.go_to_cart")}
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
