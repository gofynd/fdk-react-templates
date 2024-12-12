# Sort Component

The `Sort` component provides a dropdown menu to display and select sorting options. It handles the display of available sorting options and allows users to update the selected sort criteria. The component also supports outside click handling to close the dropdown.

## Features
- **Dropdown for Sorting Options**: Displays a list of sorting options in a dropdown.
- **Selected Sort Highlighting**: Shows the currently selected sorting option.
- **Outside Click Handling**: Closes the dropdown when clicking outside of it.
- **Dynamic Option Update**: Updates the selected sorting option and triggers a callback.

## Usage
To use the `Sort` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import Sort from "fdk-react-templates/page-layouts/plp/Components/sort/sort";
import "fdk-react-templates/page-layouts/plp/Components/sort/sort.css";

const App = () => {
  const sortOptions = [
    { name: "Price: Low to High", value: "price_asc", is_selected: false },
    { name: "Price: High to Low", value: "price_desc", is_selected: true },
    { name: "Newest First", value: "newest", is_selected: false },
  ];

  const handleSortUpdate = (selectedSort) => {
    console.log("Selected Sort:", selectedSort);
  };

  return (
    <Sort 
      sortList={sortOptions} 
      onSortUpdate={handleSortUpdate} 
    />
  );
};

export default App;

```
### Props
- **sortList** (Array): An array of sorting options. Each option is an object with the following keys:
  - **name** (string): The display name of the sorting option.
  - **value** (string): The value of the sorting option.
  - **is_selected** (boolean): Indicates whether the sorting option is currently selected.
- **onSortUpdate** (function): A callback function invoked when a sorting option is selected. The selected option's `value` is passed as an argument.

```
This README provides a detailed overview of the `SizeGuide` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.

