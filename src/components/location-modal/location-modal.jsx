/**
 * LocationModal is a React component that renders a modal dialog for entering a pincode
 * to check product availability and delivery options. It uses a form to capture the pincode
 * and provides options to close the modal or submit the form.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} [props.isOpen=true] - Determines if the modal is open or closed.
 * @param {string} [props.pincode=""] - The default pincode value to be displayed in the input field.
 * @param {object} [props.error=null] - Error object containing information about any validation or submission errors.
 * @param {Function} [props.onClose=() => {}] - Callback function to be called when the modal is closed.
 * @param {Function} [props.onSubmit=() => {}] - Callback function to be called when the form is submitted.
 * @param {Function} [props.onCurrentLocationClick=() => {}] - Callback function to be called when the current location button is clicked.
 *
 * @returns {JSX.Element} A JSX element representing the modal dialog.
 */

import React, { useEffect } from "react";
import * as styles from "./location-modal.less";
import Modal from "../core/modal/modal";
import { useForm } from "react-hook-form";
import FyInput from "../core/fy-input/fy-input";
import FyButton from "../core/fy-button/fy-button";
import { useGlobalTranslation } from "fdk-core/utils";

function LocationModal({
  isOpen = true,
  pincode = "",
  error = null,
  onClose = () => { },
  onSubmit = () => { },
  onCurrentLocationClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      pincode: pincode,
    },
  });

  useEffect(() => {
    reset({ pincode });
  }, [pincode, reset]);

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  useEffect(() => {
    if (!isOpen && !pincode) {
      clearErrors();
    }
  }, [isOpen, pincode]);

  return (
    <Modal
      isOpen={isOpen}
      closeDialog={onClose}
      hideHeader
      containerClassName={styles.locationModalContainer}
    >
      <div className={styles.locationModalHeader}>
        <h3 className={styles.modalTitle}>
          {t("resource.localization.check_pincode_availability")}
        </h3>
      </div>
      <p className={styles.locationSubtext}>
        {t("resource.localization.choose_address_for_availability")}
      </p>
      <form className={styles.locationInput} onSubmit={handleSubmit(onSubmit)}>
        <FyInput
          autoComplete="off"
          placeholder={t("resource.common.address.enter_pincode")}
          containerClassName={styles.pincodeInputWrapper}
          inputClassName={`${styles.pincodeInput} b2`}
          type="text"
          maxLength="6"
          {...register("pincode", {
            required: t("resource.common.address.valid_six_digit_pincode"),
            pattern: {
              value: /^\d{6}$/,
              message: t("resource.common.address.pincode_six_digits_required"),
            },
          })}
          error={!!errors.pincode || (!isDirty && !!errors.root)}
          errorMessage={
            errors.pincode?.message || (!isDirty && errors.root?.message)
          }
        />
        <FyButton type="submit" disabled={!isValid}>
          {t("resource.facets.apply")}
        </FyButton>
      </form>
      <button
        type="button"
        className={styles.currentLocation}
        onClick={onCurrentLocationClick}
      >
        {t("resource.localization.use_current_location")}
      </button>
    </Modal>
  );
}

export default LocationModal;
