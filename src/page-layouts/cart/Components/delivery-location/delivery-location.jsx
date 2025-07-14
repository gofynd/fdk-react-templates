import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./delivery-location.less";
import Modal from "../../../../components/core/modal/modal";
import AddressItem from "../../../../components/address-item/address-item";
import AddressForm from "../../../../components/address-form/v2/address-form";
import { useGlobalTranslation } from "fdk-core/utils";
import { translateDynamicLabel } from "../../../../helper/utils";

function DeliveryLocation({
  pincode = "",
  deliveryLocation,
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
}) {
  const { t } = useGlobalTranslation("translation");
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
  const { displayName, maxLength, validatePincode } = pincodeInput;

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
        <span className={styles.pincodeHeading}>
          {deliveryLocation
            ? `${t("resource.common.deliver_to")}:`
            : t("resource.cart.check_delivery_time_services")}
        </span>
        <span className={styles.pinCode}>
          &nbsp;
          {deliveryLocation}
        </span>
      </div>
      <div className={styles.changePinCodeButton} onClick={onChangeButtonClick}>
        {deliveryLocation
          ? t("resource.cart.change")
          : t("resource.cart.enter_pin_code")}
      </div>
      <Modal
        isOpen={isPincodeModalOpen}
        closeDialog={onCloseModalClick}
        title={`${t("resource.common.delivery")} ${displayName}`}
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
              placeholder={`${t("resource.common.enter")} ${displayName}`}
              {...register("pincode", {
                validate: validatePincode,
              })}
              maxLength={maxLength}
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
        title={t("resource.cart.change_address")}
        bodyClassName={styles.addAddressModalBody}
      >
        <div className={styles.addressModal}>
          <div className={styles.modalBody}>
            <form
              className={styles.pincodeBox}
              onSubmit={handleSubmit(onPincodeSubmit)}
            >
              <div className={styles.modalPincodeInput}>
                <input
                  type="text"
                  placeholder={`${t("resource.common.enter")} ${displayName}`}
                  {...register("pincode", {
                    validate: validatePincode,
                  })}
                  maxLength={maxLength}
                />
              </div>
              <button className={styles.modalChangePinCodeButton} type="submit">
                {t("resource.facets.check")}
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
            <div className={styles.addressContentConitainer}>
              {defaultAddress?.length > 0 && (
                <div className={styles.addressItemContainer}>
                  <div className={styles.heading}>
                    {t("resource.common.address.default_address")}
                  </div>
                  {defaultAddress?.map((item, index) => {
                    return (
                      <AddressItem
                        key={`${item?.id}_#${index}`}
                        containerClassName={styles.customAddressItem}
                        addressItem={item}
                        onAddressSelect={setSelectedAddressId}
                        showAddressSelectionCheckbox={true}
                        selectedAddressId={selectedAddressId}
                        belowAddressSlot={<AddrErrorDiv id={item?.id} />}
                      ></AddressItem>
                    );
                  })}
                </div>
              )}
              {otherAddresses?.length > 0 && (
                <div className={styles.addressItemContainer}>
                  <div className={styles.heading}>
                    {t("resource.common.address.other_address")}
                  </div>
                  {otherAddresses.map((item, index) => {
                    return (
                      <AddressItem
                        key={`${item?.id}_#${index}`}
                        containerClassName={styles.customAddressItem}
                        addressItem={item}
                        onAddressSelect={setSelectedAddressId}
                        showAddressSelectionCheckbox={true}
                        selectedAddressId={selectedAddressId}
                        belowAddressSlot={<AddrErrorDiv id={item?.id} />}
                      ></AddressItem>
                    );
                  })}
                </div>
              )}
              <div className={styles.addAddress}>
                <button
                  className={`${styles.commonBtn} ${styles.addCta}`}
                  onClick={onAddButtonClick}
                >
                  + &nbsp; {t("resource.common.address.add_address")}
                </button>
              </div>
            </div>
          </div>

          {selectedAddressId &&
            (defaultAddress.length > 0 || otherAddresses?.length > 0) && (
              <div className={styles.stickyContainer}>
                <button
                  className={`${styles.commonBtn} ${styles.selectCta}`}
                  onClick={selectAddress}
                >
                  {t("resource.cart.select_this_address")}
                </button>
              </div>
            )}
        </div>
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
        ></AddressForm>
      </Modal>
    </div>
  );
}

export default DeliveryLocation;
