import React, { useMemo } from "react";
import * as styles from "./cart-gift-item.less";

const CartGiftItem = ({ bagItem }) => {
  const freeGiftPromotions = useMemo(
    () =>
      bagItem?.promotions_applied?.filter(
        (promo) =>
          promo?.promotion_type === "free_gift_items" &&
          promo?.applied_free_articles?.length
      ) || [],
    [bagItem]
  );
  if (!freeGiftPromotions.length) {
    return null;
  }

  const getFreeGiftImage = (data) => data.replace("original", "resize-w:50");
  const getCurrencySymbol = bagItem?.price?.converted?.currency_symbol || "₹";

  return (
    <div className={styles["free-gift-box"]}>
      <div className={styles["ncc-promotions-applied-container"]}>
        <div className={styles["ncc-promotions_applied"]}>
          {freeGiftPromotions?.[0]?.applied_free_articles?.length} Free Gift
          Applied
        </div>
      </div>
      <div
        className={`${styles["free-gift-items-box"]} ${
          freeGiftPromotions.length > 1
            ? styles["free-gift-items-container"]
            : ""
        }`}
      >
        {freeGiftPromotions.map((giftItem, index) => (
          <div key={giftItem.promo_id + index} className={styles["free-items"]}>
            <div className={`${styles["free-article-container"]}`}>
              {giftItem.applied_free_articles.map(
                (appliedItem, appliedItemIndex) => (
                  <div
                    key={appliedItem.article_id + appliedItemIndex}
                    className={styles["free-gift-item"]}
                  >
                    <div className={styles["free-gift-scroll-items"]}>
                      {appliedItem?.free_gift_item_details?.item_images_url && (
                        <img
                          className={styles["free-gift-item-image"]}
                          src={getFreeGiftImage(
                            appliedItem.free_gift_item_details
                              .item_images_url?.[0]
                          )}
                          alt="gift"
                        />
                      )}
                      <div className={styles["ncc-free-gift-item-name"]}>
                        <div className={styles["ncc-free-gift-item-name-font"]}>
                          {appliedItem.free_gift_item_details.item_name}
                        </div>
                        {appliedItem.quantity && (
                          <div className={styles["ncc-free"]}>
                            <span
                              className={styles["ncc-fw-600 quantity-color"]}
                            >
                              Quantity
                            </span>
                            <span className={styles["ncc-free-gift"]}>
                              {appliedItem.quantity}
                            </span>
                          </div>
                        )}
                        <div className={styles["ncc-free"]}>
                          <span
                            className={`${styles["ncc-fw-600"]} ${styles["free-color"]}`}
                          >
                            FREE &nbsp;
                          </span>
                          {appliedItem?.free_gift_item_details
                            ?.item_price_details?.effective?.max && (
                            <span
                              className={styles["gift-line-through"]}
                            >
                              {getCurrencySymbol +
                                appliedItem.free_gift_item_details
                                  .item_price_details.effective.max}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartGiftItem;
