import React, { useEffect, useMemo, useState } from "react";
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
import SortIcon from "../../assets/images/sort.svg";
import TwoGridIcon from "../../assets/images/grid-two.svg";
import FourGridIcon from "../../assets/images/grid-four.svg";
import TwoGridMobIcon from "../../assets/images/grid-two-mob.svg";
import OneGridMobIcon from "../../assets/images/grid-one-mob.svg";
import { useGlobalTranslation, useGlobalStore, useFPI } from "fdk-core/utils";

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
  showAddToCart = false,
  showColorVariants = false,
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
  showMultipleImages = false,
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

  return (
    <div className={styles.plpWrapper}>
      {isRunningOnClient() && isPageLoading ? (
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
              {filterList.length > 0 && (
                <button
                  className={styles.filterBtn}
                  onClick={onFilterModalBtnClick}
                >
                  <FilterIcon />
                  <span>{t("resource.common.filter")}</span>
                </button>
              )}
              <button onClick={onSortModalBtnClick}>
                <SortIcon />
                <span>{t("resource.facets.sort_by")}</span>
              </button>
            </div>
            <div className={styles.headerRight}>
              <button
                className={`${styles.colIconBtn} ${styles.mobile} ${
                  columnCount?.mobile === 1 ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate({ screen: "mobile", count: 1 })
                }
                title={t("resource.product.mobile_grid_one")}
              >
                <OneGridMobIcon />
              </button>
              <button
                className={`${styles.colIconBtn} ${styles.mobile} ${
                  columnCount?.mobile === 2 ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate({ screen: "mobile", count: 2 })
                }
                title={t("resource.product.mobile_grid_two")}
              >
                <TwoGridMobIcon />
              </button>
              <button
                className={`${styles.colIconBtn} ${styles.tablet} ${
                  columnCount?.tablet === 2 ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate({ screen: "tablet", count: 2 })
                }
                title={t("resource.product.tablet_grid_two")}
              >
                <TwoGridIcon />
              </button>
              <button
                className={`${styles.colIconBtn} ${styles.tablet} ${
                  columnCount?.tablet === 3 ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate({ screen: "tablet", count: 3 })
                }
                title={t("resource.product.tablet_grid_four")}
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
                {loadingOption === "infinite" ? (
                  <InfiniteLoader
                    hasNext={paginationProps.hasNext}
                    isLoading={isProductLoading}
                    loadMore={onLoadMoreProducts}
                  >
                    <ProductGrid
                      {...{
                        isProductOpenInNewTab,
                        productList,
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
                        showMultipleImages,
                      }}
                    />
                  </InfiniteLoader>
                ) : (
                  <ProductGrid
                    {...{
                      isProductOpenInNewTab,
                      productList,
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
                      showMultipleImages,
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
                      className={styles.viewMoreBtn}
                      onClick={onViewMoreClick}
                      tabIndex="0"
                      disabled={isProductLoading}
                    >
                      {t("resource.facets.view_more")}
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
          <FilterModal {...{ isResetFilterDisable, ...filterModalProps }} />
          {isScrollTop && <ScrollTop />}
          {showAddToCart && (
            <>
              {isAddToCartOpen && (
                <Modal
                  isOpen={isAddToCartOpen}
                  hideHeader={!isTablet}
                  containerClassName={styles.addToCartContainer}
                  bodyClassName={styles.addToCartBody}
                  titleClassName={styles.addToCartTitle}
                  title={
                    isTablet
                      ? restAddToModalProps?.productData?.product?.name
                      : ""
                  }
                  closeDialog={restAddToModalProps?.handleClose}
                >
                  <AddToCart
                    {...restAddToModalProps}
                    globalConfig={globalConfig}
                    isServiceable={is_serviceable}
                  />
                </Modal>
              )}
              <SizeGuide
                isOpen={showSizeGuide}
                onCloseDialog={handleCloseSizeGuide}
                productMeta={restAddToModalProps?.productData?.product?.sizes}
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
        productList.map((product) => (
          <ProductGridItem
            key={product?.uid}
            product={product}
            {...restProps}
          />
        ))}
    </div>
  );
}

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
  showAddToCart = false,
  showColorVariants = false,
  actionButtonText,
  imageBackgroundColor = "",
  imagePlaceholder = "",
  onWishlistClick = () => {},
  handleAddToCart = () => {},
  onProductNavigation = () => {},
  isServiceable = true,
  showMultipleImages = false,
}) {
  const { t } = useGlobalTranslation("translation");

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
          sizes: { sellable: product.sellable, sizes: product.sizes },
        },
      };
    }

    return {
      action: {
        ...product.action,
        page: {
          ...product.action.page,
          query: {
            ...product.action.page.query,
            ...(sizeToSelect && { size: sizeToSelect }),
          },
        },
      },
      state,
    };
  }, [product]);

  return (
    <FDKLink
      className={styles["product-wrapper"]}
      {...getProductLinkProps}
      target={isProductOpenInNewTab ? "_blank" : "_self"}
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
        onClick={onProductNavigation}
        isServiceable={isServiceable}
        showMultipleImages={showMultipleImages}
      />
    </FDKLink>
  );
}
