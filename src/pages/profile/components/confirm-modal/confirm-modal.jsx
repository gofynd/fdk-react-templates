import React, { useCallback, useState } from "react";
import * as styles from "./confirm-modal.less";
import Modal from "../../../../components/core/modal/modal";
import FyButton from "../../../../components/core/fy-button/fy-button";
import { useGlobalTranslation } from "fdk-core/utils";

function ConfirmModal({
  isOpen,
  onClose,
  header,
  text = "",
  leftButton,
  rightButton,
  onConfirm,
  onCancel,
}) {
  const { t } = useGlobalTranslation("translation");
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
      title={header || t("resource.common.confirm")}
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
            {leftButton || t("resource.common.no")}
          </FyButton>
          <div className={styles.separator}>|</div>
          <FyButton
            variant="text"
            className={styles.yesButton}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {rightButton || t("resource.common.yes")}
          </FyButton>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
