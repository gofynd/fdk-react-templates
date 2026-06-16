/**
 * ShipmentUpdateItem is a React component that manages the quantity of an item in a shipment.
 * It provides functionality to increase or decrease the quantity, format prices, and handle errors related to quantity limits.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.selectedBagId - The ID of the selected bag.
 * @param {Object} props.item - The item object containing details about the item.
 * @param {number} props.item.quantity - The current quantity of the item.
 * @param {Array} props.item.bag_ids - An array of bag IDs associated with the item.
 * @param {Object} props.item.prices - An object containing price details of the item.
 * @param {string} props.item.prices.currency_symbol - The currency symbol for the item's price.
 *
 * @returns {JSX.Element} A React fragment containing the UI for updating the item quantity.
 *
 */

import React, { useState, useMemo } from "react";
import * as styles from "./shipments-update-item.less";
import QuantityCtrl from "./quantity-ctrl/quantity-ctrl";
import { numberWithCommas } from "../../helper/utils";
import ShipmentFreeGiftItem from "../shipment-free-gift-item/shipment-free-gift-item";

function ShipmentUpdateItem({
  selectedBagId,
  item,
  allBags,
  updatedQuantity = () => {},
}) {
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [showQuantity, setshowQuantity] = useState(true);
  const [currQuantity, setcurrQuantity] = useState(item.quantity);

  const priceFormatCurrencySymbol = (symbol, price) => {
    const hasAlphabeticCurrency = /^[A-Za-z]+$/.test(symbol);
    return hasAlphabeticCurrency ? `${symbol} ${price}` : `${symbol}${price}`;
  };

  const getPriceFormat = (symbol, price) => {
    return priceFormatCurrencySymbol(symbol, price);
  };

  const getCurrencySymbol = (item) => {
    return item?.prices?.currency_symbol || "₹";
  };

  const getItemValue = (num) => {
    return numberWithCommas(num);
  };

  const incrDecrQuantity = (val) => {
    const total = currQuantity + val;
    changeQuantity(total);
  };

  const changeQuantity = (total) => {
    if (total > item.quantity) {
      setShowQuantityError(true);
    } else if (total < 0) {
      setShowQuantityError(true);
    } else {
      setcurrQuantity(total);
      updatedQuantity(total);
      setShowQuantityError(false);
    }
  };

  // Extract free gift items - use actual bag data when available, fallback to applied_promos
  const freeGiftBags = useMemo(() => {
    // If allBags is provided, find actual free gift bags
    if (allBags && allBags.length > 0) {
      const freeGifts = allBags.filter((bag) => {
        const isParentBag = bag?.parent_promo_bags?.[item?.id];
        const isFreeGift = bag?.meta?.extra_meta?.is_free_gift_item;
        return isParentBag && isFreeGift;
      });
      
      if (freeGifts.length > 0) {
        return freeGifts;
      }
    }

    // Fallback: Extract from applied_promos if allBags not available
    const appliedPromos = item?.applied_promos || [];
    const freeGifts = [];

    appliedPromos.forEach((promo) => {
      if (promo.promotion_type === "free_gift_items" && promo.applied_free_articles) {
        promo.applied_free_articles.forEach((article) => {
          const freeGiftDetails = article.free_gift_item_details;
          if (freeGiftDetails) {
            // Use item_images_url if available, otherwise use default image
            const imageArray = freeGiftDetails.item_images_url && freeGiftDetails.item_images_url.length > 0
              ? freeGiftDetails.item_images_url
              : ["https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyndnp/wrkr/common/default_item_image.jpg"];
            
            // Create a bag-like structure for free gift items
            freeGifts.push({
              id: article.article_id,
              item: {
                id: freeGiftDetails.item_id,
                name: freeGiftDetails.item_name,
                size: freeGiftDetails.size,
                slug_key: freeGiftDetails.item_slug,
                image: imageArray,
                brand: {
                  name: freeGiftDetails.item_brand_name,
                },
              },
              quantity: article.quantity,
              prices: {
                price_marked: freeGiftDetails.article_price?.marked || 0,
                price_effective: freeGiftDetails.article_price?.effective || 0,
                currency_symbol: item?.prices?.currency_symbol,
              },
            });
          }
        });
      }
    });

    return freeGifts;
  }, [item, allBags]);

  return (
    <>
      {item?.bag_ids?.includes(selectedBagId) && (
        <>
        <div className={`${styles.updateItem}`}>
          <div className={`${styles.bagImg}`}>
            {item?.item?.image[0] && (
              <img src={item?.item?.image[0]} alt={item?.item?.name} />
            )}
          </div>
          <div className={`${styles.bagInfo}`}>
            <div>
              <div className={`${styles.brandName} ${styles.boldxxxs}`}>
                {item?.item?.brand?.name}
              </div>
              <div className={`${styles.lightxxxs}`}>{item?.item?.name}</div>
            </div>
            <div className={`${styles.sizeQuantityContainer}`}>
              <div className={`${styles.sizeContainer} ${styles.regularxxs}`}>
                <span className={`${styles.boldxxs}`}>{item.item.size}</span>
              </div>
              {showQuantity && (
                <div className={`${styles.qtyCtrl}`}>
                  <QuantityCtrl
                    currquantity={currQuantity}
                    incDecQuantity={incrDecrQuantity}
                    changeQty={changeQuantity}
                    customClassName={`${styles.hideQuantity} ${styles.modifyQtyController} ${showQuantityError ? styles.marginTopOnErr : ""}`}
                  />
                  {showQuantityError && (
                    <div className={`${styles.maxAvail} ${styles.regularxxxs}`}>
                      {currQuantity > 0 && (
                        <span>Max quantity: {currQuantity}</span>
                      )}
                      {currQuantity === 0 && <span>Min quantity: 0</span>}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div
              className={`${styles.priceContainer}  ${showQuantityError ? styles.marginTopOnErrPrice : ""}`}
            >
              <span className={`${styles.darklg}`}>
                {getPriceFormat(
                  getCurrencySymbol(item),
                  getItemValue(item?.prices.price_effective)
                )}
              </span>
              <span className={`${styles.lightxxs}`}>
                {" "}
                ({item?.quantity} {item?.quantity === 1 ? "Piece" : "Pieces"})
              </span>
            </div>
          </div>
        </div>
        {freeGiftBags.length > 0 && (
          <ShipmentFreeGiftItem
            freeGiftBags={freeGiftBags}
            currencySymbol={item?.prices?.currency_symbol}
            hasRadioButton={false}
          />
        )}
        </>
      )}
    </>
  );
}

export default ShipmentUpdateItem;
