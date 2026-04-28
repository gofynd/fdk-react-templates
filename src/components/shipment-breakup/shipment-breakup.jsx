/**
 * ShipmentBreakup is a React functional component that displays the breakup of a shipment.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.breakup - An array of objects representing the breakup details of the shipment.
 * @param {Object} props.shipmentInfo - An object containing additional information about the shipment.
 *
 * @returns {JSX.Element} A JSX element that renders the shipment breakup details.
 */

import React, { useMemo } from "react";
import * as styles from "./shipment-breakup.less";
import { priceFormatCurrencySymbol, translateDynamicLabel } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function ShipmentBreakup({ breakup }) {
  const { t } = useGlobalTranslation("translation");
  const getPriceFormat = (symbol, price) => {
    return priceFormatCurrencySymbol(symbol, price);
  };

  const breakupValues = useMemo(() => {
    const totalVal = breakup?.filter((item) => item.name === "total") || [];
    const restVal =
      breakup?.filter((item) => item.name !== "total" && item.value !== 0) ||
      [];
    return restVal.concat(totalVal);
  }, [breakup]);

  return (
    <div className={`${styles.billing} ${styles.lightsm}`}>
      <div className={`${styles.title} ${styles.boldsm}`}>{t("resource.common.billing_caps")}</div>
      <>
        {breakupValues?.map((item, index) => (
          <div key={index} className={`${styles.breakupItem}`}>
            {((index !== breakup.length - 1 && item.value !== "0") ||
              (index === breakup.length - 1 && item.value !== "0")) && (
              <>
                {index !== breakup.length - 1 && (
                  <span className={styles.totalValContainer}>
                    <span className={styles.label}>{translateDynamicLabel(item.display, t)}</span>
                    <span className={`${styles.values}`}>
                      {getPriceFormat(
                        item.currency_symbol,
                        Number(item.value.toString().replace(/,/g, ""))
                      )}
                    </span>
                  </span>
                )}
                {index === breakup.length - 1 && (
                  <span className={styles.totalValContainer}>
                    <span className={styles.label}>{translateDynamicLabel(item.display, t)}</span>
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
