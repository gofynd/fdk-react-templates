import React, { useState, useEffect } from "react";
import * as styles from "./sort-modal.less";
import Modal from "../core/modal/modal";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function SortModal({
  isOpen = true,
  sortList = [],
  onCloseModalClick = () => {},
  onResetBtnClick = () => {},
  onApplyBtnClick = () => {},
}) {
  const [selectedSort, setSelectedSort] = useState(() => {
    let selectedItem = sortList?.find((x) => x.is_selected);
    return selectedItem || sortList?.[0];
  });

  useEffect(() => {
    let selectedItem = sortList?.find((x) => x.is_selected);
    setSelectedSort(selectedItem || sortList?.[0]);
  }, [sortList]);

  const handleItemClick = (item) => {
    setSelectedSort(item);
  };

  return (
    <Modal
      isOpen={isOpen}
      modalType="right-modal"
      closeDialog={onCloseModalClick}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.modalHeader}>
          <h4 className={styles.headerTitle}>Sort by</h4>
          <button className={styles.crossIcon} onClick={onCloseModalClick}>
            <SvgWrapper svgSrc="cross-black" />
          </button>
        </div>
        <div className={styles.modalContent}>
          <ul className={styles.sortList}>
            {sortList?.map((item) => (
              <li
                className={styles.sortItem}
                key={item?.value}
                onClick={() => handleItemClick(item)}
              >
                <SvgWrapper
                  className={`${styles.radioIcon} ${selectedSort?.value === item?.value ? styles.active : ""}`}
                  svgSrc={
                    selectedSort?.value === item?.value
                      ? "radio-selected"
                      : "radio"
                  }
                />
                {item.display}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.resetBtn} onClick={onResetBtnClick}>
            Reset
          </button>
          <button
            className={styles.applyBtn}
            onClick={() => onApplyBtnClick(selectedSort)}
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default SortModal;
