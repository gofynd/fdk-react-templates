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
  return (
    <div className={`${styles.address}`}>
      <div className={`${styles.title} ${styles.boldsm}`}>ADDRESS</div>
      <div className={styles.lightsm}>
        {`${address?.name || ""} - ${address?.country_phone_code || ""} ${address?.phone || ""}`}
      </div>
      <div className={`${styles.displayAddress}`}>
        {address?.display_address || ""}
      </div>
    </div>
  );
}

export default ShipmentAddress;
