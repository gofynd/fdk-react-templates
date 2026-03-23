/**
 * AddressForm Component
 *
 * This component represents a form for adding or updating an address. It includes fields like address, city, state, etc.,
 * and supports features like Google Maps integration and custom footer buttons.
 *
 * Props:
 * @param {array} formSchema - The schema defining the fields and their validation for the form.
 * @param {object} addressItem - The existing address object, used when updating an address.
 * @param {string} mapApiKey - API key for integrating Google Maps.
 * @param {boolean} showGoogleMap - Flag to show/hide the Google Maps component in the form.
 * @param {boolean} isNewAddress - Indicates if the form is for a new address or an existing one.
 * @param {function} onAddAddress - Callback function to handle adding a new address.
 * @param {function} onUpdateAddress - Callback function to handle updating an existing address.
 * @param {function} onGetLocality - Callback function to fetch locality information based on the address.
 * @param {boolean} isGuestUser - Indicates if the user is a guest user.
 * @param {object} user - User object containing profile information for auto-filling fields.
 * @param {string} user.firstName - User's first name.
 * @param {string} user.lastName - User's last name.
 * @param {string} user.email - User's email address.
 * @param {object} user.phone - User's phone information.
 * @param {string} user.phone.mobile - User's mobile number.
 * @param {component} customFooter - Custom React component for rendering the footer of the form, typically a submit button.
 *
 * Default Props:
 * formSchema = defaultFormSchema,
 * addressItem = undefined,
 * mapApiKey = "",
 * showGoogleMap = false,
 * isNewAddress = true,
 * onAddAddress = () => {},
 * onUpdateAddress = () => {},
 * onGetLocality = () => {},
 * customFooter = (
 *   <button
 *     className={`${styles.commonBtn} ${styles.deliverBtn}`}
 *     type="submit"
 *   >
 *     {addressItem ? "Update Address" : "Add Address"}
 *   </button>
 * ),
 *
 * Example usage:
 * <AddressForm
 *   addressItem={existingAddress}
 *   mapApiKey={process.env.REACT_APP_MAP_API_KEY}
 *   onAddAddress={handleAddAddress}
 *   onUpdateAddress={handleUpdateAddress}
 * />
 *
 */

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./address-form.less";
import GoogleMapAddress from "../../google-map/v2/google-map";
import FormInputSelector from "../form-input-selector";
import FyDropdown from "../../core/fy-dropdown/fy-dropdown";
import { useGlobalTranslation, useFPI, useGlobalStore } from "fdk-core/utils";
import HomeIcon from "../../../assets/images/home-type.svg";
import OfficeIcon from "../../../assets/images/office-type.svg";
import FriendsFamilyIcon from "../../../assets/images/friends-family.svg";
import OtherIcon from "../../../assets/images/other-type.svg";
import { isRunningOnClient } from "../../../helper/utils";
import { useAddressAutofill } from "../../../helper/hooks";
import CloseIcon from "../../../assets/images/close.svg";
import BackIcon from "../../../assets/images/back.svg";
import LocationPinIcon from "../../../assets/images/location-pin.svg";
import FyButton from "../../core/fy-button/fy-button";

