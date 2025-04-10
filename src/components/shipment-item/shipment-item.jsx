/**
 * ShipmentItem component renders a shipment item with various details and allows for interaction.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.bag - The bag object containing details of the shipment item.
 * @param {Object} props.initial - The initial state or configuration for the shipment item.
 * @param {Object} props.shipment - The shipment details associated with the item.
 * @param {Object} props.deliveryAddress - The delivery address for the shipment.
 * @param {string} props.selectId - The identifier for selecting the shipment item.
 * @param {Function} props.onChangeValue - Callback function to handle changes in the shipment item.
 * @param {string} props.type - The type of the shipment item.
 *
 * @returns {JSX.Element} A JSX element representing the shipment item.
 *
 */

import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./shipment-item.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import {
  numberWithCommas,
  priceFormatCurrencySymbol,
} from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function ShipmentItem({ bag, initial, selectId, onChangeValue, type }) {
  const { t } = useGlobalTranslation("translation");
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
                {bag?.quantity} {bag?.quantity === 1 ? t("resource.common.single_piece") : t("resource.common.multiple_piece")}
              </span >
            </div >
            {bag?.prices?.currency_symbol && bag?.prices?.price_effective && (
              <div className={`${styles.effectivePrice}`}>
                <span className={`${styles.effectivePrice}`}>
                  {getPriceCurrencyFormat(
                    bag?.prices?.currency_symbol,
                    getPriceValue(bag?.prices?.price_effective)
                  )}
                </span>
              </div>
            )
            }
          </div >
        </div >
      </div >
    </div >
  );
}

export default ShipmentItem;
