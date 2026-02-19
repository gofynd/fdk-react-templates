import React, { useMemo } from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./single-address-header.less";
import { getAddressStr } from "../../../helper/utils";
import { useSearchParams } from "react-router-dom";
import { useGlobalTranslation } from "fdk-core/utils";

function SinglesAddressHeader({
  allAddresses,
  showAddNewAddressModal,
  showPayment,
  showShipment,
  backToEdit,
  acceptOrder,
}) {
  const { t } = useGlobalTranslation("translation");
  const [searchParams] = useSearchParams();
  const selectedAddId = searchParams.get("address_id");

  const selectedAddress = useMemo(() => {
    if (allAddresses && Array.isArray(allAddresses) && allAddresses.length > 0) {
      const item = allAddresses.find((item) => item.id == selectedAddId);
      if (item) {
        return { name: item?.name, addressStr: getAddressStr(item, false) };
      }
    }
    return undefined;
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
                  {t("resource.common.deliver_to")}: {selectedAddress?.name}
                </div>
                <div className={styles.address}>
                  {selectedAddress?.addressStr}
                </div>
              </div>
            </div>
            <div className={styles.rightSelected} onClick={backToEdit}>
              {t("resource.cart.change")}
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
              <button
                className={`${styles.commonBtn} ${styles.addBtn}`}
                disabled={!acceptOrder}
              >
                <SvgWrapper svgSrc="addAddress" />{" "}
                <span>{t("resource.common.address.add_new_address")}</span>
              </button>
            </div>
          </div>
          <div
            className={`${styles.addressHeaderContainer} ${styles.addressHeaderContainer__desktop}`}
          >
            <div className={styles.wrapper}>
              <SvgWrapper svgSrc="one-number"></SvgWrapper>
              <div className={styles.headerWrapper}>
                <div className={styles.addressHeading}>
                  {t("resource.checkout.delivery_address")}
                </div>
                <div className={styles.addressString}>
                  {t("resource.checkout.select_delivery_address")}
                </div>
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <button
                className={`${styles.commonBtn} ${styles.addBtn}`}
                onClick={showAddNewAddressModal}
                disabled={!acceptOrder}
              >
                <SvgWrapper svgSrc="addAddress" />{" "}
                <span>{t("resource.common.address.add_new_address")}</span>
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
