import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "../../styles/product-listing.less";
import InfiniteLoader from "../../components/core/infinite-loader/infinite-loader";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import ProductCard from "../../components/product-card/product-card";
import Sort from "../../page-layouts/plp/Components/sort/sort";
import FilterItem from "../../page-layouts/plp/Components/filter-item/filter-item";
import StickyColumn from "../../page-layouts/plp/Components/sticky-column/sticky-column";
import Pagination from "../../page-layouts/plp/Components/pagination/pagination";
import FilterTags from "../../page-layouts/plp/Components/filter-tags/filter-tags";
import ListingDescription from "../../components/listing-description/listing-description";
import SortModal from "../../components/sort-modal/sort-modal";
import FilterModal from "../../components/filter-modal/filter-modal";
import ScrollTop from "../../components/scroll-top/scroll-top";
import EmptyState from "../../components/empty-state/empty-state";
import FyImage from "../../components/core/fy-image/fy-image";
import { isRunningOnClient } from "../../helper/utils";
import Modal from "../../components/core/modal/modal";
import AddToCart from "../../page-layouts/plp/Components/add-to-cart/add-to-cart";
import { useViewport } from "../../helper/hooks";
import SizeGuide from "../../page-layouts/plp/Components/size-guide/size-guide";
import FilterIcon from "../../assets/images/filter.svg";
import TwoGridIcon from "../../assets/images/grid-two.svg";
import FourGridIcon from "../../assets/images/grid-four.svg";
import TwoGridMobIcon from "../../assets/images/grid-two-mob.svg";
import OneGridMobIcon from "../../assets/images/grid-one-mob.svg";
import {
  useGlobalTranslation,
  useGlobalStore,
  useFPI,
  useNavigate,
} from "fdk-core/utils";
import dummyProductImage from "../../assets/images/dummy-product.svg";

const DEMO_PRODUCTS = Array.from({ length: 20 }, (_, index) => ({
  uid: `demo-${index + 1}`,
  slug: `demo-product-${index + 1}`,
  name: "Linen blend relaxed fit",
  brand: { name: "COS" },
  teaser_tag: index % 3 === 0 ? "NEW" : "",
  discount: index % 4 === 0 ? "20% OFF" : "",
  sellable: true,
  media: [{ type: "image", url: dummyProductImage }],
  price: {
    effective: { min: 1290, max: 1290, currency_symbol: "₹" },
    marked: { min: 1590, max: 1590, currency_symbol: "₹" },
  },
}));

const COS_CATEGORY_LINKS = [
  { label: "CLOTHING", to: "/men/new-arrivals" },
  { label: "ALL MENSWEAR", to: "/men/view-all" },
  { label: "LINEN", to: "/men/linen-collection" },
  { label: "T-SHIRTS", to: "/men/t-shirts" },
  { label: "SHIRTS", to: "/men/shirts" },
  { label: "POLO SHIRTS", to: "/men/polo-shirts" },
  { label: "TROUSERS", to: "/men/trousers" },
  { label: "JEANS", to: "/men/jeans" },
  { label: "ACCESSORIES", to: "/men/new-accessories" },
];

