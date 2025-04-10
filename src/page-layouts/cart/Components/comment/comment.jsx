import React, { useState } from "react";
import * as styles from "./comment.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import Modal from "../../../../components/core/modal/modal";
import { useGlobalTranslation } from "fdk-core/utils";

function Comment({ comment = "", onCommentChange = () => { } }) {
  const { t } = useGlobalTranslation("translation");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isCommentError = comment.length > 500;

  const openCommentModal = () => {
    setIsModalOpen(true);
  };

  const closeCommentModal = () => {
    if (comment) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className={styles.commentOuterBox}>
        <div className={styles.addCommentHeader}>{t("resource.cart.add_comment_caps")}</div>
        <div className={styles.commentBoxMobile}>
          <div className={styles.commentIconMobile}>
            <SvgWrapper svgSrc="comment-note-mobile" />
          </div>
          {comment.length > 0 ? (
            <div className={styles.commentText}>{comment}</div>
          ) : (
            <div className={styles.addCommentLabel}>
              <div className={styles.addCommentTitle}>{t("resource.cart.add_comment_caps")}</div>
              <div>{t("resource.cart.specific_instructions_prompt")}</div>
            </div>
          )}
          <div className={styles.addBtn} onClick={openCommentModal}>
            {comment.length > 0 ? t("resource.facets.edit") : `+ ${t("resource.facets.add_caps")}`}
          </div>
        </div>
        <div className={styles.inputBox}>
          <div className={styles.commentBox}>
            <SvgWrapper
              className={styles.commentNoteIcon}
              svgSrc="comment-note"
            />
            <input
              type="text"
              value={comment}
              placeholder={t("resource.cart.placeholder_specific_comment")}
              onChange={(e) => onCommentChange(e.target.value)}
            />
            <div
              className={styles.commentLength}
            >{`${comment.length}/500`}</div>
          </div>
          {isCommentError && (
            <div className={styles.commentError}>
              {t("resource.cart.comment_character_limit")}
            </div>
          )}
        </div>
      </div>
      <Modal
        title={t("resource.cart.add_comment")}
        isOpen={isModalOpen}
        closeDialog={() => setIsModalOpen(false)}
        headerClassName={styles.modelHeader}
      >
        <div className={styles.modalContent}>
          <div>
            <textarea
              placeholder={t("resource.cart.have_any_specific_instructions")}
              className={styles.modalTextarea}
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
            />
            <div className={styles.modalErrorWrapper}>
              {isCommentError && (
                <div className={styles.modalCommentError}>
                  {t("resource.cart.comment_character_limit")}
                </div>
              )}
              <div
                className={styles.modalCommentLength}
              >{`${comment.length}/500`}</div>
            </div>
          </div>
          <button
            disabled={!comment}
            className={styles.modalActionBtn}
            onClick={closeCommentModal}
          >
            {t("resource.cart.add_comment")}
          </button>
        </div>
      </Modal >
    </>
  );
}

export default Comment;
