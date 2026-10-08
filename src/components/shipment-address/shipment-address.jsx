/**
 *
 * This React functional component is responsible for rendering a shipment address.
 * It formats the address details using optional fields such as sector, city, and pincode.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.address - The address object containing details of the shipment address.
 * @param {boolean} [props.isSelfPickup] - When true, the title shows "Pickup Address" instead of
 *   the default "Address" (used when the shipment uses the self-pickup fulfillment option).
 *
 * @returns {JSX.Element} A JSX element that displays the formatted shipment address.
 *
 */

import React from "react";
import * as styles from "./shipment-address.less";
import { useGlobalTranslation } from "fdk-core/utils";
import { formatDeliveryAddress } from "../../helper/utils";

function ShipmentAddress({ address, isSelfPickup = false }) {
  const { t } = useGlobalTranslation("translation");
  const userAddress = formatDeliveryAddress(address);
  return (
    <div className={`${styles.address}`}>
      <div className={`${styles.title} ${styles.boldsm}`}>
        {isSelfPickup
          ? t("resource.common.address.pickup_address")
          : t("resource.common.address.address_caps")}
      </div>
      <div className={styles.lightsm}>
        {`${address?.name || ""}: ${address?.country_phone_code || ""} ${address?.phone || ""}`}
      </div>
      <div className={`${styles.displayAddress}`}>{userAddress || ""}</div>
    </div>
  );
}

export default ShipmentAddress;