const defaultFormSchema = [
  {
    group: "addressInfo", // Group identifier
    groupLabel: "Address Information", // Label for the group
    fields: [
      {
        key: "address",
        display: "resource.common.house_flat_number",
        type: "text",
        required: true,
        maxLength: 80,
        fullWidth: false,
        validation: {
          required: "resource.common.house_number_required",
          pattern: {
            value: /^[A-Za-z0-9,./\s-]+$/,
            message: "resource.common.house_no_validation_msg",
          },
          maxLength: {
            value: 80,
            message: "resource.common.cannot_exceed_80_characters",
          },
        },
      },
      {
        key: "area",
        display: "resource.common.building_name_street",
        type: "text",
        required: true,
        maxLength: 80,
        fullWidth: false,
        validation: {
          required: "resource.common.building_name_street_required",
          pattern: {
            value: /^[A-Za-z0-9,./\s-]+$/,
            message: "resource.common.address_validation_msg",
          },
          maxLength: {
            value: 80,
            message: "resource.common.cannot_exceed_80_characters",
          },
        },
      },
      {
        key: "landmark",
        display: "resource.common.locality_landmark",
        type: "text",
        required: false,
        fullWidth: false,
        maxLength: 80,
        validation: {
          pattern: {
            value: /^[A-Za-z0-9,./\s-]+$/,
            message: "resource.common.address_validation_msg",
          },
          maxLength: {
            value: 80,
            message: "resource.common.cannot_exceed_80_characters",
          },
        },
      },
      {
        key: "area_code",
        display: "resource.common.pincode",
        type: "text",
        required: true,
        maxLength: 6,
        fullWidth: false,
        validation: {
          required: "resource.common.pincode_is_required",
          pattern: {
            value: /^[1-9][0-9]{5}$/,
            message: "resource.common.invalid_pincode",
          },
          maxLength: {
            value: 6,
            message: "resource.common.cannot_exceed_6_digits",
          },
        },
      },
      {
        key: "city",
        display: "resource.common.city",
        type: "text",
        required: true,
        fullWidth: false,
        validation: {
          required: "resource.common.city_is_required",
          pattern: {
            value: /^[A-Za-z\s_]+$/,
            message: "resource.common.city_can_only_contain_letters",
          },
          maxLength: {
            value: 50,
            message: "resource.common.city_cannot_exceed_50_characters",
          },
        },
      },
      {
        key: "state",
        display: "resource.common.state",
        type: "text",
        required: true,
        fullWidth: false,
        validation: {
          required: "resource.common.state_is_required",
          pattern: {
            value: /^[A-Za-z\s_]+$/,
            message: "resource.common.state_can_only_contain_letters",
          },
          maxLength: {
            value: 50,
            message: "resource.common.state_cannot_exceed_50_characters",
          },
        },
      },
      { key: "country", display: "", type: "hidden", required: false },
    ],
  },

  {
    group: "contactInfo",
    groupLabel: "Contact Information", // Label for the group
    fields: [
      {
        key: "name",
        display: "resource.common.full_name",
        type: "text",
        required: true,
        fullWidth: true,
        validation: {
          required: "resource.common.name_is_required",
          pattern: {
            value: /^[A-Za-z\s]+$/,
            message: "resource.common.name_can_only_contain_letters",
          },
          maxLength: {
            value: 50,
            message: "resource.common.name_cannot_exceed_50_characters",
          },
        },
      },
      {
        key: "phone",
        display: "resource.common.mobile_number",
        type: "mobile",
        required: true,
        fullWidth: false,
        validation: {
          required: "Mobile number is required",
          validate: (value) => {
            if (!value) return "Mobile number is required";
            
            // Always expect an object from MobileNumber component
            if (typeof value === 'object') {
              // Trust the component's validation if available
              if (value.isValidNumber === true) return true;
              
              // If no validation flag, validate the mobile number
              if (value.mobile) {
                const mobileNumber = value.mobile.toString().replace(/[\s\-+]/g, '');
                if (mobileNumber.length !== 10) return "Mobile number must be 10 digits";
                return /^[6-9]\d{9}$/.test(mobileNumber) || "Invalid mobile number format";
              }
              return "Invalid mobile number";
            }
            
            // Convert any string input to proper format
            const mobileNumber = value.toString().replace(/[\s\-+]/g, '');
            if (mobileNumber.length !== 10) return "Mobile number must be 10 digits";
            return /^[6-9]\d{9}$/.test(mobileNumber) || "Invalid mobile number format";
          }
        },
      },
      {
        key: "email",
        display: "resource.common.email",
        type: "email",
        fullWidth: false,
        validation: {
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: "resource.common.invalid_email_address",
          },
          maxLength: {
            value: 50,
            message: "resource.common.email_cannot_exceed_50_characters",
          },
        },
      },
    ],
  },
];

const addressTypes = [
  {
    label: "resource.common.breadcrumb.home",
    value: "Home",
    icon: <HomeIcon className={styles.typeIcon} />,
  },
  {
    label: "resource.common.work",
    value: "Work",
    icon: <OfficeIcon className={styles.typeIcon} />,
  },
  {
    label: "resource.common.friends_&_family",
    value: "Friends & Family",
    icon: <FriendsFamilyIcon className={styles.typeIcon} />,
  },
  {
    label: "resource.common.other",
    value: "Other",
    icon: <OtherIcon className={styles.typeIcon} />,
  },
  // Add more address types as needed
];

