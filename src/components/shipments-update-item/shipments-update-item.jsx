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

import React, { useState } from "react";
import * as styles from "./shipments-update-item.less";
import QuantityCtrl from "./quantity-ctrl/quantity-ctrl";
import { numberWithCommas } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function ShipmentUpdateItem({
  selectedBagId,
  item,
  updatedQuantity = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
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

  return (
    <>
      {item?.bag_ids?.includes(selectedBagId) && (
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
                        <span>{t("resource.common.max_quantity")}: {currQuantity}</span>
                      )}
                      {currQuantity === 0 && <span>{t("resource.common.min_quantity")}: 0</span>}
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
                ({item?.quantity} {item?.quantity === 1 ? t("resource.common.single_piece") : t("resource.common.multiple_piece")})
              </span >
            </div >
          </div >
        </div >
      )
      }
    </>
  );
}

export default ShipmentUpdateItem;
