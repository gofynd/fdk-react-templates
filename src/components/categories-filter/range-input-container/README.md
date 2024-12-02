# RangeInputContainer Component

The `RangeInputContainer` component allows users to input a range of values, typically for filters (e.g., price range). It includes two number input fields for selecting a minimum and maximum value within a specified range.

## Features
- **Range Input**: Allows users to select a minimum and maximum value using number input fields.
- **Currency Symbol**: Displays a currency symbol if provided.
- **Query Replacement**: Updates selected filters with the new range values using a custom query format.

## Props

| Prop Name               | Prop Type | Default Value | Description                                                                                      |
|-------------------------|-----------|---------------|--------------------------------------------------------------------------------------------------|
| `singleFilter`           | object    | -             | The filter object containing the filter's selected and possible min/max values.                 |
| `updateSelectedFilters`  | function  | -             | A function that updates the selected filters based on the range values.                          |
| `categoryNameValue`      | string    | -             | The category name that the filter is associated with.                                            |

## Example Usage
```jsx
import React, { useState } from "react";
import RangeInputContainer from "fdk-react-templates/components/categories-filter/range-input-container/range-input-container";
import "fdk-react-templates/components/categories-filter/range-input-container/range-input-container.css";

const App = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleUpdateFilters = (category, query, isSelected) => {
    // Handle updating selected filters
  };

  return (
    <RangeInputContainer
      singleFilter={{ min: 0, max: 100, selected_min: 20, selected_max: 80, currency_symbol: "$" }}
      updateSelectedFilters={handleUpdateFilters}
      categoryNameValue="price"
    />
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).
