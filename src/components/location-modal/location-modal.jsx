import React, { useEffect } from "react";
import * as styles from "./location-modal.less";
import Modal from "../core/modal/modal";
import { useForm } from "react-hook-form";
import FyInput from "../core/fy-input/fy-input";
import FyButton from "../core/fy-button/fy-button";

function LocationModal({
  isOpen = true,
  pincode = "",
  onClose = () => {},
  onSubmit = () => {},
  onCurrentLocationClick = () => {},
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      pincode: pincode,
    },
  });

  useEffect(() => {
    reset({ pincode });
  }, [pincode, reset]);

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
          {...register("pincode", { required: true, pattern: /^\d{6}$/ })}
          error={!!errors.pincode}
          errorMessage="Please enter a valid 6-digit pincode"
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