const ProductListing = ({
  breadcrumb = [],
  isProductCountDisplayed = true,
  productCount = 0,
  title = "",
  description = "",
  isScrollTop = true,
  filterList = [],
  selectedFilters = [],
  sortList = [],
  sortModalProps = {},
  filterModalProps = {},
  addToCartModalProps = {},
  loadingOption = "pagination",
  paginationProps = {},
  isProductLoading = false,
  isPageLoading = false,
  productList = [],
  columnCount = { desktop: 4, tablet: 3, mobile: 1 },
  isProductOpenInNewTab = false,
  isBrand = true,
  isSaleBadge = true,
  isCustomBadge = true,
  isPrice = true,
  globalConfig = {},
  imgSrcSet,
  isImageFill = false,
  showImageOnHover = false,
  isResetFilterDisable = false,
  imageBackgroundColor = "",
  imagePlaceholder = "",
  aspectRatio,
  isWishlistIcon,
  WishlistIconComponent,
  followedIdList = [],
  listingPrice = "range",
  banner = {},
  showAddToCart = true,
  showColorVariants = true,
  actionButtonText,
  stickyFilterTopOffset = 0,
  filterToggle = false,
  onColumnCountUpdate = () => {},
  onResetFiltersClick = () => {},
  onFilterUpdate = () => {},
  onSortUpdate = () => {},
  onFilterModalBtnClick = () => {},
  onSortModalBtnClick = () => {},
  onWishlistClick = () => {},
  onViewMoreClick = () => {},
  onLoadMoreProducts = () => {},
  onProductNavigation = () => {},
  EmptyStateComponent,
}) => {
  const { t } = useGlobalTranslation("translation");
  const isTablet = useViewport(0, 768);
  const fpi = useFPI();
  const { is_serviceable } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE) || {};
  const [isFilterVisible, setIsFilterVisible] = useState(filterToggle);

  useEffect(() => {
    setIsFilterVisible(filterToggle);
  }, [filterToggle]);
  const {
    handleAddToCart,
    isOpen: isAddToCartOpen,
    showSizeGuide,
    handleCloseSizeGuide,
    ...restAddToModalProps
  } = addToCartModalProps;

  const addToCartModalTitle = isTablet
    ? restAddToModalProps?.productData?.product?.name?.length > 30
      ? `${restAddToModalProps?.productData?.product?.name?.slice(0, 30)}...`
      : restAddToModalProps?.productData?.product?.name || ""
    : "";
  const shouldShowDemoData =
    !isPageLoading && (!productList || productList.length === 0);
  const displayProductList = shouldShowDemoData ? DEMO_PRODUCTS : productList;
  const loadedProductCount = displayProductList?.length || 0;
  const modalServiceable =
    typeof restAddToModalProps?.is_serviceable === "boolean"
      ? restAddToModalProps.is_serviceable
      : is_serviceable;
  const totalProductCount = Number(productCount) || 0;
  const visibleProductCount = totalProductCount
    ? Math.min(loadedProductCount, totalProductCount)
    : loadedProductCount;
  const loadMoreProgress = totalProductCount
    ? Math.min(100, Math.max(0, (visibleProductCount / totalProductCount) * 100))
    : 0;
  const loadMoreLabel = totalProductCount
    ? `LOAD MORE PRODUCTS (${visibleProductCount}/${totalProductCount})`
    : "LOAD MORE PRODUCTS";
  const shouldShowPageLoader =
    isRunningOnClient() && isPageLoading && loadedProductCount === 0;

  return (
    <div className={styles.plpWrapper}>
      {shouldShowPageLoader ? (
        <div className={styles.loader}></div>
      ) : productList?.length === 0 && !(isPageLoading || isPageLoading) ? (
        <div>
          {EmptyStateComponent ? (
            EmptyStateComponent
          ) : (
            <EmptyState
              title={t("resource.common.sorry_we_couldnt_find_any_results")}
            />
          )}
        </div>
      ) : (
        <>
          {!title && (
            <h1 className={styles.visuallyHidden}>
              {t("resource.common.breadcrumb.products")}
            </h1>
          )}
          {title && <h1 className={styles.visuallyHidden}>{title}</h1>}
          <div className={styles.mobileHeader}>
            <div className={styles.headerLeft}>
              <button
                type="button"
                className={styles.filterSortBtn}
                onClick={
                  filterList.length > 0 ? onFilterModalBtnClick : onSortModalBtnClick
                }
                aria-label="Filter and sort products"
              >
                <FilterIcon aria-hidden="true" />
                <span>Filter & sort</span>
              </button>
            </div>
            <nav className={styles.quickCategoryNav} aria-label="Product categories">
              {COS_CATEGORY_LINKS.map((item, index) => (
                <FDKLink
                  key={item.label}
                  to={item.to}
                  className={`${styles.quickCategoryLink} ${
                    index === 0 ? styles.active : ""
                  }`}
                >
                  {item.label}
                </FDKLink>
              ))}
            </nav>
            <div className={styles.headerRight}>
              {/* COS Figma match: 4 grid toggle buttons that update the current viewport's column count.
                  On desktop (>=769px): updates desktop columns (1/2/4/10).
                  On tablet: updates tablet columns.
                  On mobile: updates mobile columns. */}
              <button
                className={`${styles.colIconBtn} ${styles.mobile} ${
                  (isTablet ? columnCount?.mobile === 1 : columnCount?.desktop === 1) ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate(
                    isTablet
                      ? { screen: "mobile", count: 1 }
                      : { screen: "desktop", count: 1 }
                  )
                }
                title={t("resource.product.mobile_grid_one")}
              >
                <OneGridMobIcon />
              </button>
              <button
                className={`${styles.colIconBtn} ${styles.mobile} ${
                  (isTablet ? columnCount?.mobile === 2 : columnCount?.desktop === 2) ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate(
                    isTablet
                      ? { screen: "mobile", count: 2 }
                      : { screen: "desktop", count: 2 }
                  )
                }
                title={t("resource.product.mobile_grid_two")}
              >
                <TwoGridMobIcon />
              </button>
              <button
                className={`${styles.colIconBtn} ${styles.tablet} ${
                  (isTablet ? columnCount?.tablet === 2 : columnCount?.desktop === 4) ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate(
                    isTablet
                      ? { screen: "tablet", count: 2 }
                      : { screen: "desktop", count: 4 }
                  )
                }
                title={t("resource.product.tablet_grid_two")}
              >
                <TwoGridIcon />
              </button>
              <button
                className={`${styles.colIconBtn} ${styles.tablet} ${
                  (isTablet ? columnCount?.tablet === 3 : columnCount?.desktop === 10) ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate(
                    isTablet
                      ? { screen: "tablet", count: 3 }
                      : { screen: "desktop", count: 10 }
                  )
                }
                title="Mini grid"
              >
                <FourGridIcon />
              </button>
            </div>
          </div>
          <div className={styles.breadcrumbWrapper}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </div>
          <div className={styles.contentWrapper}>
            {filterList?.length !== 0 && (
              <StickyColumn
                className={`${styles.left} ${filterToggle && !isFilterVisible ? styles.hidden : ""}`}
                topOffset={stickyFilterTopOffset}
              >
                <div className={styles.filterHeaderContainer}>
                  <div className={styles.filterHeader}>
                    <h4 className={styles.title}>
                      {t("resource.product.filters_caps")}
                    </h4>
                    {!isResetFilterDisable && (
                      <button
                        className={styles.resetBtn}
                        onClick={onResetFiltersClick}
                      >
                        {t("resource.facets.reset_caps")}
                      </button>
                    )}
                  </div>
                  <FilterTags
                    selectedFilters={selectedFilters}
                    onFilterUpdate={onFilterUpdate}
                  />
                </div>
                {filterList?.map((filter, idx) => (
                  <FilterItem
                    isMobileView={false}
                    key={idx + "-desktop" + filter.key.display}
                    filter={filter}
                    onFilterUpdate={onFilterUpdate}
                  />
                ))}
              </StickyColumn>
            )}
            <div className={styles.right}>
              <div className={styles.rightHeader}>
                <div className={styles.headerLeft}>
                  {title && <h2 className={styles.title}>{title}</h2>}
                  {isProductCountDisplayed && (
                    <span className={styles.productCount}>
                      {`${productCount} ${productCount > 1 ? t("resource.common.items") : t("resource.common.item")}`}
                    </span>
                  )}
                </div>
                <div className={styles.headerRight}>
                  {filterToggle && filterList?.length > 0 && (
                    <div
                      className={`${styles.filterToggleBtn} `}
                      onClick={() => setIsFilterVisible(!isFilterVisible)}
                    >
                      <div className={styles.filterToggleText}>
                        {isFilterVisible
                          ? t("resource.common.hide_filters")
                          : t("resource.common.show_filters")}
                      </div>
                      <div className={`${styles.filterIcon} `}>
                        <FilterIcon />
                      </div>
                    </div>
                  )}
                  <Sort sortList={sortList} onSortUpdate={onSortUpdate} />
                  <button
                    className={`${styles.colIconBtn} ${
                      columnCount?.desktop === 2 ? styles.active : ""
                    }`}
                    onClick={() =>
                      onColumnCountUpdate({ screen: "desktop", count: 2 })
                    }
                    title={t("resource.product.desktop_grid_two")}
                  >
                    <TwoGridIcon />
                  </button>
                  <button
                    className={`${styles.colIconBtn} ${
                      columnCount?.desktop === 4 ? styles.active : ""
                    }`}
                    onClick={() =>
                      onColumnCountUpdate({ screen: "desktop", count: 4 })
                    }
                    title={t("resource.product.desktop_grid_four")}
                  >
                    <FourGridIcon />
                  </button>
                </div>
              </div>
              {banner?.desktopBanner && (
                <div
                  className={`${styles.bannerContainer} ${styles.desktopBanner}`}
                >
                  <FDKLink
                    className={styles.redirectionLink}
                    to={banner?.redirectLink}
                  >
                    <FyImage
                      alt={t("resource.product.desktop_banner_alt")}
                      src={banner?.desktopBanner}
                      customClass={styles.banner}
                      isFixedAspectRatio={false}
                      aspectRatio="auto"
                      defer={false}
                    />
                  </FDKLink>
                </div>
              )}
              {banner?.mobileBanner && (
                <div
                  className={`${styles.bannerContainer} ${styles.mobileBanner}`}
                >
                  <FDKLink
                    className={styles.redirectionLink}
                    to={banner?.redirectLink}
                  >
                    <FyImage
                      alt={t("resource.product.mobile_banner")}
                      src={banner?.mobileBanner}
                      customClass={styles.banner}
                      isFixedAspectRatio={false}
                      aspectRatio="auto"
                      defer={false}
                    />
                  </FDKLink>
                </div>
              )}
              {selectedFilters?.length > 0 && (
                <div className={styles.filterTags}>
                  <FilterTags
                    selectedFilters={selectedFilters}
                    onFilterUpdate={onFilterUpdate}
                    onResetFiltersClick={onResetFiltersClick}
                  />
                </div>
              )}
              <div className={styles["plp-container"]}>
                {isProductLoading && (
                  <div className={styles.plpLoaderHeader}>
                    {t("resource.product.desktop_grid_four") || "Desktop - 4 Column"}
                  </div>
                )}
                {loadingOption === "infinite" ? (
                  <InfiniteLoader
                    hasNext={paginationProps.hasNext}
                    isLoading={isProductLoading}
                    loadMore={onLoadMoreProducts}
                  >
                    <ProductGrid
                      {...{
                        isProductOpenInNewTab,
                        productList: displayProductList,
                        columnCount,
                        isBrand,
                        isSaleBadge,
                        isCustomBadge,
                        isPrice,
                        aspectRatio,
                        isWishlistIcon,
                        WishlistIconComponent,
                        followedIdList,
                        listingPrice,
                        showAddToCart,
                        showColorVariants,
                        actionButtonText:
                          actionButtonText ?? t("resource.common.add_to_cart"),
                        onWishlistClick,
                        isImageFill,
                        showImageOnHover,
                        imageBackgroundColor,
                        imagePlaceholder,
                        handleAddToCart,
                        imgSrcSet,
                        onProductNavigation,
                        isServiceable: is_serviceable,
                      }}
                    />
                  </InfiniteLoader>
                ) : (
                  <ProductGrid
                    {...{
                      isProductOpenInNewTab,
                      productList: displayProductList,
                      columnCount,
                      isBrand,
                      isSaleBadge,
                      isCustomBadge,
                      isPrice,
                      aspectRatio,
                      isWishlistIcon,
                      WishlistIconComponent,
                      followedIdList,
                      listingPrice,
                      showAddToCart,
                      showColorVariants,
                      actionButtonText:
                        actionButtonText ?? t("resource.common.add_to_cart"),
                      onWishlistClick,
                      isImageFill,
                      showImageOnHover,
                      imageBackgroundColor,
                      isProductLoading,
                      imagePlaceholder,
                      handleAddToCart,
                      imgSrcSet,
                      onProductNavigation,
                      isServiceable: is_serviceable,
                    }}
                  />
                )}
                {loadingOption === "pagination" && (
                  <div className={styles.paginationWrapper}>
                    <Pagination {...paginationProps} />
                  </div>
                )}
                {loadingOption === "view_more" && paginationProps.hasNext && (
                  <div className={styles.viewMoreWrapper}>
                    <button
                      className={`${styles.viewMoreBtn} ${
                        isProductLoading ? styles.loading : ""
                      }`}
                      onClick={onViewMoreClick}
                      tabIndex="0"
                      disabled={isProductLoading}
                      style={{ "--load-more-progress": `${loadMoreProgress}%` }}
                      aria-label={loadMoreLabel}
                    >
                      <span
                        className={styles.viewMoreProgress}
                        aria-hidden="true"
                      />
                      <span className={styles.viewMoreLabel}>
                        {loadMoreLabel}
                      </span>
                    </button>
                  </div>
                )}
              </div>
              <ListingDescription
                key={description.length}
                description={description}
              />
            </div>
          </div>
          <SortModal {...sortModalProps} />
          <FilterModal
            {...{
              isResetFilterDisable,
              sortList,
              productCount,
              onSortUpdate,
              ...filterModalProps,
            }}
          />
          {isScrollTop && <ScrollTop />}
          {showAddToCart && (
            <>
              {isAddToCartOpen && (
                <Modal
                  isOpen={isAddToCartOpen}
                  hideHeader={!isTablet}
                  modalType="right-modal"
                  customClassName={styles.quickShopModal}
                  containerClassName={styles.addToCartContainer}
                  bodyClassName={styles.addToCartBody}
                  titleClassName={styles.addToCartTitle}
                  title={addToCartModalTitle}
                  closeDialog={restAddToModalProps?.handleClose}
                >
                  <AddToCart
                    {...restAddToModalProps}
                    globalConfig={globalConfig}
                    isServiceable={modalServiceable}
                    recommendationProducts={displayProductList}
                    followedIdList={followedIdList}
                    onWishlistClick={onWishlistClick}
                  />
                </Modal>
              )}
              <SizeGuide
                isOpen={showSizeGuide}
                onCloseDialog={handleCloseSizeGuide}
                productMeta={restAddToModalProps?.productData?.product?.sizes}
                selectedSize={restAddToModalProps?.selectedSize}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListing;

function ProductGrid({
  columnCount = { desktop: 4, tablet: 3, mobile: 1 },
  productList = [],
  ...restProps
}) {
  return (
    <div
      className={styles.productContainer}
      style={{
        "--desktop-col": columnCount.desktop,
        "--tablet-col": columnCount.tablet,
        "--mobile-col": columnCount.mobile,
      }}
    >
      {productList?.length > 0 &&
        productList.map((product, index) => (
          <ProductGridItem
            key={
              product?.uid ||
              product?.slug ||
              `${product?.name || "product"}-${index}`
            }
            product={product}
            columnCount={columnCount}
            {...restProps}
          />
        ))}
    </div>
  );
}

const isInteractiveProductCardTarget = (target) =>
  !!target?.closest?.(
    'a, button, input, select, textarea, [role="button"], [data-product-card-interactive="true"]'
  );

const getProductPath = (product = {}, linkProps = {}) => {
  const rawSlug = linkProps?.action?.page?.params?.slug || product?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (!slug) return "";

  const query = linkProps?.action?.page?.query || {};
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined && item !== "") {
          searchParams.append(key, item);
        }
      });
      return;
    }

    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, value);
    }
  });

  const search = searchParams.toString();
  return `/product/${slug}${search ? `?${search}` : ""}`;
};

