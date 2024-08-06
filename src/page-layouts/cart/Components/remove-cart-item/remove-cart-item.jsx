import React, { useMemo } from "react";
import * as styles from "./remove-cart-item.less";
import Modal from "../../../../components/core/modal/modal";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";

function RemoveCartItem({
  isOpen = false,
  cartItem = null,
  onRemoveButtonClick = () => {},
  onWishlistButtonClick = () => {},
  onCloseDialogClick = () => {},
}) {
  const getProductImage = useMemo(() => {
    if (
      cartItem?.product?.images?.length > 0 &&
      cartItem?.product?.images?.[0]?.url
    ) {
      return cartItem.product.images[0].url.replace("original", "resize-w:150");
    }
  }, [cartItem]);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onWishlistButtonClick(cartItem);
  };

  return (
    <Modal isOpen={isOpen} closeDialog={onCloseDialogClick}>
      <div className={styles.removeModalHeader}>
        <div className={styles.titleContainer}>
          <div className={styles.headerTitle}>Remove Item</div>
          <div className={styles.headerSubTitle}>
            Are your sure you want to remove this item?
          </div>
        </div>
        <SvgWrapper
          className={styles.headerCloseIcon}
          svgSrc="item-close"
          onClick={onCloseDialogClick}
        />
      </div>
      <div className={styles.removeModalBody}>
        <div className={styles.itemDetails}>
          {getProductImage && (
            <div className={styles.itemImg}>
              <img src={getProductImage} alt={cartItem?.product?.name} />
            </div>
          )}
          <div className={styles.itemName}>{cartItem?.product?.name}</div>
        </div>
      </div>
      <div className={styles.removeModalFooter}>
        <div className={styles.removeBtn} onClick={onRemoveButtonClick}>
          REMOVE
        </div>
        <div className={styles.wishlistBtn} onClick={onWishlistButtonClick}>
          MOVE TO WISHLIST
        </div>
      </div>
    </Modal>
  );
}

export default RemoveCartItem;
