import React from "react";
import * as styles from "./cancel-order-modal.less";
import CloseIcon from "../../assets/images/close.svg";
import Modal from "../core/modal/modal";
import FyButton from "../core/fy-button/fy-button";

function CancelOrderModal({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  title = "Cancel Order?",
  message = "Cancelling the order will stop the payment process. If any amount was deducted, it will be refunded automatically within 5-7 business days.",
  cancelLabel = "No",
  confirmLabel = "yes",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      closeDialog={onClose}
      hideHeader={true}
      containerClassName={styles.cancelOrderModalContainer}
      bodyClassName={styles.cancelOrderModalBody}
    >
      <section
        className={styles.cancelOrderModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-order-modal-title"
        aria-describedby="cancel-order-modal-message"
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} id="cancel-order-modal-title">
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close cancel order dialog"
          >
            <CloseIcon aria-hidden="true" focusable="false" />
          </button>
        </div>
        <div className={styles.modalContent}>
          <p className={styles.modalMessage} id="cancel-order-modal-message">
            {message}
          </p>
        </div>
        <div className={styles.modalActions}>
          <FyButton
            variant="outlined"
            color="primary"
            className={styles.modalButton}
            onClick={onClose}
          >
            {cancelLabel}
          </FyButton>
          <FyButton
            variant="contained"
            color="primary"
            className={styles.modalButton}
            onClick={onConfirm}
          >
            {confirmLabel}
          </FyButton>
        </div>
      </section>
    </Modal>
  );
}

export default CancelOrderModal;
