import React, { useCallback, useEffect, useState } from "react";
import * as styles from "./email.less";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import AddEmailModal from "../components/add-email-modal/add-email-modal";
import ConfirmModal from "../components/confirm-modal/confirm-modal";
import FyButton from "../../../components/core/fy-button/fy-button";
import FyInput from "../../../components/core/fy-input/fy-input";
import Loader from "../../../components/loader/loader";
import { useGlobalTranslation } from "fdk-core/utils";

function Email({
  sendVerificationLinkToEmail,
  setEmailAsPrimary,
  addEmail,
  deleteEmail,
  emails,
}) {
  const { t } = useGlobalTranslation("translation");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleShowAddModal = useCallback((show) => {
    setShowAddModal(show);
  }, []);

  const handleShowDeleteModal = useCallback((email) => {
    setSelectedEmail(email);
    setShowDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedEmail({});
  }, []);

  const handleVerification = useCallback(async (email) => {
    try {
      setIsLoading(true);
      await sendVerificationLinkToEmail(email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddEmail = useCallback(async (email) => {
    try {
      await addEmail(email);
      handleShowAddModal(false);
    } catch (error) {
      throw error;
    }
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      await deleteEmail(selectedEmail);
      handleCloseDeleteModal();
    } catch (error) {
      throw error;
    }
  }, [selectedEmail, handleCloseDeleteModal]);

  const handleSetPrimary = useCallback(async (email) => {
    try {
      setIsLoading(true);
      await setEmailAsPrimary(email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader
          containerClassName={styles.loaderContainer}
          loaderClassName={styles.customLoader}
        />
      </div>
    );
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formItem}>
            {emails?.map((emailDetails) => {
              const { verified, primary, email } = emailDetails;
              return (
                <div className={styles.formInput} key={email}>
                  <FyInput
                    disabled
                    value={email}
                    inputClassName={`${styles.emailInput}  ${styles.emailBox}`}
                    containerClassName={styles.emailInputContainer}
                  />
                  <div className={styles.actionContainer}>
                    {verified && (
                      <FyButton
                        color="success"
                        size="small"
                        className={styles.verified}
                      >
                        {t("resource.profile.verified")}
                      </FyButton>
                    )}
                    {primary && (
                      <FyButton
                        color="info"
                        size="small"
                        className={styles.primary}
                      >
                        {t("resource.profile.primary")}
                      </FyButton>
                    )}

                    {!verified && (
                      <FyButton
                        variant="outlined"
                        className={styles.verifyButton}
                        onClick={() => handleVerification(email)}
                        size="small"
                        isLoading={isLoading}
                      >
                        {t("resource.facets.verify")}
                      </FyButton>
                    )}

                    {!primary && verified && (
                      <FyButton
                        className={styles.verifyButton}
                        variant="outlined"
                        size="small"
                        onClick={() => handleSetPrimary(email)}
                        isLoading={isLoading}
                      >
                        {t("resource.profile.set_primary")}
                      </FyButton>
                    )}
                    {!primary && (
                      <FyButton
                        className={styles.removeBtn}
                        onClick={() => handleShowDeleteModal(emailDetails)}
                      >
                        <SvgWrapper svgSrc="cross-black" />
                      </FyButton>
                    )}
                  </div>
                </div>
              );
            })}

            <div className={styles.submitBtnContainer}>
              <FyButton
                className={styles.btn}
                onClick={() => handleShowAddModal(true)}
              >
                {t("resource.profile.add_email")}
              </FyButton>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddEmailModal
          isOpen={showAddModal}
          onClose={() => handleShowAddModal(false)}
          onAdd={handleAddEmail}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          text={t("resource.profile.confirm_remove_email")}
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={async () => {
            await handleDelete(selectedEmail);
          }}
          onCancel={handleCloseDeleteModal}
        />
      )}
    </>
  );
}

export default Email;
