# CategoriesFilter Component

The `CategoriesFilter` component is designed to display and manage category filters for a given category. It supports both standard categories with selectable values and range-based categories where users can input a minimum and maximum value.

## Features
- **Expandable Filter**: The filter section expands and collapses when clicked to show or hide filter options.
- **Standard Category Filters**: Displays selectable category values with checkboxes.
- **Range Filters**: Displays a range input component for categories that require range values.
- **Selection Tracking**: Keeps track of selected filters and updates the selected filters state.

## Props

| Prop Name               | Prop Type  | Default Value | Description                                                                                      |
|-------------------------|------------|---------------|--------------------------------------------------------------------------------------------------|
| `categoryName`           | string     | -             | The name of the category being filtered.                                                         |
| `categoryNameValue`      | string     | -             | The unique identifier for the category.                                                          |
| `categoryValues`         | array      | -             | List of values for the category (either selectable or range).                                    |
| `selectedFilters`        | object     | -             | Object that holds the selected filters for each category.                                         |
| `categoryType`           | string     | -             | The type of the category (`"range"` or another value for standard categories).                  |
| `updateSelectedFilters`  | function   | -             | Function that updates the selected filters.                                                      |

## Example Usage
```jsx
import React, { useState } from "react";
import CategoriesFilter from "fdk-react-templates/components/categories-filter/categories-filter";
import "fdk-react-templates/styles/categories-filter.css";

const Example = () => {
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleUpdateFilters = (category, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [category]: {
        ...prevFilters[category],
        [value]: !prevFilters[category]?.[value],
      },
    }));
  };

  return (
    <CategoriesFilter
      categoryName="Price Range"
      categoryNameValue="price"
      categoryValues={[
        { value: "low", display: "Low", count: 20 },
        { value: "high", display: "High", count: 15 },
      ]}
      selectedFilters={selectedFilters}
      categoryType="range"
      updateSelectedFilters={handleUpdateFilters}
    />
  );
};

export default Example;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).
