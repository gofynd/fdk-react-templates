/**
 * FilterModal is a React component that renders a modal for applying filters.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} [props.isOpen=true] - Determines if the modal is open.
 * @param {Array} [props.filters=[]] - An array of filter objects to be displayed.
 * @param {boolean} [props.isResetFilterDisable=false] - Flag to disable the reset filter button.
 * @param {Function} [props.onCloseModalClick=() => {}] - Callback function triggered when the modal close button is clicked.
 * @param {Function} [props.onResetBtnClick=() => {}] - Callback function triggered when the reset button is clicked.
 * @param {Function} [props.onApplyBtnClick=() => {}] - Callback function triggered when the apply button is clicked.
 * @param {Function} [props.onFilterUpdate=() => {}] - Callback function triggered when a filter is updated.
 *
 * @returns {JSX.Element} A modal component for filter selection.
 */

import React, { useEffect, useMemo, useState } from "react";
import * as styles from "./filter-modal.less";
import FilterList from "../../page-layouts/plp/Components/filter-list/filter-list";
import { useLocation } from "react-router-dom";
import { useNavigate, useGlobalTranslation } from "fdk-core/utils";
import Modal from "../core/modal/modal";

function FilterModal({
  isOpen = true,
  filters = [],
  isResetFilterDisable = false,
  onCloseModalClick = () => { },
  onResetBtnClick = () => { },
  onApplyBtnClick = () => { },
  onFilterUpdate = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
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
    }, { replace: true });

    onCloseModalClick?.();
  };

  const activeFilter = useMemo(
    () => filters.find((filter) => filter.key.name === activeFilterName),
    [filters, activeFilterName]
  );

  return (
    <>
      {isOpen && <Modal
        isOpen={isOpen}
        modalType="right-modal"
        closeDialog={handleModalClose}
        title={t("resource.common.filter")}
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
              {t("resource.facets.reset")}
            </button>
            <button className={styles.applyBtn} onClick={() => onApplyBtnClick()}>
              {t("resource.facets.apply")}
            </button>
          </div>
        </div>
      </Modal>}
    </>
  );
}

export default FilterModal;
