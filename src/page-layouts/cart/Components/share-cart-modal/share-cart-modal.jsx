import React from "react";
import * as styles from "./share-cart-modal.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import Loader from "../../../../components/loader/loader";

function ShareCartModal({
  isOpen,
  title,
  qrCode,
  isShareLoading,
  onCopyToClipboardClick,
  onFacebookShareClick,
  onTwitterShareClick,
  onCloseDialogClick,
}) {
  return (
    isOpen && (
      <div className={styles.sharePopup}>
        {isShareLoading ? (
          <div className={styles.loaderCenter}>
            <Loader />
          </div>
        ) : (
          <>
            {title && <p className={styles.popupTitle}>{title}</p>}
            <div className={styles.close} onClick={onCloseDialogClick}>
              <SvgWrapper svgSrc="item-close" />
            </div>
            <div
              className={styles.qrCode}
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
            <p className={styles.nccMb10}>OR</p>
            <div className={styles.icons}>
              <div className={styles.copy} onClick={onCopyToClipboardClick}>
                <span className={styles.shareIcon}>
                  <SvgWrapper svgSrc="share-copy" />
                </span>
              </div>
              <div className={styles.facebook} onClick={onFacebookShareClick}>
                <span className={styles.shareIcon}>
                  <SvgWrapper svgSrc="share-facebook" />
                </span>
              </div>
              <div className={styles.twitter} onClick={onTwitterShareClick}>
                <span className={styles.shareIcon}>
                  <SvgWrapper svgSrc="share-twitter" />
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
}

export default ShareCartModal;
