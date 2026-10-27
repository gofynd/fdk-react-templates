import React, { useMemo, useState, useEffect, useRef } from "react";
import * as styles from "./add-to-cart.less";
import ImageGallery from "../image-gallery/image-gallery";
import ProductVariants from "../product-variants/product-variants";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import FyButton from "../../../../components/core/fy-button/fy-button";
import DeliveryInfo from "../delivery-info/delivery-info";
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
import Skeleton from "../../../../components/core/skeletons/skeleton";
import FloatingViewCart from "../../../../components/b2b-mobile-size-selector/floating-view-cart";
import SizeScroller from "../../../../components/b2b-mobile-size-selector/size-scroller";

// The popup switches to its bottom-bar layout at the same width its image column is hidden.
const MOBILE_QUERY = "(max-width: 768px)";

const useMediaMatch = (query) => {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [query]);
  return matches;
};

// The theme's mobile bottom navigation marks the body with `data-mobile-footer` while it is on
// screen. It sits above the popup, so the popup lifts its own bottom bar clear of it.
const useBottomNavVisible = () => {
  const read = () =>
    typeof document !== "undefined" &&
    document.body.getAttribute("data-mobile-footer") === "true";
  const [visible, setVisible] = useState(read);
  useEffect(() => {
    setVisible(read());
    const observer = new MutationObserver(() => setVisible(read()));
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-mobile-footer"],
    });
    return () => observer.disconnect();
  }, []);
  return visible;
};

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
  cartUpdateHandler = () => { },
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
  isServiceable = true,
}) => {
  const [isCartLoading, setIsCartLoading] = useState(false);

  const extractSizeFromSellerIdentifier = (sellerIdentifier) => {
    if (!sellerIdentifier) return "";
    const parts = sellerIdentifier.split("-");
    return parts[parts.length - 1];
  };

  const isChildDetailsAvailable = useMemo(() => {
    const childDetails = productData.productPrice?._custom_json?.child_details;
    return Array.isArray(childDetails) && childDetails.length > 0;
  }, [productData.productPrice?._custom_json?.child_details]);

  const fpi = useFPI();
  const [foLoading, setFoLoading] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  const handleCheckout = async (event, isBuyNow) => {
    setIsLoadingCart(true);
    try {
      await addProductForCheckout(event, selectedSize, isBuyNow);
    } finally {
      setIsLoadingCart(false);
    }
  };
  const { language, countryCode } =
    useGlobalStore(fpi.getters.i18N_DETAILS) || {};
  const locale = language?.locale ? language?.locale : "en";
  const { t } = useGlobalTranslation("translation");
  const loggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const { merchant_data, app_features: customAppFeatures } =
    useGlobalStore(fpi?.getters?.CUSTOM_VALUE) || {};
  const { app_features: configAppFeatures } =
    useGlobalStore(fpi?.getters?.CONFIGURATION) || {};
  // When self pickup is enabled, the fulfillment option is chosen on the cart page, so the
  // fulfillment selector is hidden here. Read the flag from either app_features source; when it's
  // not available the value is falsy and the selector renders exactly as before (no breaking change).
  const isSelfPickupEnabled =
    customAppFeatures?.self_pickup === true ||
    configAppFeatures?.self_pickup === true;

  const keyName = "kyc_status";
  const isKycKeyPresent = merchant_data?.[keyName] !== undefined;
  const isMerchantKycApproved = () => {
    return merchant_data?.[keyName] === "approved";
  };

  // useEffect(() => {
  // onSizeSelection(selectedSize);
  // }, [selectedSize, productData?.product?.slug]);

  const cartQuantity = useMemo(() => {
    return productData?.selectedQuantity ?? 0;
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
  const isMobileViewport = useMediaMatch(MOBILE_QUERY);
  const isBottomNavVisible = useBottomNavVisible();
  const cartStore = useGlobalStore(fpi.getters.CART);
  // Cart summary for the floating "View cart" pill (same source as the theme's global pill).
  const cartLines = useMemo(
    () =>
      (cartStore?.cart_items?.items || []).filter(
        (item) => (item?.quantity || 0) > 0
      ),
    [cartStore?.cart_items?.items]
  );
  const cartItemCount =
    cartStore?.cart_items?.user_cart_items_count || cartLines.length;
  const cartImages = useMemo(
    () =>
      cartLines
        .map((item) => item?.product?.images?.[0]?.url)
        .filter(Boolean)
        .filter((url, index, urls) => urls.indexOf(url) === index),
    [cartLines]
  );

  const [quantity, setQuantity] = useState(productData?.selectedQuantity ?? 0);
  const prevSelectedSizeRef = useRef(selectedSize);
  const sizeJustChanged = prevSelectedSizeRef.current !== selectedSize;
  if (sizeJustChanged) {
    prevSelectedSizeRef.current = selectedSize;
  }
  const displayCount = sizeJustChanged
    ? 0
    : (typeof productData?.selectedQuantity === "number"
      ? productData.selectedQuantity
      : quantity);
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
    is_limited_stock,
    limited_stock_label = t("resource.common.limited_stock_label"),
    limited_stock_quantity = 11,
  } = globalConfig;

  const { media, name, short_description, variants, sizes, brand } = product;

  const isMto = product?.custom_order?.is_custom_order || false;
  const { price_per_piece } = productPrice;

  const isSizeSelectionBlock = pageConfig?.size_selection_style === "block";
  const isSingleSize = !sizes?.multi_size || false;
  const isSizeCollapsed = globalConfig?.hide_single_size && isSingleSize;
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
        ? `${priceDataDefault?.[key]?.currency_symbol || ""} ${currencyFormat(priceDataDefault?.[key]?.min) || ""
        } - ${currencyFormat(priceDataDefault?.[key]?.max) || ""}`
        : currencyFormat(
          priceDataDefault?.[key]?.max,
          priceDataDefault?.[key]?.currency_symbol,
          formatLocale(locale, countryCode, true)
        ) || "";
    }
  };

  // ---------- Mobile size cards (same look as the PDP) ----------
  // Cards carry the quantity already in the cart for that size, and "Out of stock" for sizes
  // that cannot be picked. Prices are not listed per size here (only the picked size is priced).
  const mobileSizeCards = (sizes?.sizes || []).map((size) => {
    const isSizeOut = size?.quantity === 0 && !isMto;
    return {
      value: size?.value,
      display: size?.display,
      isSelected: selectedSize === size?.value,
      disabled: isSizeOut,
      statusLabel: isSizeOut
        ? t("resource.b2b.components.size_wrapper.out_of_stock")
        : "",
      quantity: cartLines
        .filter(
          (item) =>
            item?.product?.uid === product?.uid &&
            String(item?.article?.size) === String(size?.value)
        )
        .reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0),
    };
  });
  const showMobileSizeCards =
    isMobileViewport && (isChildDetailsAvailable || !isSizeCollapsed);

  // ---------- Mobile bottom bar ----------
  // On mobile the quantity controller moves into a sticky bottom bar: "Buy now" on the left (or
  // the price when Buy now is off) and the controller on the right. Without the quantity
  // controller (or with the cart disabled / product not sellable) the original buttons stay.
  const isBuyNowEnabled =
    !!showBuyNowButton && !!button_options?.includes("buynow");
  const isMobileLayout =
    isMobileViewport &&
    showQuantityController &&
    !disable_cart &&
    !!sizes?.sellable;
  const isPriceInBar = isMobileLayout && !isBuyNowEnabled && !!show_price;
  // The floating pill is only for pages without the bottom navigation (it has the cart icon).
  const showViewCartPill =
    isMobileLayout && !isBottomNavVisible && cartItemCount > 0;
  const hasSpecialPrice =
    !!productData?.product?.quotation?.is_applicable ||
    !!productData?.product?.contract?.is_applicable ||
    !!productData?.product?.pricing_tier?.is_applicable;
  const barEffectivePrice = hasSpecialPrice
    ? currencyFormat(
        productData?.product?.best_price?.price,
        productData?.productPrice?.price?.currency_symbol,
        formatLocale(locale, countryCode, true)
      )
    : getProductPrice("effective");
  const barMarkedPrice =
    !hasSpecialPrice && getProductPrice("marked") !== barEffectivePrice
      ? getProductPrice("marked")
      : "";
  // Keeps the bar clear of the bottom navigation, which is drawn above the popup.
  const bottomBarStyle =
    isMobileViewport && isBottomNavVisible
      ? { paddingBottom: "calc(12px + var(--mobile-nav-height, 56px))" }
      : undefined;

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
      setHasAddedToCart(false);
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

  // Sync local quantity when fulfillment option or parent selectedQuantity changes,
  // so switching FO shows correct qty (e.g. 0 for the FO that has no cart line).
  useEffect(() => {
    if (typeof productData?.selectedQuantity === "number") {
      setQuantity(productData.selectedQuantity);
    }
  }, [productData?.selectedQuantity, currentFO?.slug]);
  // Adds one step (first add creates the cart line). Shared by the counter's "+" and the
  // bar's "Add to cart" button so both go through the same pincode / quantity rules.
  const handleIncrement = (e, variant) => {
    if (!deliverInfoProps?.isCrossBorderOrder) {
      const pincode = deliverInfoProps?.pincode ?? "";
      const pincodeErr = deliverInfoProps?.pincodeErrorMessage ?? "";
      if (
        pageConfig?.mandatory_pincode &&
        (pincode.length !== 6 || pincodeErr.length)
      ) {
        console.log("[AddToCart][PincodeCheck]", `onIncrementClick blocked (${variant})`, { pincodeErrorMessage: pincodeErr, pincode, quantity, displayCount, cartQuantity, selectedSize });
        deliverInfoProps?.setPincodeErrorMessage?.(t("resource.product.enter_valid_location"));
        return;
      }
      if (
        !pageConfig?.mandatory_pincode &&
        ((pincode.length > 0 && pincode.length < 6) || pincodeErr.length)
      ) {
        console.log("[AddToCart][PincodeCheck]", `onIncrementClick blocked (${variant})`, { pincodeErrorMessage: pincodeErr, pincode, quantity, displayCount, cartQuantity, selectedSize });
        deliverInfoProps?.setPincodeErrorMessage?.(t("resource.product.enter_valid_location"));
        return;
      }
    }
    const newQty =
      displayCount +
      (incrementDecrementUnit || minCartQuantity || 1);
    console.log("[AddToCart][PincodeCheck]", `onIncrementClick allowed (${variant})`, { quantity, displayCount, cartQuantity, newQty, selectedSize });
    showWarningForInvalidInput(newQty);
    updateQuantity(newQty);
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
  };

  // One quantity controller for every place it is shown (inside the page body, or in the
  // mobile bottom bar), so the cart rules below exist exactly once.
  const renderQuantityControl = (variant, containerClassName = "") => (
    <B2BSizeQuantityControl
      key={selectedSize}
      minCartQuantity={minCartQuantity}
      maxCartQuantity={maxCartQuantity}
      isCartUpdating={isCartUpdating || isCartLoading}
      placeholder="Qty"
      deliveryErrorMessage={
        deliverInfoProps?.pincodeErrorMessage
      }
      pincodeErrorMessage={
        deliverInfoProps?.pincodeErrorMessage
      }
      pincode={deliverInfoProps?.pincode}
      count={displayCount}
      onDecrementClick={(e) => {
        if (deliverInfoProps?.pincodeErrorMessage && cartQuantity > 0) {
          console.log("[AddToCart][PincodeCheck]", `onDecrementClick blocked (${variant})`, { pincodeErrorMessage: deliverInfoProps?.pincodeErrorMessage, quantity, displayCount, cartQuantity, selectedSize });
          return;
        }
        const newQty =
          displayCount -
          (incrementDecrementUnit || minCartQuantity || 1);
        console.log("[AddToCart][PincodeCheck]", `onDecrementClick allowed (${variant})`, { quantity, displayCount, cartQuantity, newQty, selectedSize });
        showWarningForInvalidInput(newQty);
        updateQuantity(Math.max(0, newQty));
        if (cartQuantity > 0) {
          cartUpdateHandler(
            e,
            -incrementDecrementUnit,
            "update_item"
          );
        }
      }}
      serviceable={selectedSize && !isOutOfStock}
      onIncrementClick={(e) => handleIncrement(e, variant)}
      onQtyChange={(e, currentNum) => {
        if (!deliverInfoProps?.isCrossBorderOrder) {
          const pincode = deliverInfoProps?.pincode ?? "";
          const pincodeErr = deliverInfoProps?.pincodeErrorMessage ?? "";
          if (
            pageConfig?.mandatory_pincode &&
            (pincode.length !== 6 || pincodeErr.length)
          ) {
            console.log("[AddToCart][PincodeCheck]", `onQtyChange blocked (${variant})`, { pincodeErrorMessage: pincodeErr, pincode, quantity, displayCount, cartQuantity, selectedSize, currentNum });
            deliverInfoProps?.setPincodeErrorMessage?.(t("resource.product.enter_valid_location"));
            return;
          }
          if (
            !pageConfig?.mandatory_pincode &&
            ((pincode.length > 0 && pincode.length < 6) || pincodeErr.length)
          ) {
            console.log("[AddToCart][PincodeCheck]", `onQtyChange blocked (${variant})`, { pincodeErrorMessage: pincodeErr, pincode, quantity, displayCount, cartQuantity, selectedSize, currentNum });
            deliverInfoProps?.setPincodeErrorMessage?.(t("resource.product.enter_valid_location"));
            return;
          }
        }
        showWarningForInvalidInput(e.target.value);
        const clampedQuantity = Math.max(
          Math.min(currentNum, maxCartQuantity),
          minCartQuantity
        );
        console.log("[AddToCart][PincodeCheck]", `onQtyChange allowed (${variant})`, { quantity, displayCount, cartQuantity, clampedQuantity, currentNum, selectedSize });
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
      containerClassName={containerClassName}
    />
  );

  const renderLimitedStock = (className) =>
    is_limited_stock &&
    limited_stock_label &&
    productPrice?.quantity !== 0 &&
    productPrice?.quantity <= limited_stock_quantity && (
      <p className={className}>
        {(() => {
          const fallback = t("resource.common.limited_stock_label");
          let label;
          if (limited_stock_label?.startsWith("t:")) {
            const key = limited_stock_label.slice(2);
            const translated = t(key);
            label = translated === key ? fallback : translated;
          } else {
            label = limited_stock_label;
          }
          return label.replace(/\{\{qty\}\}/g, productPrice?.quantity);
        })()}
      </p>
    );

  const mobileTruncatedTitle = useMemo(() => {
    if (!name) return "";
    return name.length > 30 ? `${name.slice(0, 30)}...` : name;
  }, [name]);

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

            <div
              className={`${styles.productScrollContent} ${showViewCartPill ? styles.scrollWithViewCart : ""}`}
            >
            {/* ---------- Product Name ----------  */}
            {!hide_brand_name && (
              <div className={styles.product__brand}>{brand?.name}</div>
            )}
            <h1 className={styles.product__title}>{slug && name}</h1>

            {show_price && sizes?.sellable && (
              <>
                {productData?.isBestPriceLoading && selectedSize ? (
                  !isPriceInBar && (
                    <div className={styles.product__price}>
                      <div className={styles.priceShimmer}>
                        <div className={styles.shimmerLine} />
                      </div>
                    </div>
                  )
                ) : (
                  <>

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
                          <div className={styles.badge} data-testid="quoted-price-badge">
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
                    {show_price && sizes?.sellable && !isPriceInBar && (
                      <div className={styles.product__price}>
                        {productData?.product?.quotation?.is_applicable ||
                          productData?.product?.contract?.is_applicable ||
                          productData?.product?.pricing_tier?.is_applicable ? (
                          <h4 className={styles["product__price--effective"]}
                            data-testid="product-price"
                          >
                            {currencyFormat(
                              productData?.product?.best_price?.price,
                              productData?.productPrice?.price?.currency_symbol,
                              formatLocale(locale, countryCode, true)
                            )}
                          </h4>
                        ) : (
                          <>
                            <h4 className={styles["product__price--effective"]}>
                              {getProductPrice("effective")}
                            </h4>
                            {getProductPrice("effective") !==
                              getProductPrice("marked") && (
                                <span className={styles["product__price--marked"]}>
                                  {getProductPrice("marked")}
                                </span>
                              )}
                            {sizes?.discount && (
                              <span className={styles["product__price--discount"]}>
                                ({sizes?.discount})
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {/* ---------- Product Tax Label ---------- */}
            {pageConfig?.tax_label &&
              show_price &&
              sizes?.sellable &&
              !isPriceInBar && (
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

            {!isSelfPickupEnabled &&
              selectedSize &&
              !!fulfillmentOptions.length &&
              availableFOCount > 1 && (
                <div className={styles.fulfillmentWrapper}>
                  <div className={styles.foList}>
                    {foLoading
                      ? fulfillmentOptions.map((_, index) => (
                        <div key={`fo-skeleton-${index}`} className={styles.fulfillmentOption}>
                          <div style={{ width: "20px" }} className={styles.foIcon}>
                            <Skeleton height={18} width={18} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                            <Skeleton height={14} width={200} />
                            <Skeleton height={12} width={120} />
                          </div>
                        </div>
                      ))
                      : fulfillmentOptions.map((foItem, index) => (
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

            {/* ---------- Size selection on mobile: PDP-style cards ---------- */}
            {showMobileSizeCards && (
              <div className={styles.mobileSizeSection}>
                <div className={styles.mobileSizeHeader}>
                  <p className={styles.mobileSizeTitle}>
                    {t("resource.b2b.components.size_wrapper.select_size")}
                  </p>
                  {pageConfig?.show_size_guide && sizes?.sellable && (
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
                <SizeScroller
                  sizes={mobileSizeCards}
                  onSelect={(size) => {
                    if (size.value !== selectedSize) onSizeSelection(size.value);
                  }}
                />
              </div>
            )}

            {/* ---------- Size Container ---------- */}
            {isSizeSelectionBlock && (
              <div className={styles.sizeSelection}>
                {(isChildDetailsAvailable || !isSizeCollapsed) && !isMobileViewport && (
                  <div className={styles.sizeHeaderContainer}>
                    <p
                      className={`${styles.b2} ${styles.sizeSelection__label}`}
                    >
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
                )}

                {(isChildDetailsAvailable || !isSizeCollapsed) && !isMobileViewport && (
                  <div className={styles.sizeSelection__wrapper}>
                    {sizes?.sizes?.map((size) => (
                      <button
                        type="button"
                        key={`${size?.display}`}
                        className={`${styles.b2} ${styles.sizeSelection__block} ${size.quantity === 0 &&
                          !isMto &&
                          styles["sizeSelection__block--disable"]
                          } ${(size?.quantity !== 0 || isMto) &&
                          styles["sizeSelection__block--selectable"]
                          } ${selectedSize === size?.value &&
                          styles["sizeSelection__block--selected"]
                          } `}
                        title={size?.value}
                         onClick={() => { if (size?.value !== selectedSize) onSizeSelection(size?.value); }}
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
                )}
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
                {showQuantityController && !isMobileLayout && (
                  <div className={styles.quantityControl}>
                    {renderQuantityControl("size-block")}
                  </div>
                )}
              </div>
            )}
            {/* ---------- Size Dropdown And Action Buttons ---------- */}
            {!isSizeSelectionBlock &&
              !(isMobileViewport && !(showQuantityController && !isMobileLayout)) && (
              <div
                className={`${styles.sizeCartContainer} ${showQuantityController && !isMobileLayout ? styles.withQuantityWrapper : ""}`}
              >
                {(isChildDetailsAvailable || !isSizeCollapsed) && !isMobileViewport && (
                  <FyDropdown
                    options={sizes?.sizes || []}
                    value={selectedSize}
                    onChange={(value) => { if (value !== selectedSize) onSizeSelection(value); }}
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
                )}
                {showQuantityController && !isMobileLayout && (
                  <div>
                    {renderQuantityControl("dropdown")}
                  </div>
                )}
                {(isChildDetailsAvailable || !isSizeCollapsed) &&
                  !isMobileViewport &&
                  pageConfig?.show_size_guide &&
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
            {sizes?.sellable &&
              (selectedSize ||
                (isMobileViewport && pageConfig?.mandatory_pincode)) && (
              // <DeliveryInfo {...deliverInfoProps} />
              <DeliveryInfo {...deliverInfoProps} setFoLoading={setFoLoading} mandatoryPincode={pageConfig?.mandatory_pincode} />
            )}

            {isMobileLayout && renderLimitedStock(styles.limitedQuantityInline)}

            <div className={styles.viewMore}>
              <span onClick={handleViewMore}>
                {t("resource.product.view_full_details")}
              </span>
            </div>
            </div>
          </div>
          {/* ---------- Mobile bottom bar: Buy now / price + quantity controller ---------- */}
          {isMobileLayout && (
            <div className={styles.mobileBottomBar} style={bottomBarStyle}>
              {showViewCartPill && (
                <div className={styles.viewCartSlot}>
                  <FloatingViewCart
                    images={cartImages}
                    itemCount={cartItemCount}
                    label={t("resource.b2b.components.size_wrapper.view_cart")}
                    itemsLabel={`${cartItemCount} ${t(
                      cartItemCount === 1
                        ? "resource.b2b.components.size_wrapper.item"
                        : "resource.b2b.components.size_wrapper.items"
                    )}`}
                    // Placed by the slot above the bar, not fixed to the screen.
                    style={{
                      position: "static",
                      transform: "none",
                      pointerEvents: "auto",
                    }}
                    onClick={() => {
                      handleClose();
                      navigate("/cart/bag");
                    }}
                  />
                </div>
              )}
              <div
                className={`${styles.mobileBarLeft} ${isBuyNowEnabled ? styles.mobileBarLeftButton : ""}`}
              >
                {isBuyNowEnabled && (
                  <FyButton
                    className={styles.mobileBuyNow}
                    variant="outlined"
                    size="medium"
                    onClick={(event) =>
                      addProductForCheckout(
                        event,
                        selectedSize,
                        true,
                        setIsCartLoading,
                        displayCount
                      )
                    }
                    disabled={isLoadingCart || !isServiceable}
                  >
                    {t("resource.common.buy_now_caps")}
                  </FyButton>
                )}
                {isPriceInBar &&
                  (productData?.isBestPriceLoading && selectedSize ? (
                    <div className={styles.priceShimmer}>
                      <div className={styles.shimmerLine} />
                    </div>
                  ) : (
                    <div className={styles.barPrice}>
                      <div className={styles.barPriceRow}>
                        <span className={styles.barPriceEffective}>
                          {barEffectivePrice}
                        </span>
                        {barMarkedPrice && (
                          <span className={styles.barPriceMarked}>
                            {barMarkedPrice}
                          </span>
                        )}
                        {!hasSpecialPrice && sizes?.discount && (
                          <span className={styles.barPriceDiscount}>
                            ({sizes?.discount})
                          </span>
                        )}
                      </div>
                      {pageConfig?.tax_label && (
                        <span className={styles.barTaxLabel}>
                          ({pageConfig?.tax_label})
                        </span>
                      )}
                    </div>
                  ))}
              </div>
              <div className={styles.mobileBarRight}>
                {displayCount > 0 ? (
                  <div className={styles.qtyWrap}>
                    {renderQuantityControl("bar", styles.barQtyContainer)}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className={styles.mobileAddToCart}
                      disabled={
                        !selectedSize ||
                        isOutOfStock ||
                        isCartUpdating ||
                        isCartLoading
                      }
                      onClick={(e) => handleIncrement(e, "bar")}
                    >
                      {isOutOfStock && selectedSize
                        ? t("resource.b2b.components.size_wrapper.out_of_stock")
                        : t("resource.b2b.components.size_wrapper.add_to_cart")}
                    </button>
                    {quantityError.hasError && !isOutOfStock && (
                      <p className={styles.barError}>{quantityError.message}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          {/* ---------- Buy Now and Add To Cart ---------- */}
          {!isMobileLayout && (
          <div className={styles.actionButtons} style={bottomBarStyle}>
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
                        disabled={showQuantityController && quantity === 0 || !isServiceable}
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
                  disabled={displayCount === 0}
                  startIcon={
                    <CartIcon
                      className={`${styles.cartIcon} ${showBuyNowButton ? styles.fillSecondary : ""
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
                        showQuantityController ? displayCount : 0
                      )
                    }
                    startIcon={<BuyNowIcon className={styles.cartIcon} />}
                    disabled={isLoadingCart || !isServiceable}
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
          )}
          {!isMobileLayout && renderLimitedStock(styles.limitedQuantity)}
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
