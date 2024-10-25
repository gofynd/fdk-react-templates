import React, { useCallback, useState } from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./phone.less";
import ConfirmModal from "../components/confirm-modal/confirm-modal";
import MobileNumber from "../../../page-layouts/auth/mobile-number/mobile-number";
import FyButton from "../../../components/core/fy-button/fy-button";
import AddPhoneModal from "../components/add-phone-modal/add-phone-modal";

function Phone({
  setMobileNumberAsPrimary,
  deleteMobileNumber,
  phoneNumbers,
  sendOtpMobile,
  verifyMobileOtp,
  resendOtp,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState({});

  const handleShowAddModal = useCallback((show) => {
    setShowAddModal(show);
  }, []);

  const handleSetPrimary = useCallback(async (phone) => {
    try {
      setIsLoading(true);
      await setMobileNumberAsPrimary(phone);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleShowDeleteModal = useCallback((phone) => {
    setSelectedPhone(phone);
    setShowDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setSelectedPhone({});
    setShowDeleteModal(false);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteMobileNumber(selectedPhone);
      handleCloseDeleteModal();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [selectedPhone]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formItem}>
            {phoneNumbers?.map(({ __typename, ...phoneDetails }) => {
              const { phone, verified, primary } = phoneDetails;
              return (
                <div className={styles.formInput} key={`phone-${phone}`}>
                  <MobileNumber
                    mobile={phone}
                    inputClassName={styles.phoneInputText}
                    containerClassName={styles.phoneInputContainer}
                    isShowLabel={false}
                    disable
                  />
                  <div className={styles.actionContainer}>
                    {verified && (
                      <FyButton
                        color="success"
                        size="small"
                        className={styles.verified}
                      >
                        Verified
                      </FyButton>
                    )}
                    {primary && (
                      <FyButton
                        color="success"
                        size="small"
                        variant="outlined"
                        className={styles.primary}
                      >
                        Primary
                      </FyButton>
                    )}
                    {!verified && (
                      <FyButton
                        variant="outlined"
                        className={styles.verifyBtn}
                        size="small"
                        isLoading={isLoading}
                      >
                        Verify
                      </FyButton>
                    )}
                    {!primary && verified && (
                      <FyButton
                        className={styles.verifyBtn}
                        variant="outlined"
                        size="small"
                        onClick={async () => {
                          await handleSetPrimary(phoneDetails);
                        }}
                        isLoading={isLoading}
                      >
                        Set Primary
                      </FyButton>
                    )}
                    {!primary && (
                      <FyButton
                        className={styles.removeBtn}
                        onClick={() => handleShowDeleteModal(phoneDetails)}
                      >
                        <SvgWrapper svgSrc="cross-black" />
                      </FyButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.submitBtnContainer}>
            <FyButton
              className={styles.btn}
              onClick={() => handleShowAddModal(true)}
            >
              Add Number
            </FyButton>
          </div>
        </div>
      </div>
      {showAddModal && (
        <AddPhoneModal
          sendOtpMobile={sendOtpMobile}
          resendOtp={resendOtp}
          verifyMobileOtp={verifyMobileOtp}
          isOpen={showAddModal}
          onClose={() => handleShowAddModal(false)}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          text="Are you sure you want to remove the number?"
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDelete}
          onCancel={handleCloseDeleteModal}
        />
      )}
    </>
  );
}

export default Phone;
