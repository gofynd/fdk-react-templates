import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FDKLink } from "fdk-core/components";
import { useFPI } from "fdk-core/utils";
import * as styles from "../../styles/product-listing.less";
import "../../styles/base.global.less"

import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import useProductListing from "../../page-layouts/plp/useProductListing";
import ProductCard from "../../components/product-card/product-card";
import Sort from "../../page-layouts/plp/Components/sort/sort";
import FilterItem from "../../page-layouts/plp/Components/filter-item/filter-item";
import StickyColumn from "../../page-layouts/plp/Components/sticky-column/sticky-column";
import Pagination from "../../page-layouts/plp/Components/pagination/pagination";
import { updateGraphQueryWithValue } from "../../helper/utils";
import { PLP_LIST } from "../../queries/plpQuery";

const ProductListing = ({ Loader,PageNotFound }) => {
  const fpi = useFPI();
  const {
    product_lists,
    updateSelectedFilters,
    setCurrentSort,
    globalConfig,
    pageConfig,
    listing_price,
    apiLoading,
  } = useProductListing(fpi);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { filters = [], sortOn, page, items } = product_lists || {};

  const [desktopGrid, setDesktopGrid] = useState(
    pageConfig?.grid_desktop || "desktop-grid-2"
  );
  const tabletGrid = pageConfig?.grid_tablet || "tablet-grid-3";
  const mobileGrid = pageConfig?.grid_mob || "mob-grid-1";

  function updateSelection(val) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort_on", val);
    const updatedUrl = `${location.pathname}?${searchParams.toString()}`;
    setCurrentSort(val);
    navigate(updatedUrl);
  }

  useEffect(() => {
    if (!apiLoading) {
      setIsLoading(false);
    }
  }, [apiLoading]);

  function updateFilterQuery(val, parent) {
    const searchParams = new URLSearchParams(location.search);
    let updatedUrl = "";
    if (!searchParams.has(parent.key.name, val.value)) {
      searchParams.append(parent.key.name, val.value);
      updatedUrl = `${location.pathname}?${searchParams.toString()}`;
      navigate(updatedUrl);
    } else {
      searchParams.delete(parent.key.name, val.value);
    }
    updatedUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(updatedUrl);
    setTimeout(() => {
      updateSelectedFilters();
      setIsLoading(false);
    }, 1500);
  }

  function resetFilters() {
    setIsLoading(true);
    navigate(location.pathname);
    setTimeout(() => {
      updateSelectedFilters();
      setIsLoading(false);
    }, 1500);
  }

  const getPaginationValue = () => {
    return {
      ...product_lists?.page,
      current: product_lists?.page?.current || 1,
      total: Math.ceil(product_lists?.page?.item_total / 12),
    };
  };

  return (
    <>
      <div
        className={`${styles?.productListingPage} ${styles?.basePageContainer} ${styles?.margin0auto}`}
      >
        <div className={styles["plp-wrapper"]}>
          <div className={styles["content-wrapper"]}>
            <div className={styles?.left}>
              {filters?.length !== 0 && (
                <StickyColumn>
                  <div
                    className={`${styles["filter-header"]} ${styles?.flexAlignCenter} ${styles?.justifyBetween}`}
                  >
                    <h4 className={`${styles["filter-header__title"]}`}>
                      FILTERS
                    </h4>
                    <button
                      className={`${styles["filter-header__reset-btn"]} ${styles["btn-link"]}`}
                      onClick={resetFilters}
                    >
                      RESET
                    </button>
                  </div>
                  {filters?.map((filter, idx) => (
                    <FilterItem
                      isMobileView={false}
                      key={idx + "-desktop" + filter.key.display}
                      filter={filter}
                      updateFilter={updateFilterQuery}
                    />
                  ))}
                </StickyColumn>
              )}
            </div>
            <div className={styles.right}>
              <div
                className={` ${styles["right__header"]} ${styles.flexAlignCenter} ${styles.justifyBetween}`}
              >
                <div className={styles["right__header--left"]}>
                  <h1
                    className={`${styles.title} ${styles.h4} ${styles.fontBody}`}
                  >
                    {/* {{ getSearchQuery }} */}
                  </h1>
                  {pageConfig?.product_number && (
                    <span
                      className={`${styles.b1} ${styles["product-total-count"]}`}
                    >
                      {page?.item_total} Items
                    </span>
                  )}
                </div>
                <div
                  className={`${styles["right__header--right"]} ${styles.flexAlignCenter}`}
                >
                  <Sort
                    customClass={styles["sort-by"]}
                    filteredSorts={sortOn}
                    updateSelection={updateSelection}
                  />
                  <span
                    className={`${styles["col-icon"]} ${
                      desktopGrid === "desktop-grid-2" ? styles.active : ""
                    }`}
                    onClick={() => setDesktopGrid("desktop-grid-2")}
                  >
                    <SvgWrapper svgSrc="twogrid" children={undefined}></SvgWrapper>
                  </span>
                  <span
                    className={`${styles["col-icon"]} ${
                      desktopGrid === "desktop-grid-4" ? styles.active : ""
                    }`}
                    onClick={() => setDesktopGrid("desktop-grid-4")}
                  >
                    <SvgWrapper svgSrc="fourgrid" children={undefined}></SvgWrapper>
                  </span>
                </div>
              </div>
              <div className={styles["plp-container"]}>
                {items?.length === 0 && (
                  <div>
                    {!apiLoading && (
                      <PageNotFound title={"No Products Found"}></PageNotFound>
                    )}
                  </div>
                )}
                <div
                  className={`${styles["product-container"]} ${styles[desktopGrid]} ${styles[tabletGrid]} ${styles[mobileGrid]}`}
                >
                  {items?.length > 0 &&
                    items.map((product) => {
                      return (
                        <FDKLink
                          className={styles["product-wrapper"]}
                          to={`/product/${product.slug}`}
                        >
                          <ProductCard
                            customClass={[
                              `${desktopGrid}-card`,
                              `${tabletGrid}-card`,
                              `${mobileGrid}-card`,
                            ]}
                            product={product}
                            // activeProductId={active_product_uid}
                            globalConfig={globalConfig}
                            pageConfig={pageConfig}
                            listingPriceConfig={listing_price}
                            showWishlist isWishListPage={undefined} activeProductId={undefined}                            // @slide-up="slideUpEventListener($event)"
                            // @slide-down="slideDownEventListener($event)"
                          />
                        </FDKLink>
                      );
                    })}
                </div>
                <div
                  className={`${styles["pagination-wrapper"]} ${styles["flex-center"]}`}
                >
                  {!apiLoading && !isLoading && (
                    <Pagination value={getPaginationValue()} fpi={fpi} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {(apiLoading || isLoading) && <Loader></Loader>}
      </div>
    </>
  );
};

export const settings = JSON.stringify({
  props: [
    {
      type: "checkbox",
      id: "product_number",
      label: "Show product numbers",
      default: true,
    },
    {
      id: "loading_options",
      type: "select",
      options: [
        {
          value: "view_more",
          text: "View More",
        },
        {
          value: "infinite",
          text: "Infinite Loading",
        },
        {
          value: "pagination",
          text: "Pagination",
        },
      ],
      default: "infinite",
      label: "Loading Options",
    },
    {
      type: "checkbox",
      id: "back_top",
      label: "Show back to top button",
      default: true,
    },
    {
      type: "checkbox",
      id: "in_new_tab",
      label: "Open product in new tab",
      default: true,
      info: "Open product in new tab for desktop",
    },
    {
      type: "checkbox",
      id: "hide_brand",
      label: "Hide Brand Name",
      default: false,
      info: "Check to hide Brand name",
    },
    {
      id: "grid_desktop",
      type: "select",
      options: [
        {
          value: "desktop-grid-4",
          text: "4 Cards",
        },
        {
          value: "desktop-grid-2",
          text: "2 Cards",
        },
      ],
      default: "desktop-grid-4",
      label: "Default grid layout desktop",
    },
    {
      id: "grid_tablet",
      type: "select",
      options: [
        {
          value: "tablet-grid-3",
          text: "3 Cards",
        },
        {
          value: "tablet-grid-2",
          text: "2 Cards",
        },
      ],
      default: "tablet-grid-3",
      label: "Default grid layout tablet",
    },
    {
      id: "grid_mob",
      type: "select",
      options: [
        {
          value: "mob-grid-2",
          text: "2 Cards",
        },
        {
          value: "mob-grid-1",
          text: "1 Card",
        },
      ],
      default: "mob-grid-1",
      label: "Default grid layout mobile",
    },
    {
      id: "description",
      type: "textarea",
      default: "",
      label: "Description",
    },
    {
      type: "extension",
      id: "extension",
      label: "Extension Positions",
      info: "Handle extension in these positions",
      positions: [
        {
          value: "bottom_left_corner",
          text: "Bottom left corner of image",
        },
      ],
      default: {},
    },
  ],
});

ProductListing.serverFetch = async ({ fpi }) => {
  const values = [
    ["$pageNo", `${1}`],
    ["$pageType", `"number"`],
    ["$filterQuery", `""`],
    ["$sortOn", `""`],
  ];
  return fpi.executeGraphQL(updateGraphQueryWithValue(PLP_LIST, values));
};

export default ProductListing;
