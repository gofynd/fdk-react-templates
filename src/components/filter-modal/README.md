# FilterModal Component

The `FilterModal` component displays a modal dialog that allows users to filter content based on different filter categories. It includes an option to reset or apply the filters and supports dynamic filter updates.

## Features
- **Filter Selection**: Allows users to select and view filters.
- **Modal Control**: Handles opening, closing, and navigation for the modal.
- **Filter Reset and Apply**: Provides buttons for resetting and applying the selected filters.
- **Customizable Filters**: Filters can be passed as props and can dynamically update based on user interactions.

## Props

| Prop Name             | Prop Type     | Default Value  | Description                                                                 |
|-----------------------|---------------|----------------|-----------------------------------------------------------------------------|
| `isOpen`              | `boolean`     | `true`         | Controls whether the modal is visible or not.                               |
| `filters`             | `array`       | `[]`           | The list of filter categories with their respective filter options.          |
| `isResetFilterDisable`| `boolean`     | `false`        | Determines if the reset button should be disabled.                          |
| `onCloseModalClick`   | `function`    | `() => {}`      | Callback function when the modal is closed.                                 |
| `onResetBtnClick`     | `function`    | `() => {}`      | Callback function when the reset button is clicked.                         |
| `onApplyBtnClick`     | `function`    | `() => {}`      | Callback function when the apply button is clicked.                         |
| `onFilterUpdate`      | `function`    | `() => {}`      | Callback function that is triggered when the filter is updated.             |

## Example Usage

```jsx
import React, { useState } from "react";
import FilterModal from "fdk-react-templates/components/filter-modal/filter-modal";
import "fdk-react-templates/components/filter-modal/filter-modal.css"; // CSS import

const App = () => {
  const [filters, setFilters] = useState([
    {
      key: { name: "price", display: "Price" },
      options: [{ label: "Low to High", value: "low" }, { label: "High to Low", value: "high" }],
    },
    {
      key: { name: "category", display: "Category" },
      options: [{ label: "Electronics", value: "electronics" }, { label: "Clothing", value: "clothing" }],
    },
  ]);

  const onApply = () => {
    console.log("Filters applied");
  };

  const onReset = () => {
    console.log("Filters reset");
  };

  return (
    <div>
      <FilterModal
        isOpen={true}
        filters={filters}
        onApplyBtnClick={onApply}
        onResetBtnClick={onReset}
      />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).