import React from "react";
import AddressForm from "../../../components/address-form/address-form";
import Modal from "../../../components/core/modal/modal";
import SingleAddressContent from "./single-address-content";
import SinglesAddressHeader from "./single-address-header";
import * as styles from "./single-address-header.less";

function SingleAddress({
  address,
  showPayment,
  showShipment,
  setShowPayment,
  setShowShipment,
  mapApiKey,
  showGoogleMap,
  loader,
}) {
  const {
    allAddresses = [],
    isAddressLoading = false,
    editAddress,
    removeAddress,
    addressLoader,
    selectAddress,
    invalidAddressError,
    selectedAddressId,
    setSelectedAddressId,
    getOtherAddress,
    getDefaultAddress,
    setOpenModal,
    openModal,
    resetAddressState,
    updateAddress,
    addAddress,
    modalTitle,
    isNewAddress,
    addressItem,
    showAddNewAddressModal,
    getLocality,
    isInternationalShippingEnabled,
    defaultFormSchema,
    setI18nDetails,
    handleCountrySearch,
    getFilteredCountries,
    selectedCountry,
    countryDetails,
  } = address;

  function backToEdit() {
    setShowPayment(false);
    setShowShipment(false);
  }

  return (
    <div className={styles.addressContainerLeft}>
      <SinglesAddressHeader
        allAddresses={allAddresses}
        showAddNewAddressModal={showAddNewAddressModal}
        showPayment={showPayment}
        showShipment={showShipment}
        backToEdit={backToEdit}
      ></SinglesAddressHeader>
      <Modal
        title={modalTitle}
        isOpen={openModal}
        closeDialog={resetAddressState}
        modalType="right-modal"
      >
        <div className={styles.addressWrapper}>
          <AddressForm
            internationalShipping={isInternationalShippingEnabled}
            formSchema={defaultFormSchema}
            isNewAddress={isNewAddress}
            addressItem={addressItem}
            onUpdateAddress={updateAddress}
            onAddAddress={addAddress}
            mapApiKey={mapApiKey}
            showGoogleMap={showGoogleMap}
            openModal={openModal}
            onGetLocality={getLocality}
            setI18nDetails={setI18nDetails}
            handleCountrySearch={handleCountrySearch}
            getFilteredCountries={getFilteredCountries}
            selectedCountry={selectedCountry?.display_name ?? ""}
            countryDetails={countryDetails}
          ></AddressForm>
        </div>
      </Modal>
      {showShipment || showPayment ? null : (
        <SingleAddressContent
          allAddresses={allAddresses}
          addressLoading={isAddressLoading}
          editAddress={editAddress}
          removeAddress={removeAddress}
          addressLoader={addressLoader}
          selectAddress={selectAddress}
          invalidAddressError={invalidAddressError}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          getOtherAddress={getOtherAddress}
          getDefaultAddress={getDefaultAddress}
          loader={loader}
        ></SingleAddressContent>
      )}
    </div>
  );
}

export default SingleAddress;
