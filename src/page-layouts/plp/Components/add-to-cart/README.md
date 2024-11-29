# AddToCart Component

## Overview
The `AddToCart` component handles the display of product details, including images, variants, sizes, price, and the ability to add a product to the cart or proceed to checkout.

## Features
- **Product Information Display**: Displays product name, brand, price, short description, and images.
- **Size Selection**: Allows users to select a size, with options for size block display or dropdown.
- **Buy Now and Add to Cart Buttons**: Provides buttons to add the product to the cart or proceed to checkout based on configuration.
- **Loading State**: Displays a loading indicator while the product data is being fetched.
- **Size Guide**: Optionally displays a size guide for the product.
- **Delivery Information**: Displays delivery-related details for the product.
- **Product Availability**: Displays availability based on stock and custom order conditions.


## Usage
To use the `AddToCart` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import AddToCart from 'fdk-react-templates/page-layouts/plp/Components/add-to-cart/add-to-cart';
import 'fdk-react-templates/page-layouts/plp/Components/add-to-cart/add-to-cart.css';

const App = () => {
  const [selectedSize, setSelectedSize] = useState('');

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  return (
    <AddToCart
      isLoading={false}
      productData={{ /* product data */ }}
      globalConfig={{ /* global config */ }}
      pdpPageConfig={{ /* PDP config */ }}
      slug="product-slug"
      selectedSize={selectedSize}
      onSizeSelection={handleSizeSelection}
      addProductForCheckout={(event, size, isBuyNow) => {
        // Add product to cart or checkout logic
      }}
    />
  );
};

export default App;

```
### Props
- **isLoading** (boolean, optional): Shows a loading indicator while the product data is being fetched. Defaults to `false`.
- **productData** (object, optional): Contains product data like `product`, `productPrice`, etc.
- **globalConfig** (object, optional): Global configuration for the product display.
- **pdpPageConfig** (object, optional): Page-specific configuration for the product display.
- **slug** (string, optional): The product slug used for identifying the product.
- **selectedSize** (string, optional): The currently selected size of the product.
- **showSizeDropdown** (boolean, optional): Controls whether the size dropdown is visible. Defaults to `false`.
- **deliverInfoProps** (object, optional): Props for the delivery info component.
- **sizeError** (boolean, optional): Displays an error if no size is selected.
- **handleSlugChange** (function, optional): Function to handle changes to the product slug.
- **onSizeSelection** (function, optional): Function to handle size selection.
- **handleShowSizeGuide** (function, optional): Function to handle the display of the size guide.
- **setShowSizeDropdown** (function, optional): Function to toggle the visibility of the size dropdown.
- **addProductForCheckout** (function, optional): Function to add the product to the cart or proceed to checkout.
- **handleViewMore** (function, optional): Function to handle the display of full product details.
- **handleClose** (function, optional): Function to close the component.

```
This README provides a detailed overview of the `AddToCart` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.