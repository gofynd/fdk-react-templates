import React, { useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as styles from "./filter-list.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import CustomRangeSlider from "../../../../components/range-slider/range-slider";
import { isRunningOnClient } from "../../../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function FilterList({
  filter,
  isCollapsedView = true,
  onFilterUpdate = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const popupContentRef = useRef(null);
  const MAX_ITEM_COUNT = 7;

  const searchParams = isRunningOnClient()
    ? new URLSearchParams(location?.search)
    : null;

  const getFilteredItems = (searchText) => {
    if (!searchText) {
      return filter.values;
    }
    return filter.values.filter((item) => {
      return (
        (item.display || "").toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      );
    });
  };

  const expandFilter = () => {
    if (filter.key.name === "category" || filter.key.name === "brand") {
      setShowPopup(true);
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const getGroupedValues = () => {
    const groupedFilterValues = {
      "#": [],
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
      F: [],
      G: [],
      H: [],
      I: [],
      J: [],
      K: [],
      L: [],
      M: [],
      N: [],
      O: [],
      P: [],
      Q: [],
      R: [],
      S: [],
      T: [],
      U: [],
      V: [],
      W: [],
      X: [],
      Y: [],
      Z: [],
    };

    getFilteredItems(searchText).forEach((item) => {
      const firstChar = item?.display?.[0]?.toUpperCase();
      if (!groupedFilterValues[firstChar]) {
        groupedFilterValues["#"].push(item);
      } else {
        groupedFilterValues[firstChar].push(item);
      }
    });
    return groupedFilterValues;
  };

 const allFilteredItems = getFilteredItems(searchText);
  const showViewMore =
    isCollapsedView &&
    filter.values.length > MAX_ITEM_COUNT &&
    allFilteredItems.length > 0;

  const showSearch = ["category", "brand", "department"].includes(
    filter?.key?.name
  );

  const groupedValues = getGroupedValues();
  console.log(groupedValues, "groupedValues");

  const isEmptyResult = useMemo(() => {
    const filteredResult = Object.values(groupedValues).filter(
      (values) => !!values.length
    );
    return !filteredResult.length;
  }, [groupedValues]);

  function getFilteredValues() {
    let filteredItem = getFilteredItems(searchText);
    if (!showViewMore) {
      return filteredItem;
    }
    return isExpanded ? filteredItem : filteredItem.slice(0, MAX_ITEM_COUNT);
  }

  const filterClicked = (item) => {
    onFilterUpdate({ filter, item });
    if (window) {
      window?.scrollTo({
        top: 0,
      });
    }
  };

  const handleSliderUpdate = ({ minValue, maxValue, value, filter }) => {
    const item = {
      ...value,
      value: value.query_format
        ?.replace("{}", minValue)
        .replace("{}", maxValue),
    };
    onFilterUpdate({ filter, item });
  };

  const isFilterSelected = (filterItem) =>
    searchParams?.getAll(filter.key.name).includes(filterItem?.value) ||
    filterItem?.is_selected;

  // Handle alphabet click with smooth scroll
  const handleAlphabetClick = (e, alphabet) => {
    e.preventDefault();

    if (groupedValues[alphabet].length === 0) return;

    setTimeout(() => {
      const targetElement = document.getElementById(`alpha-${alphabet}`);
      const scrollContainer = popupContentRef.current;

      if (!targetElement || !scrollContainer) {
        console.log("Element not found:", { targetElement, scrollContainer });
        return;
      }

      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      // Calculate the scroll position needed
      const scrollLeft =
        scrollContainer.scrollLeft +
        (targetRect.left - containerRect.left) -
        20;

      scrollContainer.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }, 0);
  };

  return (
    <div
      className={`${styles["filter__list"]} ${
        !filter.isOpen ? styles.open : ""
      }`}
    >
      {/* Multivalued filter */}
      {filter.key.kind === "multivalued" && (
        <div>
          {showSearch && (
            <div
              className={`${styles["filter__list--search"]} ${styles.flexAlignCenter}`}
            >
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t("resource.facets.search")}
                className={`${styles.text}`}
              />
              <SvgWrapper
                className={styles["search-icon"]}
                svgSrc="searchFilter"
              />
            </div>
          )}
          <div className={styles["filter-items-container"]}>
            <ul className={`${styles["filter__list--items"]}`} id="scroll-bar">
              {getFilteredValues()?.length ? (
                getFilteredValues().map((filterItem, index) => (
                  <li
                    key={`filter-${index}`}
                    className={styles["filter__list--item"]}
                  >
                    <div
                      className={`${styles["filter__item"]} ${styles.flexAlignCenter} ${styles["caption-normal"]}`}
                      onClick={() => filterClicked(filterItem)}
                    >
                      <div>
                        {isFilterSelected(filterItem) ? (
                          <SvgWrapper
                            className={`${styles.icon} ${styles["checkbox-icon"]} ${styles.selected}`}
                            svgSrc="checkbox-selected"
                          ></SvgWrapper>
                        ) : (
                          <SvgWrapper
                            svgSrc="checkbox"
                            className={`${styles.icon} ${styles["checkbox-icon"]}`}
                          ></SvgWrapper>
                        )}
                      </div>
                      {filter.key.name === "primary_color" && (
                        <div
                          className={`
                  ${styles["filter__item--color"]} ${
                    (filterItem.value || "").toLowerCase() === "none"
                      ? styles.multiIcon
                      : ""
                  }
                `}
                          style={{ backgroundColor: `#${filterItem.value}` }}
                        ></div>
                      )}
                      <div
                        className={`${styles["filter__item--value"]} ${
                          styles["caption-normal"]
                        } ${isFilterSelected(filterItem) ? styles.active : ""}`}
                      >
                        {filterItem.display}
                      </div>
                      {filterItem.count != null && (
                        <div
                          className={`${styles["filter__item--count"]} ${styles["caption-normal"]}`}
                        >
                          ({filterItem.count})
                        </div>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li
                  key={`filter-empty`}
                  className={styles["filter__list--item"]}
                >
                  <div
                    className={`${styles["filter__item"]} ${styles.flexCenter} ${styles["caption-normal"]}`}
                  >
                    {t("resource.common.empty_state")}
                  </div>
                </li>
              )}
              {}
            </ul>
          </div>
          {showViewMore && (
            <div
              className={`${styles["view-more"]} ${styles.flexAlignCenter}`}
              onClick={expandFilter}
            >
              <span className={styles.label}>
                {isExpanded && <span>{t("resource.facets.view_less")}</span>}
                {!isExpanded && <span>{t("resource.facets.view_more")}</span>}
              </span>
              <SvgWrapper
                className={`${styles["arrow-icon"]} ${
                  isExpanded ? styles.expanded : ""
                }`}
                svgSrc="arrow-down"
              ></SvgWrapper>
            </div>
          )}
        </div>
      )}

      {/* Range filter */}
      {filter.key.kind === "range" && filter.values.length > 0 && (
        <div className={styles["filter-items-container"]}>
          <div className={styles["filter__list--items"]}>
            {filter.values?.map((value, index) => (
              <CustomRangeSlider
                key={`${filter?.key?.name}_${index}`}
                min={value.min}
                max={value.max}
                selectedMin={value?.selected_min}
                selectedMax={value?.selected_max}
                postfix={value?.display?.includes("%") ? "%" : ""}
                onSliderUpdate={(e) =>
                  handleSliderUpdate({ ...e, value, filter })
                }
                currencySymbol={value?.currency_symbol || ""}
              />
            ))}
          </div>
        </div>
      )}

      {/* Singlevalued filter */}
      {filter.key.kind === "singlevalued" && filter.values.length > 0 && (
        <div className={styles["filter-items-container"]}>
          <div className={styles["filter__list--items"]}>
            <div className={styles["filter__list--item"]}>
              <div
                className={`${styles["filter__item"]} ${styles.flexAlignCenter} ${styles["caption-normal"]}`}
                onClick={() => filterClicked(filter.values[0])}
              >
                <div>
                  {filter.values[0].is_selected && (
                    <SvgWrapper
                      className={`${styles.icon} ${styles["checkbox-icon"]} ${styles.selected}`}
                      svgSrc="checkbox-selected"
                    ></SvgWrapper>
                  )}
                  {!filter.values[0].is_selected && (
                    <SvgWrapper
                      svgSrc="checkbox"
                      className={`${styles.icon} ${styles["checkbox-icon"]}`}
                    ></SvgWrapper>
                  )}
                </div>

                <div
                  className={`${styles["filter__item--value"]} ${
                    styles["caption-normal"]
                  } ${
                    filter.values[0].is_selected == true ? styles.active : ""
                  }`}
                >
                  {filter.values[0].display}
                </div>
                {filter.values[0].count != null && (
                  <div
                    className={`${styles["filter__item--count"]} ${styles["caption-normal"]} `}
                  >
                    ({filter.values[0].count})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup && <div className={styles.overlay} onClick={closePopup}></div>}

      {showPopup && (
        <div
          className={styles["filter__popup"]}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`${styles["filter__popup--header"]} ${styles.flexAlignCenter}`}
          >
            <div className={styles.search}>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t("resource.facets.search")}
                className={styles["search__input"]}
              />
            </div>
            <ul className={styles.alphabets}>
              {Object.keys(groupedValues).map((alphabet, index) => (
                <li
                  key={`alphabet-${index}`}
                  className={`${
                    groupedValues[alphabet].length === 0 ? styles.disabled : ""
                  }`}
                  style={{
                    cursor:
                      groupedValues[alphabet].length === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={(e) => handleAlphabetClick(e, alphabet)}
                >
                  {alphabet}
                </li>
              ))}
            </ul>
            <span className={styles["close-icon"]} onClick={closePopup}>
              <SvgWrapper svgSrc="close" />
            </span>
          </div>
          <ul
            ref={popupContentRef}
            className={`${styles["filter__popup--content"]} ${isEmptyResult ? styles.emptyPopupContent : ""}`}
          >
            {!isEmptyResult ? (
              Object.keys(groupedValues).map((alphabet) => (
                <React.Fragment key={alphabet}>
                  {groupedValues[alphabet].length !== 0 && (
                    <li
                      id={`alpha-${alphabet}`}
                      className={styles["alphabet-label"]}
                    >
                      <h4>{alphabet}</h4>
                    </li>
                  )}
                  {groupedValues[alphabet].map((filterItem) => (
                    <li
                      key={`${alphabet}${filterItem.value}`}
                      className={styles.filter}
                    >
                      <fdk-link link={filterItem.url}>
                        <div
                          className={`${styles["filter__item"]} ${styles.flexAlignCenter} ${styles["caption-normal"]}`}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              filterClicked(filterItem);
                            }}
                          >
                            <SvgWrapper
                              className={`${styles.icon} ${styles["checkbox-icon"]}`}
                              svgSrc={
                                isFilterSelected(filterItem)
                                  ? "checkbox-selected"
                                  : "checkbox"
                              }
                            />
                          </div>
                          <div
                            className={`${styles["filter__item--value"]} ${
                              styles["caption-normal"]
                            } ${
                              isFilterSelected(filterItem) ? styles.active : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              filterClicked(filterItem);
                            }}
                          >
                            {filterItem.display}
                          </div>
                          {filterItem.count != null && (
                            <div
                              className={`${styles["filter__item--count"]} ${styles["caption-normal"]}`}
                            >
                              ({filterItem.count})
                            </div>
                          )}
                        </div>
                      </fdk-link>
                    </li>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <li className={styles.emptyMessage}>
                {t("resource.common.empty_state")}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FilterList;
