import React, { useState } from "react";
import * as styles from "./share-cart.less";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import ShareCartModal from "../share-cart-modal/share-cart-modal";

function ShareCart({
  showCard = false,
  qrCode = "",
  isShareLoading = false,
  onCopyToClipboardClick = () => {},
  onFacebookShareClick = () => {},
  onTwitterShareClick = () => {},
  onShareClick = () => {},
}) {
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
                <SvgWrapper svgSrc="share-cart" />
              </span>
              SHARE SHOPPING CART
            </div>
            <div className={styles.rightPart} onClick={getCartShareLink}>
              SHARE
            </div>
          </div>
        ) : (
          <div className={styles.nccCartShare} onClick={getCartShareLink}>
            <span className={styles.shareCartIconGreen}>
              <SvgWrapper svgSrc="share-cart" />
            </span>
            <span className={styles.shareBagBtn}>SHARE BAG</span>
          </div>
        )}
      </div>
      <ShareCartModal
        title="Spread the shopping delight! Scan QR & share these products with your loved ones"
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
