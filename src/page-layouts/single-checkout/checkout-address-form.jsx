import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./checkout-address-form.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import GoogleMapAddress from "../../components/google-map/google-map";

const formSchema = [
  {
    name: "address",
    label: "Flat No/House No*",
    type: "text",
    required: true,
    maxLength: 20,
    validation: {
      required: "House No. is required",
      pattern: {
        value: /^[A-Za-z0-9,./\s-]+$/,
        message:
          "House No can only contain letters, numbers, comma, period, hyphen, and slash",
      },
      maxLength: {
        value: 20,
        message: "Can not exceed 20 characters",
      },
    },
  },
  {
    name: "area",
    label: "Building Name/ Street *",
    type: "text",
    required: true,
    maxLength: 40,
    validation: {
      required: "address is required",
      pattern: {
        value: /^[A-Za-z0-9,./\s-]+$/,
        message:
          "address can only contain letters, numbers, comma, period, hyphen, and slash",
      },
      maxLength: {
        value: 40,
        message: "Can not exceed 40 characters",
      },
    },
  },
  {
    name: "landmark",
    label: "Locality/ Landmark *",
    type: "text",
    required: true,
    maxLength: 40,
    validation: {
      required: "landmark is required",
      pattern: {
        value: /^[A-Za-z0-9,./\s-]+$/,
        message:
          "address can only contain letters, numbers, comma, period, hyphen, and slash",
      },
      maxLength: {
        value: 40,
        message: "Can not exceed 40 characters",
      },
    },
  },
  {
    name: "area_code",
    label: "Pincode*",
    type: "text",
    required: true,
    validation: {
      required: "Pin-code is required",
      pattern: {
        value: /^[1-9][0-9]{5}$/,
        message: "Invalid pin-code",
      },
    },
  },
  {
    name: "city",
    label: "City*",
    type: "text",
    required: true,
    validation: {
      required: "City is required",
      pattern: {
        value: /^[A-Za-z]+$/,
        message: "City can only contain letters",
      },
      maxLength: {
        value: 20,
        message: "City cannot exceed 20 characters",
      },
    },
  },
  {
    name: "state",
    label: "State*",
    type: "text",
    required: true,
    validation: {
      required: "State is required",
      pattern: {
        value: /^[A-Za-z]+$/,
        message: "State can only contain letters",
      },
      maxLength: {
        value: 20,
        message: "State cannot exceed 20 characters",
      },
    },
  },
  { name: "country", label: "", type: "hidden", required: false },
  {
    name: "name",
    label: "Full Name*",
    type: "text",
    required: true,
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

const CheckoutAddressForm = ({
  addressItem,
  mapApiKey,
  showGoogleMap,
  addAddress,
  updateAddress,
  isNewAddress,
}) => {
  const isOtherAddressType = !["Home", "Work", "Friends & Family"].includes(
    addressItem?.address_type
  );
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...addressItem,
      country: addressItem?.country || "India",
    } || { address_type: "Home" },
  });
  const [isCityStateDisabled, setCityStateDisabled] = useState(true);
  const [showOtherText, setShowOtherText] = useState(false);
  const address_type = watch("address_type");

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
    }
  }, [addressItem, reset]);

  // useEffect(() => {
  //   if (area_code && area_code.length === 6) {
  //     axios
  //       .get(`https://api.example.com/pincode/${pincode}`) // Replace with your actual API endpoint
  //       .then((response) => {
  //         const { city, state } = response.data;
  //         setValue("city", city);
  //         setValue("state", state);
  //         setCityStateDisabled(false);
  //       })
  //       .catch((error) => {
  //         console.error(
  //           "There was an error fetching the city and state!",
  //           error
  //         );
  //       });
  //   } else {
  //     setValue("city", "");
  //     setValue("state", "");
  //     setCityStateDisabled(true);
  //   }
  // }, [area_code, setValue]);

  useEffect(() => {
    setShowOtherText(address_type === "Other");
  }, [address_type]);

  const removeNullValues = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value !== null)
    );
  };

  const onSubmit = (data) => {
    if (isNewAddress) {
      addAddress(removeNullValues(data));
    } else {
      updateAddress(removeNullValues(data));
    }
  };

  const selectAddress = (data) => {
    reset(data);
  };

  return (
    <div>
      {showGoogleMap && mapApiKey && (
        <div style={{ padding: "12px 24px" }}>
          <GoogleMapAddress
            mapApiKey={mapApiKey}
            onAddressSelect={selectAddress}
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        {formSchema.map((field) => (
          <div key={field.name} className={styles.formItemDiv}>
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
              {errors[field.name] && <span>{errors[field.name]?.message}</span>}
            </span>
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

        <button
          className={`${styles.commonBtn} ${styles.deliverBtn}`}
          type="submit"
        >
          {addressItem ? "Update Address" : "Add Address"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutAddressForm;
