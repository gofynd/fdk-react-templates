import React, { useState } from "react";
import * as styles from "./comment.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import Modal from "../../../../components/core/modal/modal";

function Comment({ comment = "", onCommentChange = () => {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isCommentError = comment.length > 500;

  const openCommentModal = () => {
    setIsModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={styles.commentOuterBox}>
        <div className={styles.addCommentHeader}>ADD COMMENT</div>
        <div className={styles.commentBoxMobile}>
          <SvgWrapper svgSrc="comment-note-mobile" />
          {comment.length > 0 ? (
            <div className={styles.commentText}>{comment}</div>
          ) : (
            <div className={styles.addCommentLabel}>
              <div className={styles.addCommentTitle}>ADD COMMENT</div>
              <div>Want to provide any specific instructions?</div>
            </div>
          )}
          <div className={styles.addBtn} onClick={openCommentModal}>
            {comment.length > 0 ? "Edit" : "+ ADD"}
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
              placeholder="Have any specific comment?..."
              onChange={(e) => onCommentChange(e.target.value)}
            />
            <div
              className={styles.commentLength}
            >{`${comment.length}/500`}</div>
          </div>
          {isCommentError && (
            <div className={styles.commentError}>
              Comment should be within 500 characters
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} closeDialog={closeCommentModal}>
        <div className={styles.modelHeader}>
          <span>Add Comment</span>
          <SvgWrapper svgSrc="cross-black" onClick={closeCommentModal} />
        </div>
        <div className={styles.modalContent}>
          <div>
            <textarea
              placeholder="Have any specific instructions..."
              className={styles.modalTextarea}
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
            />
            <div className={styles.modalErrorWrapper}>
              {isCommentError && (
                <div className={styles.modalCommentError}>
                  Comment should be within 500 characters
                </div>
              )}
              <div
                className={styles.modalCommentLength}
              >{`${comment.length}/500`}</div>
            </div>
          </div>
          <button className={styles.modalActionBtn}>Add Comment</button>
        </div>
      </Modal>
    </>
  );
}

export default Comment;
