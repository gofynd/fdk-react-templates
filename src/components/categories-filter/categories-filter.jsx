/**
 * A React functional component that manages the display and interaction of a filter category.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.categoryName - The name of the category.
 * @param {string} props.categoryNameValue - The display value of the category name.
 * @param {Array} props.categoryValues - The list of values associated with the category.
 * @param {Array} props.selectedFilters - The currently selected filters.
 * @param {string} props.categoryType - The type of the category, e.g., "range".
 * @param {Function} props.updateSelectedFilters - A function to update the selected filters.
 *
 * @returns {JSX.Element} A JSX element representing the filter category UI.
 */

import React, { useState } from "react";
import * as styles from "./categories-filter.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import RangeInputContainer from "./range-input-container/range-input-container";

const CategoriesFilter = ({
  categoryName,
  categoryNameValue,
  categoryValues,
  selectedFilters,
  categoryType,
  updateSelectedFilters,
}) => {
  const [open, setOpen] = useState(false);

  const isRangeCategories =
    categoryType === "range" && categoryValues?.length > 0 && open;

  const isCategoriesFilter =
    categoryType !== "range" && categoryValues?.length > 0 && open;
  return (
    <div className={styles.singleFilterContainer}>
      <div
        className={styles.filterInformationContainer}
        onClick={() => setOpen(!open)}
      >
        <p className={styles.filterHeading}>{categoryName}</p>
        <SvgWrapper
          svgSrc={"arrow-down"}
          className={styles.filterSvg}
          style={{ transform: open ? "scale(1,-1)" : "scale(1)" }}
        />
      </div>
      {isCategoriesFilter &&
        categoryValues.map((singleFilter) => {
          const isSelected =
            selectedFilters &&
            selectedFilters[categoryNameValue] &&
            selectedFilters[categoryNameValue][singleFilter?.value]
              ? true
              : false;
          return (
            <div
              key={singleFilter?.value}
              className={styles.filterValueContainer}
              onClick={() =>
                updateSelectedFilters(categoryNameValue, singleFilter?.value)
              }
            >
              <span
                className={`${styles.svgStrokeContainer} ${
                  !isSelected ? styles.notSelected : ""
                }`}
              >
                <SvgWrapper
                  svgSrc={"selected-checkbox"}
                  className={styles.filterValueCheckBox}
                  style={{ fill: isSelected ? "var(--buttonPrimary)" : "none" }}
                />
              </span>
              <p className={styles.filterValueName}>{singleFilter?.display}</p>
              <p
                className={styles.filterValueCount}
              >{`(${singleFilter?.count})`}</p>
            </div>
          );
        })}
      {isRangeCategories &&
        categoryValues?.map((singleFilter, index) => {
          return (
            <RangeInputContainer
              key={index}
              singleFilter={singleFilter}
              categoryNameValue={categoryNameValue}
              updateSelectedFilters={updateSelectedFilters}
            />
          );
        })}
    </div>
  );
};

export default CategoriesFilter;
