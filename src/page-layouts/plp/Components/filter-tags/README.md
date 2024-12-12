# FilterTags Component

## Overview
The `FilterTags` component displays the selected filters as tags, allowing users to remove individual filters or clear all filters at once. It supports responsive behavior, showing all filter tags on tablet or smaller devices, and a limited number of tags (5) on larger screens. It also includes a toggle to view all tags or less, depending on user interaction.

## Features
- **Responsive Design**: Displays all filters on tablet or smaller screens and up to 5 filters on larger screens.
- **View All Toggle**: Allows users to toggle between showing a limited number of filters or all of them.
- **Remove Filter Tags**: Users can remove individual filter tags.
- **Clear All Filters**: A button to clear all selected filters.

## Usage
To use the `FilterTags` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from "react";
import FilterTags from 'fdk-react-templates/page-layouts/plp/Components/filter-tags/filter-tags';
import 'fdk-react-templates/page-layouts/plp/Components/filter-tags/filter-tags.css';

const App = () => {
  const [selectedFilters, setSelectedFilters] = useState([
    { name: "Brand", values: [{ display: "Apple" }, { display: "Samsung" }] },
    { name: "Price", values: [{ display: "$100 - $200" }, { display: "$200 - $300" }] },
  ]);

  const handleFilterUpdate = ({ filter, item }) => {
    // Handle filter removal
    console.log(`Removed ${item.display} from ${filter.name}`);
  };

  const handleResetFilters = () => {
    // Handle resetting all filters
    setSelectedFilters([]);
  };

  return (
    <FilterTags
      selectedFilters={selectedFilters}
      onFilterUpdate={handleFilterUpdate}
      onResetFiltersClick={handleResetFilters}
    />
  );
};

export default App;

```

### Props
- **selectedFilters** (array, required): An array of selected filters, each filter containing multiple values to be displayed as tags.
- **onFilterUpdate** (function, optional): Callback function triggered when a filter tag is removed. It receives the `filter` and `filterItem` as arguments.
- **onResetFiltersClick** (function, optional): Callback function triggered when the "CLEAR ALL" button is clicked.

```
This README provides a detailed overview of the `FilterTags` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
