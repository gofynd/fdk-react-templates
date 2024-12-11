# Compare Component

## Overview
The `Compare` component provides a product comparison interface that allows users to compare up to four products at a time. The component allows adding products to the comparison list, displaying product attributes, and managing the comparison list. It also features a search bar for finding products to add to the comparison.

## Features
- **Product Comparison**: Displays a list of selected products for comparison, with the ability to remove products from the list.
- **Dynamic Attribute Display**: Shows product attributes in a side-by-side comparison format, highlighting differences.
- **Search Functionality**: Allows users to search for products and add them to the comparison list.
- **Limit on Product Count**: Restricts the number of products in the comparison list to a maximum of four.
- **Loading State**: Displays a loader or empty state while the comparison data is being loaded or when no products are added.

## Usage
To use the `Comapre` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import Compare from 'fdk-react-templates/page-layouts/compare/compare';
import 'fdk-react-templates/page-layouts/compare/compare.css';

const App = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleAdd = (slug) => {
    // Add product to comparison
  };

  const handleRemove = (slug) => {
    // Remove product from comparison
  };

  const handleInputChange = (value) => {
    // Update search text and filter suggestions
  };

  return (
    <Compare
      isLoading={false}
      products={products}
      attributes={[]}
      showSearch={isSearchVisible}
      searchText=""
      filteredSuggestions={filteredSuggestions}
      setShowSearch={setSearchVisible}
      handleAdd={handleAdd}
      handleRemove={handleRemove}
      handleInputChange={handleInputChange}
      isDifferentAttr={() => false}
      getAttribute={() => ""}
      checkHtml={() => false}
    />
  );
};

export default App;

```


### Props
- **isLoading** (boolean, required): Indicates whether the component is in a loading state.
- **products** (array, required): The list of products to compare.
- **attributes** (array, required): The list of product attributes to compare.
- **category** (object, optional): The category to which the products belong, for breadcrumb navigation.
- **showSearch** (boolean, required): Controls whether the search input is shown.
- **searchText** (string, optional): The search query text.
- **filteredSuggestions** (array, optional): The list of products filtered based on the search text.
- **cardProps** (object, optional): Customizable props for the `ProductCard` component, including options like `isSaleBadge`, `isWishlistIcon`, and `isImageFill`.
- **imagePlaceholder** (string, optional): A placeholder image URL for products.
- **loader** (JSX, optional): A custom loader component to show while the data is loading.
- **setShowSearch** (function, required): A function to toggle the search visibility.
- **handleAdd** (function, required): A function to add a product to the comparison list.
- **handleRemove** (function, required): A function to remove a product from the comparison list.
- **handleInputChange** (function, required): A function to handle changes in the search input field.
- **isDifferentAttr** (function, required): A function to check if an attribute value is different across products.
- **getAttribute** (function, required): A function to retrieve the value of a specific attribute for a given product.
- **checkHtml** (function, required): A function to check whether an attribute value contains HTML.

This README provides a detailed overview of the `Comapre` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.


