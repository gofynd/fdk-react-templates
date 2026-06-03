import React, { useState, useMemo } from "react";
import { numberWithCommas, currencyFormat, formatLocale, translateDynamicLabel } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./gst-card.less";
import {
  useGlobalStore,
  useFPI,
  useGlobalTranslation
} from "fdk-core/utils";

function GstCard({
  gstNumber = "",
  gstCharges = 0,
  isApplied = false,
  error = {},
  currencySymbol = "₹",
  onGstChange = () => { },
  onRemoveGstClick = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  const [checkBoxSelected, setCheckBoxSelected] = useState(isApplied);

  const isError = useMemo(() => Object.keys(error || {}).length !== 0, [error]);

  const handleCheckboxChange = (e) => {
    setCheckBoxSelected(e.target.checked);
    if (!e?.target?.checked && gstNumber?.length && isApplied) {
      onRemoveGstClick();
    }
  };

  return (
    <div className={styles.gstContainer}>
      <div className={styles.gstCheckboxContainer}>
        <div className={styles.gstTitle}>
          <input
            type="checkbox"
            id="gst-checkbox"
            checked={checkBoxSelected}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="gst-checkbox">{t("resource.cart.use_gst")}</label>
        </div>
      </div>
      {checkBoxSelected && (
        <div className={styles.inputBox}>
          <input
            type="text"
            maxLength="15"
            value={gstNumber}
            placeholder={t("resource.cart.enter_gstin")}
            disabled={isApplied}
            className={isError ? styles.errorBox : ""}
            onChange={(e) => onGstChange(e.target.value)}
          />
          {gstNumber && gstNumber.length > 0 && (
            <span onClick={onRemoveGstClick} className={styles.crossBtn}>
              <SvgWrapper svgSrc="cross-bold" />
            </span>
          )}
        </div>
      )}
      {checkBoxSelected && (
        <div className={styles.gstValidationBox}>
          {isApplied && !isError && (
            <span className={styles.colorSuccessNormal}>
              {t("resource.cart.gstin_applied_success", {
                gst_credit: currencyFormat(
                  numberWithCommas(gstCharges),
                  currencySymbol,
                  formatLocale(locale, countryCode, true)
                )
              })}
            </span>
          )}
          {isError && gstNumber.length > 0 && (
            <span className={styles.colorErrorNormal}>{translateDynamicLabel(error.message, t)}</span>
          )}
          {!isApplied && (
            <span className={styles.statusInfo}>
              {t("resource.cart.enter_gst_number", {
                gst_credit: currencyFormat(
                  numberWithCommas(gstCharges),
                  currencySymbol,
                  formatLocale(locale, countryCode, true)
                )
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default GstCard;
