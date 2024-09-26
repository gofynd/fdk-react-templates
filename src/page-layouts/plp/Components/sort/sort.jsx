import React, { useState, useMemo } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient } from "../../../../helper/utils";
import * as styles from "./sort.less";

function Sort({ sortList = [], onSortUpdate = () => {} }) {
  const [sortOpen, setSortOpen] = useState(false);

  const selectedSort = useMemo(() => {
    let selectedItem = sortList?.find((x) => x.is_selected);
    if (selectedItem) {
      return selectedItem.name;
    }
    return sortList?.[0]?.name;
  }, [sortList]);

  // function checkMobile() {
  //   if (isRunningOnClient()) {
  //     return window.innerWidth > 480;
  //   } else {
  //     return false;
  //   }
  // }

  function updateSortOption(e, sortValue) {
    e.stopPropagation();
    e.preventDefault();
    onSortUpdate(sortValue);
    closeSortOption(e);
  }

  function closeSortOption(event) {
    // if (event && event.target.id !== "sortopt") {
    setSortOpen(false);
    // }
  }

  return (
    <OutsideClickHandler onOutsideClick={(e) => closeSortOption(e)}>
      <div className={styles.dropdown}>
        <span className={styles.sortLabel}>Sort by: </span>
        <div
          className={styles.selectedSortWrapper}
          onClick={() => setSortOpen(!sortOpen)}
        >
          <span className={styles.selectedSort}> {selectedSort} </span>
          <SvgWrapper
            className={`${styles.arrowIcon} ${sortOpen ? styles.open : ""}`}
            svgSrc="arrow-down"
          ></SvgWrapper>
        </div>

        {sortOpen && (
          <ul className={styles.dropdownList}>
            {sortList?.map((sortType, index) => (
              <li
                key={sortType.value + index}
                onClick={(e) => updateSortOption(e, sortType.value)}
              >
                <span>{sortType.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default Sort;
