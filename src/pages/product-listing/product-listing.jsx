import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "../../styles/product-listing.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import InfiniteLoader from "../../components/core/infinite-loader/infinite-loader";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import ProductCard from "../../components/product-card/product-card";
import Sort from "../../page-layouts/plp/Components/sort/sort";
import FilterItem from "../../page-layouts/plp/Components/filter-item/filter-item";
import StickyColumn from "../../page-layouts/plp/Components/sticky-column/sticky-column";
import Pagination from "../../page-layouts/plp/Components/pagination/pagination";
import ListingDescription from "../../components/listing-description/listing-description";
import SortModal from "../../components/sort-modal/sort-modal";
import FilterModal from "../../components/filter-modal/filter-modal";
import ScrollTop from "../../components/scroll-top/scroll-top";
import EmptyState from "../../components/empty-state/empty-state";
import Loader from "../../components/loader/loader";
import { isRunningOnClient } from "../../helper/utils";

const ProductListing = ({
  breadcrumb = [],
  isProductCountDisplayed = true,
  productCount = 0,
  title = "",
  description = "",
  isScrollTop = true,
  filterList = [],
  sortList = [],
  sortModalProps = {},
  filterModalProps = {},
  loadingOption = "pagination",
  paginationProps = {},
  isProductLoading = false,
  isPageLoading = false,
  productList = [],
  columnCount = { desktop: 4, tablet: 3, mobile: 1 },
  isProductOpenInNewTab = false,
  isBrand = true,
  isSaleBadge = true,
  isPrice = true,
  isHdimgUsed = false,
  isImageFill = false,
  showImageOnHover = false,
  isResetFilterDisable = false,
  imageBackgroundColor = "",
  aspectRatio,
  isWishlistIcon,
  WishlistIconComponent,
  followedIdList = [],
  listingPrice = "range",
  onColumnCountUpdate = () => {},
  onResetFiltersClick = () => {},
  onFilterUpdate = () => {},
  onSortUpdate = () => {},
  onFilterModalBtnClick = () => {},
  onSortModalBtnClick = () => {},
  onWishlistClick = () => {},
  onViewMoreClick = () => {},
  onLoadMoreProducts = () => {},
  EmptyStateComponent = (
    <EmptyState title="Sorry, we couldn’t find any results" />
  ),
}) => {
  return (
    <div className={styles.plpWrapper}>
      {isRunningOnClient() && isPageLoading ? (
        <div className={styles.loader}>
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.customLoader}
          />
        </div>
      ) : productList?.length === 0 && !isProductLoading ? (
        <div>{EmptyStateComponent}</div>
      ) : (
        <>
          <div className={styles.breadcrumbWrapperDesktop}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </div>
          <div className={styles.mobileHeader}>
            <div className={styles.headerLeft}>
              {filterList.length > 0 && (
                <button
                  className={styles.filterBtn}
                  onClick={onFilterModalBtnClick}
                >
                  <SvgWrapper svgSrc="filter" />
                  <span>Filter</span>
                </button>
              )}
              <button onClick={onSortModalBtnClick}>
                <SvgWrapper svgSrc="sort" />
                <span>Sort By</span>
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
                title="Mobile grid one"
              >
                <SvgWrapper svgSrc="grid-one-mob" />
              </button>
              <button
                className={`${styles.colIconBtn} ${styles.mobile} ${
                  columnCount?.mobile === 2 ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate({ screen: "mobile", count: 2 })
                }
                title="Mobile grid two"
              >
                <SvgWrapper svgSrc="grid-two-mob" />
              </button>
              <button
                className={`${styles.colIconBtn} ${styles.tablet} ${
                  columnCount?.tablet === 2 ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate({ screen: "tablet", count: 2 })
                }
                title="Tablet grid two"
              >
                <SvgWrapper svgSrc="grid-two" />
              </button>
              <button
                className={`${styles.colIconBtn} ${styles.tablet} ${
                  columnCount?.tablet === 3 ? styles.active : ""
                }`}
                onClick={() =>
                  onColumnCountUpdate({ screen: "tablet", count: 3 })
                }
                title="Tablet grid four"
              >
                <SvgWrapper svgSrc="grid-four" />
              </button>
            </div>
          </div>
          <div className={styles.contentWrapper}>
            {filterList?.length !== 0 && (
              <div className={styles?.left}>
                <StickyColumn>
                  <div className={styles.filterHeader}>
                    <h4 className={styles.title}>FILTERS</h4>
                    {!isResetFilterDisable && (
                      <button
                        className={styles.resetBtn}
                        onClick={onResetFiltersClick}
                      >
                        RESET
                      </button>
                    )}
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
              </div>
            )}
            <div className={styles.right}>
              <div className={styles.rightHeader}>
                <div className={styles.headerLeft}>
                  {title && <h1 className={styles.title}>{title}</h1>}
                  {isProductCountDisplayed && (
                    <span className={styles.productCount}>
                      {`${productCount} ${productCount > 1 ? "Items" : "Item"}`}
                    </span>
                  )}
                </div>
                <div className={styles.headerRight}>
                  <Sort sortList={sortList} onSortUpdate={onSortUpdate} />
                  <button
                    className={`${styles.colIconBtn} ${
                      columnCount?.desktop === 2 ? styles.active : ""
                    }`}
                    onClick={() =>
                      onColumnCountUpdate({ screen: "desktop", count: 2 })
                    }
                    title="Desktop grid two"
                  >
                    <SvgWrapper svgSrc="grid-two"></SvgWrapper>
                  </button>
                  <button
                    className={`${styles.colIconBtn} ${
                      columnCount?.desktop === 4 ? styles.active : ""
                    }`}
                    onClick={() =>
                      onColumnCountUpdate({ screen: "desktop", count: 4 })
                    }
                    title="Desktop grid four"
                  >
                    <SvgWrapper svgSrc="grid-four"></SvgWrapper>
                  </button>
                </div>
              </div>
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
                        isPrice,
                        isHdimgUsed,
                        aspectRatio,
                        isWishlistIcon,
                        WishlistIconComponent,
                        followedIdList,
                        listingPrice,
                        onWishlistClick,
                        isImageFill,
                        showImageOnHover,
                        imageBackgroundColor,
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
                      isPrice,
                      isHdimgUsed,
                      aspectRatio,
                      isWishlistIcon,
                      WishlistIconComponent,
                      followedIdList,
                      listingPrice,
                      onWishlistClick,
                      isImageFill,
                      showImageOnHover,
                      imageBackgroundColor,
                      isProductLoading,
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
                      View More
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.breadcrumbWrapperMobile}>
                <Breadcrumb breadcrumb={breadcrumb} />
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
        </>
      )}
    </div>
  );
};

