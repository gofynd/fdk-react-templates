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
import GoogleMapAddress from "../google-map/google-map";
import FormInputSelector from "./form-input-selector";
import FyDropdown from "../core/fy-dropdown/fy-dropdown";
import { useGlobalTranslation } from "fdk-core/utils";
import HomeIcon from "../../assets/images/home-type.svg";
import OfficeIcon from "../../assets/images/office-type.svg";
import FriendsFamilyIcon from "../../assets/images/friends-family.svg";
import OtherIcon from "../../assets/images/other-type.svg";
import { isRunningOnClient } from "../../helper/utils";

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
              "address can only contain letters, numbers, comma, period, hyphen, and slash"
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
  showGoogleMap = false,
  isNewAddress = true,
  defaultPincode = "",
  onAddAddress = () => {},
  onUpdateAddress = () => {},
  onGetLocality = () => {},
  isGuestUser = false,
  customFooter,
  setI18nDetails,
  handleCountrySearch,
  getFilteredCountries,
  selectedCountry,
  countryDetails,
}) => {
  const { t } = useGlobalTranslation("translation");
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
      // area_code: addressItem?.area_code || defaultPincode || "",
    },
  });
  const formContainerRef = useRef(null);
  const [currBgColor, setCurrBgColor] = useState("#fff");
  const [showOtherText, setShowOtherText] = useState(false);
  const address_type = watch("address_type");
  const sector = watch("sector");

  useEffect(() => {
    if (addressItem) {
      reset({
        ...getValues(),
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
    if (isNewAddress) {
      onAddAddress(removeNullValues(payload));
    } else {
      onUpdateAddress(removeNullValues(payload));
    }
  };

  const handleCountryChange = (event) => {
    setI18nDetails(event);
    setValue("country", event);
    setTimeout(() => {
      formSchema?.forEach((group) =>
        group?.fields?.forEach(({ key }) => {
          setValue(key, "");
        })
      );
    }, 0);
  };

  const selectAddress = (data) => {
    //setResetStatus(false);
    reset(data);
    formSchema?.forEach((group) =>
      group?.fields?.forEach(({ type, key }) => {
        if (type === "list") {
          setValue(key, "");
        }
      })
    );
  };

  return (
    <div className={styles.addressFormWrapper}>
      {showGoogleMap && mapApiKey && (
        <div className={styles.mapWrap}>
          <GoogleMapAddress
            mapApiKey={mapApiKey}
            onAddressSelect={selectAddress}
            countryDetails={countryDetails}
            addressItem={addressItem}
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {internationalShipping && isNewAddress && (
          <div className={`${styles.formGroup} ${styles.formContainer}`}>
            <FyDropdown
              value={selectedCountry}
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
            {t("resource.common.save_as")}{" "}
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
            <span className={`${styles.formError}`}>{t("resource.common.field_required")}</span>
          )}
        </div >
        {showOtherText && (
          <div className={styles.formItemDiv}>
            <label
              className={styles.formLabel}
              style={{ backgroundColor: currBgColor }}
            >
              {t("resource.localization.other_address_type")} <span className={`${styles.formReq}`}>*</span>
            </label >
            <input
              {...register("otherAddressType", {
                validate: (value) => {
                  if (!value.trim()) {
                    return `${t("resource.common.address.address_type")} ${t("resource.common.address.is_required")}`;
                  }
                  if (value.length < 1 || value.length > 30) {
                    return t("resource.common.validation_length", { min: 1 || 0, max: 30 });
                  }
                  return true;
                },
              })}
              className={`${styles.formInputBox} ${styles.otherInput}`}
            />
            {
              errors.otherAddressType && (
                <div className={`${styles.formError}`}>
                  {errors.otherAddressType.message}
                </div>
              )
            }
          </div >
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
        <div>
          {customFooter ? 
            customFooter : 
            <button
              className={`${styles.commonBtn} ${styles.deliverBtn}`}
              type="submit"
            >
              {isNewAddress ? t("resource.common.address.add_address") : t("resource.common.address.update_address")}
          </button>}
      </div>
      </form>
    </div>
  );
};

export default AddressForm;
