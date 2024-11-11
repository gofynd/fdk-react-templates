# SharedCart Component

## Overview

The `SharedCart` component displays a user's shared cart items along with applied coupons, allowing them to view cart items before merging or adding them to their personal bag. It enhances the e-commerce experience by providing a clear overview of items in the shared cart.

## Features

- **Item Display**: Shows all items in the shared cart along with their details.
- **Coupons Display**: Displays applied coupons 
- **Merge/Add Options**: Offers buttons to either merge the shared cart with the user's bag or add items to the bag directly.

## Usage

To use the `SharedCart` component, import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import SharedCart from "./SharedCart";

const App = () => {
  const sharedCartData = {
    items: [
      { quantity: 2, item: { name: "Product A" }, articles: [] },
      { quantity: 1, item: { name: "Product B" }, articles: [] },
    ],
    breakup_values: {
      coupon: { code: "SAVE20", is_applied: true },
      display: [],
    },
  };

  const bagItems = sharedCartData.items;

  const handleMergeBagClick = () => {
    console.log("Merging bags...");
  };

  const handleAddToBagClick = () => {
    console.log("Adding to bag...");
  };

  return (
    <SharedCart
      sharedCartData={sharedCartData}
      bagItems={bagItems}
      showReplaceBtn={true}
      onMergeBagClick={handleMergeBagClick}
      onAddToBagClick={handleAddToBagClick}
      onReplaceBagClick={() => console.log("Replacing bag...")}
    />
  );
};

export default App;
```

## Props

- **sharedCartData**: An object containing shared cart details, including items and coupon information.
- **bagItems**: An array of items derived from sharedCartItems.
- **showReplaceBtn**: A boolean indicating if the replace button should be shown.
- **onMergeBagClick**: A function triggered when the "Merge Bag" button is clicked.
- **onAddToBagClick**: A function triggered when the "Add To Bag" button is clicked.
- **onReplaceBagClick**: A function triggered when the "Replace Bag" button is clicked.

## Component Structure

The `SharedCart` component consists of the following key sections:

1. **Cart Title and Item Count**: Displays the title "Shared bag" along with the number of items and total quantity.
2. **Item Listing**: Renders each item in the shared cart using the `ChipReviewItem` component.
3. **Coupons and Breakup**: Displays applied coupons and any price breakdowns related to the shared cart.
4. **Action Buttons**: Provides buttons for merging or adding items to the bag and optionally replacing the bag.

## State Management

The component primarily uses `useMemo` for performance optimization to calculate derived values such as total pieces and item counts based on props, without maintaining internal state.

## Event Handlers

- **onMergeBagClick**: Handles the merging of shared and personal bags when the corresponding button is clicked.
- **onAddToBagClick**: Manages the action of adding items from the shared cart to the user's bag.
- **onReplaceBagClick**: Responsible for replacing the user's current bag with the shared bag when the replace button is clicked.