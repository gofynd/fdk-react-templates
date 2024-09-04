import React, { useState } from "react";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import FilterList from "../filter-list/filter-list";
import * as styles from "./filter-item.less";

const FilterItem = ({ filter, isMobileView, onFilterUpdate = () => {} }) => {
  const [isActive, setIsActive] = useState(filter?.isOpen);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.filter}>
      {filter.values.length > 0 && (
        <div
          className={`${styles["filter__title"]} ${styles.flexAlignCenter} ${styles.justifyBetween}`}
          onClick={toggleActive}
        >
          <p className={`${styles.name} ${styles.b2}`}>{filter.key.display}</p>
          <div>
            <SvgWrapper
              className={`${styles["arrow-icon"]} ${isActive ? styles.isOpen : ""}`}
              svgSrc="arrow-down"
              children={undefined}
            />
          </div>
        </div>
      )}
      <div
        className={`${styles["filter__list"]} ${
          !isActive ? styles.collapse : ""
        } 
        }`}
      >
        <FilterList
          filter={filter}
          isMobileView={isMobileView}
          onFilterUpdate={onFilterUpdate}
        />
      </div>
    </div>
  );
};

export default FilterItem;
