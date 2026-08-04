/**
 * QuantityCtrl is a React functional component that manages and displays a quantity control interface.
 *
 * @param {Object} props - The properties object.
 * @param {number} props.currquantity - The current quantity to be displayed and managed.
 * @param {function} props.incDecQuantity - A function to increment or decrement the quantity.
 * @param {function} props.changeQty - A function to change the quantity based on user input.
 *
 * @returns {JSX.Element} A JSX element representing the quantity control interface.
 */

import React, { useState, useEffect } from "react";
import * as styles from "./quantity-ctrl.less";
import SvgWrapper from "../../core/svgWrapper/SvgWrapper";
import { isNumberKey, isFreeNavigation } from "../../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function QuantityCtrl({
  currquantity,
  incDecQuantity,
  changeQty,
  customClassName,
}) {
  const { t } = useGlobalTranslation("translation");
  const [quantity, setQuantity] = useState(currquantity);
  const [isdisabled, setIsdisabled] = useState(false);
  useEffect(() => {
    setQuantity(currquantity);
    setIsdisabled(currquantity === 1);
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
    <div className={`${styles.qtyControl} ${customClassName}`}>
      <button
        type="button"
        aria-label={t("resource.order.aria_label_dec_quantity")}
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
        aria-label={t("resource.order.aria_label_inc_quantity")}
        className={`${styles.operator}`}
        onClick={() => incrDecrQuantity(1)}
      >
        <SvgWrapper svgSrc="increase" className={styles.operation} />
      </button>
    </div>
  );
}

export default QuantityCtrl;
