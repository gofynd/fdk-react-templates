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
 * @param {string} subTitle - The subTitle of the modal, displayed in the header.
 * @param {string} subTitleClassName - Additional class name(s) for the modal subTitle.
 * @param {string} headerClassName - Additional class name(s) for the modal header.
 * @param {string} bodyClassName - Additional class name(s) for the modal body.
 * @param {string} containerClassName - Additional class name(s) for the modal container.
 * @param {string} ignoreClickOutsideForClass - Classe name for the the element on which clickOutside is not desireable.
 *
 * @returns {React.ReactElement|null} - The rendered modal component
 */

import React, { useEffect, useMemo, useRef } from "react";
import * as styles from "./modal.less";
import { useMobile } from "../../../helper/hooks/useMobile";
import CloseBoldIcon from "../../../assets/images/close-bold.svg";
import { isRunningOnClient } from "../../../helper/utils";

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
  subTitle,
  subTitleClassName,
  headerClassName,
  bodyClassName,
  containerClassName,
  ignoreClickOutsideForClass,
  customClassName,
}) {
  const modalRef = useRef(null);
  const modalContainerRef = useRef(null);

  const isMobile = useMobile();

  useEffect(() => {
    if (isOpen && !childHandleFocus && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen, childHandleFocus]);

  const handleClickOutside = (event) => {
    if (
      isCancellable &&
      modalContainerRef.current &&
      !modalContainerRef.current.contains(event.target) &&
      (ignoreClickOutsideForClass
        ? !event.target.className.includes(ignoreClickOutsideForClass) &&
          !event.target.parentElement?.className.includes(
            ignoreClickOutsideForClass
          )
        : true)
    ) {
      closeDialog(event);
    }
  };

  useEffect(() => {
    if(!isRunningOnClient()) return;
    const openModals = document.querySelectorAll(`.${styles.modalContainer}`);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (openModals.length < 1) {
      document.body.style.overflow = "unset";
    }

    return () => {
      const remainingModals = document.querySelectorAll(
        `.${styles.modalContainer}`
      );
      if (remainingModals.length < 1) {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen]);

  const customHeaderClass = useMemo(
    () => `${styles.modalHeader} ${headerClassName ?? ""}`,
    [headerClassName]
  );

  const customTitleClass = useMemo(
    () => `${styles.modalTitle} ${titleClassName ?? ""}`,
    [titleClassName]
  );
  const customSubTitleClass = useMemo(
    () => `${styles.modalSubTitle} ${subTitleClassName ?? ""}`,
    [subTitleClassName]
  );

  const customContainerClass = useMemo(
    () =>
      `${styles.modalContainer} ${modalType === "" ? styles["modalContainer--borders"] : ""} ${containerClassName ?? ""}`,
    [containerClassName]
  );

  const customBodyClass = useMemo(
    () => `${styles.modalBody} ${bodyClassName ?? ""}`,
    [bodyClassName]
  );

  // const animationVariants = useMemo(
  //   () => ({
  //     initial: { opacity: 0, x: isRunningOnClient() && document.dir === "rtl" ? "-100%" : "100%" },
  //     animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  //     exit: { opacity: 0, x: isRunningOnClient() && document.dir === "rtl" ? "-100%" : "100%", transition: { duration: 0.5 } },
  //   }),
  //   []
  // ); 

  // const mobileAnimationVariants = useMemo(
  //   () => ({
  //     initial: { opacity: 0, y: "100%" },
  //     animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  //     exit: { opacity: 0, y: "100%", transition: { duration: 0.5 } },
  //   }),
  //   []
  // );

  return (
    <>
      {isOpen && (
        <div
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          className={`${styles.modal} ${modalType === "right-modal" ? styles.rightModal : ""} ${modalType === "center-modal" ? styles.centerModal : ""} ${customClassName ?? ""}`}
          ref={modalRef}
          // tabIndex="0"
          // onKeyDown={(e) =>
          //   e.key === "Escape" && isCancellable && closeDialog(e)
          // }
          onClick={handleClickOutside}
        >
          <div
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1, transition: { duration: 0.5 } }}
            // exit={{ opacity: 0, transition: { duration: 0.5 } }}
            // {...(modalType === "right-modal" && !isMobile && animationVariants)}
            // {...(isMobile &&
            //   modalType !== "center-modal" &&
            //   mobileAnimationVariants)}
            className={customContainerClass}
            ref={modalContainerRef}
          >
            {!hideHeader && (
              <div className={customHeaderClass}>
                <div>
                  <div className={customTitleClass}>{title}</div>
                  {subTitle && (
                    <div className={customSubTitleClass}>{subTitle}</div>
                  )}
                </div>
                <div className={styles.crossIcon} onClick={closeDialog}>
                  <CloseBoldIcon />
                </div>
              </div>
            )}
            <div className={customBodyClass}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
