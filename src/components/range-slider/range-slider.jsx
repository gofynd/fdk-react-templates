import React, { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import * as styles from "./range-slider.less";
// import "../../styles/base.global.less";

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

  const setValue = () => {
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

  const onSliderInput = (e) => {
    const [startValue, endValue] = e;
    setStartValue(startValue);
    setEndValue(endValue);
  };

  // const onMinValueChange = (value) => {
  //   setStartValue(value);
  //   if (value < min) {
  //     setRangeMessage(`The minimum value should be ${min}`);
  //   } else setRangeMessage("");
  // };

  // const onMinBlurChange = (value) => {
  //   if (value < min) setStartValue(min);
  //   setRangeMessage("");
  //   // setSelectedMin(startValue);
  //   setSelectedMin(startValue, endValue, filter, value);
  // };

  // const onMaxValueChange = (value) => {
  //   setEndValue(value);
  //   if (value > max) {
  //     setRangeMessage(`The maximum value should be ${max}`);
  //   } else setRangeMessage("");
  // };

  // const onMaxBlurChange = (value) => {
  //   if (value > max) setEndValue(max);
  //   setRangeMessage("");
  //   // setSelectedMax(endValue);
  //   setSelectedMax(startValue, endValue, filter, value);
  // };

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
      {/* <div className={styles.inputContainer}>
        <div className={`${styles.inputFields} ${customClass}`} id="inputfields">
          <div className={styles.fieldItem}>
            <InputField
              value={startValue}
              onChange={(e) => onMinValueChange(e.target.value)}
              onBlur={(e) => onMinBlurChange(e.target.value)}
              prefix={prefix}
              postfix={postfix}
            />
          </div>
          <span style={{ padding: "0px 16px" }}>-</span>
          <div className={styles.fieldItem}>
            <InputField
              value={endValue}
              onChange={(e) => onMaxValueChange(e.target.value)}
              onBlur={(e) => onMaxBlurChange(e.target.value)}
              prefix={prefix}
              postfix={postfix}
            />
          </div>
        </div>
        {showDoneButton && (
          <div>
            <button
              className={`${styles.doneButton} ${
                rangeMessage ? styles.disableButton : ""
              }`}
              onClick={() => onDoneClick(startValue, endValue, filter, value)}
            >
              Done
            </button>
          </div>
        )}
      </div> */}

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
