import React, { useEffect, useState } from "react";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import { convertUTCDateToLocalDate, formatLocale } from "../../../../helper/utils";
import * as styles from "./delivery-info.less";
import FyButton from "../../../../components/core/fy-button/fy-button";
import FyInput from "../../../../components/core/fy-input/fy-input";
import {
  useGlobalStore,
  useFPI,
  useGlobalTranslation
} from "fdk-core/utils";

function DeliveryInfo({
  tat,
  pincode,
  pincodeErrorMessage,
  checkPincode,
  setPincodeErrorMessage,
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  const [postCode, setPostCode] = useState(pincode || "");
  const [tatMessage, setTatMessage] = useState("");
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
     // setPincodeChecked(false);
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

    const minDate = convertUTCDateToLocalDate(min, options, formatLocale(locale, countryCode));
    const maxDate = convertUTCDateToLocalDate(max, options, formatLocale(locale, countryCode));
    setTimeout(() => {
      const deliveryMessage = min === max
        ? t('resource.product.delivery_on', { date: minDate })
        : t('resource.product.delivery_between', { minDate, maxDate });

      setTatMessage(deliveryMessage);
    }, 1000);
  };

  const handleDeliveryAction = async () => {
    await checkPincode(postCode);
    //setPincodeChecked(true);
  };

  return (
    <div className={styles.deliveryInfo}>
      <h4 className={`${styles.deliveryLabel} b2`}>{t("resource.common.address.select_delivery_location")}</h4>
      <div className={styles.delivery}>
        <FyInput
          autoComplete="off"
          value={postCode}
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
          disabled={postCode?.length !== 6}
          endIcon={
            <SvgWrapper svgSrc="delivery" className={styles.deliveryIcon} />
          }
        >
          {t("resource.facets.check")}
        </FyButton>
      </div>
      {!pincodeErrorMessage && (
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
        <div className={`${styles.captionNormal} ${styles.emptyPincode}`}>
          {pincodeErrorMessage}
        </div>
      )}
    </div>
  );
}

export default DeliveryInfo;
