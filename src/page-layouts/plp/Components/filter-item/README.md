# FilterItem Component

## Overview
The `FilterItem` component renders a filter item with a title that can be toggled open and closed. It uses the `FilterList` component to display filter options. The component accepts the `filter` data, manages its open/close state, and provides an arrow icon to indicate the current state.

## Features
- **Toggle Filter Visibility**: The component can open or close the filter list when the title is clicked.
- **Arrow Icon**: Displays an arrow that rotates based on whether the filter list is open or closed.
- **Filter List**: Renders the `FilterList` component for selecting filter values.

## Usage
To use the `FilterItem` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from 'react';
import FilterItem from 'fdk-react-templates/page-layouts/plp/Components/filter-item/filter-item';
import 'fdk-react-templates/page-layouts/plp/Components/filter-item/filter-item.css';;

const App = () => {
  const filterData = {
    key: { display: 'Category' },
    values: ['Option 1', 'Option 2', 'Option 3'],
    isOpen: false
  };

  const handleFilterUpdate = (selectedFilter) => {
    console.log(selectedFilter);
  };

  return (
    <FilterItem
      filter={filterData}
      isMobileView={false}
      onFilterUpdate={handleFilterUpdate}
    />
  );
};

export default App;

```

### Props
- **filter** (object, required): Contains the filter data, including:
  - `key`: Object containing filter metadata such as `display` (string).
  - `values`: Array of filter options.
  - `isOpen`: Boolean indicating whether the filter list is initially open.
- **isMobileView** (boolean, optional): Indicates if the component is being rendered in mobile view.
- **onFilterUpdate** (function, optional): Callback function for updating the filter when an option is selected.

```
This README provides a detailed overview of the `FilterItem` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.