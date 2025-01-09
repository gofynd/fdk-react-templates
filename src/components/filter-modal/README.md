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
import "fdk-react-templates/components/filter-modal/filter-modal.css";

const App = () => {
  const [filters, setFilters] = useState([
    {
        "key": {
            "display": "Department",
            "kind": "multivalued",
            "logo": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/department.png",
            "name": "department"
        },
        "values": [
            {
                "count": 399,
                "currency_code": null,
                "currency_symbol": null,
                "display": "Fashion",
                "display_format": null,
                "is_selected": true,
                "max": null,
                "min": null,
                "query_format": null,
                "selected_max": null,
                "selected_min": null,
                "value": "fashion"
            },
            {
                "count": 220,
                "currency_code": null,
                "currency_symbol": null,
                "display": "Food & Beverage",
                "display_format": null,
                "is_selected": false,
                "max": null,
                "min": null,
                "query_format": null,
                "selected_max": null,
                "selected_min": null,
                "value": "food-beverage"
            },
        ]
    },
    {
        "key": {
            "display": "Category",
            "kind": "multivalued",
            "logo": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/category.png",
            "name": "category"
        },
        "values": [
            {
                "count": 1,
                "currency_code": null,
                "currency_symbol": null,
                "display": "Tops",
                "display_format": null,
                "is_selected": false,
                "max": null,
                "min": null,
                "query_format": null,
                "selected_max": null,
                "selected_min": null,
                "value": "tops"
            },
            {
                "count": 1,
                "currency_code": null,
                "currency_symbol": null,
                "display": "Western Jackets",
                "display_format": null,
                "is_selected": false,
                "max": null,
                "min": null,
                "query_format": null,
                "selected_max": null,
                "selected_min": null,
                "value": "western-jackets"
            }
        ]
    }
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