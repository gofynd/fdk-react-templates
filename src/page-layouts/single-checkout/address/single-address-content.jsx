import React from "react";
import { useNavigate } from "react-router-dom";
import AddressItem from "../../../components/address-item/address-item";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./single-address-content.less";

function AddressRight({
  selectedAddressId,
  addressItem,
  editAddress,
  removeAddress,
}) {
  return (
    <>
      {selectedAddressId == addressItem?.id && (
        <div className={styles.contentTopRight}>
          <span
            className={styles.edit}
            onClick={() => editAddress(addressItem)}
          >
            edit
          </span>
          <span>|</span>
          <span className={styles.remove} onClick={() => removeAddress()}>
            Remove
          </span>
        </div>
      )}
    </>
  );
}

function DeliverBtn({ selectedAddressId, id, selectAddress }) {
  return (
    <>
      {selectedAddressId === id && (
        <button
          className={styles.deliverToThis}
          onClick={() => selectAddress()}
        >
          DELIVER TO THIS ADDRESS
        </button>
      )}
    </>
  );
}

function InvalidAddress({ errorMessage }) {
  const navigate = useNavigate();
  return (
    <div className={styles.invalidAddError}>
      <div className={styles.invalidAddErrorLeft}>
        <div>
          <SvgWrapper svgSrc={"warning-address"} />
        </div>
        <div className={styles.invalidAddErrorData}>
          <div className={styles.invalidAddErrorMsg}>{errorMessage}</div>
          <div className={styles.invalidAddErrorSuggestion}>
            Try changing the pincode or remove the non deliverable items
          </div>
        </div>
      </div>
      <button
        className={styles.invalidEditCart}
        onClick={() => {
          navigate("/cart/bag");
        }}
      >
        Edit CART
      </button>
    </div>
  );
}

function SingleAddressContent({
  allAddresses = [],
  addressLoading = false,
  editAddress,
  removeAddress,
  addressLoader,
  selectAddress,
  invalidAddressError,
  selectedAddressId,
  setSelectedAddressId,
  getOtherAddress,
  getDefaultAddress,
  loader,
}) {
  function selectAdd(id) {
    setSelectedAddressId(id);
  }
  return (
    <>
      {allAddresses && allAddresses.length && !addressLoader ? (
        <div className={styles.addressContentConitainer}>
          {getDefaultAddress.length ? (
            <div className={styles.heading}>Default Address</div>
          ) : null}
          {getDefaultAddress?.length > 0
            ? getDefaultAddress.map((item, index) => {
                return (
                  <AddressItem
                    key={`${item?.id}_#${index}`}
                    addressItem={item}
                    onAddressSelect={selectAdd}
                    showAddressSelectionCheckbox={true}
                    selectedAddressId={selectedAddressId}
                    headerRightSlot={
                      <AddressRight
                        selectedAddressId={selectedAddressId}
                        addressItem={item}
                        editAddress={editAddress}
                        removeAddress={removeAddress}
                      />
                    }
                    belowAddressSlot={
                      <>
                        {invalidAddressError?.id === item?.id &&
                          selectedAddressId === item?.id && (
                            <InvalidAddress
                              errorMessage={invalidAddressError.message}
                            />
                          )}
                        <DeliverBtn
                          selectedAddressId={selectedAddressId}
                          id={item?.id}
                          selectAddress={selectAddress}
                        />
                      </>
                    }
                  ></AddressItem>
                );
              })
            : null}
          {getOtherAddress.length ? (
            <div className={styles.heading}>Other Address</div>
          ) : null}
          {getOtherAddress?.length > 0
            ? getOtherAddress.map((item, index) => {
                return (
                  <AddressItem
                    key={`${item?.id}_#${index}`}
                    addressItem={item}
                    onAddressSelect={selectAdd}
                    showAddressSelectionCheckbox={true}
                    selectedAddressId={selectedAddressId}
                    headerRightSlot={
                      <AddressRight
                        selectedAddressId={selectedAddressId}
                        addressItem={item}
                        editAddress={editAddress}
                        removeAddress={removeAddress}
                      />
                    }
                    belowAddressSlot={
                      <>
                        {invalidAddressError?.id === item?.id &&
                          selectedAddressId === item?.id && (
                            <InvalidAddress
                              errorMessage={invalidAddressError.message}
                            />
                          )}
                        <DeliverBtn
                          selectedAddressId={selectedAddressId}
                          id={item?.id}
                          selectAddress={selectAddress}
                        />
                      </>
                    }
                  ></AddressItem>
                );
              })
            : ""}
        </div>
      ) : (
        <>
          {addressLoading || addressLoader ? (
            loader
          ) : (
            <div
              className={`${styles.addressContentConitainer} ${styles.fontSize}`}
              style={{ textAlign: "center", color: "var(--textLabel)" }}
            >
              {" "}
              No Address Found, Please Add Address
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SingleAddressContent;
