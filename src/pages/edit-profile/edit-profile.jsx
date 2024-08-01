import { useId, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as styles from "./edit-profile.less";
import VerifyBoth from "../../page-layouts/auth/verify-both/verify-both";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import { validateName, validateEmailField } from "../../helper/utils";

function EditProfile({
  isFormSubmitSuccess = false,
  user = {
    firstName: "",
    lastName: "",
    gender: "male",
    email: "",
    phone: {
      countryCode: "91",
      mobile: "",
      isValidNumber: false,
    },
  },
  isEmail = true,
  emailLevel = "hard",
  primaryEmail = {},
  isMobile = true,
  mobileLevel = "hard",
  primaryPhone = {},
  isLogoutButton = true,
  isSkipButton = true,
  error = null,
  verifyDetailsProp = {},
  onEditProfileSubmit = () => {},
  onLogoutButtonClick = () => {},
  onSkipButtonClick = () => {},
}) {
  const fNameInputId = useId();
  const lNameInputId = useId();
  const emailInputId = useId();

  const validateEmail = (value) => {
    if ((isEmail && emailLevel === "hard") || value) {
      return validateEmailField(value);
    }
    return true;
  };

  const isEmailRequired = useMemo(() => {
    if (emailLevel === "soft") {
      return " (optional)";
    }
    if (emailLevel === "hard") {
      return "*";
    }
    return "";
  }, [emailLevel]);

  const isMobileRequired = useMemo(() => {
    if (mobileLevel === "soft") {
      return "optional";
    }
    if (mobileLevel === "hard") {
      return "required";
    }
    return "";
  }, [mobileLevel]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: user,
  });

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  return (
    <div className={styles.containerWrapper}>
      {!isFormSubmitSuccess ? (
        <>
          <form onSubmit={handleSubmit(onEditProfileSubmit)}>
            <div className={styles.editProfileTitle}>Complete Signup</div>
            <div
              className={`${styles.inputGroup} ${styles.editProfileNameInput} ${
                errors?.firstName ? styles.errorInput : ""
              }`}
            >
              <label className={styles.inputTitle} htmlFor={fNameInputId}>
                First Name*
              </label>
              <input
                id={fNameInputId}
                type="text"
                {...register("firstName", {
                  validate: (value) =>
                    validateName(value) || "Please enter valid first name",
                })}
              />
              {errors?.firstName && (
                <p className={styles.errorText}>{errors?.firstName?.message}</p>
              )}
            </div>
            <div
              className={`${styles.inputGroup} ${styles.editProfileNameInput} ${
                errors.lastName ? styles.errorInput : ""
              }`}
            >
              <label className={styles.inputTitle} htmlFor={lNameInputId}>
                Last Name*
              </label>
              <input
                id={lNameInputId}
                type="text"
                {...register("lastName", {
                  validate: (value) =>
                    validateName(value) || "Please enter valid last name",
                })}
              />
              {errors?.lastName && (
                <p className={styles.errorText}>{errors.lastName.message}</p>
              )}
            </div>
            <div className={styles.genderRadioContainer}>
              <label className={styles.radioContainer}>
                Male
                <input type="radio" value="male" {...register("gender")} />
                <span className={styles.checkmark} />
              </label>
              <label className={styles.radioContainer}>
                Female
                <input type="radio" value="female" {...register("gender")} />
                <span className={styles.checkmark} />
              </label>
              <label className={styles.radioContainer}>
                Other
                <input type="radio" value="unisex" {...register("gender")} />
                <span className={styles.checkmark} />
              </label>
            </div>
            {isEmail && (
              <div
                className={`${styles.inputGroup} ${styles.editProfileEmail} ${
                  errors.email ? styles.errorInput : ""
                }`}
              >
                <label className={styles.inputTitle} htmlFor={emailInputId}>
                  {`Email${isEmailRequired}`}
                </label>
                <input
                  id={emailInputId}
                  type="text"
                  disabled={primaryEmail?.verified}
                  {...register("email", {
                    validate: (value) =>
                      validateEmail(value) ||
                      "Please enter valid email address",
                  })}
                />
                {errors.email && (
                  <p className={styles.errorText}>{errors.email.message}</p>
                )}
              </div>
            )}
            {isMobile && (
              <div className={styles.editProfileMobileInput}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (isMobileRequired === "required" || value?.mobile) {
                        return (
                          value.isValidNumber ||
                          "Please enter valid phone number"
                        );
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <MobileNumber
                      mobile={field.value.mobile}
                      countryCode={field.value.countryCode}
                      error={error}
                      disable={primaryPhone?.verified}
                      isRequired={isMobileRequired}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </div>
            )}
            {errors.root && (
              <div className={styles.editProfileAlert}>
                <span className={styles.alertMessage}>
                  {errors.root.message}
                </span>
              </div>
            )}
            <button className={styles.continueBtn} type="submit">
              Continue
            </button>
          </form>
          {isLogoutButton && (
            <button className={styles.logoutBtn} onClick={onLogoutButtonClick}>
              Logout
            </button>
          )}
          {isSkipButton && (
            <button className={styles.skipBtn} onClick={onSkipButtonClick}>
              SKIP
            </button>
          )}
        </>
      ) : (
        <VerifyBoth {...verifyDetailsProp} />
      )}
    </div>
  );
}

export default EditProfile;
