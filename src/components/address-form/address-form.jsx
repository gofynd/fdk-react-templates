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

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./address-form.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import GoogleMapAddress from "../google-map/google-map";

const defaultFormSchema = [
  {
    group: "addressInfo", // Group identifier
    groupLabel: "Address Information", // Label for the group
    fields: [
      {
        name: "address",
        label: "Flat No/House No*",
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
        name: "area",
        label: "Building Name/ Street *",
        type: "text",
        required: true,
        maxLength: 80,
        fullWidth: false,
        validation: {
          required: "address is required",
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
        name: "landmark",
        label: "Locality/ Landmark *",
        type: "text",
        required: true,
        fullWidth: false,
        maxLength: 80,
        validation: {
          required: "landmark is required",
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
        name: "area_code",
        label: "Pincode*",
        type: "text",
        required: true,
        maxLength: 6,
        fullWidth: false,
        validation: {
          required: "Pin-code is required",
          pattern: {
            value: /^[1-9][0-9]{5}$/,
            message: "Invalid pin-code",
          },
          maxLength: {
            value: 6,
            message: "Can not exceed 6 digits",
          },
        },
      },
      {
        name: "city",
        label: "City*",
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
        name: "state",
        label: "State*",
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
      { name: "country", label: "", type: "hidden", required: false },
    ],
  },

  {
    group: "contactInfo",
    groupLabel: "Contact Information", // Label for the group
    fields: [
      {
        name: "name",
        label: "Full Name*",
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
        name: "phone",
        label: "Mobile Number*",
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
        name: "email",
        label: "Email (optional)",
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
      {
        name: "is_default_address",
        label: "Make this my default address",
        type: "checkbox",
        fullWidth: true,
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
    icon: <SvgWrapper svgSrc="otherType" className={styles.typeIcon} />,
  },
  {
    label: "Other",
    value: "Other",
    icon: <SvgWrapper svgSrc="otherType" className={styles.typeIcon} />,
  },
  // Add more address types as needed
];

const AddressForm = ({
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
      {addressItem ? "Update Address" : "Add Address"}
    </button>
  ),
}) => {
  const isOtherAddressType = !["Home", "Work", "Friends & Family"].includes(
    addressItem?.address_type
  );
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...addressItem,
      country: addressItem?.country || "India",
      area_code: addressItem?.addressItem || defaultPincode || "",
    } || { address_type: "Home" },
  });
  const [isCityStateDisabled, setCityStateDisabled] = useState(true);
  const [showOtherText, setShowOtherText] = useState(false);
  const address_type = watch("address_type");
  const pin = watch("area_code");

  useEffect(() => {
    if (addressItem) {
      reset(addressItem);
      setValue(
        "address_type",
        addressItem
          ? isOtherAddressType
            ? "Other"
            : addressItem?.address_type
          : "Home"
      );
      setValue(
        "otherAddressType",
        addressItem && isOtherAddressType ? addressItem?.address_type : ""
      );
    } else {
      setValue("is_default_address", true);
      setValue("address_type", "Home");
    }
  }, [addressItem, reset]);

  useEffect(() => {
    if (pin && pin.length === 6) {
      onGetLocality(pin).then((data) => {
        setValue("city", "");
        setValue("state", "");
        setError("area_code", {
          type: "manual",
          message: data?.errorMsg,
        });
        if (data?.showError) {
        } else {
          const { city = "", state = "" } = data;
          setValue("city", city);
          setValue("state", state);
        }
      });
    }
  }, [pin, setValue]);

  useEffect(() => {
    setShowOtherText(address_type === "Other");
  }, [address_type]);

  const removeNullValues = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value !== null)
    );
  };

  const onSubmit = (data) => {
    let payload = { ...data };
    if (payload.address_type === "Other") {
      payload.address_type = payload?.otherAddressType || "Other";
      delete payload?.otherAddressType;
    }
    if (isNewAddress) {
      onAddAddress(removeNullValues(payload));
    } else {
      onUpdateAddress(removeNullValues(payload));
    }
  };

  const selectAddress = (data) => {
    reset(data);
  };

  return (
    <div className={styles.addressFormWrapper}>
      {showGoogleMap && mapApiKey && (
        <div className={styles.mapWrap}>
          <GoogleMapAddress
            mapApiKey={mapApiKey}
            onAddressSelect={selectAddress}
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {formSchema.map((group, index) => (
          <div key={index} className={styles.formGroup}>
            {group.groupLabel && (
              <h3 className={styles.groupLabel}>{group.groupLabel}</h3>
            )}
            <div className={styles.formContainer}>
              {group.fields.map((field) => (
                <div
                  key={field.name}
                  className={`${styles.formItemDiv} ${field.fullWidth ? styles.fullInput : styles.halfInput}`}
                >
                  <label
                    className={
                      field.type === "checkbox"
                        ? styles.formCheckboxLabel
                        : styles.formLabel
                    }
                  >
                    {field.label}
                  </label>
                  <input
                    {...register(field.name, field.validation)}
                    type={field.type}
                    maxLength={field.maxLength || 60}
                    className={
                      field.type === "checkbox"
                        ? styles.formCheckBox
                        : styles.formInputBox
                    }
                    disabled={field.disabled && isCityStateDisabled}
                  />
                  <span
                    className={`${styles.formError} ${errors[field.name] ? styles.visible : ""}`}
                  >
                    {errors[field.name] && (
                      <span>{errors[field.name]?.message}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className={styles.addressTypeContainer}>
          <label className={styles.addressTypeHeader}>SAVE AS </label>
          <div className={styles.typeWrap}>
            {addressTypes.map((type) => (
              <button
                type="button"
                key={type.value}
                onClick={() => setValue("address_type", type.value)}
                className={styles.typeBtn}
                style={{
                  border:
                    watch("address_type") === type.value
                      ? "2px solid var(--buttonPrimary)"
                      : "1px solid var(--dividerStokes)",
                }}
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
          <span
            className={`${styles.formError} ${errors.address_type ? styles.visible : ""}`}
          >
            {errors.address_type && <span>This field is required</span>}
          </span>
        </div>

        {showOtherText && (
          <div className={styles.formItemDiv}>
            <label className={styles.formLabel}>Other Address Type*</label>
            <input
              {...register("otherAddressType", { required: true })}
              className={styles.formInputBox}
            />
            <span
              className={`${styles.formError} ${errors.otherAddressType ? styles.visible : ""}`}
            >
              {errors.otherAddressType && <span>This field is required</span>}
            </span>
          </div>
        )}
        <div>{customFooter}</div>
      </form>
    </div>
  );
};

export default AddressForm;
