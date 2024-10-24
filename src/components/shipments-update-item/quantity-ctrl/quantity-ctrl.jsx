import React, { useState, useEffect } from "react";
import * as styles from "./quantity-ctrl.less";
import SvgWrapper from "../../core/svgWrapper/SvgWrapper";
import { isNumberKey, isFreeNavigation } from "../../../helper/utils";

function QuantityCtrl({ currquantity, incDecQuantity, changeQty }) {
  const [quantity, setQuantity] = useState(currquantity);
  const [isdisabled, setIsdisabled] = useState(false);
  useEffect(() => {
    setQuantity(currquantity);
  }, [currquantity]);
  const incrDecrQuantity = (value) => {
    incDecQuantity(value);
  };
  const onQtyKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      changeQty(Number(evt.target.value));
    } else if (!isNumberKey(evt) && !isFreeNavigation(evt)) {
      return evt.preventDefault();
    }
  };
  const onQtyLostFocus = (evt) => {
    const val = Number(evt.target.value);
    if (val !== currquantity) {
      changeQty(val);
    }
  };

  return (
    <div className={`${styles.qtyControl}`}>
      <button
        type="button"
        aria-label="Dec Quantity"
        className={`${styles.operator}`}
        onClick={() => incrDecrQuantity(-1)}
        disabled={isdisabled}
      >
        <SvgWrapper svgSrc="decrease" className={styles.operation} />
      </button>
      <div className={`${styles.qtyAmount}`}>
        <input
          type="text"
          name="qty"
          className={`${styles.lightxs}`}
          onKeyDown={onQtyKeyDown}
          onBlur={onQtyLostFocus}
          disabled={isdisabled}
          autoComplete="off"
          value={quantity}
          readOnly
        />
      </div>
      <button
        type="button"
        aria-label="Inc Quantity"
        className={`${styles.operator}`}
        onClick={() => incrDecrQuantity(1)}
        disabled={isdisabled}
      >
        <SvgWrapper svgSrc="increase" className={styles.operation} />
      </button>
    </div>
  );
}

export default QuantityCtrl;
