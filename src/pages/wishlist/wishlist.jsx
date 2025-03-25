import React from "react";
import * as styles from "./wishlist.less";
import { FDKLink } from "fdk-core/components";
import InfiniteLoader from "../../components/core/infinite-loader/infinite-loader";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import ProductCard from "../../components/product-card/product-card";
import Modal from "../../components/core/modal/modal";
import AddToCart from "../../page-layouts/plp/Components/add-to-cart/add-to-cart";
import SizeGuide from "../../page-layouts/plp/Components/size-guide/size-guide";
import { useViewport } from "../../helper/hooks";

const Wishlist = ({
  breadcrumb = [],
  title = "Wishlist",
  productList = [],
  totalCount = 0,
  isBrand = true,
  isSaleBadge = true,
  isPrice = true,
  isHdimgUsed = false,
  aspectRatio,
  isProductOpenInNewTab = false,
  showImageOnHover = false,
  listingPrice = "range",
  WishlistIconComponent,
  isImageFill,
  imageBackgroundColor,
  hasNext = false,
  isLoading = false,
  EmptyStateComponent,
  onLoadMore = () => {},
  onWishlistClick = () => {},
  imagePlaceholder = "",
  addToCartModalProps = {},
  showAddToCart = false,
  globalConfig = {},
}) => {
  const countLabel = totalCount > 1 ? `${totalCount} items` : "";

  const followedIdList = productList.map((m) => m.uid);
  const isTablet = useViewport(0, 768);
  const {
    handleAddToCart,
    isOpen: isAddToCartOpen,
    showSizeGuide,
    handleCloseSizeGuide,
    ...restAddToModalProps
  } = addToCartModalProps;

  if (!productList?.length) {
    return <EmptyStateComponent />;
  }

  return (
    <div>
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumb breadcrumb={breadcrumb} />
      </div>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>{title}</h1>
        {countLabel && (
          <span className={styles.wishlistCount}>{countLabel}</span>
        )}
      </div>

      <InfiniteLoader
        hasNext={hasNext}
        isLoading={isLoading}
        loadMore={onLoadMore}
      >
        <div className={styles.productGrid}>
          {productList.map((product, index) => (
            <FDKLink
              className={styles.productWrapper}
              to={`/product/${product?.slug}`}
              key={product?.uid}
              target={isProductOpenInNewTab ? "_blank" : "_self"}
            >
              <ProductCard
                product={product}
                listingPrice={listingPrice}
                isHdimgUsed={isHdimgUsed}
                aspectRatio={aspectRatio}
                isBrand={isBrand}
                isPrice={isPrice}
                isSaleBadge={isSaleBadge}
                isWishlistIcon={true}
                WishlistIconComponent={WishlistIconComponent}
                onWishlistClick={(event) => onWishlistClick(event, index)}
                followedIdList={followedIdList}
                isImageFill={isImageFill}
                imageBackgroundColor={imageBackgroundColor}
                showImageOnHover={showImageOnHover}
                imagePlaceholder={imagePlaceholder}
                columnCount={{ desktop: 4, tablet: 3, mobile: 2 }}
                showAddToCart={showAddToCart}
                handleAddToCart={handleAddToCart}
              />
            </FDKLink>
          ))}
        </div>
      </InfiniteLoader>

      {showAddToCart && (
        <>
          <Modal
            isOpen={isAddToCartOpen}
            hideHeader={!isTablet}
            containerClassName={styles.addToCartContainer}
            bodyClassName={styles.addToCartBody}
            titleClassName={styles.addToCartTitle}
            title={
              isTablet ? restAddToModalProps?.productData?.product?.name : ""
            }
            closeDialog={restAddToModalProps?.handleClose}
          >
            <AddToCart {...restAddToModalProps} globalConfig={globalConfig} />
          </Modal>
          <SizeGuide
            isOpen={showSizeGuide}
            onCloseDialog={handleCloseSizeGuide}
            productMeta={restAddToModalProps?.productData?.product?.sizes}
          />
        </>
      )}
    </div>
  );
};

export default Wishlist;
