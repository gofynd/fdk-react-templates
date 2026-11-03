import React, { useState, useMemo } from "react";
import AddressItem from "../../../components/address-item/address-item";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./single-address-content.less";
import {
  useNavigate,
  useGlobalTranslation,
  useGlobalStore,
} from "fdk-core/utils";
import Skeleton from "../../../components/core/skeletons/skeleton";
import { isValidErrorMessage } from "../../../helper/utils";

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

function DeliverBtn({
  selectedAddressId,
  id,
  selectAddress,
  getTotalValue,
  showPaymentOptions,
  isCreditNoteApplied,
}) {
  const { t } = useGlobalTranslation("translation");
  const { app_features } = useGlobalStore(fpi.getters.CONFIGURATION) || {};
  const { order = {} } = app_features || {};
  return (
    <>
      {selectedAddressId === id && (
        <div className={styles.actionContainer}>
          <button
            className={styles.deliverToThis}
            disabled={!order?.enabled}
            onClick={() => {
              if (getTotalValue?.() === 0 && !isCreditNoteApplied) {
                showPaymentOptions();
              }
              selectAddress();
            }}
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

  // Don't display generic JavaScript errors or invalid messages to users
  // Use utility function to validate error message
  if (!isValidErrorMessage(errorMessage)) {
    return null;
  }

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
  isApiLoading,
  showPaymentOptions,
  getTotalValue,
  isCreditNoteApplied,
}) {
  const { t } = useGlobalTranslation("translation");
  const [showAllOtherAddresses, setShowAllOtherAddresses] = useState(false);
  function selectAdd(id) {
    setSelectedAddressId(id);
  }

  const displayedOtherAddresses = useMemo(() => {
    if (showAllOtherAddresses || getOtherAddress.length <= 3) {
      return getOtherAddress;
    }
    return getOtherAddress.slice(0, 3);
  }, [showAllOtherAddresses, getOtherAddress]);

  return (
    <>
      {allAddresses &&
      allAddresses.length &&
      !(addressLoader || addressLoading || isApiLoading) ? (
        <div className={styles.addressContentConitainer}>
          {getDefaultAddress.length > 0 ? (
            <div className={styles.address}>
              <div className={styles.heading}>
                {t("resource.common.address.default_address")}
              </div>
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
                          getTotalValue={getTotalValue}
                          showPaymentOptions={showPaymentOptions}
                          isCreditNoteApplied={isCreditNoteApplied}
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
              <div className={styles.heading}>
                {t("resource.common.address.other_address")}
              </div>
              {displayedOtherAddresses.map((item, index) => {
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
                          getTotalValue={getTotalValue}
                          showPaymentOptions={showPaymentOptions}
                          isCreditNoteApplied={isCreditNoteApplied}
                        />
                      </>
                    }
                  ></AddressItem>
                );
              })}

              {getOtherAddress.length > 3 && (
                <div className={styles.showMoreBtnContainer}>
                  <button
                    className={styles.showOtherAddresses}
                    onClick={() => setShowAllOtherAddresses((prev) => !prev)}
                  >
                    <span>
                      {showAllOtherAddresses
                        ? t("resource.common.show_fewer_addresses")
                        : t("resource.common.show_more_addresses")}
                    </span>
                    <span
                      className={`${styles.arrow} ${
                        showAllOtherAddresses
                          ? styles.rotateUp
                          : styles.rotateDown
                      }`}
                    >
                      <SvgWrapper svgSrc="arrow-down" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {addressLoading || addressLoader || isApiLoading ? (
            <div className={styles.addressContentConitainer}>
              <div className={styles.shimmer}>
                <Skeleton
                  className={styles.defaultAddressLabel}
                  width={93}
                  height={17}
                />
                <div className={styles.addressCard}>
                  <Skeleton width={158} height={25} />
                  <Skeleton width={265} height={17} />
                  <Skeleton width={100} height={17} />

                  <div className={styles.addressActionBtn}>
                    <Skeleton width={93} height={17} />
                  </div>

                  <Skeleton className={styles.addressDeliverBtn} height={37} />
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${styles.addressContentConitainer} ${styles.fontSize}`}
              style={{
                textAlign: "center",
                color: "var(--textLabel)",
                marginBottom: "12px",
              }}
            >
              {" "}
              {t("resource.checkout.no_address_found")}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SingleAddressContent;
