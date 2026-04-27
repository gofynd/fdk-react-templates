import React, { useState, useMemo, useCallback } from "react";
import Modal from "../core/modal/modal";
import SvgClose from "../../assets/images/close-wishlist.svg";
import * as styles from "./create-wishlist-modal.less";
import DangerInfoIcon from "../../assets/images/danger-info.svg";
import { useGlobalTranslation } from "fdk-core/utils";

const CreateRenameWishlistModal = ({
  isOpen,
  onClose,
  title,
  textAreaTitle,
  textAreaPlaceholder,
  isError = false,
  errorMessage,
  onSubmit = () => {},
  cancelButtonText,
  createButtonText,
  action = "create",
  parentTitle = "",
}) => {
  const { t } = useGlobalTranslation("translation");
  const [textAreaValue, setTextAreaValue] = useState("");

  const isRenameDisabled = useMemo(
    () => action === "rename" && textAreaValue.trim() === parentTitle.trim(),
    [action, textAreaValue, parentTitle]
  );

  const isButtonDisabled = useMemo(
    () => isRenameDisabled || textAreaValue.trim() === "",
    [isRenameDisabled, textAreaValue]
  );

  const shouldShowError = useMemo(
    () => isError || isRenameDisabled,
    [isError, isRenameDisabled]
  );

  const currentErrorMessage = useMemo(
    () =>
      isRenameDisabled
        ? t(
            "resource.dynamic_label.modal_wishlist_name_cannot_be_the_same_as_the_original_name"
          )
        : errorMessage,
    [isRenameDisabled, errorMessage]
  );

  const handleTextAreaChange = useCallback((e) => {
    setTextAreaValue(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isButtonDisabled) {
      onSubmit(textAreaValue);
      setTextAreaValue("");
    }
  }, [onSubmit, textAreaValue, isButtonDisabled]);

  const handleClose = useCallback(() => {
    onClose();
    setTextAreaValue("");
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} closeDialog={onClose} hideHeader={true}>
      <div
        className={styles.createWishlistModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.createWishlistModalHeader}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={styles.createWishlistModalTitle}
            onClick={(e) => e.stopPropagation()}
          >
            {title}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className={styles.createWishlistModalClose}
            type="button"
            aria-label="Close modal"
          >
            <SvgClose />
          </button>
        </div>

        <div
          className={styles.noteContainer}
          onClick={(e) => e.stopPropagation()}
        >
          <fieldset
            className={styles.fieldset}
            onClick={(e) => e.stopPropagation()}
          >
            <legend
              className={styles.legend}
              onClick={(e) => e.stopPropagation()}
            >
              {textAreaTitle}
            </legend>
            <div
              className={styles.textareaWrapper}
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                className={styles.textarea}
                value={textAreaValue}
                onChange={handleTextAreaChange}
                placeholder={textAreaPlaceholder}
                maxLength={40}
                rows={1}
                name="wishlist-note"
                aria-label={textAreaTitle}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>
          </fieldset>
          <div
            className={`${styles.noteFooter} ${shouldShowError ? styles.error : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {shouldShowError && (
              <span
                className={styles.errorMessage}
                role="alert"
                onClick={(e) => e.stopPropagation()}
              >
                <DangerInfoIcon />
                {currentErrorMessage}
              </span>
            )}
            <span
              className={styles.charCount}
              onClick={(e) => e.stopPropagation()}
            >
              {textAreaValue.length}/40
            </span>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            type="button"
          >
            {cancelButtonText}
          </button>
          <button
            className={`${styles.button} ${styles.createButton}`}
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            type="submit"
          >
            {createButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateRenameWishlistModal;
