/**
 * ShipmentBreakup is a React functional component that displays the breakup of a shipment.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.breakup - An array of objects representing the breakup details of the shipment.
 * @param {Object} props.shipmentInfo - An object containing additional information about the shipment.
 *
 * @returns {JSX.Element} A JSX element that renders the shipment breakup details.
 */

import React from "react";
import * as styles from "./shipment-breakup.less";
import { priceFormatCurrencySymbol } from "../../helper/utils";

function ShipmentBreakup({ breakup }) {
  const getPriceFormat = (symbol, price) => {
    return priceFormatCurrencySymbol(symbol, price);
  };
  const breakupValues = () => {
    const totalVal = breakup?.filter((item) => item.name === "total") || [];
    const restVal =
      breakup?.filter((item) => item.name !== "total" && item.value !== 0) ||
      [];
    return totalVal.concat(restVal);
  };
  return (
    <div className={`${styles.billing} ${styles.lightsm}`}>
      <div className={`${styles.title} ${styles.boldsm}`}>BILLING</div>
      <>
        {breakupValues()?.map((item, index) => (
          <div key={index} className={`${styles.breakupItem}`}>
            {((index !== breakup.length - 1 && item.value !== "0") ||
              (index === breakup.length - 1 && item.value !== "0")) && (
              <>
                {index !== breakup.length - 1 && (
                  <span>
                    <span>{item.display}</span>
                    <span className={`${styles.values}`}>
                      {getPriceFormat(
                        item.currency_symbol,
                        Number(item.value.toString().replace(/,/g, ""))
                      )}
                    </span>
                  </span>
                )}
                {index === breakup.length - 1 && (
                  <span>
                    <span>{item.display}</span>
                    <span className={`${styles.values}`}>
                      {getPriceFormat(
                        item.currency_symbol,
                        Number(item.value.toString().replace(/,/g, ""))
                      )}
                    </span>
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </>
    </div>
  );
}

export default ShipmentBreakup;
