import React, { useState, useMemo, useEffect } from "react";
import * as styles from "./wishlist.less";
import { FDKLink } from "fdk-core/components";
import InfiniteLoader from "../../components/core/infinite-loader/infinite-loader";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import ProductCard from "../../components/product-card/product-card";

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
  listingPrice = "range",
  WishlistIconComponent,
  hasNext = false,
  isLoading = false,
  EmptyStateComponent,
  onLoadMore = () => {},
  onWishlistClick = () => {},
}) => {
  const countLabel =
    totalCount > 1 ? `${totalCount} items` : `${totalCount} item`;

  return (
    <div>
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumb breadcrumb={breadcrumb} />
      </div>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.wishlistCount}>{countLabel}</span>
      </div>
      {productList.length === 0 ? (
        <EmptyStateComponent />
      ) : (
        <InfiniteLoader
          hasNext={hasNext}
          isLoading={isLoading}
          loadMore={onLoadMore}
        >
          <div className={styles.productGrid}>
            {productList.map((product) => (
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
                  onWishlistClick={onWishlistClick}
                />
              </FDKLink>
            ))}
          </div>
        </InfiniteLoader>
      )}
    </div>
  );
};

export default Wishlist;