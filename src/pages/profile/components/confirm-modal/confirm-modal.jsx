import React, { useCallback, useState } from "react";
import * as styles from "./confirm-modal.less";
import Modal from "../../../../components/core/modal/modal";
import FyButton from "../../../../components/core/fy-button/fy-button";

function ConfirmModal({
  isOpen,
  onClose,
  header = "Confirm",
  text = "",
  leftButton = "No",
  rightButton = "Yes",
  onConfirm,
  onCancel,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onConfirm]);

  return (
    <Modal
      isOpen={isOpen}
      closeDialog={onClose}
      title={header}
      modalType="center-modal"
    >
      <div className={styles.modalContainer}>
        {text && <div className={styles.body}>{text}</div>}
        <div className={styles.btnContainer}>
          <FyButton
            variant="text"
            className={styles.noButton}
            onClick={onCancel}
          >
            {leftButton}
          </FyButton>
          <div className={styles.separator}>|</div>
          <FyButton
            variant="text"
            className={styles.yesButton}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {rightButton}
          </FyButton>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
