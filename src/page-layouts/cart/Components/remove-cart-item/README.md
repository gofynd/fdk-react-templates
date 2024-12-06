# RemoveCartItem Component

## Overview
The `RemoveCartItem` component displays a modal dialog for confirming the removal of an item from the cart. It also provides an option to move the item to a wishlist.

## Features
- **Modal Confirmation**: Displays a confirmation dialog to remove an item.
- **Product Image and Name**: Shows the image and name of the product to be removed.
- **Action Buttons**: Provides buttons to remove the item or move it to a wishlist.

## Usage
To use the `RemoveCartItem` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import RemoveCartItem from 'fdk-react-templates/page-layouts/cart/Components/remove-cart-item/remove-cart-item';
import 'fdk-react-templates/page-layouts/cart/Components/remove-cart-item/remove-cart-item.css';


const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  
  // Sample cart item
  const cartItem = {
    product: {
      name: "Sample Product",
      images: [{ url: "http://example.com/original/sample-product.jpg" }],
    },
  };

  const handleRemoveButtonClick = () => {
    console.log('Item removed from cart');
    setModalOpen(false);
  };

  const handleWishlistButtonClick = (item) => {
    console.log('Item moved to wishlist:', item);
    setModalOpen(false);
  };

  const handleCloseDialogClick = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Remove Item</button>
      <RemoveCartItem
        isOpen={isModalOpen}
        cartItem={cartItem}
        onRemoveButtonClick={handleRemoveButtonClick}
        onWishlistButtonClick={handleWishlistButtonClick}
        onCloseDialogClick={handleCloseDialogClick}
      />
    </div>
  );
};

export default App;

```

### Props
- **isOpen** (boolean, optional): Indicates whether the modal is open or closed. Defaults to `false`.
- **cartItem** (object, optional): The item object from the cart that is to be removed. Defaults to `null`.
- **onRemoveButtonClick** (function, optional): Callback function triggered when the "REMOVE" button is clicked.
- **onWishlistButtonClick** (function, optional): Callback function triggered when the "MOVE TO WISHLIST" button is clicked.
- **onCloseDialogClick** (function, optional): Callback function triggered when the modal is closed.


```
This README provides a detailed overview of the `RemoveCartItem` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.