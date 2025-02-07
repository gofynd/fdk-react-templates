import React from "react";
import * as styles from "./free-gift-item.less";
import { currencyFormat, numberWithCommas } from "../../../../helper/utils";

const FreeGiftItem = ({ item, currencySymbol = "₹" }) => {
  return (
    <>
      {item?.promotions_applied?.map(
        (promotion) =>
          promotion?.promotion_type === "free_gift_items" && (
            <div
              className={`${styles.freeArticleContainer} ${promotion?.applied_free_articles.length === 1 ? styles.singleCol : ""}`}
              key={promotion.promo_id}
            >
              <h6
                className={styles.freeArticleTitle}
              >{`${promotion?.applied_free_articles?.length} free gift added`}</h6>
              {promotion?.applied_free_articles.map((item, itemIndex) => {
                const { item_images_url, item_name, item_price_details } =
                  item?.free_gift_item_details || {};
                const freeGiftImage =
                  item_images_url?.[0]?.replace("original", "resize-w:50") ||
                  "";

                return (
                  <div
                    className={styles.freeGiftItem}
                    key={item?.article_id + itemIndex}
                  >
                    {freeGiftImage && (
                      <img
                        className={styles.freeGiftItemImage}
                        src={freeGiftImage}
                        alt={item_name}
                      />
                    )}
                    <div className={styles.freeGiftItemDetails}>
                      <div className={styles.freeGiftItemName}>{item_name}</div>
                      <div className={styles.freeGiftItemPrice}>
                        <span className={styles.freeGiftItemFreeLabel}>
                          FREE
                        </span>
                        {item_price_details?.effective?.max && (
                          <span className={styles.freeGiftItemFreeEffective}>
                            {currencyFormat(
                              numberWithCommas(
                                item_price_details?.effective?.max
                              ),
                              currencySymbol
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
      )}
    </>
  );
};

export default FreeGiftItem;
