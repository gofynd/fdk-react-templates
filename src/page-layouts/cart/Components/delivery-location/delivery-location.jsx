import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./delivery-location.less";
import Modal from "../../../../components/core/modal/modal";
import AddressItem from "../../../../components/address-item/address-item";
import AddressForm from "../../../../components/address-form/v2/address-form";
import { useGlobalTranslation, useGlobalStore, useFPI } from "fdk-core/utils";
import { translateDynamicLabel } from "../../../../helper/utils";
import FyButton from "../../../../components/core/fy-button/fy-button";

function DeliveryLocation({
  pincode = "",
  deliveryLocation,
  addressTags = [],
  btnLabel,
  pincodeInput,
  error = null,
  isPincodeModalOpen = false,
  isAddressModalOpen = false,
  isAddAddressModalOpen = false,
  defaultAddress = [],
  otherAddresses = [],
  selectedAddressId = "",
  showGoogleMap,
  mapApiKey,
  getLocality,
  selectAddress,
  addrError,
  onChangeButtonClick = () => {},
  onAddButtonClick = () => {},
  onPincodeSubmit = () => {},
  onCloseModalClick = () => {},
  onBackFromAddAddress = null,
  setSelectedAddressId = () => {},
  addAddress = () => {},
  isInternationalShippingEnabled = false,
  addressFormSchema,
  addressItem,
  onCountryChange = () => {},
  handleCountrySearch = () => {},
  getFilteredCountries = () => {},
  selectedCountry,
  countryDetails,
  isGuestUser = false,
  user,
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  // Fetch user data internally if not provided via props (similar to checkout page)
  const userDetails = useGlobalStore(fpi?.getters?.USER_DATA);
  const userData = user || userDetails;
  const computedBtnLabel = btnLabel || t("resource.cart.change");
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      pincode,
    },
  });
  const { displayName, maxLength, validatePincode } = pincodeInput || {};

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  const AddrErrorDiv = ({ id }) => {
    return (
      id === addrError?.id &&
      addrError?.message && (
        <div className={styles.addrErrText}>
          {translateDynamicLabel(addrError?.message, t)}
        </div>
      )
    );
  };
  return (
    <div className={styles.cartPincodeContainer}>
      <div className={styles.pinCodeDetailsContainer}>
                <div className={styles.deliveryHeader}>

        <span className={styles.pincodeHeading}>
          {deliveryLocation
            ? `${t("resource.common.deliver_to")}:`
            : t("resource.cart.check_delivery_time_services")}
        </span>
        {deliveryLocation && (
            <span className={styles.pinCode}>{deliveryLocation}</span>
          )}
          {addressTags && addressTags.length > 0 && (
            <div className={styles.addressTagsContainer}>
              {addressTags
                .filter((tag) => tag != null && tag !== "")
                .map((tag, index) => (
                  <span key={index} className={styles.addressTag}>
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <button
          className={styles.changePinCodeButton}
          onClick={onChangeButtonClick}
        >
          {deliveryLocation ? "Change Address" : "Change Pincode"}
        </button>
      </div>
      <Modal
        isOpen={isPincodeModalOpen}
        closeDialog={onCloseModalClick}
        title={`${t("resource.common.delivery")} ${displayName || ""}`}
        containerClassName={styles.pincodeModal}
        bodyClassName={styles.modalBody}
        headerClassName={styles.modalHeader}
      >
        <form
          className={styles.modalPincodeContainer}
          onSubmit={handleSubmit(onPincodeSubmit)}
        >
          <div className={styles.modalPincodeInput}>
            <input
              type="text"
              placeholder={`${t("resource.common.enter")} ${displayName || ""}`}
              {...register("pincode", {
                validate: validatePincode,
              })}
              maxLength={maxLength || undefined}
            />
          </div>
          <button className={styles.modalChangePinCodeButton} type="submit">
            {t("resource.facets.check")}
          </button>
          {errors.pincode && (
            <div className={styles.errorText}>{errors?.pincode?.message}</div>
          )}
          {errors.root && (
            <div className={styles.errorText}>{errors?.root?.message}</div>
          )}
        </form>
      </Modal>
      <Modal
        isOpen={isAddressModalOpen}
        closeDialog={onCloseModalClick}
        title={t("resource.common.address.select_delivery_address")}
        customClassName={styles.deliveryAddressModal}
        containerClassName={styles.deliverAddressesModalContainer}
        headerClassName={styles.deliveryAddressHeader}
        bodyClassName={styles.deliveryAddressBody}
      >
        <>
          <div className={styles.deliverAddressesContainer}>
            <div className={styles.contentHeaderContainer}>
              <h5 className={styles.contentHeader}>
                {t("resource.common.address.saved_addresses")}
              </h5>
              <button className={styles.addCta} onClick={onAddButtonClick}>
                +&nbsp;{t("resource.common.address.add_new_address")}
              </button>
            </div>
            <div className={styles.deliveryAddressList}>
              {defaultAddress?.map((item, index) => (
                <AddressItem
                  key={`${item?.id}_#${index}`}
                  containerClassName={styles.customAddressItem}
                  addressItem={item}
                  onAddressSelect={setSelectedAddressId}
                  showAddressSelectionCheckbox={true}
                  selectedAddressId={selectedAddressId}
                  isDefault={true}
                  belowAddressSlot={<AddrErrorDiv id={item?.id} />}
                ></AddressItem>
              ))}
              {otherAddresses.map((item, index) => (
                <AddressItem
                  key={`${item?.id}_#${index}`}
                  containerClassName={styles.customAddressItem}
                  addressItem={item}
                  onAddressSelect={setSelectedAddressId}
                  showAddressSelectionCheckbox={true}
                  selectedAddressId={selectedAddressId}
                  belowAddressSlot={<AddrErrorDiv id={item?.id} />}
                ></AddressItem>
              ))}
            </div>
          </div>
          {selectedAddressId &&
            (defaultAddress.length > 0 || otherAddresses?.length > 0) && (
              <div className={styles.stickyContainer}>
                <FyButton
                  color="primary"
                  variant="contained"
                  fullWidth
                  className={styles.deliveryCta}
                  onClick={selectAddress}
                >
                  {t("resource.common.address.deliver_here")}
                </FyButton>
              </div>
            )}
        </>
      </Modal>
      <Modal
        title={t("resource.common.address.add_new_address")}
        isOpen={isAddAddressModalOpen}
        closeDialog={onCloseModalClick}
        ignoreClickOutsideForClass="pac"
        hideHeader
        containerClassName={styles.addAddressModalContainer}
        bodyClassName={styles.addAddressModalBody}
      >
        <AddressForm
          internationalShipping={isInternationalShippingEnabled}
          addressItem={addressItem}
          formSchema={addressFormSchema}
          isNewAddress={true}
          onAddAddress={addAddress}
          isMap={showGoogleMap}
          mapApiKey={mapApiKey}
          onGetLocality={getLocality}
          defaultPincode={pincode}
          setI18nDetails={onCountryChange}
          handleCountrySearch={handleCountrySearch}
          getFilteredCountries={getFilteredCountries}
          selectedCountry={selectedCountry?.display_name ?? ""}
          countryDetails={countryDetails}
          isGuestUser={isGuestUser}
          onClose={onCloseModalClick}
          onBack={onBackFromAddAddress}
          onUpdateAddress={addAddress}
          user={userData}
        ></AddressForm>
      </Modal>
    </div>
  );
}

export default DeliveryLocation;
