import React, { useState } from "react";
import * as styles from "./add-email-modal.less";
import Modal from "../../../../components/core/modal/modal";
import FyInput from "../../../../components/core/fy-input/fy-input";
import FyButton from "../../../../components/core/fy-button/fy-button";
import { useForm } from "react-hook-form";

function AddEmailModal({ isOpen, onClose, onAdd }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleAddEmail = async ({ email }) => {
    try {
      setIsLoading(true);
      await onAdd(email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      closeDialog={onClose}
      title="Add Email"
      headerClassName={styles.modalHeader}
      titleClassName={styles.modalTitle}
    >
      <div className={styles.modalContainer}>
        <div className={`${styles.body} ${styles.form}`}>
          <form className={styles.form} onSubmit={handleSubmit(handleAddEmail)}>
            <div className={styles.formInputContainer}>
              <FyInput
                type="text"
                label="Enter your email address"
                labelVariant="floating"
                error={errors?.email}
                errorMessage={errors?.email?.message}
                className={styles.emailInput}
                {...register("email", {
                  required: "Please enter a email address",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            <div className={styles.btnContainer}>
              <FyButton
                fullWidth
                type="submit"
                className={styles.yesBtn}
                isLoading={isLoading}
              >
                Add
              </FyButton>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default AddEmailModal;
