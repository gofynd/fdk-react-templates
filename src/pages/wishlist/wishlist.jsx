import React, { useMemo } from "react";
import * as styles from "./wishlist.less";
import { FDKLink } from "fdk-core/components";
import InfiniteLoader from "../../components/core/infinite-loader/infinite-loader";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import ProductCard from "../../components/product-card/product-card";
import { useGlobalTranslation, useGlobalStore, useFPI } from "fdk-core/utils";
import Modal from "../../components/core/modal/modal";
import AddToCart from "../../page-layouts/plp/Components/add-to-cart/add-to-cart";
import SizeGuide from "../../page-layouts/plp/Components/size-guide/size-guide";
import { useViewport } from "../../helper/hooks";

const Wishlist = ({
  breadcrumb = [],
  title,
  productList = [],
  totalCount = 0,
  isBrand = true,
  isSaleBadge = true,
  isPrice = true,
  imgSrcSet,
  aspectRatio,
  isProductOpenInNewTab = false,
  showImageOnHover = false,
  listingPrice = "range",
  RemoveIconComponent,
  isImageFill,
  imageBackgroundColor,
  hasNext = false,
  isLoading = false,
  EmptyStateComponent,
  onLoadMore = () => {},
  onRemoveClick = () => {},
  imagePlaceholder = "",
  addToCartModalProps = {},
  showAddToCart = false,
  actionButtonText,
  globalConfig = {},
  showHeader = true,
}) => {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const { is_serviceable } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE) || {};
  const countLabel =
    totalCount > 1 ? `${totalCount} ${t("resource.common.items")}` : "";

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
        {/* <Breadcrumb breadcrumb={breadcrumb} /> */}
      </div>
      {showHeader && (
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            {title || t("resource.common.breadcrumb.wishlist")}
          </h1>
          {countLabel && (
            <span className={styles.wishlistCount}>{countLabel}</span>
          )}
        </div>
      )}

      <InfiniteLoader
        hasNext={hasNext}
        isLoading={isLoading}
        loadMore={onLoadMore}
      >
        <div className={styles.productGrid}>
          {productList.map((product, index) => (
            <WishlistProductCard
              key={product?.uid}
              index={index}
              {...{
                product,
                isBrand,
                isSaleBadge,
                isPrice,
                imgSrcSet,
                aspectRatio,
                isProductOpenInNewTab,
                showImageOnHover,
                listingPrice,
                RemoveIconComponent,
                isImageFill,
                imageBackgroundColor,
                followedIdList,
                imagePlaceholder,
                actionButtonText,
                showAddToCart,
                onRemoveClick,
                handleAddToCart,
                isServiceable: is_serviceable,
              }}
            />
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
            <AddToCart
              {...restAddToModalProps}
              globalConfig={globalConfig}
              isServiceable={is_serviceable}
            />
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

const WishlistProductCard = ({
  product,
  index,
  isBrand = true,
  isSaleBadge = true,
  isPrice = true,
  imgSrcSet,
  aspectRatio,
  isProductOpenInNewTab = false,
  showImageOnHover = false,
  listingPrice = "range",
  RemoveIconComponent,
  isImageFill,
  imageBackgroundColor,
  followedIdList,
  imagePlaceholder,
  actionButtonText,
  showAddToCart,
  onRemoveClick = () => {},
  handleAddToCart,
  isServiceable = true,
}) => {
  const { t } = useGlobalTranslation("translation");

  const getProductAction = useMemo(() => {
    const isMto = product?.custom_order?.is_custom_order || false;
    const firstAvailableSize = product?.sizes?.sizes?.find(
      (sizeOption) => sizeOption.quantity > 0 || isMto
    );

    return {
      ...product.action,
      page: {
        ...product.action.page,
        query: {
          ...product.action.page.query,
          ...(firstAvailableSize && { size: firstAvailableSize.value }),
        },
      },
    };
  }, [product]);

  return (
    <FDKLink
      className={styles.productWrapper}
      action={getProductAction}
      state={{
        product: product,
      }}
      target={isProductOpenInNewTab ? "_blank" : "_self"}
    >
      <ProductCard
        product={product}
        listingPrice={listingPrice}
        imgSrcSet={imgSrcSet}
        aspectRatio={aspectRatio}
        isBrand={isBrand}
        isPrice={isPrice}
        isSaleBadge={isSaleBadge}
        isWishlistIcon={false}
        isRemoveIcon={true}
        RemoveIconComponent={RemoveIconComponent}
        onRemoveClick={(event) => onRemoveClick(event, index)}
        followedIdList={followedIdList}
        isImageFill={isImageFill}
        imageBackgroundColor={imageBackgroundColor}
        showImageOnHover={showImageOnHover}
        imagePlaceholder={imagePlaceholder}
        columnCount={{ desktop: 4, tablet: 3, mobile: 2 }}
        showAddToCart={showAddToCart}
        actionButtonText={actionButtonText ?? t("resource.common.add_to_cart")}
        handleAddToCart={handleAddToCart}
        isServiceable={isServiceable}
      />
    </FDKLink>
  );
};

export default Wishlist;