function ProductGridItem({
  product,
  isBrand = true,
  isSaleBadge = true,
  isCustomBadge = true,
  isPrice = true,
  isWishlistIcon = true,
  imgSrcSet,
  aspectRatio,
  WishlistIconComponent,
  isProductOpenInNewTab = false,
  columnCount = { desktop: 4, tablet: 3, mobile: 1 },
  followedIdList = [],
  listingPrice = "range",
  isImageFill = false,
  showImageOnHover = false,
  showAddToCart = true,
  showColorVariants = true,
  actionButtonText,
  imageBackgroundColor = "",
  imagePlaceholder = "",
  onWishlistClick = () => {},
  handleAddToCart = () => {},
  onProductNavigation = () => {},
  isServiceable = true,
}) {
  const { t } = useGlobalTranslation("translation");
  const navigate = useNavigate();

  const getProductLinkProps = useMemo(() => {
    const isMto = product?.custom_order?.is_custom_order || false;
    let sizeToSelect;
    let state = { product };
    if (!!product?.sizes?.sizes?.length) {
      let firstAvailableSize = product.sizes.sizes.find(
        (size) => size.quantity > 0 || isMto
      );
      if (firstAvailableSize) sizeToSelect = firstAvailableSize.value;
    } else if (!!product?.sizes?.length) {
      sizeToSelect = product.sizes[0];
      state = {
        product: {
          ...product,
          sizes: {
            sellable: product.sellable,
            sizes: product.sizes.map((s) =>
              typeof s === "string" ? { display: s, value: s } : s
            ),
          },
        },
      };
    }

    return {
      action: {
        ...(product?.action || {}),
        page: {
          ...(product?.action?.page || {}),
          query: {
            ...(product?.action?.page?.query || {}),
            ...(sizeToSelect && { size: sizeToSelect }),
          },
        },
      },
      state,
    };
  }, [product]);
  const productPath = useMemo(
    () => getProductPath(product, getProductLinkProps),
    [product, getProductLinkProps]
  );

  const navigateToProduct = useCallback(
    (event) => {
      if (!productPath) return;

      onProductNavigation();

      if (
        isProductOpenInNewTab ||
        event?.metaKey ||
        event?.ctrlKey ||
        event?.shiftKey
      ) {
        if (isRunningOnClient()) {
          window.open(productPath, "_blank", "noopener,noreferrer");
        }
        return;
      }

      navigate(productPath, { state: getProductLinkProps.state });
    },
    [
      getProductLinkProps.state,
      isProductOpenInNewTab,
      navigate,
      onProductNavigation,
      productPath,
    ]
  );

  const handleProductClick = useCallback(
    (event) => {
      if (
        event?.defaultPrevented ||
        isInteractiveProductCardTarget(event?.target)
      ) {
        return;
      }

      navigateToProduct(event);
    },
    [navigateToProduct]
  );

  const handleProductKeyDown = useCallback(
    (event) => {
      if (
        (event.key !== "Enter" && event.key !== " ") ||
        isInteractiveProductCardTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      navigateToProduct(event);
    },
    [navigateToProduct]
  );

  return (
    <div
      className={styles["product-wrapper"]}
      role="link"
      tabIndex={0}
      onClick={handleProductClick}
      onKeyDown={handleProductKeyDown}
      style={{
        display: "block",
      }}
    >
      <ProductCard
        product={product}
        listingPrice={listingPrice}
        columnCount={columnCount}
        aspectRatio={aspectRatio}
        isBrand={isBrand}
        isPrice={isPrice}
        isSaleBadge={isSaleBadge}
        isCustomBadge={isCustomBadge}
        imgSrcSet={imgSrcSet}
        isWishlistIcon={isWishlistIcon}
        WishlistIconComponent={WishlistIconComponent}
        followedIdList={followedIdList}
        showAddToCart={showAddToCart}
        showColorVariants={showColorVariants}
        actionButtonText={actionButtonText ?? t("resource.common.add_to_cart")}
        onWishlistClick={onWishlistClick}
        isImageFill={isImageFill}
        showImageOnHover={showImageOnHover}
        imageBackgroundColor={imageBackgroundColor}
        imagePlaceholder={imagePlaceholder}
        handleAddToCart={handleAddToCart}
        isServiceable={isServiceable}
      />
    </div>
  );
}
