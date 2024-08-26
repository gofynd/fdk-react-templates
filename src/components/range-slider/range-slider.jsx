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
  prefix = null,
  postfix = null,
  count,
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

  const setValue = (event) => {
    // if (
    //   selectedMin !== startValue &&
    //   startValue >= min &&
    //   startValue <= endValue
    // ) {
    //   // setSelectedMin(startValue);
    //   setSelectedMin(startValue, endValue);
    // }
    // if (endValue !== selectedMax && endValue >= startValue && endValue <= max) {
    //   // setSelectedMax(endValue);
    //   setSelectedMax(startValue, endValue);
    // }
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
      <RangeSlider
        className={styles.rangeSlider}
        min={min}
        max={max}
        value={[startValue, endValue]}
        onInput={onSliderInput}
        onThumbDragEnd={setValue}
      />
      <div className={styles.inputContainer}>
        <FyInput
          value={startValue}
          type="number"
          onChange={(event) => onMinValueChange(event.target.value)}
          onBlur={(event) => onMinBlurChange(event.target.value)}
          label="From"
          inputClassName={styles.fieldItem}
          min={min}
        />
        <FyInput
          value={endValue}
          onChange={(event) => onMaxValueChange(event.target.value)}
          onBlur={(event) => onMaxBlurChange(event.target.value)}
          label="To"
          type="number"
          inputClassName={styles.fieldItem}
          max={max}
        />
      </div>

      {count && (
        <div className={styles.entityCount}>{count} Products Found</div>
      )}

      {/* <div className={styles.extremeValues}>
        <div>
          {prefix}
          {min}
          {postfix}
        </div>
        <div>
          {prefix}
          {max}
          {postfix}
        </div>
      </div> */}

      {rangeMessage && <p className={styles.errorMessage}>{rangeMessage}</p>}
    </div>
  );
}

export default CustomRangeSlider;
