import React, { useState } from "react";
import * as styles from "./share-cart.less";
import ShareCartModal from "../share-cart-modal/share-cart-modal";
import { useGlobalTranslation } from "fdk-core/utils";
import ShareCartIcon from "../../../../assets/images/share-cart.svg";

function ShareCart({
  showCard = false,
  qrCode = "",
  isShareLoading = false,
  onCopyToClipboardClick = () => { },
  onFacebookShareClick = () => { },
  onTwitterShareClick = () => { },
  onShareClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const [showShare, setShowShare] = useState(false);

  const getCartShareLink = () => {
    setShowShare(true);
    onShareClick();
  };

  return (
    <div className={styles.cartSharePopup}>
      <div className={styles.cartShare}>
        {showCard ? (
          <div className={styles.shareCartBox}>
            <div className={styles.leftPart}>
              <span className={styles.shareCartIcon}>
                <ShareCartIcon />
              </span>
              {t("resource.cart.share_shopping_cart_caps")}
            </div>
            <div className={styles.rightPart} onClick={getCartShareLink}>
              {t("resource.common.share_caps")}
            </div>
          </div>
        ) : (
          <div className={styles.nccCartShare} onClick={getCartShareLink}>
            <span className={styles.shareCartIconGreen}>
              <ShareCartIcon />
            </span>
            <span className={styles.shareBagBtn}>{t("resource.cart.share_bag_caps")}</span>
          </div>
        )}
      </div>
      <ShareCartModal
        title={t("resource.cart.share_shopping_qr")}
        isOpen={showShare}
        {...{
          isShareLoading,
          qrCode,
          onCopyToClipboardClick,
          onFacebookShareClick,
          onTwitterShareClick,
        }}
        onCloseDialogClick={() => {
          setShowShare(false);
        }}
      />
    </div>
  );
}

export default ShareCart;
