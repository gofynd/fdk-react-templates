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

const SORT_LABELS = {
  recommended: "Recommended",
  newest: "Newest",
  lowest: "Lowest Price",
  highest: "Highest Price",
};

const SORT_ORDER = ["recommended", "newest", "lowest", "highest"];

const FILTER_ROW_DEFINITIONS = [
  {
    key: "product_type",
    label: "PRODUCT TYPE",
    matchers: ["department", "product type", "l1 category"],
  },
  {
    key: "product_feature",
    label: "PRODUCT FEATURE",
    matchers: ["product feature", "feature", "category", "l2 category"],
  },
  {
    key: "colour",
    label: "COLOUR",
    matchers: ["colour", "color"],
  },
  {
    key: "material",
    label: "MATERIAL",
    matchers: ["material", "fabric"],
  },
  {
    key: "fit",
    label: "FIT",
    matchers: ["fit"],
  },
  {
    key: "sizes",
    label: "SIZES",
    matchers: ["size", "sizes"],
  },
];

const getSortKind = (item) => {
  const normalized = [
    item?.display,
    item?.name,
    item?.value,
    item?.key,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (normalized.includes("recommend") || normalized.includes("popular")) {
    return "recommended";
  }
  if (normalized.includes("new") || normalized.includes("latest")) {
    return "newest";
  }
  if (
    normalized.includes("high to low") ||
    normalized.includes("highest") ||
    (normalized.includes("price") && normalized.includes("desc"))
  ) {
    return "highest";
  }
  if (
    normalized.includes("low to high") ||
    normalized.includes("lowest") ||
    (normalized.includes("price") && normalized.includes("asc"))
  ) {
    return "lowest";
  }

  return "";
};

const buildSortOptions = (sortList) => {
  const sortByKind = new Map();

  sortList?.filter(Boolean).forEach((item) => {
    const kind = getSortKind(item);
    if (!kind) return;

    const current = sortByKind.get(kind);
    if (!current || item.is_selected) {
      sortByKind.set(kind, {
        ...item,
        kind,
        displayLabel: SORT_LABELS[kind],
      });
    }
  });

  return SORT_ORDER.map((kind) => sortByKind.get(kind)).filter(Boolean);
};

const normalizeFilterKey = (filter) =>
  [filter?.key?.display, filter?.key?.name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const buildFilterRows = (filters) => {
  const usedFilters = new Set();

  return FILTER_ROW_DEFINITIONS.map((definition) => {
    const filter = filters?.find((item) => {
      if (!item?.key?.name || usedFilters.has(item.key.name)) return false;

      const normalized = normalizeFilterKey(item);
      const isMatch = definition.matchers.some((matcher) =>
        matcher === "size"
          ? normalized.split(/[^a-z0-9]+/).includes("size")
          : normalized.includes(matcher)
      );

      return isMatch;
    });

    if (filter?.key?.name) {
      usedFilters.add(filter.key.name);
    }

    return {
      ...definition,
      filter,
    };
  });
};

function FilterModal({
  isOpen = true,
  filters = [],
  sortList = [],
  productCount = 0,
  isResetFilterDisable = false,
  onCloseModalClick = () => { },
  onResetBtnClick = () => { },
  onApplyBtnClick = () => { },
  onFilterUpdate = () => { },
  onSortUpdate = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const [expandedFilterName, setExpandedFilterName] = useState("");
  const [selectedFiltersParams, setSelectedFiltersParams] = useState("");
  const [selectedSort, setSelectedSort] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const sortOptions = useMemo(() => buildSortOptions(sortList), [sortList]);
  const filterRows = useMemo(() => buildFilterRows(filters), [filters]);
  const selectedSortKind = selectedSort?.kind;
  const recommendedSort = sortOptions.find((item) => item.kind === "recommended");
  const viewProductsLabel = productCount
    ? `VIEW ${productCount} PRODUCTS`
    : "VIEW PRODUCTS";

  const handleFilterItemClick = (row) => {
    if (!row.filter) return;

    setExpandedFilterName((current) => (current === row.key ? "" : row.key));
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedSort(
        sortOptions.find((item) => item.is_selected) ||
          recommendedSort ||
          sortOptions[0]
      );
    }
  }, [isOpen, recommendedSort, sortOptions]);

  useEffect(() => {
    if (isOpen) {
      const searchParams = new URLSearchParams(location?.search);
      setSelectedFiltersParams(searchParams?.toString());
    } else {
      setSelectedFiltersParams("");
      setExpandedFilterName("");
      setSelectedSort(null);
    }
  }, [isOpen]);

  const handleModalClose = () => {
    navigate?.({
      pathname: location?.pathname,
      ...(selectedFiltersParams && { search: selectedFiltersParams }),
    });

    onCloseModalClick?.();
  };

  const handleResetClick = () => {
    setSelectedSort(recommendedSort || sortOptions[0] || null);
    onResetBtnClick?.();
  };

  const handleApplyClick = () => {
    if (selectedSort) {
      onSortUpdate?.(selectedSort.value || "");
    }

    onApplyBtnClick?.();
  };

  return (
    <>
      {isOpen && <Modal
        isOpen={isOpen}
        modalType="right-modal"
        closeDialog={handleModalClose}
        title="Filter & sort"
        customClassName={styles.filterSortModal}
        containerClassName={styles.filterSortContainer}
        headerClassName={styles.filterSortHeader}
        titleClassName={styles.filterSortTitle}
        bodyClassName={styles.filterSortBody}
      >
        <div className={styles.contentWrapper}>
          <div className={styles.modalContent}>
            {sortOptions.length > 0 && (
              <section className={styles.sortSection} aria-labelledby="filter-sort-heading">
                <h2 id="filter-sort-heading" className={styles.sectionTitle}>
                  SORT BY
                </h2>
                <ul className={styles.sortGrid}>
                  {sortOptions.map((item) => (
                    <li key={item?.value || item?.display}>
                      <button
                        type="button"
                        className={styles.sortOption}
                        onClick={() => setSelectedSort(item)}
                      >
                        <span
                          className={`${styles.radioMark} ${
                            selectedSortKind === item?.kind ? styles.selected : ""
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item.displayLabel}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <div className={styles.filterSection}>
              <ul className={styles.filterNameList}>
                {filterRows.map((row) => (
                  <li
                    className={`${styles.filterNameItem} ${row.key === expandedFilterName ? styles.active : ""}`}
                    key={row.key}
                  >
                    <button
                      type="button"
                      className={styles.filterNameButton}
                      onClick={() => handleFilterItemClick(row)}
                      aria-expanded={row.filter ? row.key === expandedFilterName : false}
                    >
                      <span className={styles.filterNameTitle}>
                        {row.label}
                      </span>
                      <span className={styles.filterToggleIcon} aria-hidden="true">
                        {row.key === expandedFilterName ? "-" : "+"}
                      </span>
                    </button>
                    {row.filter && row.key === expandedFilterName && (
                      <div className={styles.filterListPanel}>
                        <FilterList
                          key={row.filter?.key?.name}
                          isCollapsedView={false}
                          filter={row.filter}
                          onFilterUpdate={onFilterUpdate}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              className={styles.resetBtn}
              onClick={handleResetClick}
              disabled={isResetFilterDisable}
            >
              <span>{t("resource.facets.reset").toUpperCase()}</span>
              <span className={styles.resetIcon} aria-hidden="true" />
            </button>
            <button className={styles.applyBtn} onClick={handleApplyClick}>
              <span>{viewProductsLabel}</span>
              <span className={styles.applyIcon} aria-hidden="true" />
            </button>
          </div>
        </div>
      </Modal>}
    </>
  );
}

export default FilterModal;
