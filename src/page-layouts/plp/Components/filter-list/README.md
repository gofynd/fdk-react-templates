# FilterList Component

## Overview
The `FilterList` component renders a filter list with different types of filters such as multi-valued, single-valued, and range filters. It supports search functionality for filtering values, dynamic expansion of the list, and handling of filter selection. The component also includes a popup to group and display filters alphabetically.

## Features
- **Multi-valued filter**: Displays a list of options, with checkboxes for selection.
- **Single-valued filter**: Displays a single selectable option.
- **Range filter**: Displays a slider for selecting a range of values.
- **Search functionality**: Allows the user to search for specific filter options.
- **Expandable list**: Supports expanding and collapsing the filter list to show more options.
- **Popup for grouped filter values**: Displays the filters grouped alphabetically in a popup.

## Usage
To use the `FilterList` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from 'react';
import FilterList from 'fdk-react-templates/page-layouts/plp/Components/filter-list/filter-list';
import 'fdk-react-templates/page-layouts/plp/Components/filter-list/filter-list.css';

const App = () => {
  const filter = {
    key: { name: 'category', kind: 'multivalued' },
    values: [
      { display: 'Category 1', value: 'cat1', is_selected: false },
      { display: 'Category 2', value: 'cat2', is_selected: true },
      { display: 'Category 3', value: 'cat3', is_selected: false },
    ],
    isOpen: true,
  };

  const handleFilterUpdate = ({ filter, item }) => {
    console.log('Updated Filter:', filter);
    console.log('Selected Item:', item);
  };

  return (
    <FilterList
      filter={filter}
      onFilterUpdate={handleFilterUpdate}
    />
  );
};

export default App;

```

### Props
- **filter** (`object`, required): The filter object that contains the data for the filter. It includes:
  - `key` (object): The filter key information (name, kind, etc.).
  - `values` (array): The values/options for the filter.
  - `isOpen` (boolean): Determines if the filter is initially open.
- **isCollapsedView** (`boolean`, optional): If `true`, the filter list is collapsed by default. Defaults to `true`.
- **onFilterUpdate** (`function`, optional): A callback function to handle filter updates. It receives the filter and selected item as arguments.


```
This README provides a detailed overview of the `FilterList` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.