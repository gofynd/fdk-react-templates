import React, { useState, useMemo } from "react";
import { numberWithCommas, currencyFormat } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./gst-card.less";

function GstCard({
  gstNumber = "",
  gstCharges = 0,
  isApplied = false,
  error = {},
  currencySymbol = "₹",
  onGstChange = () => {},
  onRemoveGstClick = () => {},
}) {
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
          <label htmlFor="gst-checkbox">Use GST</label>
        </div>
      </div>
      {checkBoxSelected && (
        <div className={styles.inputBox}>
          <input
            type="text"
            maxLength="15"
            value={gstNumber}
            placeholder="Enter GSTIN"
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
              {`GSTIN Applied Successfully!!! Claimed ${currencyFormat(
                numberWithCommas(gstCharges),
                currencySymbol
              )} GST input credit`}
            </span>
          )}
          {isError && gstNumber.length > 0 && (
            <span className={styles.colorErrorNormal}>{error.message}</span>
          )}
          {!isApplied && (
            <span className={styles.statusInfo}>
              {`Enter GST number to claim ${currencyFormat(
                numberWithCommas(gstCharges),
                currencySymbol
              )} input credit`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default GstCard;
