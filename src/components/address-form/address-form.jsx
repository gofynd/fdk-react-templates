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

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./address-form.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import GoogleMapAddress from "../google-map/google-map";
import FormInputSelector from "./form-input-selector";
import FyDropdown from "../core/fy-dropdown/fy-dropdown";

const defaultFormSchema = [
  {
    group: "addressInfo", // Group identifier
    groupLabel: "Address Information", // Label for the group
    fields: [
      {
        key: "address",
        display: "Flat No/House No",
        type: "text",
        required: true,
        maxLength: 80,
        fullWidth: false,
        validation: {
          required: "House No. is required",
          pattern: {
            value: /^[A-Za-z0-9,./\s-]+$/,
            message:
              "House No can only contain letters, numbers, comma, period, hyphen, and slash",
          },
          maxLength: {
            value: 80,
            message: "Can not exceed 80 characters",
          },
        },
      },
      {
        key: "area",
        display: "Building Name/ Street",
        type: "text",
        required: true,
        maxLength: 80,
        fullWidth: false,
        validation: {
          required: "Building name or street is required",
          pattern: {
            value: /^[A-Za-z0-9,./\s-]+$/,
            message:
              "address can only contain letters, numbers, comma, period, hyphen, and slash",
          },
          maxLength: {
            value: 80,
            message: "Can not exceed 80 characters",
          },
        },
      },
      {
        key: "landmark",
        display: "Locality/ Landmark",
        type: "text",
        required: false,
        fullWidth: false,
        maxLength: 80,
        validation: {
          pattern: {
            value: /^[A-Za-z0-9,./\s-]+$/,
            message:
              "address can only contain letters, numbers, comma, period, hyphen, and slash",
          },
          maxLength: {
            value: 80,
            message: "Can not exceed 80 characters",
          },
        },
      },
      {
        key: "area_code",
        display: "Pincode",
        type: "text",
        required: true,
        maxLength: 6,
        fullWidth: false,
        validation: {
          required: "Pincode is required",
          pattern: {
            value: /^[1-9][0-9]{5}$/,
            message: "Invalid pincode",
          },
          maxLength: {
            value: 6,
            message: "Can not exceed 6 digits",
          },
        },
      },
      {
        key: "city",
        display: "City",
        type: "text",
        required: true,
        fullWidth: false,
        validation: {
          required: "City is required",
          pattern: {
            value: /^[A-Za-z\s_]+$/,
            message: "City can only contain letters",
          },
          maxLength: {
            value: 50,
            message: "City cannot exceed 50 characters",
          },
        },
      },
      {
        key: "state",
        display: "State",
        type: "text",
        required: true,
        fullWidth: false,
        validation: {
          required: "State is required",
          pattern: {
            value: /^[A-Za-z\s_]+$/,
            message: "State can only contain letters",
          },
          maxLength: {
            value: 50,
            message: "State cannot exceed 50 characters",
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
        display: "Full Name",
        type: "text",
        required: true,
        fullWidth: true,
        validation: {
          required: "Name is required",
          pattern: {
            value: /^[A-Za-z\s]+$/,
            message: "Name can only contain letters",
          },
          maxLength: {
            value: 50,
            message: "Name cannot exceed 50 characters",
          },
        },
      },
      {
        key: "phone",
        display: "Mobile Number",
        type: "text",
        required: true,
        fullWidth: false,
        validation: {
          required: "Mobile number is required",
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Invalid mobile number",
          },
        },
      },
      {
        key: "email",
        display: "Email",
        type: "email",
        fullWidth: false,
        validation: {
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: "Invalid email address",
          },
          maxLength: {
            value: 50,
            message: "Email cannot exceed 50 characters",
          },
        },
      },
    ],
  },
];

const addressTypes = [
  {
    label: "Home",
    value: "Home",
    icon: <SvgWrapper svgSrc="homeType" className={styles.typeIcon} />,
  },
  {
    label: "Work",
    value: "Work",
    icon: <SvgWrapper svgSrc="officeType" className={styles.typeIcon} />,
  },
  {
    label: "Friends & Family",
    value: "Friends & Family",
    icon: <SvgWrapper svgSrc="friendsFamily" className={styles.typeIcon} />,
  },
  {
    label: "Other",
    value: "Other",
    icon: <SvgWrapper svgSrc="otherType" className={styles.typeIcon} />,
  },
  // Add more address types as needed
];

