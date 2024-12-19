import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as styles from "./filter-list.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import CustomRangeSlider from "../../../../components/range-slider/range-slider";
import { isRunningOnClient } from "../../../../helper/utils";

function FilterList({
  filter,
  isCollapsedView = true,
  onFilterUpdate = () => {},
}) {
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
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
        item.display.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
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
      const firstChar = item.display[0].toUpperCase();
      if (!groupedFilterValues[firstChar]) {
        groupedFilterValues["#"].push(item);
      } else {
        groupedFilterValues[firstChar].push(item);
      }
    });
    return groupedFilterValues;
  };

  const showViewMore = isCollapsedView && filter.values.length > MAX_ITEM_COUNT;
  const showSearch =
    filter.key.name === "category" || filter.key.name === "brand";

  // const filteredValues = getFilteredItems(searchText);
  const groupedValues = getGroupedValues();

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
    // rangeClick(value, filter.key.name, minValue, maxValue);
  };

  const isFilterSelected = (filterItem) =>
    searchParams?.getAll(filter.key.name).includes(filterItem?.value) ||
    filterItem?.is_selected;

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
                placeholder="Search"
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
              {getFilteredValues().map((filterItem, index) => (
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
                    filterItem.value.toLowerCase() === "none"
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
                    <div
                      className={`${styles["filter__item--count"]} ${styles["caption-normal"]}`}
                    >
                      ({filterItem.count || 0})
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {showViewMore && (
            <div
              className={`${styles["view-more"]} ${styles.flexAlignCenter}`}
              onClick={expandFilter}
            >
              <span className={styles.label}>
                {isExpanded && <span>View Less</span>}
                {!isExpanded && <span>View More</span>}
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
                // prefix={value?.currency_symbol || ""}
                onSliderUpdate={(e) =>
                  handleSliderUpdate({ ...e, value, filter })
                }
                currencySymbol={value?.currency_symbol || ""}
                // value={value}
                // prefix={extractPrefix(value.display_format)}
                // postfix={extractSuffix(value.display_format)}
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
                <div
                  className={`${styles["filter__item--count"]} ${styles["caption-normal"]} `}
                >
                  ({filter.values[0].count || 0})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter popup */}
      {showPopup && (
        <div className={styles["filter__popup"]}>
          <div
            className={`${styles["filter__popup--header"]} ${styles.flexAlignCenter}`}
          >
            <div className={styles.search}>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
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
                >
                  <a href={`#${alphabet}`}>{alphabet}</a>
                </li>
              ))}
            </ul>
            <span className={styles["close-icon"]} onClick={closePopup}>
              <SvgWrapper svgSrc="close" />
            </span>
          </div>
          <ul className={styles["filter__popup--content"]}>
            {Object.keys(groupedValues).map((alphabet) => (
              <React.Fragment key={alphabet}>
                {groupedValues[alphabet].length !== 0 && (
                  <li id={alphabet} className={styles["alphabet-label"]}>
                    <h4>{alphabet}</h4>
                  </li>
                )}
                {groupedValues[alphabet].map((filterItem) => (
                  <li
                    key={`${alphabet}${filterItem.value}`}
                    className={styles.filter}
                  >
                    {/* @ts-ignore */}
                    <fdk-link link={filterItem.url}>
                      <div
                        className={`${styles["filter__item"]} ${styles.flexAlignCenter} ${styles["caption-normal"]}`}
                        onClick={() => filterClicked(filterItem)}
                      >
                        <div>
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
                        >
                          {filterItem.display}
                        </div>
                        <div
                          className={`${styles["filter__item--count"]} ${styles["caption-normal"]}`}
                        >
                          ({filterItem.count || 0})
                        </div>
                      </div>
                      {/* @ts-ignore */}
                    </fdk-link>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}

      {/* Overlay */}
      {showPopup && <div className={styles.overlay} onClick={closePopup}></div>}
    </div>
  );
}

export default FilterList;
