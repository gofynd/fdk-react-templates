import React, { useCallback, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./profile-details.less";
import { GENDER_OPTIONS } from "../../helper/constant";
import FyInput from "../../components/core/fy-input/fy-input";
import FyButton from "../../components/core/fy-button/fy-button";
import { deepEqual } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";
import FyDatePicker from "../../components/date-picker/fy-date-picker/fy-date-picker";
import { convertISOToDDMMYYYY, convertDDMMYYYYToISO } from "../../helper/utils";
import RadioIcon from "../../assets/images/radio";

function ProfileDetails({ userData, onSave, isLoading }) {
    const { t } = useGlobalTranslation("translation");
  const today = new Date();               
  const todayFormatted = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`; 

  const defaultValues = useMemo(
    () => ({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      mobileNumber: userData?.mobileNumber || "",
      email: userData?.email || "",
      gender: userData?.gender || "male",
      dob: userData?.dob ? convertISOToDDMMYYYY(userData.dob) : "",
    }),
    [userData]
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm({ defaultValues });
const firstNameValue = watch("firstName");
const lastNameValue = watch("lastName");
const genderValue = watch("gender");
const dobValue = watch("dob");
const disableSave = useMemo(() => {
  const normalizeDob = (dob) => dob?.trim() || "";

  const currentValues = {
    firstName: firstNameValue?.trim() || "",
    lastName: lastNameValue?.trim() || "",
    gender: genderValue || "male",
    dob: normalizeDob(dobValue),
  };

  const initialValues = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    gender: userData?.gender || "male",
    dob: userData?.dob
      ? convertISOToDDMMYYYY(userData.dob)
      : "",
  };

  return (
    deepEqual(currentValues, initialValues) ||
    !!errors?.firstName ||
    !!errors?.lastName
  );
}, [
  firstNameValue,
  lastNameValue,
  genderValue,
  dobValue,
  userData,
  errors?.firstName,
  errors?.lastName,
]);


  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const formatDobValue = (value) => {
    if (typeof value === "string" && value.includes("T")) {
      return convertISOToDDMMYYYY(value) || "";
    }
    if (value instanceof Date && !isNaN(value.getTime())) {
      // Extract local date components directly to avoid timezone shift issues
      const day = String(value.getDate()).padStart(2, "0");
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const year = value.getFullYear();
      return `${day}-${month}-${year}`;
    }
    if (typeof value === "string" && value.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return value;
    }
    return "";
  };

  const onSubmit = (data) => {
    if (onSave) {
      const hasDob = typeof data.dob === "string" && data.dob.trim().length > 0;
      const dobValue =
        hasDob && data.dob.match(/^\d{2}-\d{2}-\d{4}$/)
          ? convertDDMMYYYYToISO(data.dob)
          : null;

      onSave({
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        mobileNumber: data.mobileNumber,
        email: data.email,
        dob: dobValue,
      });
    }
  };

 return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.profileForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>My Profile</h2>
      </div>

      <div className={styles.formDivider}></div>

      <div className={styles.formFields}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <div className={styles.inputWrapper}>
                  <FyInput
                    {...field}
                    label="First Name"
                    labelVariant="floating"
                    labelClassName={styles.inputLabel}
                    inputClassName={styles.inputField}
                    inputVariant="outlined"
                    error={!!errors.firstName}
                    errorMessage={errors.firstName?.message}
                  />
                </div>
              )}
            />
          </div>

          <div className={styles.formField}>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <div className={styles.inputWrapper}>
                  <FyInput
                    {...field}
                    label="Last Name"
                    labelVariant="floating"
                    labelClassName={styles.inputLabel}
                    inputClassName={styles.inputField}
                    inputVariant="outlined"
                    error={!!errors.lastName}
                    errorMessage={errors.lastName?.message}
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div
            className={
              styles.formField +
              " " +
              styles.inputWrapper +
              " " +
              styles.datePickerWrapper
            }
          >
            <Controller
              name="dob"
              control={control}
              render={({ field }) => {
                const dobValue = formatDobValue(field.value);
                return (
                  <FyDatePicker
                    key={dobValue || "empty-dob"}
                    preselectedDate={dobValue}
                    ref={field.ref}
                    onChange={(date) => {
                      const formattedDob = formatDobValue(date);
                      field.onChange(formattedDob);
                    }}
                    placeholderText="DD-MM-YYYY"
                    dateFormat="DD-MM-YYYY"
                    error={!!errors.dob}
                    errorMessage={errors.dob?.message}
                    inputLabel="Date of Birth"
                    className={styles.datePicker}
                    isLabelFloating
                    enableMonthYearSelection
                    minInactiveDate={todayFormatted}   
                    readOnly 
                  />
                );
              }}
            />
          </div>

          <div className={styles.formField}>
            <Controller
              name="mobileNumber"
              control={control}
              rules={{ required: "Mobile number is required" }}
              render={({ field }) => (
                <div className={styles.inputWrapper}>
                  <FyInput
                    {...field}
                    label="Mobile Number"
                    labelVariant="floating"
                    labelClassName={styles.inputLabel}
                    inputClassName={styles.inputField}
                    inputVariant="outlined"
                    error={!!errors.mobileNumber}
                    errorMessage={errors.mobileNumber?.message}
                    readOnly={!!userData?.mobileNumber}
                  />
                </div>
              )}
            />
          </div>
        </div>

        {/* {userData?.email && (
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <div className={styles.inputWrapper}>
                    <FyInput
                      {...field}
                      label="Email Address"
                      labelVariant="floating"
                      labelClassName={styles.inputLabel}
                      inputClassName={styles.inputField}
                      inputVariant="outlined"
                      error={!!errors.email}
                      errorMessage={errors.email?.message}
                      readOnly={!!userData?.email}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        )} */}

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <div className={styles.genderSection}>
              <p className={styles.genderLabel}>Gender</p>
              <div className={styles.genderOptions}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label className={styles.radioOption}>
                        <input
                          type="radio"
                          value="male"
                          checked={field.value === "male"}
                          onChange={() => field.onChange("male")}
                          className={styles.radioInput}
                        />
                        <RadioIcon checked={field.value === "male"} />
                        <span className={styles.radioLabel}>Male</span>
                      </label>

                      <label className={styles.radioOption}>
                        <input
                          type="radio"
                          value="female"
                          checked={field.value === "female"}
                          onChange={() => field.onChange("female")}
                          className={styles.radioInput}
                        />
                        <RadioIcon checked={field.value === "female"} />
                        <span className={styles.radioLabel}>Female</span>
                      </label>

                      <label className={styles.radioOption}>
                        <input
                          type="radio"
                          value="unisex"
                          checked={field.value === "unisex"}
                          onChange={() => field.onChange("unisex")}
                          className={styles.radioInput}
                        />
                        <RadioIcon checked={field.value === "unisex"} />
                        <span className={styles.radioLabel}>Other</span>
                      </label>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FyButton
        type="submit"
        className={styles.submitButton}
        disabled={isLoading || disableSave}
        fullWidth
      >
        Save
      </FyButton>
    </form>
  );
}

export default ProfileDetails;
