import React, { useCallback, useState } from "react";
import * as styles from "./phone.less";
import MobileNumber from "../../../page-layouts/auth/mobile-number/mobile-number";
import FyButton from "../../../components/core/fy-button/fy-button";
import AddPhoneModal from "../components/add-phone-modal/add-phone-modal";
import Loader from "../../../components/loader/loader";
import { useGlobalTranslation } from "fdk-core/utils";
import EmptyState from "../components/empty-state/empty-state";
import AddAddressIcon from "../../../assets/images/add-address.svg";

function Phone({
  setMobileNumberAsPrimary,
  deleteMobileNumber,
  phoneNumbers,
  sendOtpMobile,
  verifyMobileOtp,
  resendOtp,
  countryCode = "91",
}) {
  const { t } = useGlobalTranslation("translation");
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
        <div className={styles.header}>{t("resource.common.phone_number")}</div>
        {phoneNumbers?.length > 0 && (
          <div className={styles.formContainer}>
            <div className={styles.formItem}>
              {phoneNumbers?.map((phoneDetails) => {
                const {
                  phone,
                  verified,
                  country_code: phoneCountryCode,
                } = phoneDetails;
                return (
                  <>
                    <div className={styles.formInput} key={`phone-${phone}`}>
                      <MobileNumber
                        mobile={phone}
                        countryCode={phoneCountryCode}
                        height="40px"
                        textColor="var(--textHeading, #26201a)"
                        containerClassName={styles.phoneInputContainer}
                        isShowLabel={false}
                        fontSize="12px"
                        disable
                      />
                      <div className={styles.actionContainer}>
                        {verified && (
                          <FyButton
                            color="success"
                            size="small"
                            className={styles.verified}
                            disabled
                          >
                            {t("resource.profile.verified")}
                          </FyButton>
                        )}
                        {/* {primary && (
                      <FyButton
                        color="info"
                        size="small"
                        // variant="outlined"
                        className={styles.primary}
                      >
                        {t("resource.profile.primary")}
                      </FyButton>
                    )} */}
                        {!verified && (
                          <FyButton
                            variant="outlined"
                            className={styles.verifyBtn}
                            size="small"
                            isLoading={isLoading}
                          >
                            {t("resource.facets.verify")}
                          </FyButton>
                        )}
                        {/* {!primary && verified && (
                      <FyButton
                        className={styles.verifyBtn}
                        variant="outlined"
                        size="small"
                        onClick={async () => {
                          await handleSetPrimary(phoneDetails);
                        }}
                        isLoading={isLoading}
                      >
                        {t("resource.profile.set_primary")}
                      </FyButton>
                    )}
                    {!primary && (
                      <FyButton
                        className={styles.removeBtn}
                        onClick={() => handleShowDeleteModal(phoneDetails)}
                      >
                        <SvgWrapper svgSrc="cross-black" />
                      </FyButton>
                    )} */}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        )}
        {!phoneNumbers?.length && (
          <EmptyState
            title={t("resource.profile.no_phone_number_added")}
            onBtnClick={() => handleShowAddModal(true)}
            btnTitle={t("resource.profile.add_phone_number_caps")}
            icon={<AddAddressIcon />}
          />
        )}
      </div>
      {showAddModal && (
        <AddPhoneModal
          sendOtpMobile={sendOtpMobile}
          resendOtp={resendOtp}
          verifyMobileOtp={verifyMobileOtp}
          isOpen={showAddModal}
          countryCode={countryCode}
          onClose={() => handleShowAddModal(false)}
          // countries={countries}
        />
      )}
      {/* {showDeleteModal && (
        <ConfirmModal
          text={t("resource.profile.confirm_remove_number")}
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDelete}
          onCancel={handleCloseDeleteModal}
        />
      )} */}
    </>
  );
}

export default Phone;
