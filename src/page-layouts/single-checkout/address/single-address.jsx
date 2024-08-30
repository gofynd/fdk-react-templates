import React from "react";
import AddressForm from "../../../components/address-form/address-form";
import Modal from "../modal";
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
      <>
        <Modal
          title={modalTitle}
          isOpen={openModal}
          onCloseDialog={() => {
            resetAddressState();
            setOpenModal(false);
          }}
        >
          <div className={styles.addressWrapper}>
            <AddressForm
              isNewAddress={isNewAddress}
              addressItem={addressItem}
              onUpdateAddress={updateAddress}
              onAddAddress={addAddress}
              mapApiKey={mapApiKey}
              showGoogleMap={showGoogleMap}
              openModal={openModal}
              onGetLocality={getLocality}
            ></AddressForm>
          </div>
        </Modal>
      </>
      {showShipment || showPayment ? null : (
        <SingleAddressContent
          allAddresses={allAddresses}
          addressLoading={isAddressLoading}
          editAddress={editAddress}
          removeAddress={removeAddress}
          addressLoader={addressLoader}
          selectAddress={selectAddress}
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
