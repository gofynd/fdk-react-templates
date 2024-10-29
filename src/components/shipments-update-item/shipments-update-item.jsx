import React, { useState } from "react";
import * as styles from "./shipments-update-item.less";
import QuantityCtrl from "./quantity-ctrl/quantity-ctrl";
import { numberWithCommas } from "../../helper/utils";

function ShipmentUpdateItem({ selectedBagId, item }) {
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
      setShowQuantityError(false);
    }
  };

  const getUpdatedBags = () => {
    return currQuantity > 0 ? item?.bag_ids?.slice(0, currQuantity) : [];
  };

  return (
    <>
      {item?.bag_ids?.includes(selectedBagId) && (
        <div className={`${styles.updateItem}`}>
          <div className={`${styles.bagImg}`}>
            <img src={item?.item?.image[0]} alt={item?.item?.name} />
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
            <div className={`${styles.priceContainer}`}>
              <span className={`${styles.darklg}`}>
                {getPriceFormat(
                  getCurrencySymbol(item),
                  getItemValue(item?.prices.price_effective)
                )}
              </span>
              <span className={`${styles.lightxxs}`}>
                ({item?.quantity}
                {item?.quantity === 1 ? "Piece" : "Pieces"})
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShipmentUpdateItem;
