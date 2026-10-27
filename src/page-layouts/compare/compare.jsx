import React, { useState, useEffect, useRef, useCallback } from "react";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import ProductCard from "../../components/product-card/product-card";
import * as styles from "./compare.less";
import { useGlobalTranslation } from "fdk-core/utils";
import PlusIcon from "../../assets/images/plus-icon.svg";
import SearchIcon from "../../assets/images/search-icon.svg";
import CloseIcon from "../../assets/images/clear-search-close-icon.svg";
import Modal from "../../components/core/modal/modal";
import CompareProductCard from "../../components/compare-product-card/compare-product-card";
import { useGlobalStore, useFPI } from "fdk-core/utils";
import { useNavigate } from "react-router-dom";

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
  const fpi = useFPI();
  const { is_serviceable } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE) || {};
  const navigate = useNavigate();
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localProducts, setLocalProducts] = useState(products || []);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Refs for height synchronization
  const headerRefs = useRef({});
  const valueRefs = useRef({});
  const resizeTimeoutRef = useRef(null);
  const isResizingRef = useRef(false);

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

  const synchronizeHeights = useCallback(() => {
    if (!attributes || !products || products.length === 0) return;

    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      try {
        attributes.forEach((attributesMetadata, groupIndex) => {
          attributesMetadata.details.forEach((attribute, attrIndex) => {
            const headerKey = `header-${groupIndex}-${attrIndex}`;
            const valueKey = `values-${groupIndex}-${attrIndex}`;

            const headerElement = headerRefs.current[headerKey];
            const valueElement = valueRefs.current[valueKey];

            if (headerElement && valueElement) {
              // Reset heights to auto first
              headerElement.style.height = "auto";
              valueElement.style.height = "auto";

              // Force reflow to get accurate measurements
              headerElement.offsetHeight;
              valueElement.offsetHeight;

              // Get computed styles to account for padding, margins, etc.
              const headerComputedStyle =
                window.getComputedStyle(headerElement);
              const valueComputedStyle = window.getComputedStyle(valueElement);

              // Get natural heights including all content
              const headerHeight = headerElement.scrollHeight;
              const valueHeight = valueElement.scrollHeight;

              const maxHeight = Math.max(headerHeight, valueHeight);

              if (maxHeight > 0) {
                headerElement.style.height = `${maxHeight}px`;
                valueElement.style.height = `${maxHeight}px`;
              }
            }
          });
        });
      } catch (error) {
        console.warn("Error synchronizing heights:", error);
      }
    });
  }, [products, attributes]);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    const newIsMobileOrTablet = window.innerWidth <= 1023;
    setIsMobileOrTablet(newIsMobileOrTablet);

    isResizingRef.current = true;

    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      isResizingRef.current = false;
      synchronizeHeights();
    }, 150);
  }, [synchronizeHeights]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      synchronizeHeights();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [products, attributes, synchronizeHeights]);

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleResize]);

  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        synchronizeHeights();
      }, 300);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [synchronizeHeights]);

  const createRefCallback = useCallback(
    (refKey) => {
      return (el) => {
        if (refKey.includes("header")) {
          headerRefs.current[refKey] = el;
        } else {
          valueRefs.current[refKey] = el;
        }

        if (el && !isResizingRef.current) {
          setTimeout(() => synchronizeHeights(), 10);
        }
      };
    },
    [synchronizeHeights]
  );

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

    // if (shouldRedirect) {
    //   navigate("/products");
    // }
  }, [products, location.search, isLoading, navigate]);

  const renderSearchShimmer = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <CompareProductCard
        key={`search-shimmer-${index}`}
        productItem={null}
        isLoading={true}
        globalConfig={globalConfig}
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
              addProduct={async () => {
                const ok = await handleAdd(item.slug);
                if (ok) setShowProductModal(false);
              }}
              isLoading={false}
              globalConfig={globalConfig}
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
                                    ref={createRefCallback(
                                      `header-${id}-${aid}`
                                    )}
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
                                  customImageContainerClass={`${styles.customImageContainer} ${globalConfig?.img_fill ? styles.objectFitCover : styles.objectFitContain}`}
                                  handleAddToCart={handleAddToCart}
                                  isServiceable={is_serviceable}
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
                                    ref={createRefCallback(
                                      `values-${id}-${aid}`
                                    )}
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
