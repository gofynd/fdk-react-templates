/**
 * Modal Component
 *
 * A flexible modal dialog component that can be used to display content in a pop-up overlay.
 * The modal supports various types, customizable styles, and can handle focus management
 * and outside clicks for closing.
 *
 * @param {boolean} isOpen - Controls whether the modal is open or not.
 * @param {boolean} hideHeader - Controls whether the modal header is shown or not.
 * @param {boolean} isCancellable - Determines if the modal can be closed by pressing the "Escape" key or clicking outside.
 * @param {boolean} childHandleFocus - If true, the modal does not automatically handle focus when opened.
 * @param {string} modalType - Type of modal. Can be "right-modal" or "center-modal" for positioning.
 * @param {Function} closeDialog - Callback function to close the modal.
 * @param {React.ReactNode} children - The content to be displayed inside the modal.
 * @param {string} title - The title of the modal, displayed in the header.
 * @param {string} titleClassName - Additional class name(s) for the modal title.
 * @param {string} headerClassName - Additional class name(s) for the modal header.
 * @param {string} bodyClassName - Additional class name(s) for the modal body.
 * @param {string} containerClassName - Additional class name(s) for the modal container.
 *
 * @returns {React.ReactElement|null} - The rendered modal component
 */

import React, { useEffect, useMemo, useRef } from "react";
import * as styles from "./modal.less";
import SvgWrapper from "../svgWrapper/SvgWrapper";

function Modal({
  isOpen,
  isCancellable = true,
  childHandleFocus = false,
  hideHeader = false,
  modalType = "",
  closeDialog = () => {},
  children,
  title,
  titleClassName,
  headerClassName,
  bodyClassName,
  containerClassName,
}) {
  const modalRef = useRef(null);
  const modalContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen && !childHandleFocus && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen, childHandleFocus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalContainerRef.current &&
        !modalContainerRef.current.contains(event.target)
      ) {
        closeDialog();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const customHeaderClass = useMemo(
    () => `${styles.modalHeader} ${headerClassName ?? ""}`,
    [headerClassName]
  );

  const customTitleClass = useMemo(
    () => `${styles.modalTitle} ${titleClassName ?? ""}`,
    [titleClassName]
  );

  const customContainerClass = useMemo(
    () => `${styles.modalContainer} ${containerClassName ?? ""}`,
    [containerClassName]
  );

  const customBodyClass = useMemo(
    () => `${styles.modalBody} ${bodyClassName ?? ""}`,
    [bodyClassName]
  );

  return (
    isOpen && (
      <div
        className={`${styles.modal} ${modalType === "right-modal" ? styles.rightModal : ""} ${modalType === "center-modal" ? styles.centerModal : ""}`}
        ref={modalRef}
        tabIndex="0"
        onKeyDown={(e) => e.key === "Escape" && isCancellable && closeDialog()}
      >
        <div className={customContainerClass} ref={modalContainerRef}>
          {!hideHeader && (
            <div className={customHeaderClass}>
              <div className={customTitleClass}>{title}</div>
              <div className={styles.crossIcon} onClick={closeDialog}>
                <SvgWrapper svgSrc="cross-black" />
              </div>
            </div>
          )}
          <div className={customBodyClass}>{children}</div>
        </div>
      </div>
    )
  );
}

export default Modal;
