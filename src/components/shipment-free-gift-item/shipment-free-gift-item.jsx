import React from "react";
import * as styles from "./shipment-free-gift-item.less";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

const ShipmentFreeGiftItem = ({ freeGiftBags = [], currencySymbol = "₹", hasRadioButton = false }) => {
  const { t } = useGlobalTranslation("translation");

  if (!freeGiftBags || freeGiftBags.length === 0) {
    return null;
  }

  // Group free gift bags by unique bag ID to show each variant separately
  // This ensures different sizes/variants of the same product are shown as separate items
  const groupedGifts = freeGiftBags.reduce((acc, bag) => {
    const bagId = bag?.id || bag?.article?.uid;
    if (!bagId) return acc;

    if (!acc[bagId]) {
      acc[bagId] = {
        bag: bag,
        totalQuantity: 0,
      };
    }
    acc[bagId].totalQuantity += bag?.quantity || 1;
    return acc;
  }, {});

  const groupedGiftArray = Object.values(groupedGifts);
  const uniqueGiftCount = groupedGiftArray.length;

  return (
    <div className={`${styles.freeGiftContainer} ${hasRadioButton ? styles.withRadioButton : ''}`}>
      <h6 className={styles.freeGiftTitle}>
        {uniqueGiftCount} {t("resource.cart.free_gift_added")}
      </h6>
      <div className={styles.freeGiftItemsWrapper}>
        {groupedGiftArray.map((group, index) => {
          const bag = group.bag;
          const itemName = bag?.item?.name || "";
          const itemImage = bag?.item?.image?.[0] || "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyndnp/wrkr/common/default_item_image.jpg";
          const itemSize = bag?.item?.size || "";
          const totalQuantity = group.totalQuantity;
          const priceMarked = bag?.prices?.price_marked || 0;

          return (
            <div className={styles.freeGiftItem} key={bag?.id || index}>
              <div className={styles.freeGiftImageWrapper}>
                <img
                  className={styles.freeGiftImage}
                  src={itemImage}
                  alt={itemName}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyndnp/wrkr/common/default_item_image.jpg";
                  }}
                />
              </div>
              <div className={styles.freeGiftDetails}>
                <div className={styles.freeGiftName}>{itemName}</div>
                {itemSize && (
                  <div className={styles.freeGiftSize}>
                    {t("resource.common.size")}: {itemSize}
                  </div>
                )}
                {totalQuantity > 0 && (
                  <div className={styles.freeGiftQuantity}>
                    <span className={styles.quantityLabel}>
                      {t("resource.common.quantity")}:
                    </span>{" "}
                    <span className={styles.quantityValue}>{totalQuantity}</span>
                  </div>
                )}
                <div className={styles.freeGiftPrice}>
                  <span className={styles.freeLabel}>
                    {t("resource.common.free")}
                  </span>
                  {priceMarked > 0 && (
                    <span className={styles.originalPrice}>
                      {priceFormatCurrencySymbol(currencySymbol, priceMarked)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipmentFreeGiftItem;
