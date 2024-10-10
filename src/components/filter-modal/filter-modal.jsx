import React, { useEffect, useMemo, useState } from "react";
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
  const [activeFilterName, setActiveFilterName] = useState("");
  const [selectedFiltersParams, setSelectedFiltersParams] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleFilterItemClick = (name) => {
    setActiveFilterName(name);
  };

  useEffect(() => {
    if (isOpen && filters.length > 0 && !activeFilterName) {
      setActiveFilterName(filters[0].key.name);
    }
  }, [isOpen, filters]);

  useEffect(() => {
    if (isOpen) {
      const searchParams = new URLSearchParams(location?.search);
      setSelectedFiltersParams(searchParams?.toString());
    } else {
      setSelectedFiltersParams("");
      setActiveFilterName("");
    }
  }, [isOpen]);

  const handleModalClose = () => {
    navigate?.({
      pathname: location?.pathname,
      ...(selectedFiltersParams && { search: selectedFiltersParams }),
    });

    onCloseModalClick?.();
  };

  const activeFilter = useMemo(
    () => filters.find((filter) => filter.key.name === activeFilterName),
    [filters, activeFilterName]
  );

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
                  className={`${styles.filterNameItem} ${item.key.name === activeFilterName ? styles.active : ""}`}
                  key={`${index}-${item.key.display}`}
                  onClick={() => handleFilterItemClick(item.key.name)}
                >
                  <h5 className={styles.filterNameTitle}>{item.key.display}</h5>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.rightPane}>
            {activeFilter && (
              <FilterList
                key={activeFilter?.key?.name}
                isCollapsedView={false}
                filter={activeFilter}
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
