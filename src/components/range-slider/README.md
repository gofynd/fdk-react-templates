# Custom Range Slider Component

The `CustomRangeSlider` component allows users to select a range of values through a slider, with both numerical input fields and a visual slider for selection. It is designed for scenarios where users need to choose a price range or other types of numerical ranges.

## Features
- **Range selection**: Users can select a range of values using a visual slider or numeric input fields.
- **Currency symbol**: Displays an optional currency symbol next to the values.
- **Debounced input**: Updates the slider values after a delay to improve performance.
- **Error handling**: Displays messages if the selected values are out of the allowed range.

## Props

| Prop Name          | Prop Type      | Default Value | Description                                                                 |
|--------------------|----------------|---------------|-----------------------------------------------------------------------------|
| `min`              | `number`       | `null`        | The minimum value allowed on the slider.                                     |
| `max`              | `number`       | `null`        | The maximum value allowed on the slider.                                     |
| `heading`          | `string`       | `null`        | Optional heading to display above the slider.                               |
| `selectedMin`      | `number`       | `null`        | The initially selected minimum value for the range.                          |
| `selectedMax`      | `number`       | `null`        | The initially selected maximum value for the range.                          |
| `prefix`           | `string`       | `null`        | Optional prefix to display next to the values.                              |
| `postfix`          | `string`       | `null`        | Optional postfix to display next to the values.                             |
| `count`            | `number`       | `null`        | The number of products found that fit the selected range.                   |
| `currencySymbol`   | `string`       | `""`          | Optional currency symbol to display next to the values.                     |
| `onSliderUpdate`   | `function`     | `() => {}`     | Callback function that is triggered when the slider values are updated.     |

## Example Usage

```jsx
import React, { useState } from "react";
import CustomRangeSlider from "fdk-react-templates/components/range-slider/range-slider";
import "fdk-react-templates/components/range-slider/range-slider.css";

const App = () => {
  const [minValue, setMinValue] = useState(10);
  const [maxValue, setMaxValue] = useState(100);

  const handleSliderUpdate = ({ minValue, maxValue }) => {
    setMinValue(minValue);
    setMaxValue(maxValue);
  };

  return (
    <CustomRangeSlider
      min={0}
      max={500}
      selectedMin={minValue}
      selectedMax={maxValue}
      onSliderUpdate={handleSliderUpdate}
      currencySymbol="₹"
      count={200}
    />
  );
};

export default App;

```
## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).