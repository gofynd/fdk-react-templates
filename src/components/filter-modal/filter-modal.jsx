import React, { useEffect, useState } from "react";
import * as styles from "./filter-modal.less";
import Modal from "../core/modal/modal";
import FilterList from "../../page-layouts/plp/Components/filter-list/filter-list";
import { useLocation, useNavigate } from "react-router-dom";

function FilterModal({
  isOpen = true,
  filters = [],
  isResetFilterDisable = false,
  onCloseModalClick = () => {},
  onResetBtnClick = () => {},
  onApplyBtnClick = () => {},
  onFilterUpdate = () => {},
}) {
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [selectedFiltersParams, setSelectedFiltersParams] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleFilterItemClick = (index) => {
    setActiveFilterIndex(index);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location?.search);
    setSelectedFiltersParams(searchParams?.toString());
  }, []);

  const handleModalClose = () => {
    navigate?.({
      pathname: location?.pathname,
      ...(selectedFiltersParams && { search: selectedFiltersParams }),
    });

    onCloseModalClick?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      modalType="right-modal"
      closeDialog={handleModalClose}
      title="Filter"
    >
      <div className={styles.contentWrapper}>
        <div className={styles.modalContent}>
          <div className={styles.leftPane}>
            <ul className={styles.filterNameList}>
              {filters?.map((item, index) => (
                <li
                  className={`${styles.filterNameItem} ${index === activeFilterIndex ? styles.active : ""}`}
                  key={`${index}-${item.key.display}`}
                  onClick={() => handleFilterItemClick(index)}
                >
                  <h5 className={styles.filterNameTitle}>{item.key.display}</h5>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.rightPane}>
            {filters?.[activeFilterIndex] && (
              <FilterList
                key={activeFilterIndex}
                isCollapsedView={false}
                filter={filters?.[activeFilterIndex]}
                onFilterUpdate={onFilterUpdate}
              />
            )}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.resetBtn}
            onClick={onResetBtnClick}
            disabled={isResetFilterDisable}
          >
            Reset
          </button>
          <button className={styles.applyBtn} onClick={() => onApplyBtnClick()}>
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default FilterModal;
