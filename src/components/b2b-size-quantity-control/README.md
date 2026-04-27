# Quantity Control Component

The `QuantityControl` component is used for adjusting the quantity of an item in a cart. It provides increment and decrement buttons, along with the current item count. The component is ideal for use in shopping cart pages or anywhere you need to control the quantity of a product.

## Features
- **Increment and decrement buttons**: Allows users to increase or decrease the item quantity.
- **Disabled state**: Buttons are disabled when the cart is updating to prevent accidental clicks during updates.
- **Count display**: Shows the current item quantity.

## Props

| Prop Name           | Prop Type      | Default Value | Description                                                                 |
|---------------------|----------------|---------------|-----------------------------------------------------------------------------|
| `isCartUpdating`    | `boolean`      | `false`       | Determines if the cart is updating. When `true`, buttons are disabled.      |
| `count`             | `number`       | `0`           | The current quantity of the item.                                            |
| `onDecrementClick`  | `Function`     | `() => {}`     | Function to handle the decrement action when the button is clicked.         |
| `onIncrementClick`  | `Function`     | `() => {}`     | Function to handle the increment action when the button is clicked.         |

## Example Usage

```jsx
import React, { useState } from "react";
import QuantityControl from "fdk-react-templates/components/quantity-control/quantity-control";
import "fdk-react-templates/components/quantity-control/quantity-control.css";

const App = () => {
  const [count, setCount] = useState(0);

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <QuantityControl
      isCartUpdating={false}
      count={count}
      onDecrementClick={handleDecrement}
      onIncrementClick={handleIncrement}
    />
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).