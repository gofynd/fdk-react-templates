# SortModal Component

The `SortModal` component is a modal dialog that allows users to sort items by various criteria. It displays a list of sorting options, where users can select their preferred sorting method, and provides buttons for resetting or applying the chosen sort option.

## Features
- **Dynamic Sort List**: Displays a list of sorting options that can be provided via props.
- **Pre-selected Sort Option**: Automatically selects a previously selected sort option or defaults to the first item in the list.
- **User Interaction**: Users can click to select a sort option, reset the selection, or apply the selected sort.
- **Modal Dialog**: The component is displayed as a modal, providing a focused interaction area for sorting.

## Props

| Prop Name             | Prop Type        | Default Value     | Description                                                                 |
|-----------------------|------------------|-------------------|-----------------------------------------------------------------------------|
| `isOpen`              | `boolean`        | `true`            | Controls whether the modal is open or closed.                               |
| `sortList`            | `array`          | `[]`              | List of sorting options with each option having a `value`, `display`, and `is_selected` key. |
| `onCloseModalClick`   | `function`       | `() => {}`        | Callback function triggered when the modal is closed.                       |
| `onResetBtnClick`     | `function`       | `() => {}`        | Callback function triggered when the reset button is clicked.               |
| `onApplyBtnClick`     | `function`       | `() => {}`        | Callback function triggered when the apply button is clicked. Receives the selected sort option as an argument. |

## Example Usage

```jsx
import React, { useState } from "react";
import SortModal from "fdk-react-templates/components/sort-modal/sort-modal";
import "fdk-react-templates/components/sort-modal/sort-modal.css";

const App = () => {
  const [sortList, setSortList] = useState([
      {
        "display": "Latest Products",
        "is_selected": true,
        "logo": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/latest-products.png",
        "name": "Latest Products",
        "value": "latest"
      },
      {
        "display": "Popularity",
        "is_selected": false,
        "logo": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/popular.png",
        "name": "Popularity",
        "value": "popular"
      },
      {
        "display": "Price Low to High",
        "is_selected": false,
        "logo": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/price-asc.png",
        "name": "Price Low to High",
        "value": "price_asc"
      }
  ]);

  const handleApplySort = (selectedSort) => {
    console.log("Applied Sort:", selectedSort);
    // Apply the selected sort logic here
  };

  const handleResetSort = () => {
    console.log("Reset Sort");
    // Reset the sorting logic here
  };

  const handleCloseModal = () => {
    console.log("Modal Closed");
    // Handle modal close logic here
  };

  return (
    <div>
      <SortModal
        isOpen={true}
        sortList={sortList}
        onCloseModalClick={handleCloseModal}
        onResetBtnClick={handleResetSort}
        onApplyBtnClick={handleApplySort}
      />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).