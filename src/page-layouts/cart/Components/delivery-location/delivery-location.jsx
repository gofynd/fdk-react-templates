import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./delivery-location.less";
import { isValidPincode } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import Modal from "../../../../components/core/modal/modal";

function DeliveryLocation({
  pincode = "",
  error = null,
  isModalOpen = false,
  onChangeButtonClick = () => {},
  onPincodeSubmit = () => {},
  onCloseModalClick = () => {},
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      pincode,
    },
  });

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  return (
    <div className={styles.cartPincodeContainer}>
      <div className={styles.pinCodeDetailsContainer}>
        <span className={styles.pincodeHeading}>
          {pincode ? "Deliver To:" : "Check delivery time & services"}
        </span>
        <span className={styles.pinCode}>
          &nbsp;
          {pincode}
        </span>
      </div>
      <div className={styles.changePinCodeButton} onClick={onChangeButtonClick}>
        {pincode ? "Change" : "Enter PIN Code"}
      </div>
      <Modal isOpen={isModalOpen} closeDialog={onCloseModalClick}>
        <div className={styles.pinCodeModal}>
          <div className={styles.modalHeader}>
            <div className={styles.modalHeading}>Delivery PIN Code</div>
            <div className={styles.modalCloseIcon}>
              <span>
                <SvgWrapper svgSrc="item-close" onClick={onCloseModalClick} />
              </span>
            </div>
          </div>
          <div className={styles.modalBody}>
            <form
              className={styles.modalPincodeContainer}
              onSubmit={handleSubmit(onPincodeSubmit)}
            >
              <div className={styles.modalPincodeInput}>
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  {...register("pincode", {
                    validate: (value) =>
                      isValidPincode(value) || "Please enter valid pincode",
                  })}
                />
              </div>
              <button className={styles.modalChangePinCodeButton} type="submit">
                Change
              </button>
              {errors.pincode && (
                <div className={styles.errorText}>
                  {errors?.pincode?.message}
                </div>
              )}
              {errors.root && (
                <div className={styles.errorText}>{errors?.root?.message}</div>
              )}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DeliveryLocation;
