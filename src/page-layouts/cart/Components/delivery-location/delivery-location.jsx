import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./delivery-location.less";
import { isValidPincode } from "../../../../helper/utils";
import Modal from "../../../../components/core/modal/modal";
import AddressItem from "../../../../components/address-item/address-item";
import AddressForm from "../../../../components/address-form/address-form";
function DeliveryLocation({
  deliveryLocation,
  pincode = "",
  error = null,
  isPincodeModalOpen = false,
  isAddressModalOpen = false,
  isAddAddressModalOpen = false,
  defaultAddress = [],
  otherAddresses = [],
  selectedAddressId = "",
  mapApiKey,
  showGoogleMap,
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
  setI18nDetails = () => {},
  handleCountrySearch = () => {},
  getFilteredCountries = () => {},
  selectedCountry,
  countryDetails,
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

  const AddrErrorDiv = ({ id }) => {
    return (
      id === addrError?.id &&
      addrError?.message && (
        <div className={styles.addrErrText}>{addrError?.message}</div>
      )
    );
  };
  return (
    <div className={styles.cartPincodeContainer}>
      <div className={styles.pinCodeDetailsContainer}>
        <span className={styles.pincodeHeading}>
          {deliveryLocation ? "Deliver To:" : "Check delivery time & services"}
        </span>
        <span className={styles.pinCode}>
          &nbsp;
          {deliveryLocation}
        </span>
      </div>
      <div className={styles.changePinCodeButton} onClick={onChangeButtonClick}>
        Change
      </div>
      <Modal
        isOpen={isPincodeModalOpen}
        closeDialog={onCloseModalClick}
        title="Delivery PIN Code"
      >
        <div className={styles.pincodeModal}>
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
                CHECK
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
      <Modal
        isOpen={isAddressModalOpen}
        modalType="right-modal"
        closeDialog={onCloseModalClick}
        title="Change Address"
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
                  placeholder="Enter Pincode"
                  {...register("pincode", {
                    validate: (value) =>
                      isValidPincode(value) || "Please enter valid pincode",
                  })}
                />
              </div>
              <button className={styles.modalChangePinCodeButton} type="submit">
                CHECK
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
                <>
                  <div className={styles.heading}>Default Address</div>
                  {defaultAddress?.map((item, index) => {
                    return (
                      <AddressItem
                        key={`${item?.id}_#${index}`}
                        addressItem={item}
                        onAddressSelect={setSelectedAddressId}
                        showAddressSelectionCheckbox={true}
                        selectedAddressId={selectedAddressId}
                        belowAddressSlot={<AddrErrorDiv id={item?.id} />}
                      ></AddressItem>
                    );
                  })}
                </>
              )}
              {otherAddresses?.length > 0 && (
                <>
                  <div className={styles.heading}>Other Address</div>
                  {otherAddresses.map((item, index) => {
                    return (
                      <AddressItem
                        key={`${item?.id}_#${index}`}
                        addressItem={item}
                        onAddressSelect={setSelectedAddressId}
                        showAddressSelectionCheckbox={true}
                        selectedAddressId={selectedAddressId}
                        belowAddressSlot={<AddrErrorDiv id={item?.id} />}
                      ></AddressItem>
                    );
                  })}
                </>
              )}

              <button
                className={`${styles.commonBtn} ${styles.addCta}`}
                onClick={onAddButtonClick}
              >
                + &nbsp; Add New Address
              </button>
              {selectedAddressId &&
                (defaultAddress.length > 0 || otherAddresses?.length > 0) && (
                  <button
                    className={`${styles.commonBtn} ${styles.selectCta}`}
                    onClick={selectAddress}
                  >
                    select this address
                  </button>
                )}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Add new Address"
        isOpen={isAddAddressModalOpen}
        closeDialog={onCloseModalClick}
        modalType="right-modal"
        ignoreClickOutsideForClass="pac"
      >
        <div className={styles.addressModal}>
          <div className={`${styles.modalBody} ${styles.addressFormWrapper}`}>
            <AddressForm
              internationalShipping={isInternationalShippingEnabled}
              addressItem={addressItem}
              formSchema={addressFormSchema}
              isNewAddress={true}
              onAddAddress={addAddress}
              mapApiKey={mapApiKey}
              showGoogleMap={showGoogleMap}
              onGetLocality={getLocality}
              defaultPincode={pincode}
              setI18nDetails={setI18nDetails}
              handleCountrySearch={handleCountrySearch}
              getFilteredCountries={getFilteredCountries}
              selectedCountry={selectedCountry?.display_name ?? ""}
              countryDetails={countryDetails}
            ></AddressForm>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DeliveryLocation;