const AddressForm = ({
  internationalShipping,
  formSchema = defaultFormSchema,
  addressItem,
  mapApiKey = "",
  isMap = false,
  isNewAddress = true,
  onAddAddress = () => {},
  onUpdateAddress = () => {},
  onGetLocality = () => {},
  isGuestUser = false,
  user = null,
  customFooter,
  setI18nDetails,
  handleCountrySearch,
  getFilteredCountries,
  selectedCountry,
  countryDetails,
  onClose = () => {},
  onBack = null,
}) => {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const isOtherAddressType = !["Home", "Work", "Friends & Family"].includes(
    addressItem?.address_type
  );

  // Get currentCountry from global store (header selection)
  const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE) || {};
  const i18nDetails = useGlobalStore(fpi?.getters?.i18N_DETAILS) || {};
  const { countryCurrencies } = customValues ?? {};
  
  // Get currentCountry based on header selection (same logic as useInternational)
  const currentCountry = useMemo(() => {
    return countryCurrencies?.find(
      (country) => country.iso2 === i18nDetails?.countryCode
    );
  }, [countryCurrencies, i18nDetails?.countryCode]);

  const { autofillData: userAutofillData } = useAddressAutofill(
    user,
    isGuestUser
  );

  // Conditionally exclude phone from autofill data when international shipping is enabled
  const autofillDataForForm = useMemo(() => {
    if (internationalShipping && userAutofillData?.phone) {
      // eslint-disable-next-line no-unused-vars
      const { phone, ...rest } = userAutofillData;
      return rest;
    }
    return userAutofillData;
  }, [userAutofillData, internationalShipping]);
  
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...addressItem,
      address_type: addressItem?.address_type
        ? isOtherAddressType
          ? "Other"
          : addressItem?.address_type
        : "Home",
      otherAddressType:
        addressItem && isOtherAddressType ? addressItem?.address_type : "",
      geo_location: { latitude: "", longitude: "" },
      country: selectedCountry || t("resource.localization.india"),
      // Auto-fill user data using memoized utility function (excluding phone if international)
      ...autofillDataForForm,
      // area_code: addressItem?.area_code || defaultPincode || "",
    },
  });
  const formContainerRef = useRef(null);
  const [currBgColor, setCurrBgColor] = useState("#fff");
  const [showOtherText, setShowOtherText] = useState(false);
  // Local state to track selected country - this ensures the selection persists
  const [localSelectedCountry, setLocalSelectedCountry] = useState(
    selectedCountry || currentCountry
  );
  const isMapAvailable = isMap && !!mapApiKey;
  const [isMapView, setIsMapView] = useState(() => {
    const isMapAvailable = isMap && !!mapApiKey;
    if (!isMapAvailable || !addressItem) return isMapAvailable;
    if (
      addressItem?.geo_location?.latitude &&
      addressItem?.geo_location?.longitude 
    ) { return false; }
    return true;
  });
  const address_type = watch("address_type");
  const sector = watch("sector");

  /**
   * Transforms phone number from addressItem format to form format
   * Handles both string and object formats for backward compatibility
   * @param {string|object|undefined} phone - Phone number from addressItem
   * @param {string|undefined} countryPhoneCode - Country phone code from addressItem
   * @returns {object|undefined} Formatted phone object or undefined
   */
  const transformPhoneForForm = (phone, countryPhoneCode) => {
    // Return undefined if phone is not provided
    if (!phone) {
      return undefined;
    }

    // If phone is already in the correct object format with all required fields
    if (
      typeof phone === 'object' &&
      phone.mobile &&
      phone.countryCode &&
      phone.isValidNumber !== undefined
    ) {
      return phone;
    }

    // If phone is a string, convert to object format
    if (typeof phone === 'string') {
      return {
        mobile: phone,
        countryCode: countryPhoneCode || "91",
        isValidNumber: true // Assume valid if it's from a saved address
      };
    }

    // If phone is an object but missing some fields, fill them in
    if (typeof phone === 'object') {
      return {
        mobile: phone.mobile || phone || "",
        countryCode: phone.countryCode || countryPhoneCode || "91",
        isValidNumber: phone.isValidNumber !== undefined ? phone.isValidNumber : true
      };
    }

    // Fallback: return undefined if phone format is unexpected
    return undefined;
  };

