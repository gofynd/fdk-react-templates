import React, { useState, useEffect, useRef } from "react";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import ProductCard from "../../components/product-card/product-card";
import FyImage from "../../components/core/fy-image/fy-image";
import * as styles from "./compare.less";
import { useGlobalTranslation } from "fdk-core/utils";
import PlusIcon from "../../assets/images/plus-icon.svg";
import CartIcon from "../../assets/images/cart-icon.svg";
import SearchIcon from "../../assets/images/search-icon.svg";
import CloseIcon from "../../assets/images/clear-search-close-icon.svg";
import { currencyFormat, formatLocale } from "../../helper/utils";
import { div, style } from "framer-motion/client";
import Modal from "../../components/core/modal/modal";
import CompareProductCard from "../../components/compare-product-card/compare-product-card";
import { useGlobalStore, useFPI } from "fdk-core/utils";
import { useMobile } from "../../helper/hooks";
import AddToCart from "../plp/Components/add-to-cart/add-to-cart";
import { useNavigate } from "react-router-dom";
import Shimmer from "../../components/shimmer/shimmer";

function Compare({
  isLoading = false,
  products = [],
  attributes = [],
  category,
  showSearch,
  searchLoading,
  searchText,
  setSearchText,
  filteredSuggestions,
  cardProps = {
    isSaleBadge: false,
    isWishlistIcon: false,
    isImageFill: false,
  },
  imagePlaceholder = "",
  loader = <></>,
  globalConfig = {},
  setShowSearch = () => {},
  handleAdd = () => {},
  handleRemove = () => {},
  handleInputChange = () => {},
  isDifferentAttr = () => {},
  getAttribute = () => {},
  checkHtml = () => {},
  handleAddToCart,
}) {
  const { t } = useGlobalTranslation("translation");
  const navigate = useNavigate();
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localProducts, setLocalProducts] = useState(products || []);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Refs for height synchronization
  const headerRefs = useRef({});
  const valueRefs = useRef({});

  const toggleShowProductModal = () => {
    setShowProductModal((showProduct) => !showProduct);
  };

  const handleChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const filteredList = filteredSuggestions?.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCompareProduct = (product) => {
    if (localProducts.length >= 4) return;
    setLocalProducts([...localProducts, product]);
    setShowProductModal(false);
  };

  // Function to synchronize heights
  const synchronizeHeights = () => {
    if (!attributes || !products || products.length === 0) return;

    setTimeout(() => {
      attributes.forEach((attributesMetadata, groupIndex) => {
        attributesMetadata.details.forEach((attribute, attrIndex) => {
          const headerKey = `header-${groupIndex}-${attrIndex}`;
          const valueKey = `values-${groupIndex}-${attrIndex}`;

          const headerElement = headerRefs.current[headerKey];
          const valueElement = valueRefs.current[valueKey];

          if (headerElement && valueElement) {
            // Reset heights
            headerElement.style.height = "auto";
            valueElement.style.height = "auto";

            // Get natural heights
            const headerHeight = headerElement.offsetHeight;
            const valueHeight = valueElement.offsetHeight;

            // Set both to the maximum height
            const maxHeight = Math.max(headerHeight, valueHeight);
            headerElement.style.height = `${maxHeight}px`;
            valueElement.style.height = `${maxHeight}px`;
          }
        });
      });
    }, 100);
  };

  // Synchronize heights when data changes
  useEffect(() => {
    synchronizeHeights();
  }, [products, attributes]);

  // Synchronize heights on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1023);
      synchronizeHeights();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getAddContainerCount = () => {
    const remaining = 4 - products.length;
    return remaining > 0 ? remaining : 0;
  };

  const hasProductIdsInUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.has("id");
  };

  useEffect(() => {
    const shouldRedirect =
      (!products || products.length === 0) &&
      !hasProductIdsInUrl() &&
      !isLoading;

    if (shouldRedirect) {
      navigate("/products");
    }
  }, [products, location.search, isLoading, navigate]);

  const renderSearchShimmer = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <CompareProductCard
        key={`search-shimmer-${index}`}
        productItem={null}
        isLoading={true}
      />
    ));
  };

  const renderSearchResults = () => {
    if (searchLoading) {
      return (
        <div className={styles.productListContainer}>
          {renderSearchShimmer()}
        </div>
      );
    }

    if (filteredList?.length > 0) {
      return (
        <div className={styles.productListContainer}>
          {filteredList?.map((item, index) => (
            <CompareProductCard
              key={index}
              productItem={item}
              addProduct={() => {
                handleAdd(item.slug);
                setShowProductModal(false);
              }}
              isLoading={false}
            />
          ))}
        </div>
      );
    }

    if (!searchLoading && filteredList?.length === 0) {
      return (
        <div className={styles.noProductFoundMessage}>
          <span> {t("resource.compare.no_product_found")}</span>
        </div>
      );
    }

    return null;
  };

  const showAddCompareProduct = products?.length >= 4;

  return (
    <>
      <div className={styles.compare}>
        <div
          className={`${styles.compare__breadcrumbs} ${styles.captionNormal}`}
        ></div>
        <h1 className={`${styles.compare__title} fontHeader`}>
          {t("resource.compare.add_products_to_compare")}
        </h1>
        {isLoading ? (
          loader
        ) : (
          <>
            <div className={styles.compareContainer}>
              {(products?.length > 0 || getAddContainerCount() > 0) && (
                <div className={styles.comparisonTableWrapper}>
                  <div className={styles.flexCompareWrapper}>
                    <div className={styles.leftStickySection}>
                      <div
                        className={styles.emptyHeaderSpace}
                        onClick={() => {
                          if (products.length === 4) {
                            return;
                          }
                          setShowProductModal(true);
                        }}
                        style={{
                          visibility: showAddCompareProduct
                            ? "hidden"
                            : "visible",
                          pointerEvents: showAddCompareProduct
                            ? "none"
                            : "auto",
                        }}
                      >
                        <div className={styles.addProductWrapper}>
                          <div className={styles.addProductCard}>
                            <div className={styles.plusIconContainer}>
                              <PlusIcon />
                            </div>
                            <span>
                              {t("resource.compare.add_products_to_compare")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Table Headers */}
                      {products?.length > 0 && (
                        <div className={styles.tableHeadersSection}>
                          {attributes?.map((attributesMetadata, id) => (
                            <div key={id} className={styles.attributeGroup}>
                              {attributesMetadata.details.map(
                                (attribute, aid) => (
                                  <div
                                    key={`header-${id}-${aid}`}
                                    ref={(el) => {
                                      headerRefs.current[
                                        `header-${id}-${aid}`
                                      ] = el;
                                    }}
                                    className={`${styles.attributeHeader} ${
                                      isDifferentAttr(attribute)
                                        ? styles.differ
                                        : ""
                                    }`}
                                  >
                                    {attribute.display}
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Scrollable Section  */}
                    <div className={styles.rightScrollableSection}>
                      <div className={styles.productCardsRow}>
                        {products?.length > 0 &&
                          products.map((item, index) => (
                            <div
                              key={index}
                              className={styles.productCardContainer}
                            >
                              <div
                                className={styles.crossBtn}
                                onClick={() => handleRemove(item.slug)}
                              >
                                <SvgWrapper svgSrc="close" />
                              </div>

                              <FDKLink
                                className={styles.productLinkWrapper}
                                to={`/product/${item?.slug}`}
                                target="_blank"
                                style={{
                                  display: "block",
                                  width: "100%",
                                  height: "100%",
                                  textDecoration: "none",
                                }}
                              >
                                <ProductCard
                                  product={item}
                                  {...cardProps}
                                  imagePlaceholder={imagePlaceholder}
                                  showAddToCart={true}
                                  isSaleBadge={false}
                                  isWishlistIcon={false}
                                  showBadge={false}
                                  customImageContainerClass={
                                    styles.customImageContainer
                                  }
                                  handleAddToCart={handleAddToCart}
                                  customeProductDescContainerClass={
                                    styles.customeProductDescContainerClass
                                  }
                                />
                              </FDKLink>
                            </div>
                          ))}
                      </div>
                      {/* Attribute Values Rows*/}
                      {products?.length > 0 && (
                        <div className={styles.attributeValuesSection}>
                          {attributes?.map((attributesMetadata, id) => (
                            <div key={id} className={styles.attributeGroup}>
                              {attributesMetadata.details.map(
                                (attribute, aid) => (
                                  <div
                                    key={`values-${id}-${aid}`}
                                    ref={(el) => {
                                      valueRefs.current[`values-${id}-${aid}`] =
                                        el;
                                    }}
                                    className={styles.attributeValuesRow}
                                  >
                                    {products.map((cProduct, idx) =>
                                      cProduct ? (
                                        <div
                                          key={`value-${idx}`}
                                          className={styles.attributeValue}
                                        >
                                          {checkHtml(
                                            getAttribute(cProduct, attribute)
                                          ) ? (
                                            <span
                                              className={styles.attr}
                                              dangerouslySetInnerHTML={{
                                                __html: getAttribute(
                                                  cProduct,
                                                  attribute
                                                ),
                                              }}
                                            />
                                          ) : (
                                            <span className={styles.attr}>
                                              {getAttribute(
                                                cProduct,
                                                attribute
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      ) : null
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={showProductModal}
        customClassName={styles.compareModalSection}
        modalType="right-modal"
        closeDialog={toggleShowProductModal}
        isCancellable={false}
        headerClassName={styles.productModalHeader}
        containerClassName={styles.productModalContainer}
        title={
          <div className={styles.productModalTitle}>
            {t("resource.compare.select_product")}
          </div>
        }
      >
        <div className={styles.productListWrapper}>
          <div className={styles.searchBoxContainer}>
            <div className={styles.searcBarContainer}>
              <SearchIcon />
              <input
                type="text"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e?.target?.value || "");
                }}
                placeholder={t("resource.compare.search_product_here")}
              />
            </div>
            {searchText?.length > 0 && (
              <CloseIcon
                className={styles.cancelIcon}
                onClick={() => {
                  setSearchText("");
                  handleInputChange("");
                }}
              />
            )}
          </div>
          {renderSearchResults()}
        </div>
      </Modal>
    </>
  );
}

export default Compare;
