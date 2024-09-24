import React, { useState } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./shipment-item.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import {
  numberWithCommas,
  priceFormatCurrencySymbol,
} from "../../helper/utils";

function ShipmentItem({
  bag,
  initial,
  shipment,
  deliveryAddress,
  selectId,
  onChangeValue,
  type,
}) {
  const getPriceValue = (item) => {
    return numberWithCommas(item);
  };
  const getPriceCurrencyFormat = (symbol, price) => {
    return priceFormatCurrencySymbol(symbol, price);
  };
  const onChange = (id) => {
    onChangeValue(id);
  };
  return (
    <div className={`${styles.bagItem}`}>
      <div className={`${styles.label}`}>
        {!initial &&
          type === "my-orders" &&
          (bag.can_cancel || bag.can_return) && (
            <div className={`${styles.radiobtn}`}>
              <input
                type="radio"
                value={bag.id}
                onChange={() => onChange(bag.id)}
                name="reasoncheckbox"
                id={bag.id}
              />
              {selectId !== bag.id && (
                <SvgWrapper svgSrc="regular" onClick={() => onChange(bag.id)} />
              )}
              {selectId === bag.id && <SvgWrapper svgSrc="radio-selected" />}
            </div>
          )}
        {type === "tracking" && (
          <FDKLink className={`${styles.bagImg}`}>
            <img src={bag?.item?.image[0]} alt={bag?.item.name} />
          </FDKLink>
        )}
        {type !== "tracking" && (
          <FDKLink
            to={`/product/${bag?.item?.slug_key}`}
            className={`${styles.bagImg}`}
          >
            <img src={bag?.item?.image[0]} alt={bag?.item?.name} />
          </FDKLink>
        )}
        <div className={`${styles.bagInfo}`}>
          <div className={`${styles.brand} ${styles.boldsm}`}>
            {bag?.item?.brand.name}
          </div>

          <div className={`${styles.bagDetails}`}>
            <div className={`${styles.chip} ${styles.regularxxs}`}>
              <span className={`${styles.boldxxs}`}>{bag?.item?.size}</span>
              <span>{` | `}</span>
              <span className={`${styles.lightxxs}`}>
                {bag?.quantity}
                {bag?.quantity === 1 ? "Piece" : "Pieces"}
              </span>
            </div>
            {bag?.prices?.currency_symbol && bag?.prices?.price_effective && (
              <div className={`${styles.effectivePrice}`}>
                <span className={`${styles.effectivePrice}`}>
                  {getPriceCurrencyFormat(
                    bag?.prices?.currency_symbol,
                    getPriceValue(bag?.prices?.price_effective)
                  )}
                </span>
              </div>
            )}

            {/* {type === "tracking" && (
              <FDKLink to={shipment.track_url} className={`${styles.total}`}>
                {shipment.tracking_no}
              </FDKLink>
            )}
            {type === "tracking" && (
              <div className={`${styles.total} ${styles.regularxs}`}>
                <span className={`${styles.boldxs}`}>Delivery At :</span>
                <span className={`${styles.deliveryAt}`}>
                  {deliveryAddress?.city} -{deliveryAddress?.pincode}
                </span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipmentItem;
