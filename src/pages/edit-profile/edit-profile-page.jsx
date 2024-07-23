import React, { useId } from "react";
import { Controller } from "react-hook-form";
import useEditProfile from "../../page-layouts/edit-profile/useEditProfile";
import * as styles from "./edit-profile-page.less";
import AuthContainer from "../../page-layouts/auth/auth-container/auth-container";
import VerifyBoth from "../../page-layouts/auth/verify-both/verify-both";
import MobileNumber from "../../page-layouts/auth/mobile-number/mobile-number";
import { validateName } from "../../helper/utils";

function EditProfilePage({ fpi }) {
  const fNameInputId = useId();
  const lNameInputId = useId();
  const emailInputId = useId();

  const {
    editProfileForm,
    showVerifyBoth,
    verifyBothData,
    showVerifyEmail,
    showVerifyMobile,
    isLoggedIn,
    isEmail,
    isEmailRequired,
    isMobile,
    isMobileRequired,
    isEmailExist,
    isMobileDisabled,
    isCancelButton,
    validateEmail,
    handleCancelClick,
    handleSignOutClick,
    handleProfileUpdate,
  } = useEditProfile(fpi);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = editProfileForm;

  return (
    <AuthContainer>
      <div className={styles.containerWrapper}>
        {!showVerifyBoth ? (
          <form onSubmit={handleSubmit(handleProfileUpdate)}>
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
              {/* onInput={(e) => validateText('firstName', e.target.value)} */}
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
              {/* onInput={(e) => validateText('lastName', e.target.value)} */}
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
                  {`Email ${isEmailRequired}`}
                </label>
                <input
                  id={emailInputId}
                  type="text"
                  disabled={isEmailExist}
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
                      disable={isMobileDisabled}
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
            {isLoggedIn && (
              <button className={styles.logoutBtn} onClick={handleSignOutClick}>
                Logout
              </button>
            )}
            {isCancelButton && (
              <button className={styles.skipBtn} onClick={handleCancelClick}>
                SKIP
              </button>
            )}
          </form>
        ) : (
          <VerifyBoth
            fpi={fpi}
            isShowVerifyEmail={showVerifyEmail}
            isShowVerifyMobile={showVerifyMobile}
            verifyBothData={verifyBothData}
          />
        )}
      </div>
    </AuthContainer>
  );
}

export default EditProfilePage;
