/**
 * RangeInputContainer is a React component that manages a range input for filtering purposes.
 * It allows users to select a minimum and maximum value within a specified range and updates
 * the selected filters accordingly.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.singleFilter - An object representing the filter with properties:
 *   - `selected_min` (number): The currently selected minimum value.
 *   - `selected_max` (number): The currently selected maximum value.
 *   - `min` (number): The minimum value of the range.
 *   - `max` (number): The maximum value of the range.
 *   - `query_format` (string): The format string for the query.
 *   - `currency_symbol` (string): The symbol for currency, if applicable.
 * @param {Function} props.updateSelectedFilters - A function to update the selected filters.
 *   - It takes three arguments: categoryNameValue (string), query (string), and a boolean flag.
 * @param {string} props.categoryNameValue - The name of the category for the filter.
 *
 * @returns {JSX.Element} A JSX element representing the range input container.
 */

import React, { useState, useEffect } from "react";
import { replaceQueryPlaceholders } from "../../../helper/utils";
import * as styles from "./range-input-container.less";

function RangeInputContainer({
  singleFilter,
  updateSelectedFilters,
  categoryNameValue,
}) {
  const [minVal, setMinVal] = useState(
    singleFilter?.selected_min || singleFilter?.min
  );
  const [maxVal, setMaxVal] = useState(
    singleFilter?.selected_max || singleFilter?.max
  );

  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      updateSelectedFilters(
        categoryNameValue,
        replaceQueryPlaceholders(
          singleFilter?.query_format,
          Math.floor(minVal),
          Math.floor(maxVal)
        ),
        true
      );
    } else {
      setIsMounted(true);
    }
  }, [minVal, maxVal]);

  return (
    <div className={styles.rangeContainer}>
      <div className={styles.rangeTitleContainer}>
        <div>From</div>
        <div>To</div>
      </div>
      <div className={styles.rangeInputContainer}>
        <div>
          {singleFilter?.currency_symbol && (
            <span className={styles.currencySymbol}>
              {singleFilter?.currency_symbol}
            </span>
          )}
          <input
            type="number"
            value={minVal}
            min={singleFilter?.min}
            max={singleFilter?.max}
            className={styles.rangeInputContainer}
            onChange={(event) => setMinVal(event?.target?.value)}
          />
        </div>
        <div>
          {singleFilter?.currency_symbol && (
            <span className={styles.currencySymbol}>
              {singleFilter?.currency_symbol}
            </span>
          )}
          <input
            type="number"
            value={maxVal}
            min={singleFilter?.min}
            max={singleFilter?.max}
            className={styles.rangeInputContainer}
            onChange={(event) => setMaxVal(event?.target?.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default RangeInputContainer;
