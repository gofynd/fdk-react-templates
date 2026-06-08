/**
 * CustomRangeSlider is a React component that renders a range slider allowing users to select a minimum and maximum value within a specified range.
 *
 * @param {Object} props - The properties object.
 * @param {number} props.min - The minimum value of the slider.
 * @param {number} props.max - The maximum value of the slider.
 * @param {string|null} [props.heading=null] - An optional heading to display above the slider.
 * @param {number} props.selectedMin - The initially selected minimum value.
 * @param {number} props.selectedMax - The initially selected maximum value.
 * @param {string|null} [props.prefix=null] - An optional prefix to display before the values.
 * @param {string|null} [props.postfix=null] - An optional postfix to display after the values.
 * @param {number} props.count - The number of steps or increments in the slider.
 * @param {string} [props.currencySymbol=""] - An optional currency symbol to display with the values.
 * @param {Function} [props.onSliderUpdate=() => {}] - A callback function that is called when the slider values are updated.
 *
 * @returns {JSX.Element} A JSX element representing the custom range slider.
 *
 */

import React, { useState, useEffect, useCallback } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import * as styles from "./range-slider.less";
import FyInput from "../core/fy-input/fy-input";
import { debounce } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function CustomRangeSlider({
  min,
  max,
  heading = null,
  selectedMin,
  selectedMax,
  count,
  currencySymbol = "",
  postfix = "",
  onSliderUpdate = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const [startValue, setStartValue] = useState(selectedMin);
  const [endValue, setEndValue] = useState(selectedMax);
  const [rangeMessage, setRangeMessage] = useState("");

  useEffect(() => {
    setStartValue(selectedMin);
  }, [selectedMin]);

  useEffect(() => {
    setEndValue(selectedMax);
  }, [selectedMax]);

  const setValue = (values) => {
    const [minValue, maxValue] = values;
    onSliderUpdate({ minValue, maxValue });
  };

  const onSliderInput = (values) => {
    const [newStartValue, newEndValue] = values;
    setStartValue(newStartValue);
    setEndValue(newEndValue);
    setRangeMessage(""); 
  };

  const debouncedSliderUpdate = useCallback(
    debounce(({ minValue, maxValue }) => {
      onSliderUpdate({ minValue, maxValue });
    }, 800),
    [onSliderUpdate]
  );

  const onMinValueChange = (value) => {
    const numValue = value === "" ? min : Number(value);
    setStartValue(numValue);
    
    if (numValue >= min && numValue < endValue) {
      debouncedSliderUpdate({
        minValue: numValue < min ? min : numValue,
        maxValue: endValue,
      });
      setRangeMessage("");
    } else if (numValue < min) {
      setRangeMessage(`${t("resource.product.min_value_should_be")} ${min}`);
    } else if (numValue >= endValue) {
      setRangeMessage(
        `${t("resource.product.min_value_cannot_exceed")} ${endValue}`
      );
    }
  };

  const onMinBlurChange = (value) => {
    const numValue = value === "" ? min : Number(value);
    if (numValue < min) {
      setStartValue(min);
      onSliderUpdate({ minValue: min, maxValue: endValue });
    } else if (numValue >= endValue) {
      setStartValue(endValue - 1);
      onSliderUpdate({ minValue: endValue - 1, maxValue: endValue });
    }
    setRangeMessage("");
  };

  const onMaxValueChange = (value) => {
    const numValue = value === "" ? max : Number(value);
    setEndValue(numValue);
    
    if (numValue <= max && numValue > startValue) {
      debouncedSliderUpdate({
        minValue: startValue,
        maxValue: numValue > max ? max : numValue,
      });
      setRangeMessage("");
    } else if (numValue > max) {
      setRangeMessage(`${t("resource.product.max_value_should_be")} ${max}`);
    } else if (numValue <= startValue) {
      setRangeMessage(
        `${t("resource.product.max_value_should_be_greater_than")} ${startValue}`
      );
    }
  };

  const onMaxBlurChange = (value) => {
    const numValue = value === "" ? max : Number(value);
    if (numValue > max) {
      setEndValue(max);
      onSliderUpdate({ minValue: startValue, maxValue: max });
    } else if (numValue <= startValue) {
      setEndValue(startValue + 1);
      onSliderUpdate({ minValue: startValue, maxValue: startValue + 1 });
    }
    setRangeMessage("");
  };

  return (
    <div className={styles.CustomRangeSlider}>
      {heading && (
        <div className={styles["price-Container--title"]}>{heading}</div>
      )}
      <div className={styles.inputContainer}>
        <div>
          <label className={styles.label} htmlFor={t("resource.facets.from")}>
            {t("resource.facets.from")}
          </label>
          <div className={styles.flexAlignCenter}>
            {currencySymbol && (
              <span className={styles.currency}>{currencySymbol}</span>
            )}
            <FyInput
              value={startValue}
              id={t("resource.facets.from")}
              type="number"
              onChange={(event) => onMinValueChange(event.target.value)}
              onBlur={(event) => onMinBlurChange(event.target.value)}
              inputClassName={styles.fieldItem}
              min={min}
            />
            {!currencySymbol && postfix && (
              <span className={styles.postfix}>{postfix}</span>
            )}
          </div>
        </div>
        <div>
          <label className={styles.label} htmlFor={t("resource.facets.to")}>
            {t("resource.facets.to")}
          </label>
          <div className={styles.flexAlignCenter}>
            {currencySymbol && (
              <span className={styles.currency}>{currencySymbol}</span>
            )}

            <FyInput
              value={endValue}
              onChange={(event) => onMaxValueChange(event.target.value)}
              onBlur={(event) => onMaxBlurChange(event.target.value)}
              id={t("resource.facets.to")}
              type="number"
              inputClassName={styles.fieldItem}
              max={max}
            />
            {!currencySymbol && postfix && (
              <span className={styles.postfix}>{postfix}</span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.sliderWrapper}>
        <Slider
          range
          className={styles.rangeSlider}
          allowCross={false}
          min={min}
          max={max}
          value={[startValue, endValue]}
          onChange={onSliderInput}
          onChangeComplete={setValue}
        />

        {count && (
          <div className={styles.entityCount}>
            {count} {t("resource.product.products_found")}
          </div>
        )}

        {rangeMessage && <p className={styles.errorMessage}>{rangeMessage}</p>}
      </div>
    </div>
  );
}

export default CustomRangeSlider;
