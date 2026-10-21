// Only subpremise identifies an apartment/unit. Premise, street_number and
// route describe the building/street and must not become the flat number.
export const getGoogleMapFormFields = (components = [], point, selection) => {
  if (!Array.isArray(components)) components = [];
  const value = (type) =>
    components.find((component) => component.types?.includes(type))
      ?.long_name || "";
  const isSelectedPoint =
    point &&
    selection &&
    Math.abs(selection.lat - point.lat) < 0.0000001 &&
    Math.abs(selection.lng - point.lng) < 0.0000001;
  return {
    unit: (isSelectedPoint ? selection.unit : "") || value("subpremise"),
    building:
      (isSelectedPoint && selection.building) ||
      [
        ...new Set(
          [value("premise"), value("street_number"), value("route")].filter(
            Boolean
          )
        ),
      ].join(", "),
  };
};

export const getMapAddressFormFields = (address, countryIso) => {
  if (!address) return address;
  // This metadata is only for form mapping, never part of a saved-address API.
  const { map_address_fields: googleFields, ...fields } = address;
  if ((address.country_iso_code || countryIso)?.toUpperCase() !== "IN")
    return "map_address_fields" in address ? fields : address;
  const parts = [
    ...new Set(
      [
        googleFields?.building || (!address.id && address.address),
        address.area,
      ].filter(Boolean)
    ),
  ];
  return {
    ...fields,
    address: googleFields?.unit || "",
    area: parts.join(", "),
  };
};

export const getInitialAddressFormFields = (
  address,
  isNewAddress,
  countryIso
) =>
  isNewAddress && !address?.id && address?.geo_location
    ? getMapAddressFormFields(address, countryIso)
    : address;

export const mergeMapAddressFormFields = (current, address, countryIso) => {
  const fields = getMapAddressFormFields(address, countryIso);
  return {
    ...current,
    ...fields,
    ...((address?.country_iso_code || countryIso)?.toUpperCase() === "IN"
      ? { address: fields.address || current.address || "" }
      : {}),
  };
};
