import React, { useEffect, useState } from "react";
import * as styles from "./edit-email-modal.less";
import Modal from "../../../../components/core/modal/modal";
import FyInput from "../../../../components/core/fy-input/fy-input";
import FyButton from "../../../../components/core/fy-button/fy-button";
import { useForm, Controller } from "react-hook-form";
import { useGlobalTranslation } from "fdk-core/utils";

function EditEmailModal({ isOpen, onClose, onUpdate, currentEmail }) {
  const { t } = useGlobalTranslation("translation");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: currentEmail || "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    reset({
      email: currentEmail || "",
    });
  }, [currentEmail, reset]);

  const handleUpdateEmail = async ({ email }) => {
    try {
      setIsLoading(true);
      await onUpdate(email);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmailErrorMessage = () => {
    if (!errors?.email) return "";

    // hide all email errors while user is typing/focused
    if (isEmailFocused) return "";

    return errors.email.message;
  };

  const emailErrorMessage = getEmailErrorMessage();

  return (
    <Modal
      isOpen={isOpen}
      closeDialog={onClose}
      title={t("resource.profile.edit_email")}
      headerClassName={styles.modalHeader}
      titleClassName={styles.modalTitle}
    >
      <div className={styles.modalContainer}>
        <div className={`${styles.body} ${styles.form}`}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(handleUpdateEmail)}
          >
            <div className={styles.formInputContainer}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: t("resource.profile.please_enter_a_email_address"),
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z-][a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$/,
                    message: t("resource.common.invalid_email_address"),
                  },
                }}
                render={({ field }) => (
                  <FyInput
                    {...field}
                    type="text"
                    label={t("resource.profile.enter_your_email_address")}
                    labelVariant="floating"
                    className={styles.emailInput}
                    error={!!emailErrorMessage}
                    errorMessage={emailErrorMessage}
                    onFocus={(e) => {
                      setIsEmailFocused(true);
                      if (field.onFocus) field.onFocus(e);
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    onBlur={(e) => {
                      setIsEmailFocused(false);
                      field.onBlur();
                    }}
                  />
                )}
              />
            </div>

            <div className={styles.btnContainer}>
              <FyButton
                fullWidth
                type="submit"
                className={styles.updateBtn}
                isLoading={isLoading}
              >
                {t("resource.facets.update")}
              </FyButton>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default EditEmailModal;