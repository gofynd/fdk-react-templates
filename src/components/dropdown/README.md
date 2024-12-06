# Dropdown Component

The `Dropdown` component provides a customizable dropdown list that allows users to select an option. Based on the `type` prop, it can manage different types of filters such as "time" or "status." It also allows for navigation and updates the query parameters accordingly.

## Features
- **Dynamic Dropdown Options**: Displays a list of options passed via `dropdownData` prop.
- **Query Parameter Update**: Updates the URL query parameters based on the selected option.
- **Customizable Selection**: Provides visual feedback for selected options with icons.
- **Outside Click Handler**: Closes the dropdown when clicking outside of it.
- **Arrow Icon**: Includes an arrow icon to indicate the dropdown functionality.

## Props

| Prop Name       | Prop Type     | Default Value | Description                                                                 |
|-----------------|---------------|---------------|-----------------------------------------------------------------------------|
| `type`          | `string`      | -             | Specifies the type of dropdown, e.g., "time" or "status", which determines the query parameter key. |
| `selectedOption`| `string`      | -             | The currently selected option displayed in the dropdown.                    |
| `dropdownData`  | `array`       | -             | An array of objects representing the dropdown options. Each object should have `value`, `display`, and `is_selected` properties. |

## Example Usage

```jsx
import React, { useState } from "react";
import Dropdown from "fdk-react-templates/components/dropdown/dropdown";
import "fdk-react-templates/components/dropdown/dropdown.css";

const ordersData = [
  { value: "today", display: "Today", is_selected: false },
  { value: "this_week", display: "This Week", is_selected: true },
  { value: "this_month", display: "This Month", is_selected: false },
];

const App = () => {
  const [selectedOption, setSelectedOption] = useState("This Week");

  return (
    <div>
      <h1>Filter Orders</h1>
      <Dropdown
        type="time"
        selectedOption={selectedOption}
        dropdownData={ordersData}
      />
    </div>
  );
};

export default App;


```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).