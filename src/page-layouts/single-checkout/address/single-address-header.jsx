import React, { useMemo } from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./single-address-header.less";
import { getAddressStr } from "../../../helper/utils";
import { useSearchParams } from "react-router-dom";

function SinglesAddressHeader({
  allAddresses,
  showAddNewAddressModal,
  showPayment,
  showShipment,
  backToEdit,
}) {
  const [searchParams] = useSearchParams();
  const selectedAddId = searchParams.get("address_id");

  const selectedAddress = useMemo(() => {
    if (allAddresses?.length) {
      const item = allAddresses?.find((item) => item.id == selectedAddId);
      return { name: item?.name, addressStr: getAddressStr(item, false) };
    }
  }, [allAddresses, selectedAddId]);

  return (
    <>
      {showShipment || showPayment ? (
        <>
          <div className={styles.addressSelectedHeaderContainer}>
            <div className={styles.leftSelected}>
              <div className={styles.icon}>
                <SvgWrapper svgSrc="checkmark"></SvgWrapper>
              </div>
              <div className={styles.deliverAdd}>
                <div className={styles.title}>
                  Deliver To: {selectedAddress?.name}
                </div>
                <div className={styles.address}>
                  {selectedAddress?.addressStr}
                </div>
              </div>
            </div>
            <div className={styles.rightSelected} onClick={backToEdit}>
              Change
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={`${styles.addressHeaderContainer} ${styles.addressHeaderContainer__mobile}`}
            onClick={showAddNewAddressModal}
          >
            <div className={styles.buttonWrapper}>
              <button className={`${styles.commonBtn} ${styles.addBtn}`}>
                <SvgWrapper svgSrc="addAddress" /> <span>Add New Address</span>
              </button>
            </div>
          </div>
          <div
            className={`${styles.addressHeaderContainer} ${styles.addressHeaderContainer__desktop}`}
          >
            <div className={styles.wrapper}>
              <SvgWrapper svgSrc="one-number"></SvgWrapper>
              <div className={styles.headerWrapper}>
                <div className={styles.addressHeading}>Delivery Address</div>
                <div className={styles.addressString}>
                  Select delivery address
                </div>
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <button
                className={`${styles.commonBtn} ${styles.addBtn}`}
                onClick={showAddNewAddressModal}
              >
                <SvgWrapper svgSrc="addAddress" /> <span>Add New Address</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SinglesAddressHeader;

// className=("[a-z-]+")
// className={styles[$1]}
