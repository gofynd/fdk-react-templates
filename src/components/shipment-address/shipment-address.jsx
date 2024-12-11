/**
 *
 * This React functional component is responsible for rendering a shipment address.
 * It formats the address details using optional fields such as sector, city, and pincode.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.address - The address object containing details of the shipment address.
 *
 * @returns {JSX.Element} A JSX element that displays the formatted shipment address.
 *
 */

import React from "react";
import * as styles from "./shipment-address.less";

function ShipmentAddress({ address }) {
  const getOptionalFields = (item) => {
    return `${item?.sector ? `${item?.sector}, ` : ""}${item?.city}, ${
      item?.pincode ? `- ${item?.pincode}` : ""
    }`;
  };

  return (
    <div className={`${styles.address} ${styles.lightsm}`}>
      <div className={`${styles.title} ${styles.boldsm}`}>ADDRESS</div>
      <div className={`${styles.lightsm}`}>
        {address?.name} - {address?.phone}
      </div>
      <div className={`${styles.lightsm}`}>{address?.address}</div>
      <div className={`${styles.lightsm}`}>
        {address?.area}, {address?.landmark}
      </div>
      <div className={`${styles.lightsm}`}>{getOptionalFields(address)}</div>
    </div>
  );
}

export default ShipmentAddress;
