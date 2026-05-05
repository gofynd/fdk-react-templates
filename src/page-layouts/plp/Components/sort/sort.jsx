import React, { useState, useMemo, useEffect } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./sort.less";
import { useLocation } from "react-router-dom";
import { useGlobalTranslation } from "fdk-core/utils";

function Sort({ sortList = [], onSortUpdate = () => { } }) {
  const { t } = useGlobalTranslation("translation");
  const [sortOpen, setSortOpen] = useState(false);
  const location = useLocation();

  const selectedSort = useMemo(() => {
    let selectedItem = sortList?.find((x) => x.is_selected);
    if (selectedItem) {
      return selectedItem.name;
    }
    return sortList?.[0]?.name;
  }, [sortList]);

  function updateSortOption(e, sortValue) {
    e.stopPropagation();
    e.preventDefault();
    onSortUpdate(sortValue);
    closeSortOption(e);
  }

  function closeSortOption() {
    setSortOpen(false);
  }

  useEffect(() => {
    closeSortOption();
  }, [location?.search]);

  return (
    <OutsideClickHandler onOutsideClick={closeSortOption}>
      <div className={styles.dropdown}>
        <span className={styles.sortLabel}>{t("resource.facets.sort_by")}: </span>
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
