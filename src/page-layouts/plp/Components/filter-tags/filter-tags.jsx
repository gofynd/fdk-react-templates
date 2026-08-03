import React, { useMemo, useState } from "react";
import * as styles from "./filter-tags.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import { useViewport } from "../../../../helper/hooks";

const FilterTags = ({
  selectedFilters,
  onFilterUpdate = () => {},
  onResetFiltersClick = () => {},
}) => {
  const [isViewAll, setIsViewAll] = useState(false);

  const isTablet = useViewport(0, 768);

  const toggleViewAll = () => {
    setIsViewAll((prevState) => !prevState);
  };

  const getTotalVisibleValues = (data, maxVisible) => {
    let remainingSlots = maxVisible;

    return data.reduce((acc, filter) => {
      if (remainingSlots <= 0) return acc;

      const visibleValues = filter.values.slice(0, remainingSlots);
      remainingSlots -= visibleValues.length;

      return [...acc, { ...filter, values: visibleValues }];
    }, []);
  };

  const visibleFilters = useMemo(
    () =>
      isViewAll || isTablet
        ? selectedFilters
        : getTotalVisibleValues(selectedFilters, 5),
    [isViewAll, selectedFilters, isTablet]
  );

  const showViewAll = useMemo(
    () =>
      selectedFilters?.reduce((acc, curr) => [...acc, ...curr?.values], [])
        .length > 5,
    [selectedFilters]
  );

  return (
    <>
      {visibleFilters?.length > 0 && (
        <div className={styles.filterTagsContainer}>
          <div className={styles.filterTags}>
            {visibleFilters?.map((filter) =>
              filter?.values?.map((filterItem) => (
                <div key={filterItem?.display} className={styles.filterTagItem}>
                  <span className={styles.tagTitle}>{filterItem?.display}</span>
                  <span
                    className={styles.removeTag}
                    onClick={() => onFilterUpdate({ filter, item: filterItem })}
                  >
                    <SvgWrapper svgSrc="cross" />
                  </span>
                </div>
              ))
            )}
          </div>
          <div
            className={`${styles.actionButton} ${styles.clearAll}`}
            onClick={onResetFiltersClick}
          >
            CLEAR ALL
          </div>
          {showViewAll && (
            <div
              className={`${styles.actionButton} ${styles.viewAll}`}
              onClick={toggleViewAll}
            >
              {isViewAll ? "VIEW LESS" : "VIEW ALL"}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FilterTags;
