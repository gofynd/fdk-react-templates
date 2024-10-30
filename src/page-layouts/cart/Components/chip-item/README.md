# ChipItem Component

## Overview
The `ChipItem` component represents an individual item in a shopping cart, displaying relevant details such as the product image, name, size, quantity control, price, and promotional offers. It also allows users to update the cart, change sizes, and view promotional details.

## Features
- **Display Product Details**: Shows product image, brand, name, size, and price.
- **Quantity Control**: Users can increase or decrease the item quantity.
- **Size Selection**: Users can select a size for the product if applicable.
- **Promotional Offers**: Displays applied promotions and offers a modal for details.
- **Error Handling**: Provides feedback for quantity limits and stock availability.

## Usage
To use the `ChipItem` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import ChipItem from 'fdk-react-templates/page-layout/cart/Components/chip-item/chip-item';

const App = () => {
  const itemDetails = {
    name: "Product Name",
    brand: "Brand Name",
    price: 29.99,
    promotions: ["10% off", "Free shipping"]
  };

  const handleUpdate = (newDetails) => {
    console.log("Update cart with:", newDetails);
  };

  const sizeModalItem = {
    availableSizes: ["S", "M", "L", "XL"]
  };

  const setCurrentSize = (size) => {
    console.log("Selected size:", size);
  };

  const setSizeModal = (isOpen) => {
    console.log("Size modal is now:", isOpen ? "open" : "closed");
  };

  const isSizeModalOpen = false;
  const cartItems = [itemDetails];
  const cartItemsWithActualIndex = [itemDetails];
  const singleItem = itemDetails;
  const isPromoModalOpen = false;

  const handleRemove = () => {
    console.log("Item removed");
  };

  const handleOpenPromoModal = () => {
    console.log("Promo modal opened");
  };

  const handleClosePromoModal = () => {
    console.log("Promo modal closed");
  };

  return (
    <ChipItem
      isCartUpdating={false}
      singleItemDetails={itemDetails}
      onUpdateCartItems={handleUpdate}
      currentSize="M"
      productImage="path/to/image.jpg"
      itemIndex={0}
      sizeModalItemValue={sizeModalItem}
      currentSizeModalSize="M"
      setCurrentSizeModalSize={setCurrentSize}
      setSizeModal={setSizeModal}
      sizeModal={isSizeModalOpen}
      cartItems={cartItems}
      cartItemsWithActualIndex={cartItemsWithActualIndex}
      singleItem={singleItem}
      isPromoModalOpen={isPromoModalOpen}
      onRemoveIconClick={handleRemove}
      onOpenPromoModal={handleOpenPromoModal}
      onClosePromoModal={handleClosePromoModal}
    />
  );
};

export default App;

```

### Props
- **isCartUpdating** (boolean, optional): Indicates if the cart is currently being updated.
- **singleItemDetails** (object): Details of the product item including availability, price, and promotions.
- **onUpdateCartItems** (function): Function to update the cart with new item details.
- **currentSize** (string): The currently selected size of the item.
- **productImage** (string): URL of the product image.
- **itemIndex** (number): The index of the item in the cart.
- **sizeModalItemValue** (object): The value for the size modal, containing product details.
- **currentSizeModalSize** (string): The size currently selected in the size modal.
- **setCurrentSizeModalSize** (function): Function to set the current size in the size modal.
- **setSizeModal** (function): Function to toggle the visibility of the size modal.
- **sizeModal** (boolean): Indicates if the size modal is open.
- **cartItems** (array): Array of items in the cart.
- **cartItemsWithActualIndex** (array): Array of items with their actual indices.
- **singleItem** (object): The single item being represented.
- **isPromoModalOpen** (boolean): Indicates if the promotional modal is open.
- **onRemoveIconClick** (function, optional): Callback function when the remove icon is clicked.
- **onOpenPromoModal** (function): Function to open the promotional modal.
- **onClosePromoModal** (function): Function to close the promotional modal.

```
This README provides a detailed overview of the `ChipItem` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.

