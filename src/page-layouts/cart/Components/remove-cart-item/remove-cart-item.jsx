import React, { useMemo } from "react";
import * as styles from "./remove-cart-item.less";
import Modal from "../../../../components/core/modal/modal";
import { useGlobalTranslation } from "fdk-core/utils";

function RemoveCartItem({
  isOpen = false,
  cartItem = null,
  onRemoveButtonClick = () => { },
  onWishlistButtonClick = () => { },
  onCloseDialogClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const getProductImage = useMemo(() => {
    if (
      cartItem?.product?.images?.length > 0 &&
      cartItem?.product?.images?.[0]?.url
    ) {
      return cartItem.product.images[0].url.replace("original", "resize-w:250");
    }
  }, [cartItem]);

  return (
    <Modal
      title={t("resource.cart.remove_item")}
      isOpen={isOpen}
      closeDialog={onCloseDialogClick}
      headerClassName={styles.header}
      subTitleClassName={styles.subTitle}
      containerClassName={styles.modalContainer}
      subTitle={t("resource.cart.confirm_item_removal")}
    >
      <div className={styles.removeModalBody}>
        <div className={styles.itemDetails}>
          {getProductImage && (
            <div className={styles.itemImg}>
              <img src={getProductImage} alt={cartItem?.product?.name} />
            </div>
          )}
          <div>
            <div className={styles.itemBrand}>
              {cartItem?.product?.brand?.name}
            </div>
            <div className={styles.itemName}>{cartItem?.product?.name}</div>
          </div>
        </div>
      </div>
      <div className={styles.removeModalFooter}>
        <div className={styles.removeBtn} onClick={onRemoveButtonClick}>
          {t("resource.facets.remove_caps")}
        </div>
        <div className={styles.wishlistBtn} onClick={onWishlistButtonClick}>
          {t("resource.cart.move_to_wishlist")}
        </div>
      </div>
    </Modal>
  );
}

export default RemoveCartItem;