export default ProductListing;

function ProductGrid({
  isBrand = true,
  isSaleBadge = true,
  isPrice = true,
  isWishlistIcon = true,
  isHdimgUsed = false,
  aspectRatio,
  WishlistIconComponent,
  isProductOpenInNewTab = false,
  columnCount = { desktop: 4, tablet: 3, mobile: 1 },
  productList = [],
  followedIdList = [],
  listingPrice = "range",
  isImageFill = false,
  showImageOnHover = false,
  imageBackgroundColor = "",
  onWishlistClick = () => {},
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
          <FDKLink
            className={styles["product-wrapper"]}
            to={`/product/${product?.slug}`}
            key={product?.uid}
            target={isProductOpenInNewTab ? "_blank" : "_self"}
            style={{
              "--delay": `${(index % 12) * 150}ms`,
            }}
          >
            <ProductCard
              product={product}
              listingPrice={listingPrice}
              columnCount={columnCount}
              isHdimgUsed={isHdimgUsed}
              aspectRatio={aspectRatio}
              isBrand={isBrand}
              isPrice={isPrice}
              isSaleBadge={isSaleBadge}
              isWishlistIcon={isWishlistIcon}
              WishlistIconComponent={WishlistIconComponent}
              followedIdList={followedIdList}
              onWishlistClick={onWishlistClick}
              isImageFill={isImageFill}
              showImageOnHover={showImageOnHover}
              imageBackgroundColor={imageBackgroundColor}
            />
          </FDKLink>
        ))}
    </div>
  );
}
