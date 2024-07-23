import React, { useState, useEffect } from "react";
import { numberWithCommas, currencyFormat } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./gst-card.less";

const GST_NUMBER_LENGTH = 15;
const EMPTY_GST = "Enter GST no to claim input credits";
const GST_APPLIED = "You can claim 250 GST input credit";
const INVALID_GST = "Invalid GST number";

function GstCard({ cartData, currencySymbol, applyGST, removeGST }) {
  const [gstNumber, setGstNumber] = useState(cartData?.gstin || "");
  const [isApplied, setIsApplied] = useState(!!cartData?.gstin);
  const [showError, setShowError] = useState(false);
  const [checkBoxSelected, setCheckBoxSelected] = useState(!!cartData?.gstin);
  const [gstError, setGstError] = useState("Invalid gstin number");

  useEffect(() => {
    if (cartData) {
      setGstNumber(cartData?.gstin || "");
      const isGstinPresent = !!cartData.gstin;
      setIsApplied(isGstinPresent);
      setCheckBoxSelected(isGstinPresent);
    }
  }, [cartData]);

  const taxAmount = cartData?.breakup_values?.raw?.gst_charges;

  function handleRemoveGST() {
    removeGST().then((res) => {
      const isValid = !!res?.updateCartMeta?.is_valid;
      if (isValid) {
        setIsApplied(!isValid);
        setGstNumber("");
      }
    });
  }

  const handleCheckboxChange = (e) => {
    setCheckBoxSelected(e.target.checked);
    if (!e?.target?.checked && gstNumber?.length && isApplied) {
      handleRemoveGST();
    }
  };

  const handleRemoveGst = () => {
    if (gstNumber.length === GST_NUMBER_LENGTH && isApplied) {
      handleRemoveGST();
    } else if (
      gstNumber.length > GST_NUMBER_LENGTH ||
      gstNumber.length < GST_NUMBER_LENGTH
    ) {
      setGstNumber("");
    }
  };

  const onInput = (e) => {
    const gst = e.target.value;
    setGstNumber(gst);
    if (gst?.length === GST_NUMBER_LENGTH) {
      applyGST(gst).then((res) => {
        setIsApplied(!!res?.updateCartMeta?.is_valid);
      });
    } else if (
      gst?.length > GST_NUMBER_LENGTH ||
      gst?.length < GST_NUMBER_LENGTH ||
      gst?.length === 0
    ) {
      setIsApplied(false);
      setGstError("Invalid gstin number");
      setShowError(true);
    }
  };

  return (
    <div className={styles.gstContainer}>
      <div className={styles.gstCheckboxContainer}>
        <label htmlFor="gst-checkbox" className={styles.gstTitle}>
          <input
            type="checkbox"
            id="gst-checkbox"
            checked={checkBoxSelected}
            onChange={handleCheckboxChange}
          />
          Use GST
        </label>
      </div>
      {checkBoxSelected && (
        <div className={styles.inputBox}>
          <input
            type="text"
            maxLength="15"
            value={gstNumber}
            placeholder="Enter GSTIN"
            disabled={isApplied}
            className={showError ? styles.errorBox : ""}
            onChange={onInput}
          />
          {/* onInput={onInput}
						onKeyDown={onInput} */}
          {gstNumber && gstNumber.length > 0 && (
            <span onClick={handleRemoveGst} className={styles.crossBtn}>
              <SvgWrapper svgSrc="cross-bold" />
            </span>
          )}
        </div>
      )}
      {checkBoxSelected && (
        <div className={styles.gstValidationBox}>
          {isApplied && !showError && (
            <span className={styles.colorSuccessNormal}>
              {`GSTIN Applied Successfully!!! Claimed ${currencyFormat(
                numberWithCommas(taxAmount),
                currencySymbol
              )} GST input credit`}
            </span>
          )}
          {showError && gstNumber.length > 0 && (
            <span className={styles.colorErrorNormal}>{gstError}</span>
          )}
          {!isApplied && (
            <span className={styles.statusInfo}>
              {`Enter GST number to claim ${currencyFormat(
                numberWithCommas(taxAmount),
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
