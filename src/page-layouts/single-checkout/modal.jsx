import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import * as styles from "./modal.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient } from "../../helper/utils";

const Modal = ({ isOpen = false, title = "", onCloseDialog, children }) => {
  const modalContainerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const closeDialog = () => {
    onCloseDialog();
  };

  useEffect(() => {
    setIsMounted(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      event.stopPropagation();
      if (
        modalContainerRef.current &&
        !modalContainerRef.current.contains(event.target) &&
        !event.target.className.includes("pac") &&
        !event.target.parentElement?.className.includes("pac")
      ) {
        closeDialog();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isRunningOnClient()) {
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          closeDialog();
        }
      };
      document.addEventListener("keydown", handleEscKey);

      return () => {
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, []);

  return isOpen ? (
    <div className={`${styles.modal} ${isMounted ? styles.slideInModal : ""} `}>
      <div
        className={`${styles.modalContainerCss} ${
          isMounted ? styles.slideIn : ""
        }`}
        ref={modalContainerRef}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>{title}</div>
          <div className={styles.cross} onClick={closeDialog}>
            <SvgWrapper svgSrc="cross-bold"></SvgWrapper>
          </div>
        </div>
        <div className={styles.modalBody} style={{ marginTop: "18px" }}>
          {children}
        </div>
      </div>
    </div>
  ) : null;
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  onCloseDialog: PropTypes.func,
  children: PropTypes.node,
};

export default Modal;
