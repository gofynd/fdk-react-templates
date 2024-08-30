import React, { useState } from "react";
import * as styles from "./filter-modal.less";
import Modal from "../core/modal/modal";
import FilterList from "../../page-layouts/plp/Components/filter-list/filter-list";

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

  const handleFilterItemClick = (index) => {
    setActiveFilterIndex(index);
  };

  const handleFilterUpdate = ({ filter, item }) => {};

  return (
    <Modal
      isOpen={isOpen}
      modalType="right-modal"
      closeDialog={onCloseModalClick}
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
