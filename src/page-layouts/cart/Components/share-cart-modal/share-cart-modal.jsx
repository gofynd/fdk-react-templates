import React, { useEffect, useRef } from "react";
import * as styles from "./share-cart-modal.less";
import Loader from "../../../../components/loader/loader";
import { useGlobalTranslation } from "fdk-core/utils";
import CloseIcon from "../../../../assets/images/item-close.svg";
import ShareCopyIcon from "../../../../assets/images/share-copy.svg";
import ShareFacebookIcon from "../../../../assets/images/share-facebook.svg";
import ShareTwitterIcon from "../../../../assets/images/share-twitter.svg";

function ShareCartModal({
  isOpen,
  title,
  qrCode,
  isShareLoading,
  onCopyToClipboardClick = () => {},
  onFacebookShareClick = () => {},
  onTwitterShareClick = () => {},
  onCloseDialogClick = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const sharePopupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sharePopupRef.current &&
        !sharePopupRef.current.contains(event.target)
      ) {
        onCloseDialogClick();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    isOpen && (
      <div className={styles.sharePopup} ref={sharePopupRef}>
        {isShareLoading ? (
          <div className={styles.loaderCenter}>
            <Loader />
          </div>
        ) : (
          <>
            {title && <p className={styles.popupTitle}>{title}</p>}
            <div className={styles.close} onClick={onCloseDialogClick}>
              <CloseIcon />
            </div>
            <div
              className={styles.qrCode}
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
            <p className={styles.nccMb10}>{t("resource.common.or")}</p>
            <div className={styles.icons}>
              <div
                className={styles.shareIcon}
                onClick={onCopyToClipboardClick}
              >
                <ShareCopyIcon />
              </div>
              <div className={styles.shareIcon} onClick={onFacebookShareClick}>
                <ShareFacebookIcon />
              </div>
              <div className={styles.shareIcon} onClick={onTwitterShareClick}>
                <ShareTwitterIcon />
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
}

export default ShareCartModal;
