/**
 * AddressItem Component
 *
 * This component represents a single address item that can be selected, edited, or displayed. It supports the display of various address details,
 * the selection of the address via a checkbox, and additional custom content in specified slots.
 *
 * Props:
 * @param {boolean} showAddressSelectionCheckbox - Flag to show or hide the checkbox for selecting the address.
 * @param {boolean} showAddressType - Flag to show or hide the address type (e.g., Home, Work).
 * @param {string} selectedAddressId - The ID of the currently selected address, used for determining which address is selected.
 * @param {object} addressItem - The address object containing details like area, landmark, city, etc.
 * @param {function} onAddressSelect - Callback function to handle the selection of an address. Called when the address is clicked.
 * @param {component} headerRightSlot - Custom React component to render additional content to the right of the header (e.g., edit or delete buttons).
 * @param {component} belowNameSlot - Custom React component to render additional content below the name field.
 * @param {component} belowAddressSlot - Custom React component to render additional content below the address fields.
 *
 * Default Props:
 * showAddressSelectionCheckbox = false,
 * showAddressType = true,
 * selectedAddressId = "",
 * addressItem = {
 *   area: "",
 *   landmark: "",
 *   city: "",
 *   area_code: "",
 *   country_phone_code: "91",
 *   phone: "",
 *   name: "",
 *   address_type: "",
 *   sector: "",
 * },
 * onAddressSelect = () => {},
 * headerRightSlot = <></>,
 * belowNameSlot = <></>,
 * belowAddressSlot = <></>,
 *
 * Example usage:
 * <AddressItem
 *   selectedAddressId={selectedAddressId}
 *   addressItem={address}
 *   onAddressSelect={handleAddressSelect}
 *   headerRightSlot={<EditButton />}
 *   belowNameSlot={<AdditionalInfo />}
 *   belowAddressSlot={<MapLink />}
 * />
 *
 */

import React from "react";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import * as styles from "./address-item.less";

const AddressType = {
  area: "",
  landmark: "",
  city: "",
  area_code: "",
  country_phone_code: "91",
  phone: "",
  name: "",
  address_type: "",
  sector: "",
};

function AddressItem({
  showAddressSelectionCheckbox = false,
  showAddressType = true,
  selectedAddressId = "",
  addressItem = AddressType,
  onAddressSelect = () => {},
  headerRightSlot = <></>,
  belowNameSlot = <></>,
  belowAddressSlot = <></>,
}) {
  function getAddress() {
    return `${addressItem.address}, ${
      addressItem.area
    } ${addressItem.landmark ? "," + addressItem.landmark : ""} ${
      addressItem.city ? "," + addressItem.city : ""
    } - ${addressItem.area_code}`;
  }

  return (
    <div
      className={styles.addressContent}
      onClick={() => onAddressSelect(addressItem?.id)}
      style={
        selectedAddressId !== addressItem.id
          ? { border: "1px solid var(--dividerStokes)" }
          : {}
      }
    >
      <div className={styles.addressContentTop}>
        <div className={styles.addressContentTopLeft}>
          {showAddressSelectionCheckbox && (
            <>
              {selectedAddressId == addressItem.id ? (
                <SvgWrapper svgSrc={"radio-selected"}></SvgWrapper>
              ) : (
                <SvgWrapper svgSrc={"radio"}></SvgWrapper>
              )}
            </>
          )}
          <span className={styles.addressName}>{addressItem.name}</span>
          {showAddressType && (
            <span className={styles.addressType}>
              {addressItem.address_type}
            </span>
          )}
        </div>
        <div className={styles.addressContentTopRight}>{headerRightSlot}</div>
      </div>
      <>{belowNameSlot}</>
      <div
        className={styles.addressMid}
        style={{ marginLeft: showAddressSelectionCheckbox ? "25px" : 0 }}
      >
        {getAddress()}
      </div>
      <div
        className={styles.phEnd}
        style={{ marginLeft: showAddressSelectionCheckbox ? "25px" : 0 }}
      >
        {+addressItem.country_phone_code + "-" + addressItem.phone}
      </div>
      <>{belowAddressSlot}</>
    </div>
  );
}

export default AddressItem;
