import React from "react";
import CheckoutAddressForm from "../checkout-address-form";
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
          <CheckoutAddressForm
            isNewAddress={isNewAddress}
            addressItem={addressItem}
            updateAddress={updateAddress}
            addAddress={addAddress}
          ></CheckoutAddressForm>
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
        ></SingleAddressContent>
      )}
    </div>
  );
}

export default SingleAddress;
