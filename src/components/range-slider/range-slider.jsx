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
import RangeSlider from "react-range-slider-input";
import * as styles from "./range-slider.less";
import FyInput from "../core/fy-input/fy-input";
import { debounce } from "../../helper/utils";

function CustomRangeSlider({
  min,
  max,
  heading = null,
  selectedMin,
  selectedMax,
  count,
  currencySymbol = "",
  onSliderUpdate = () => {},
}) {
  const [startValue, setStartValue] = useState(selectedMin);
  const [endValue, setEndValue] = useState(selectedMax);
  const [rangeMessage, setRangeMessage] = useState("");

  useEffect(() => {
    setStartValue(selectedMin);
  }, [selectedMin]);

  useEffect(() => {
    setEndValue(selectedMax);
  }, [selectedMax]);

  const setValue = () => {
    onSliderUpdate({ minValue: startValue, maxValue: endValue });
  };

  const onSliderInput = (event) => {
    const [startValue, endValue] = event;
    setStartValue(startValue);
    setEndValue(endValue);
  };

  const debouncedSliderUpdate = useCallback(
    debounce(({ minValue, maxValue }) => {
      onSliderUpdate({ minValue, maxValue });
    }, 800),
    []
  );

  const onMinValueChange = (value) => {
    setStartValue(value);
    if (value >= min && value < endValue) {
      debouncedSliderUpdate({
        minValue: value < min ? min : value,
        maxValue: endValue,
      });
    }
    if (value < min) {
      setRangeMessage(`The minimum value should be ${min}`);
    } else if (value >= endValue) {
      setRangeMessage(`The minimum value cannot exceed ${endValue}`);
    } else setRangeMessage("");
  };

  const onMinBlurChange = (value) => {
    if (value < min) setStartValue(min);
    setRangeMessage("");
  };

  const onMaxValueChange = async (value) => {
    setEndValue(value);
    if (value <= max && value > startValue) {
      debouncedSliderUpdate({
        minValue: startValue,
        maxValue: value > max ? max : value,
      });
    }
    if (value > max) {
      setRangeMessage(`The maximum value should be ${max}`);
    } else if (value <= startValue) {
      setRangeMessage(`The maximum value should be greater than ${startValue}`);
    } else setRangeMessage("");
  };

  const onMaxBlurChange = (value) => {
    if (value > max) setEndValue(max);
    setRangeMessage("");
  };

  return (
    <div className={styles.CustomRangeSlider}>
      {heading && (
        <div className={styles["price-Container--title"]}>{heading}</div>
      )}
      <div className={styles.inputContainer}>
        <div>
          <label className={styles.label} htmlFor="from">
            From
          </label>
          <div className={styles.flexAlignCenter}>
            {currencySymbol && (
              <span className={styles.currency}>{currencySymbol}</span>
            )}
            <FyInput
              value={startValue}
              id="from"
              type="number"
              onChange={(event) => onMinValueChange(event.target.value)}
              onBlur={(event) => onMinBlurChange(event.target.value)}
              inputClassName={styles.fieldItem}
              min={min}
            />
          </div>
        </div>
        <div>
          <label className={styles.label} htmlFor="to">
            To
          </label>
          <div className={styles.flexAlignCenter}>
            {currencySymbol && (
              <span className={styles.currency}>{currencySymbol}</span>
            )}

            <FyInput
              value={endValue}
              onChange={(event) => onMaxValueChange(event.target.value)}
              onBlur={(event) => onMaxBlurChange(event.target.value)}
              id="to"
              type="number"
              inputClassName={styles.fieldItem}
              max={max}
            />
          </div>
        </div>
      </div>
      <div className={styles.sliderWrapper}>
        <RangeSlider
          className={styles.rangeSlider}
          min={min}
          max={max}
          value={[startValue, endValue]}
          onInput={onSliderInput}
          onThumbDragEnd={setValue}
        />

        {count && (
          <div className={styles.entityCount}>{count} Products Found</div>
        )}

        {rangeMessage && <p className={styles.errorMessage}>{rangeMessage}</p>}
      </div>
    </div>
  );
}

export default CustomRangeSlider;
