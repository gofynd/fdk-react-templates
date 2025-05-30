/**
 * SortModal is a React component that renders a modal dialog for sorting options.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} [props.isOpen=true] - Determines if the modal is open.
 * @param {Array} [props.sortList=[]] - An array of sorting options, each option should have a `value` and `is_selected` property.
 * @param {Function} [props.onCloseModalClick=() => {}] - Callback function to handle the modal close event.
 * @param {Function} [props.onResetBtnClick=() => {}] - Callback function to handle the reset button click event.
 * @param {Function} [props.onApplyBtnClick=() => {}] - Callback function to handle the apply button click event.
 *
 * @returns {JSX.Element} A modal component with a list of sorting options.
 */

import React, { useState, useEffect } from "react";
import * as styles from "./sort-modal.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { useGlobalTranslation } from "fdk-core/utils";
import Modal from "../core/modal/modal";

function SortModal({
  isOpen = true,
  sortList = [],
  onCloseModalClick = () => { },
  onResetBtnClick = () => { },
  onApplyBtnClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
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
    <>
      {isOpen && 
        <Modal
          isOpen={isOpen}
          modalType="right-modal"
          closeDialog={onCloseModalClick}
          title={t("resource.facets.sort_by")}
        >
          <div className={styles.contentWrapper}>
            <div className={styles.modalContent}>
              <ul className={styles.sortList}>
                {sortList?.map((item) => (
                  <li
                    className={`${styles.sortItem} ${selectedSort?.value === item?.value ? styles.selected : ""}`}
                    key={item?.value}
                    onClick={() => handleItemClick(item)}
                  >
                    <SvgWrapper
                      className={styles.radioIcon}
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
                {t("resource.facets.cancel_caps")}
              </button>
              <button
                className={styles.applyBtn}
                onClick={() => onApplyBtnClick(selectedSort)}
              >
                {t("resource.facets.apply_caps")}
              </button>
            </div>
          </div>
        </Modal>
      }
    </>
  );
}

export default SortModal;
