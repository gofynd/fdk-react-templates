import React, { useState } from "react";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./delivery-info.less";
import FyButton from "../../../../components/core/fy-button/fy-button";
import FyInput from "../../../../components/core/fy-input/fy-input";
import { useGlobalTranslation } from "fdk-core/utils";
import Skeleton from "../../../../components/core/skeletons/skeleton";

function DeliveryInfo({
  pincode,
  setPincode,
  pincodeErrorMessage,
  setPincodeErrorMessage,
  isServiceability,
  tatMessage,
  checkPincode,
  fulfillmentOptions,
  availableFOCount,
  setFoLoading,
  mandatoryPincode,
}) {
  const { t } = useGlobalTranslation("translation");
  const numberRegex = /^\d*$/;
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const changePostCode = (event) => {
    const value = event?.target?.value;
    if (numberRegex.test(Number(value))) {
      setPincode(value);
      setPincodeErrorMessage("");
      // setPincodeChecked(false);
    }
  };

  const handleDeliveryAction = async () => {
    setPincodeErrorMessage("");
    setPincodeLoading(true);
    if (setFoLoading) {
      setFoLoading(true); 
    }
    try {
      await checkPincode(pincode);
    } finally {
      setPincodeLoading(false);
      if (setFoLoading) {
        setFoLoading(false); 
      }
    }
  };

  return (
    <>
      {/* Pincode Input Section - Only show when mandatoryPincode is true */}
      {mandatoryPincode && (
        <div className={styles.deliveryInfo}>
          {!isServiceability && (
            <>
              <h4 className={`${styles.deliveryLabel} b2`}>
                {t("resource.common.address.select_delivery_location")}
              </h4>
              <div className={styles.delivery}>
                <FyInput
                  autoComplete="off"
                  value={pincode}
                  placeholder={t("resource.product.check_delivery_time")}
                  inputClassName={styles.pincodeInput}
                  containerClassName={styles.pincodeInputContainer}
                  maxLength="6"
                  onChange={changePostCode}
                  inputVariant="no-border"
                  type="text"
                />
                <FyButton
                  variant="text"
                  className={styles.deliveryAction}
                  onClick={handleDeliveryAction}
                  disabled={pincode?.length !== 6}
                  endIcon={
                    <SvgWrapper
                      svgSrc="delivery"
                      className={styles.deliveryIcon}
                    />
                  }
                >
                  {t("resource.facets.check")}
                </FyButton>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Message - Always show when there's an error, regardless of mandatoryPincode */}
      {pincodeErrorMessage && (
        <div className={`${styles.captionNormal} ${styles.emptyPincode}`}>
          {pincodeErrorMessage}
        </div>
      )}

      {/* Delivery Promise - Always show when conditions are met, regardless of mandatoryPincode */}
      {!pincodeErrorMessage && availableFOCount === 1 && (
        <div
          className={`${styles.deliveryDate} ${styles.dateInfoContainer}`}
        >
          {pincodeLoading ? (
            <Skeleton height={16} width={158} />
          ) : (
            tatMessage?.length > 0 && (
              <>
                <SvgWrapper
                  svgSrc="delivery"
                  className={`${styles.deliveryIcon}`}
                />
                <p className={styles.captionNormal}>{tatMessage}</p>
              </>
            )
          )}
        </div>
      )}
    </>
  );
}

export default DeliveryInfo;
