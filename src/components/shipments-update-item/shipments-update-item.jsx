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
import { useGlobalTranslation } from "fdk-core/utils";
import { getProductImgAspectRatio } from "../../helper/utils";
import { BagImage, BundleBagImage } from "../bag/bag";
import ShipmentFreeGiftItem from "../shipment-free-gift-item/shipment-free-gift-item";

function ShipmentUpdateItem({
  quantity = 1,
  selectedBagId,
  item,
  bundleGroups,
  bundleGroupArticles,
  globalConfig,
  allBags,
  updatedQuantity = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [showQuantity, setshowQuantity] = useState(true);
  const [currQuantity, setcurrQuantity] = useState(quantity);

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

  const incrDecrQuantity = (val) => {
    const total = currQuantity + val;
    changeQuantity(total);
  };

  const changeQuantity = (total) => {
    const itemQuantity = isBundleItem
      ? item?.bundle_details?.bundle_count
      : item.quantity;
    if (total > itemQuantity) {
      setShowQuantityError(true);
    } else if (total < 0) {
      setShowQuantityError(true);
    } else {
      setcurrQuantity(total);
      updatedQuantity(total);
      setShowQuantityError(false);
    }
  };

  const bundleGroupId = item?.bundle_details?.bundle_group_id;
  const isBundleItem =
    bundleGroupId &&
    bundleGroups &&
    bundleGroups[bundleGroupId]?.length > 0;

  const { name, brand, size, itemQty, price } = useMemo(() => {
    if (isBundleItem) {
      // For bundles, sum all individual bag prices from the bundleGroups
      // This avoids the mutation issue where getGroupedShipmentBags modifies bundle_details
      const bundleBags = bundleGroups[bundleGroupId] || [];
      
      // Sum the ORIGINAL individual bag prices (not the modified base bag price)
      const totalEffectivePrice = bundleBags.reduce((sum, bundleBag) => {
        // If base bag has been aggregated by getGroupedShipmentBags, use financial_breakup instead
        const isAggregated = bundleBag?.bundle_details?.is_base && 
                             bundleBag?.prices?.price_effective > (bundleBag?.financial_breakup?.[0]?.price_effective || bundleBag?.prices?.price_effective);
        
        if (isAggregated) {
          // Use financial_breakup which contains the original individual bag price
          return sum + (bundleBag?.financial_breakup?.[0]?.price_effective || 0);
        }
        
        return sum + (bundleBag?.prices?.price_effective || 0);
      }, 0);
      
      return {
        name: item?.bundle_details?.name,
        brand: "",
        size: item?.bundle_details?.size,
        itemQty: item?.bundle_details?.bundle_count,
        price: totalEffectivePrice,
      };
    }
    return {
      name: item?.item?.name,
      brand: item?.item?.brand?.name,
      size: item?.item?.size,
      itemQty: item?.quantity,
      price: item?.prices?.price_effective,
    };
  }, [item, bundleGroups, bundleGroupId, isBundleItem]);

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
            <ShipmentImage
              bag={item}
              isBundleItem={isBundleItem}
              bundleGroupId={item?.bundle_details?.bundle_group_id}
              bundleGroups={bundleGroups}
              bundleGroupArticles={bundleGroupArticles}
              globalConfig={globalConfig}
            />
            <div className={`${styles.bagInfo}`}>
              <div>
                <div className={`${styles.brandName} ${styles.boldxxxs}`}>
                  {brand}
                </div>
                <div className={`${styles.lightxxxs}`}>{name}</div>
              </div>
              <div className={`${styles.sizeQuantityContainer}`}>
                {size && (
                <div className={`${styles.sizeContainer} ${styles.regularxxs} ${showQuantityError? styles.addPaddingToContainer : ''}`}>
                    <span className={`${styles.boldxxs}`}>{size}</span>
                  </div>
                )}
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
                          <span>
                            {t("resource.common.max_quantity")}: {currQuantity}
                          </span>
                        )}
                        {currQuantity === 0 && (
                          <span>{t("resource.common.min_quantity")}: 0</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div
                className={`${styles.priceContainer}`}
              >
                <span className={`${styles.darklg}`}>
                  {getPriceFormat(getCurrencySymbol(item), price)}
                </span>
                <span className={`${styles.lightxxs}`}>
                  ({itemQty}{" "}
                  {itemQty === 1
                    ? t("resource.common.single_piece")
                    : t("resource.common.multiple_piece")}
                  )
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

const ShipmentImage = ({
  bag,
  bundleGroupId,
  isBundleItem,
  bundleGroupArticles,
  globalConfig,
}) => {
  const aspectRatio = getProductImgAspectRatio(globalConfig);

  return (
    <div className={styles.bagImg}>
      <BagImage
        bag={bag}
        isBundle={isBundleItem}
        aspectRatio={aspectRatio}
        isImageFill={globalConfig?.img_fill}
      />
    </div>
  );
};

export default ShipmentUpdateItem;
