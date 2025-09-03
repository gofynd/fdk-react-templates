import React from "react";
import AddressItem from "../../../components/address-item/address-item";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./single-address-content.less";
import { useNavigate, useGlobalTranslation } from "fdk-core/utils";
import Shimmer from "../../../components/shimmer/shimmer";

function AddressRight({
  selectedAddressId,
  addressItem,
  editAddress,
  removeAddress,
}) {
  const { t } = useGlobalTranslation("translation");
  return (
    <>
      {selectedAddressId == addressItem?.id && (
        <div className={styles.contentTopRight}>
          <span
            className={styles.edit}
            onClick={() => editAddress(addressItem)}
          >
            {t("resource.common.edit_lower")}
          </span>
          <span>|</span>
          <span className={styles.remove} onClick={() => removeAddress()}>
            {t("resource.facets.remove")}
          </span>
        </div>
      )}
    </>
  );
}

function DeliverBtn({ selectedAddressId, id, selectAddress }) {
  const { t } = useGlobalTranslation("translation");
  return (
    <>
      {selectedAddressId === id && (
        <div className={styles.actionContainer}>
          <button
            className={styles.deliverToThis}
            onClick={() => selectAddress()}
          >
            {t("resource.checkout.deliver_to_this_address")}
          </button>
        </div>
      )}
    </>
  );
}

function InvalidAddress({ errorMessage }) {
  const { t } = useGlobalTranslation("translation");
  const navigate = useNavigate();
  return (
    <div className={styles.invalidAddError}>
      <div className={styles.invalidAddErrorLeft}>
        <SvgWrapper className={styles.warningIcon} svgSrc={"warning-address"} />

        <div className={styles.invalidAddErrorData}>
          <div className={styles.invalidAddErrorMsg}>{errorMessage}</div>
          {/* NOTE: Removing for now as it is static and often misleading */}
          {/* <div className={styles.invalidAddErrorSuggestion}>
            Please add more items to your cart to meet the minimum order value
          </div> */}
        </div>
      </div>
      <button
        className={styles.invalidEditCart}
        onClick={() => {
          navigate("/cart/bag");
        }}
      >
        {t("resource.checkout.edit_cart")}
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
  const { t } = useGlobalTranslation("translation");
  function selectAdd(id) {
    setSelectedAddressId(id);
  }
  return (
    <>
      {allAddresses &&
      allAddresses.length &&
      !(addressLoader || addressLoading) ? (
        <div className={styles.addressContentConitainer}>
          {getDefaultAddress.length > 0 ? (
            <div className={styles.address}>
              <div className={styles.heading}>{t("resource.common.address.default_address")}</div>
              {getDefaultAddress.map((item, index) => {
                return (
                  <AddressItem
                    containerClassName={styles.customAddressItem}
                    key={`${item?.id}_#${index}`}
                    addressItem={item}
                    onAddressSelect={selectAdd}
                    showAddressSelectionCheckbox={true}
                    selectedAddressId={selectedAddressId}
                    belowAddressSlot={
                      <>
                        <div className={styles.addressActions}>
                          <AddressRight
                            selectedAddressId={selectedAddressId}
                            addressItem={item}
                            editAddress={editAddress}
                            removeAddress={removeAddress}
                          />
                        </div>
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
              })}
            </div>
          ) : null}

          {getOtherAddress.length > 0 ? (
            <div className={styles.address}>
              <div className={styles.heading}>{t("resource.common.address.other_address")}</div>
              {getOtherAddress.map((item, index) => {
                return (
                  <AddressItem
                    containerClassName={styles.customAddressItem}
                    key={`${item?.id}_#${index}`}
                    addressItem={item}
                    onAddressSelect={selectAdd}
                    showAddressSelectionCheckbox={true}
                    selectedAddressId={selectedAddressId}
                    belowAddressSlot={
                      <>
                        <div className={styles.addressActions}>
                          <AddressRight
                            selectedAddressId={selectedAddressId}
                            addressItem={item}
                            editAddress={editAddress}
                            removeAddress={removeAddress}
                          />
                        </div>
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
              })}
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {addressLoading || addressLoader ? (
            <div className={styles.addressContentConitainer}>
              {loader || <Shimmer className={styles.shimmer} />}
            </div>
          ) : (
            <div
              className={`${styles.addressContentConitainer} ${styles.fontSize}`}
              style={{
                textAlign: "center",
                color: "var(--textLabel)",
                marginBottom:"12px"
              }}
            >
              {" "}
              {t("resource.checkout.no_address_found")}
            </div>
          )}
        </>
      )
      }
    </>
  );
}

export default SingleAddressContent;
