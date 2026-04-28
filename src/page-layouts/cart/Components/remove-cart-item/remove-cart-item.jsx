import React, { useMemo } from "react";
import * as styles from "./remove-cart-item.less";
import Modal from "../../../../components/core/modal/modal";
import { useGlobalTranslation } from "fdk-core/utils";
import { truncateName } from "../../../../helper/utils";

function RemoveCartItem({
  isOpen = false,
  cartItem = null,
  isRemoving = false,
  isMovingToWishlist = false,
  onRemoveButtonClick = () => {},
  onWishlistButtonClick = () => {},
  onCloseDialogClick = () => {},
  globalConfig
}) {
  const { t } = useGlobalTranslation("translation");

  const isGifUrl = (url = "") => /\.gif(\?|#|$)/i.test(String(url || ""));

  const getProductImage = useMemo(() => {
    if (
      cartItem?.product?.images?.length > 0 &&
      cartItem?.product?.images?.[0]?.url
    ) {
      return isGifUrl(cartItem.product.images[0].url)
        ? cartItem.product.images[0].url
        : cartItem.product.images[0].url.replace("original", "resize-w:250");
    }
  }, [cartItem]);

  const brandName = truncateName(cartItem?.product?.brand?.name || "", 40);
  const productName = truncateName(cartItem?.product?.name || "", 40);

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
              <img src={getProductImage} alt={cartItem?.product?.name} 
              className={`${globalConfig?.img_fill ? styles.imgCover : styles.imgContain}`} />
            </div>
          )}
          <div>
            <div className={styles.itemBrand}>
             {brandName}
            </div>
            <div className={styles.itemName}>{productName}</div>
          </div>
        </div>
      </div>
      <div className={styles.removeModalFooter}>
        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemoveButtonClick}
          disabled={isRemoving}
        >
          {isRemoving ? "Removing..." : t("resource.facets.remove_caps")}
        </button>

        <button
          type="button"
          className={`${styles.wishlistBtn} ${isMovingToWishlist ? styles.disabled : ""}`}
          onClick={onWishlistButtonClick}
        >
          {t("resource.cart.move_to_wishlist")}
        </button>
      </div>
    </Modal>
  );
}

export default RemoveCartItem;
