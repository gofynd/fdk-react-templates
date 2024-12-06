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

function LocationModal({
  isOpen = true,
  pincode = "",
  error = null,
  onClose = () => {},
  onSubmit = () => {},
  onCurrentLocationClick = () => {},
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
    clearErrors
  } = useForm({
    mode: "onChange",
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

  return (
    <Modal
      isOpen={isOpen}
      closeDialog={onClose}
      hideHeader
      containerClassName={styles.locationModalContainer}
    >
      <div className={styles.locationModalHeader}>
        <h3 className={styles.modalTitle}>
          Enter pincode to check availability
        </h3>
        {/* <button onClick={onClose}>
          <SvgWrapper svgSrc="cross-black" />
        </button> */}
      </div>
      <p className={styles.locationSubtext}>
        Choose your address location to see product availability and delivery
        options
      </p>
      <form className={styles.locationInput} onSubmit={handleSubmit(onSubmit)}>
        <FyInput
          autoComplete="off"
          placeholder="Please enter pincode"
          containerClassName={styles.pincodeInput}
          inputClassName="b2"
          type="text"
          maxLength="6"
          {...register("pincode", {
            required: "Please enter a valid 6-digit pincode",
            pattern: {
              value: /^\d{6}$/, 
              message: "Pincode must be exactly 6 digits long",
            },
          })}
          error={!!errors.pincode || !!errors.root}
          errorMessage={errors.pincode?.message || errors.root?.message}
        />
        <FyButton type="submit" disabled={!isValid}>
          APPLY
        </FyButton>
      </form>
      <button
        type="button"
        className={styles.currentLocation}
        onClick={onCurrentLocationClick}
      >
        use my current location
      </button>
    </Modal>
  );
}

export default LocationModal;
