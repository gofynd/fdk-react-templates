import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./styles/profile-details.less";
import { GENDER_OPTIONS } from "../../helper/constant";
import FyInput from "../../components/core/fy-input/fy-input";
import FyButton from "../../components/core/fy-button/fy-button";
import { deepEqual } from "../../helper/utils";

function ProfileDetails({ userData, handleSave }) {
  const [isLoading, setIsLoading] = useState(false);
  const { firstName, lastName, gender } = userData;

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      firstName,
      lastName,
      gender,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      firstName,
      lastName,
      gender,
    });
  }, [userData]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        await handleSave(data);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleSave]
  );

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const genderValue = watch("gender");

  const disableSave = useMemo(
    () =>
      deepEqual(
        {
          firstName: firstNameValue?.trim(),
          lastName: lastNameValue?.trim(),
          gender: genderValue?.trim(),
        },
        userData
      ) ||
      errors?.firstName ||
      errors?.lastName,
    [
      userData,
      firstNameValue,
      lastNameValue,
      genderValue,
      errors?.firstName,
      errors?.lastName,
    ]
  );

  return (
    <div className={styles.profileDetailsContainer}>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputContainer}>
            <FyInput
              id="firstName"
              label="First Name"
              showAsterik
              inputVariant="underline"
              type="text"
              error={errors?.firstName && errors.firstName.type === "required"}
              errorMessage="Required"
              {...register("firstName", {
                required: true,
              })}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <FyInput
              id="lastName"
              label="Last Name"
              showAsterik
              type="text"
              inputVariant="underline"
              error={errors?.lastName && errors.lastName.type === "required"}
              errorMessage="Required"
              {...register("lastName", {
                required: true,
              })}
              required
            />
          </div>
          <div className={styles.radioInputContainer}>
            <div className={styles.formLabel}>
              Gender <span className={styles.required}>*</span>
            </div>
            <div className={styles.radioContent}>
              {GENDER_OPTIONS.map(({ value, display }) => (
                <div key={value} className={styles.radioInput}>
                  <input
                    className={styles.formRadioInput}
                    id={`gender-${value}`}
                    name="gender"
                    type="radio"
                    {...register("gender")}
                    value={value}
                  />
                  <label
                    className={styles.radioLabel}
                    htmlFor={`gender-${value}`}
                  >
                    {display}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.actionContainer}>
            <FyButton
              isLoading={isLoading}
              disabled={disableSave}
              className={styles.submitBtn}
              type="submit"
            >
              Save
            </FyButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileDetails;
