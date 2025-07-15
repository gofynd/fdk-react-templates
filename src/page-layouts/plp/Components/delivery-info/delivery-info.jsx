import React from "react";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./delivery-info.less";

function DeliveryInfo({ tatMessage, pincodeErrorMessage, availableFOCount }) {
  return (
    <div className={styles.deliveryInfo}>
      {!pincodeErrorMessage && availableFOCount === 1 && (
        <div className={`${styles.deliveryDate} ${styles.dateInfoContainer}`}>
          {tatMessage?.length > 0 && (
            <>
              <SvgWrapper
                svgSrc="delivery"
                className={`${styles.deliveryIcon}`}
              />
              <p className={`${styles.captionNormal}`}>{tatMessage}</p>
            </>
          )}
        </div>
      )}
      {pincodeErrorMessage && (
        <div className={`${styles.captionNormal} ${styles.emptyPincode}`}>
          {pincodeErrorMessage}
        </div>
      )}
    </div>
  );
}

export default DeliveryInfo;
