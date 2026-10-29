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
  // A map selection replaces both postcode representations. A header/edit
  // draft may otherwise leave its old pincode beside the new area_code.
  if ("area_code" in address && "pincode" in fields)
    fields.pincode = address.area_code;
  if ((address.country_iso_code || countryIso)?.toUpperCase() !== "IN")
    return fields;
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
  isNewAddress &&
  !address?.id &&
  !address?.delivery_address_draft &&
  address?.geo_location
    ? getMapAddressFormFields(address, countryIso)
    : address;

export const getAddressMapPoint = (address) => {
  const { latitude, longitude } = address?.geo_location || {};
  const isNumber = (value) =>
    (typeof value === "number" || typeof value === "string") &&
    String(value).trim() !== "" &&
    Number.isFinite(Number(value));
  if (!isNumber(latitude) || !isNumber(longitude)) return null;
  const lat = Number(latitude),
    lng = Number(longitude);
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
};

export const hasPrefilledAddressLocation = (address) =>
  Boolean(
    (address?.delivery_address_draft || getAddressMapPoint(address)) &&
      (address?.address || address?.area || address?.landmark || address?.city)
  );

export const shouldOpenAddressMap = (
  mapAvailable,
  address,
  isNewAddress,
  startWithAddressForm = false
) => {
  if (!mapAvailable) return false;
  // A location chosen in the header/cart is already selected. Collect the
  // remaining delivery details first; Change can reopen its map explicitly.
  if (startWithAddressForm && hasPrefilledAddressLocation(address))
    return false;
  if (!isNewAddress && getAddressMapPoint(address)) return false;
  return true;
};

export const resolveAddressMapCenter = (address, lastUsed, country) =>
  getAddressMapPoint(address) ||
  getAddressMapPoint({
    geo_location: { latitude: lastUsed?.lat, longitude: lastUsed?.lng },
  }) ||
  getAddressMapPoint({
    geo_location: {
      latitude: country?.latitude,
      longitude: country?.longitude,
    },
  }) || { lat: 19.076, lng: 72.8777 };

export const getAddressCountryDraft = (current, country) => {
  const draft = {};
  [
    "name",
    "phone",
    "email",
    "address_type",
    "otherAddressType",
    "is_default_address",
  ].forEach((key) => {
    if (current?.[key] !== undefined) draft[key] = current[key];
  });
  draft.country =
    typeof country === "object"
      ? country.name || country.display_name || country.iso2
      : country;
  if (country?.iso2) draft.country_iso_code = country.iso2;
  return draft;
};

export const mergeMapAddressFormFields = (
  current,
  address,
  countryIso,
  addressFields = []
) => {
  const fields = getMapAddressFormFields(address, countryIso);
  const previousPoint = getAddressMapPoint(current);
  const nextPoint = getAddressMapPoint(address);
  const moved =
    nextPoint &&
    (!previousPoint ||
      previousPoint.lat !== nextPoint.lat ||
      previousPoint.lng !== nextPoint.lng);
  const fieldKey = (slug) => (slug === "pincode" ? "area_code" : slug);
  const fieldValue = (value) =>
    String(
      value && typeof value === "object"
        ? (value.display_name ?? value.display ?? value.name ?? value.key ?? "")
        : (value ?? "")
    ).trim();
  const parents = new Map();
  addressFields.forEach((field) => {
    if (field.prev) parents.set(field.slug, field.prev);
    if (field.next) parents.set(field.next, field.slug);
  });
  const cleared = {};
  const locationFields = new Set([
    "pincode",
    "city",
    "state",
    "sector",
    ...parents.keys(),
  ]);
  locationFields.delete("country");
  // A changed map parent can invalidate an Area even when the map returns no
  // coordinates. Preserve explicit map values and unchanged edit selections.
  addressFields.forEach((field) => {
    const key = fieldKey(field.slug);
    if (fieldValue(fields?.[key])) return;
    if (moved && locationFields.has(field.slug)) {
      cleared[key] = "";
      return;
    }
    if (!parents.has(field.slug)) return;
    let parent = parents.get(field.slug);
    const visited = new Set([field.slug]);
    let parentChanged = false;
    while (parent && !visited.has(parent)) {
      visited.add(parent);
      const parentKey = fieldKey(parent);
      if (
        parentKey in (fields || {}) &&
        fieldValue(fields[parentKey]) !== fieldValue(current?.[parentKey])
      )
        parentChanged = true;
      parent = parents.get(parent);
    }
    if (moved || parentChanged) cleared[key] = "";
  });
  return {
    ...current,
    ...fields,
    ...cleared,
    ...(("area_code" in (fields || {}) || "area_code" in cleared) &&
    "pincode" in current
      ? { pincode: cleared.area_code ?? fields.area_code }
      : {}),
    ...((address?.country_iso_code || countryIso)?.toUpperCase() === "IN"
      ? { address: fields.address || current.address || "" }
      : {}),
  };
};

export const getAddressFormFieldErrors = (errors) =>
  (Array.isArray(errors) ? errors : []).reduce(
    (fields, error) => ({
      ...fields,
      ...(error?.details?.field_errors || {}),
      ...(error?.extensions?.details?.field_errors || {}),
    }),
    {}
  );
