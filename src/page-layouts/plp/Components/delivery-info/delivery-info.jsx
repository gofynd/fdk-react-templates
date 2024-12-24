import React, { useEffect, useRef, useState } from "react";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import { convertUTCDateToLocalDate } from "../../../../helper/utils";
import * as styles from "./delivery-info.less";
import FyButton from "../../../../components/core/fy-button/fy-button";
import FyInput from "../../../../components/core/fy-input/fy-input";

function DeliveryInfo({
  selectPincodeError,
  tat,
  pincode,
  pincodeErrorMessage,
  setCurrentPincode,
  checkPincode,
  setPincodeErrorMessage,
}) {
  const [postCode, setPostCode] = useState(pincode || "");
  const [tatMessage, setTatMessage] = useState("");
  const pincodeInputRef = useRef(null);
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const numberRegex = /^\d*$/;

  useEffect(() => {
    setPostCode(pincode);
  }, [pincode]);

  useEffect(() => {
    if (postCode?.length > 5) {
      getDeliveryDate();
    }
  }, [tat]);

  const changePostCode = (event) => {
    const value = event?.target?.value;
    if (numberRegex.test(Number(value))) {
      setPostCode(value);
      setTatMessage("");
      setPincodeErrorMessage("");
      setPincodeChecked(false);
    }
  };

  const getDeliveryDate = () => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    const { min, max } = tat || {};

    if (!min) {
      return false;
    }

    const minDate = convertUTCDateToLocalDate(min, options);
    const maxDate = convertUTCDateToLocalDate(max, options);
    setTimeout(() => {
      setTatMessage(
        `Will be delivered ${
          min === max ? `on ${minDate}` : `between ${minDate} - ${maxDate}`
        }`
      );
    }, 1000);
  };

  const handleDeliveryAction = async () => {
    if (pincodeChecked) {
      setPincodeChecked(false);
      setPostCode("");
      setTatMessage("");
      setPincodeErrorMessage("");
    } else {
      await checkPincode(postCode);
      setPincodeChecked(true);
    }
  };

  useEffect(() => {
    if (!pincodeChecked && pincodeInputRef.current && !postCode) {
      pincodeInputRef.current.focus();
    }
  }, [pincodeChecked]);

  return (
    !pincode && (
      <div className={styles.deliveryInfo}>
        <h4 className={`${styles.deliveryLabel} b2`}>
          Select delivery location
        </h4>
        <div className={styles.delivery}>
          <FyInput
            ref={pincodeInputRef}
            autoComplete="off"
            value={postCode}
            placeholder="Check delivery time"
            inputClassName={styles.pincodeInput}
            containerClassName={styles.pincodeInputContainer}
            maxLength="6"
            onChange={changePostCode}
            inputVariant="no-border"
            disabled={pincodeChecked}
            type="text"
          />
          <FyButton
            variant="text"
            className={styles.deliveryAction}
            onClick={handleDeliveryAction}
            disabled={!pincodeChecked && postCode?.length !== 6}
            endIcon={
              <SvgWrapper svgSrc="delivery" className={styles.deliveryIcon} />
            }
          >
            {pincodeChecked ? "CHANGE" : "CHECK"}
          </FyButton>
        </div>
        {selectPincodeError && !pincodeErrorMessage?.length && (
          <div className={`${styles.captionNormal} ${styles.emptyPincode}`}>
            Please enter valid pincode before Add to cart/ Buy now
          </div>
        )}
        {!pincodeErrorMessage && !selectPincodeError && (
          <div className={`${styles.deliveryDate} ${styles.dateInfoContainer}`}>
            {postCode?.length === 6 && tatMessage?.length > 0 && (
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
          <div className={`${styles.captionNormal} ${styles.error}`}>
            {pincodeErrorMessage}
          </div>
        )}
      </div>
    )
  );
}

export default DeliveryInfo;
