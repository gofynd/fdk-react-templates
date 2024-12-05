/**
 * ChipReviewItem is a React component that displays a review item for a product.
 * It uses several useMemo hooks to optimize performance by memoizing values.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.item - The item object containing product details.
 * @param {Array} props.articles - An array of article objects related to the item.
 *
 * @returns {JSX.Element} A JSX element representing the review item.
 */

import React, { useState, useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./chip-review-item.less";
import { currencyFormat, numberWithCommas } from "../../helper/utils";

export default function ChipReviewItem({ item, articles }) {
  const getProductPath = useMemo(() => `/product/${item.product.slug}`, [item]);

  const getProductImage = useMemo(() => {
    if (item?.product?.images?.length && item?.product?.images?.[0]?.url) {
      return item.product.images[0].url.replace(
        "original",
        "resize-h:170,w:110"
      );
    }
  }, [item]);

  const isOutofStock = useMemo(() => {
    let outOfStockArticles = articles.filter((article) => {
      return article?.availability?.out_of_stock === true;
    });
    return outOfStockArticles.length === articles.length;
  }, [articles]);

  const getTotal = useMemo(() => {
    const total = articles.reduce(
      (total, item) => total + item.price.converted.effective,
      0
    );
    return currencyFormat(
      numberWithCommas(total),
      articles?.[0]?.price?.converted?.currency_symbol || "₹"
    );
  }, [articles]);

  const getPieces = useMemo(() => {
    return articles.reduce(
      (totalQuantity, item) => totalQuantity + item?.quantity,
      0
    );
  }, [articles]);

  return (
    <div className={`${styles.bag} ${isOutofStock ? styles.outOfStock : ""}`}>
      <div className={styles.itemContainer}>
        <div className={styles.bagLeft}>
          <FDKLink to={getProductPath}>
            <img src={getProductImage} alt={item.product.name} />
          </FDKLink>
        </div>
        <div className={styles.bagRight}>
          <div className={styles.bagBrand}>{item.product.brand.name}</div>
          <div className={styles.bagName}>{item.product.name}</div>
          <div className={styles.soldBy}>
            Sold by: {item.article.store.name + ","}
            {item.article.seller.name}
          </div>

          <div className={styles.chipMetaDesktop}>
            <ChipMeta item={item} />
          </div>

          {/* Extension Slot : above_shipment_item_price */}

          <div className={styles.bagName}>
            <span className={styles.itemTotal}> {`Total: ${getTotal}`}</span>
            &nbsp;
            <span className={styles.quantityLabel}>
              {`( ${articles.length} Size, ${getPieces} ${getPieces > 1 ? "Pieces" : "Piece"} )`}
            </span>
          </div>

          {/* Extension Slot : below_shipment_item_price */}
        </div>
        <div className={styles.chipMetaMobile}>
          <ChipMeta item={item} />
        </div>
      </div>
    </div>
  );
}

const ChipMeta = ({ item }) => {
  return (
    <div className={styles.bagItem}>
      <div className={styles.chip}>
        <div className={styles.productMetas}>
          <div>
            <span className={styles.itemSize}>{item.article.size}</span>
            <span className={styles.itemSize}>|</span>
          </div>
          <div className={styles.priceCntr}>
            <span className={styles.effectivePrice}>
              {item?.is_set && item?.price_per_unit?.converted
                ? `${currencyFormat(
                    numberWithCommas(
                      item?.price_per_unit?.converted?.effective
                    ),
                    item?.price_per_unit?.converted?.currency_symbol || "₹"
                  )}/Pcs`
                : item?.price?.converted
                  ? currencyFormat(
                      numberWithCommas(item?.price?.converted?.effective),
                      item?.price?.converted?.currency_symbol || "₹"
                    )
                  : ""}
            </span>
            {item?.price?.converted?.effective !==
              item?.price?.converted?.marked && (
              <span className={styles.markedPrice}>
                {item.is_set && item?.price_per_unit?.converted
                  ? `${currencyFormat(
                      numberWithCommas(item?.price_per_unit?.converted?.marked),
                      item?.price_per_unit?.converted?.currency_symbol || "₹"
                    )}/Pcs`
                  : item?.price?.converted
                    ? currencyFormat(
                        numberWithCommas(item?.price?.converted?.marked),
                        item?.price?.converted?.currency_symbol || "₹"
                      )
                    : ""}
              </span>
            )}
          </div>
          <div className={styles.discountCntr}>
            <span className={styles.discount}>{item.article.discount}</span>
          </div>
        </div>

        <div className={styles.rightItems}>
          <div className={styles.quantity}>
            <span>
              {`${item?.quantity} ${item.quantity > 1 ? "Pieces" : "Piece"}`}
            </span>
          </div>
        </div>
      </div>
      {item?.availability?.out_of_stock && (
        <div className={styles.outOfStock}>{item.message}</div>
      )}
      {item?.coupon_message && (
        <div className={styles.offersContainer}>
          <span className={styles.offerApplied}>{item.coupon_message}</span>
        </div>
      )}
      {item.bulk_message && (
        <div className={styles.offersContainer}>
          <span className={styles.offerApplied}>{item.bulk_message}</span>
        </div>
      )}
    </div>
  );
};