useEffect(() => {
  if (addressItem) {
    const transformedPhone = transformPhoneForForm(
      addressItem.phone,
      addressItem.country_phone_code
    );

    // Destructure to exclude phone and country_phone_code from addressItem spread
    // The destructured values are intentionally unused (only used to exclude from spread)
    const {
      phone: _phone, // eslint-disable-line no-unused-vars
      country_phone_code: _countryPhoneCode, // eslint-disable-line no-unused-vars
      ...addressItemWithoutPhone
    } = addressItem;

    const countryValue = addressItem?.country || selectedCountry;

    reset({
      ...addressItemWithoutPhone,
      ...(transformedPhone && { phone: transformedPhone }),
      address_type: addressItem?.address_type
        ? isOtherAddressType
          ? "Other"
          : addressItem?.address_type
        : "Home",
      otherAddressType:
        addressItem && isOtherAddressType ? addressItem?.address_type : "",
      is_default_address: isNewAddress
        ? true
        : (addressItem?.is_default_address ?? false),
      // ✅ FIXED: Only add geo_location if it exists, don't create new objects
      ...(addressItem?.geo_location && {
        geo_location: addressItem.geo_location,
      }),
      // ✅ FIXED: Use ternary to avoid creating new values on every render
      country: countryValue,
    });
  } else {
    setValue("is_default_address", true);
    setValue("address_type", "Home");
    // Auto-fill user data when creating new address using memoized data
    if (userAutofillData.name) {
      setValue("name", userAutofillData.name);
    }
    // Don't prefill phone number if international shipping is enabled
    if (!internationalShipping && userAutofillData.phone && userAutofillData.phone.mobile) {
      setValue("phone", {
        mobile: userAutofillData.phone.mobile,
        countryCode: userAutofillData.phone.countryCode || "91",
        isValidNumber: true,
      });
    }
    if (userAutofillData.email) {
      setValue("email", userAutofillData.email);
    }
  }
}, [
  addressItem,
  reset,
  userAutofillData,
  internationalShipping,
  isNewAddress,
  selectedCountry,
  isOtherAddressType,
]);

  useEffect(() => {
    setShowOtherText(address_type === "Other");
  }, [address_type]);

  useEffect(() => {
    if (sector && sector.length > 0) {
      onGetLocality("sector", sector);
    }
  }, [sector]);

  useEffect(() => {
    if (!isRunningOnClient()) return;
    if (formContainerRef?.current) {
      let levelChecked = 0;
      const maxLevel = 20;

      let parentEle = formContainerRef?.current?.parentElement;
      while (parentEle && levelChecked < maxLevel) {
        levelChecked++;
        const computedStyle = window.getComputedStyle(parentEle);
        const backgroundColor = computedStyle?.backgroundColor;
        if (
          backgroundColor !== "rgba(0, 0, 0, 0)" &&
          backgroundColor !== "transparent"
        ) {
          setCurrBgColor(backgroundColor);
          break;
        }
        parentEle = parentEle.parentElement;
      }
    }
  }, []);

  const removeNullValues = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => {
        if (key === "area_code") {
          return value !== "";
        }
        return value !== null;
      })
    );
  };

  const onSubmit = (data) => {
    let payload = { ...data };
    if (payload.address_type === "Other") {
      payload.address_type = payload?.otherAddressType || "Other";
    }
    delete payload?.otherAddressType;
    // Convert country object to string (uid/id/iso2) if it's an object
    // Handles: API country objects (with id), countryCurrencies objects (with uid/iso2), and string values
    if (payload.country && typeof payload.country === "object" && payload.country !== null) {
      payload.country = payload.country.uid || payload.country.id || payload.country.iso2 || String(payload.country);
    }
    if (isNewAddress) {
      onAddAddress(removeNullValues(payload));
    } else {
      onUpdateAddress(removeNullValues(payload));
    }
  };

  const handleCountryChange = (event) => {
    // Find the country object from countryCurrencies
    const selectedCountryObj = countryCurrencies?.find(
      (country) => country.name === event || country.display_name === event
    );
    
    // Update local state immediately to preserve selection
    if (selectedCountryObj) {
      setLocalSelectedCountry(selectedCountryObj);
    } else if (typeof event === 'string') {
      // If it's just a string, create a minimal object
      setLocalSelectedCountry({ name: event, display_name: event });
    }
    
    // Only update header country when adding a new address
    // When editing, don't change the header country - it should remain as user's preference
    if (isNewAddress) {
      setI18nDetails(event);
    }
    
    setValue("country", event);
    setTimeout(() => {
      formSchema?.forEach((group) =>
        group?.fields?.forEach(({ key }) => {
          // Don't clear user auto-filled fields when country changes
          if (key !== "name" && key !== "phone" && key !== "email") {
            setValue(key, "");
          }
        })
      );
    }, 0);
  };
  
  // Update localSelectedCountry when selectedCountry prop changes (from parent)
  // Only sync from prop, don't reset when currentCountry changes (to preserve user selection)
  useEffect(() => {
    if (selectedCountry) {
      setLocalSelectedCountry(selectedCountry);
    }
  }, [selectedCountry]);
  
  // Initialize localSelectedCountry on mount only
  useEffect(() => {
    if (!localSelectedCountry) {
      const initialCountry = selectedCountry || currentCountry;
      if (initialCountry) {
        setLocalSelectedCountry(initialCountry);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectAddress = (data) => {
    // Get current form values to preserve name, phone, email, and address type
    const currentValues = getValues();
    // Get contact info from addressItem if available (for edit scenario)
    const addressItemPhone = addressItem?.phone 
      ? transformPhoneForForm(addressItem.phone, addressItem.country_phone_code)
      : null;
    
    // Merge Google Maps data with existing form values, preserving contact info and address type
    const mergedData = {
      ...currentValues,
      ...data,
      // Preserve name, phone, and email - prioritize current form, then addressItem, then userAutofillData
      name: currentValues.name || addressItem?.name || data.name || userAutofillData?.name || "",
      // Don't use userAutofillData phone if international shipping is enabled
      phone: currentValues.phone || addressItemPhone || data.phone || (!internationalShipping ? userAutofillData?.phone : "") || "",
      email: currentValues.email || addressItem?.email || data.email || userAutofillData?.email || "",
      // Preserve address type selection
      address_type: currentValues.address_type || "Home",
      otherAddressType: currentValues.otherAddressType || "",
      is_default_address: currentValues.is_default_address !== undefined ? currentValues.is_default_address : true,
    };
    reset(mergedData);
    formSchema?.forEach((group) =>
      group?.fields?.forEach(({ type, key }) => {
        if (type === "list") {
          setValue(key, "");
        }
      })
    );
    setIsMapView(false);
  };

  // Remove useMemo - getValues() creates new reference each time, defeating useMemo's purpose
const currentLocation = getValues();
const displayAddress = {
  addressLine1: [currentLocation.address, currentLocation.area]
    .filter(Boolean)
    .join(", "),
  addressLine2: [
    currentLocation.landmark,
    currentLocation.city,
    currentLocation.state,
    currentLocation.area_code,
  ]
    .filter(Boolean)
    .join(", "),
};

  if (isMapView) {
    const currentFormValues = getValues();
    // Use current form values if geo_location exists (user has selected from map)
    // Otherwise use original addressItem to show country defaults
    const mapAddressItem = 
      currentFormValues?.geo_location?.latitude && 
      currentFormValues?.geo_location?.longitude
        ? currentFormValues
        : addressItem;
    
    return (
      <GoogleMapAddress
        mapApiKey={mapApiKey}
        countryDetails={countryDetails}
        addressItem={mapAddressItem}
        onAddressSelect={selectAddress}
        onClose={onClose}
      />
    );
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <button
          className={styles.backIcon}
          onClick={onBack || onClose}
        >
          <BackIcon />
        </button>
        <h2 className={styles.formHeaderTitle}>
          {isNewAddress
            ? t("resource.common.address.add_new_address")
            : t("resource.common.address.edit_address")}
        </h2>
        <button className={styles.closeIcon} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className={styles.formBody}>
        {isMapAvailable && displayAddress && (
          <div className={styles.addressContainer}>
            <LocationPinIcon className={styles.locationPinIcon} />
            <div className={styles.address}>
              {!!displayAddress.addressLine1 && (
                <h4 className={styles.title}>{displayAddress.addressLine1}</h4>
              )}
              {!!displayAddress.addressLine2 && (
                <p className={styles.subTitle}>{displayAddress.addressLine2}</p>
              )}
            </div>
            <button
              className={styles.changeButton}
              onClick={() => setIsMapView(true)}
            >
              CHANGE
            </button>
          </div>
        )}
        <form className={styles.addressForm} onSubmit={handleSubmit(onSubmit)}>
          {internationalShipping && isNewAddress && (
            <div className={`${styles.formGroup} ${styles.formContainer}`}>
              <FyDropdown
                value={
                  localSelectedCountry?.name || 
                  localSelectedCountry?.display_name || 
                  localSelectedCountry || 
                  selectedCountry?.name || 
                  selectedCountry?.display_name || 
                  selectedCountry || 
                  currentCountry?.name ||
                  currentCountry?.display_name ||
                  countryDetails?.display_name ||
                  countryDetails?.name ||
                  (getFilteredCountries()?.[0]?.key) ||
                  ""
                }
                onChange={handleCountryChange}
                onSearch={handleCountrySearch}
                options={getFilteredCountries()}
                optionValue="display_name"
                optionLabel="display_name"
                showDropdownIcon
                label={t("resource.localization.country")}
                placeholder={t("resource.localization.select_country")}
                containerClassName={styles.customClass}
              />
            </div>
          )}
          {formSchema?.map((group, index) => (
            <div key={index} className={styles.formGroup}>
              <div ref={formContainerRef} className={styles.formContainer}>
                {group?.fields?.map((field) => (
                  <FormInputSelector
                    labelClassName={styles.labelClassName}
                    isSingleField={group?.fields?.length === 1}
                    key={field.key}
                    formData={field}
                    control={control}
                    formMethods={{ setValue, getValues, setError, trigger }}
                    allowDropdown={false}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className={styles.addressTypeContainer}>
            <label className={styles.addressTypeHeader}>
              {t("resource.common.save_as")}
              <span className={styles.required}> *</span>
            </label>
            <div className={styles.typeWrap}>
              {addressTypes?.map((type) => (
                <button
                  type="button"
                  key={type.value}
                  onClick={() => setValue("address_type", type.value)}
                  className={`${styles.typeBtn} ${watch("address_type") === type.value ? styles.selected : ""}`}
                >
                  {type.icon}
                  <span>{t(type.label)}</span>
                </button>
              ))}
            </div>
            <input
              type="hidden"
              {...register("address_type", { required: true })}
            />
            {errors.address_type && (
              <span className={`${styles.formError}`}>
                {t("resource.common.field_required")}
              </span>
            )}
          </div>
          {showOtherText && (
            <div className={styles.formItemDiv}>
              <label
                className={styles.formLabel}
                style={{ backgroundColor: currBgColor }}
              >
                {t("resource.localization.other_address_type")}{" "}
                <span className={`${styles.formReq}`}>*</span>
              </label>
              <input
                {...register("otherAddressType", {
                  validate: (value) => {
                    if (!value.trim()) {
                      return `${t("resource.common.address.address_type")} ${t("resource.common.address.is_required")}`;
                    }
                    if (value.length < 1 || value.length > 30) {
                      return t("resource.common.validation_length", {
                        min: 1 || 0,
                        max: 30,
                      });
                    }
                    return true;
                  },
                })}
                className={`${styles.formInputBox} ${styles.otherInput}`}
              />
              {errors.otherAddressType && (
                <div className={`${styles.formError}`}>
                  {errors.otherAddressType.message}
                </div>
              )}
            </div>
          )}
          {!isGuestUser && (
            <div className={styles.defaultAddressContainer}>
              <input
                id="is_default_address"
                className={styles.checkbox}
                type="checkbox"
                {...register("is_default_address")}
              />
              <label className={styles.label} htmlFor="is_default_address">
                {t("resource.common.address.make_this_my_default_address")}
              </label>
            </div>
          )}
          <div className={styles.formFooter}>
            {isMapAvailable ? (
              <FyButton type="submit">
                {t("resource.common.address.save_continue")}
              </FyButton>
            ) : (
              <>
                <FyButton variant="outlined" onClick={onClose}>
                  {t("resource.common.address.cancel")}
                </FyButton>
                <FyButton type="submit">
                  {t("resource.common.address.save")}
                </FyButton>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