const AddressForm = ({
  internationalShipping,
  formSchema = defaultFormSchema,
  addressItem,
  mapApiKey = "",
  showGoogleMap = false,
  isNewAddress = true,
  defaultPincode = "",
  onAddAddress = () => {},
  onUpdateAddress = () => {},
  onGetLocality = () => {},
  customFooter = (
    <button
      className={`${styles.commonBtn} ${styles.deliverBtn}`}
      type="submit"
    >
      {isNewAddress ? "Add Address" : "Update Address"}
    </button>
  ),
  setI18nDetails,
  handleCountrySearch,
  getFilteredCountries,
  selectedCountry,
  countryDetails,
}) => {
  const isOtherAddressType = !["Home", "Work", "Friends & Family"].includes(
    addressItem?.address_type
  );
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    trigger,
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
      country: selectedCountry || "India",
      // area_code: addressItem?.area_code || defaultPincode || "",
    },
  });
  const formContainerRef = useRef(null);
  const [currBgColor, setCurrBgColor] = useState("#fff");
  const [showOtherText, setShowOtherText] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [resetStatus, setResetStatus] = useState(true);
  const address_type = watch("address_type");
  const pin = watch("area_code");
  const sector = watch("sector");

  useEffect(() => {
    if (addressItem) {
      reset({
        ...addressItem,
        address_type: addressItem?.address_type
          ? isOtherAddressType
            ? "Other"
            : addressItem?.address_type
          : "Home",
        otherAddressType:
          addressItem && isOtherAddressType ? addressItem?.address_type : "",
      });
    } else {
      setValue("is_default_address", true);
      setValue("address_type", "Home");
    }
  }, [addressItem, reset]);

  useEffect(() => {
    setShowOtherText(address_type === "Other");
  }, [address_type]);

  const validatePin = async () => {
    const isPinValid = await trigger("area_code");
    if (!isPinValid) {
      return;
    }
    onGetLocality("pincode", pin).then((data) => {
      if (resetStatus) {
        getLatLngFromPostalCode(pin);
      }
      setValue("city", "");
      setValue("state", "");
      if (data?.showError) {
        setError("area_code", {
          type: "manual",
          message: data?.errorMsg,
        });
      } else {
        const { city = "", state = "" } = data;
        setValue("city", city);
        setValue("state", state);
      }
    });
  };

  useEffect(() => {
    if (pin) {
      validatePin();
    }
  }, [pin, setValue]);

  const getLatLngFromPostalCode = async (postalCode) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${mapApiKey}`
      );
      const data = await response.json();
      if (data?.results?.length > 0) {
        const location = data.results[0]?.geometry?.location;
        setValue("geo_location", {
          latitude: location?.lat,
          longitude: location?.lng,
        });
      }
    } catch (error) {
      console.error("Error fetching coordinates from postal code:", error);
    }
  };

  useEffect(() => {
    reset();
    setValue("country", selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    if (sector && sector.length > 0) {
      onGetLocality("sector", sector);
    }
  }, [sector]);

  useEffect(() => {
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
    if (isNewAddress) {
      onAddAddress(removeNullValues(payload));
    } else {
      onUpdateAddress(removeNullValues(payload));
    }
  };

  const selectAddress = (data) => {
    setResetStatus(false);
    reset(data);
    formSchema?.forEach((group) =>
      group?.fields?.forEach(({ type, key }) => {
        if (type === "list") {
          setValue(key, "");
        }
      })
    );
  };

  const onLoadMap = (map) => {
    if (map) {
      setIsMapLoaded(true);
    }
  };

  const isAddressForm = !showGoogleMap || !mapApiKey || isMapLoaded;

  return (
    <div
      className={styles.addressFormWrapper}
      style={{ display: isAddressForm ? "block" : "none" }}
    >
      {showGoogleMap && mapApiKey && (
        <div className={styles.mapWrap}>
          <GoogleMapAddress
            mapApiKey={mapApiKey}
            onAddressSelect={selectAddress}
            countryDetails={countryDetails}
            addressItem={addressItem}
            onLoad={onLoadMap}
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {internationalShipping && isNewAddress && (
          <div className={`${styles.formGroup} ${styles.formContainer}`}>
            <FyDropdown
              value={selectedCountry}
              onChange={setI18nDetails}
              onSearch={handleCountrySearch}
              options={getFilteredCountries()}
              optionValue="display_name"
              optionLabel="display_name"
              showDropdownIcon
              label="Country"
              placeholder="Select country"
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
                  setValue={setValue}
                  allowDropdown={false}
                />
              ))}
            </div>
          </div>
        ))}
        <div className={styles.addressTypeContainer}>
          <label className={styles.addressTypeHeader}>SAVE AS </label>
          <div className={styles.typeWrap}>
            {addressTypes?.map((type) => (
              <button
                type="button"
                key={type.value}
                onClick={() => setValue("address_type", type.value)}
                className={`${styles.typeBtn} ${watch("address_type") === type.value ? styles.selected : ""}`}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("address_type", { required: true })}
          />
          {errors.address_type && (
            <span className={`${styles.formError}`}>Field is required</span>
          )}
        </div>
        {showOtherText && (
          <div className={styles.formItemDiv}>
            <label
              className={styles.formLabel}
              style={{ backgroundColor: currBgColor }}
            >
              Other Address Type*
            </label>
            <input
              {...register("otherAddressType", {
                validate: (value) => {
                  if (!value) {
                    return "Field is required";
                  }
                  if (value.length < 1 || value.length > 30) {
                    return "Length must be between 1 and 30";
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
        <div className={styles.defaultAddressContainer}>
          <input
            id="is_default_address"
            className={styles.checkbox}
            type="checkbox"
            {...register("is_default_address")}
          />
          <label className={styles.label} htmlFor="is_default_address">
            Make this my default address
          </label>
        </div>
        <div>{customFooter}</div>
      </form>
    </div>
  );
};

export default AddressForm;
