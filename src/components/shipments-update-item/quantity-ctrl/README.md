# Quantity Control Component

The `QuantityCtrl` component is used to control the quantity of an item in a UI. It allows users to increase or decrease the quantity with buttons or directly input the quantity value. The component includes validation to ensure that only valid numeric inputs are accepted.

## Features
- **Increment and Decrement**: Allows users to increase or decrease the quantity of an item using buttons.
- **Direct Input**: Users can directly type in the desired quantity.
- **Validation**: Ensures that only numeric values are entered.
- **Disability State**: The control can be disabled based on specific conditions (e.g., when the quantity cannot be changed).
- **Focus Loss Handling**: Automatically updates the quantity when the input loses focus.

## Props

| Prop Name        | Prop Type  | Default Value | Description                                                                 |
|------------------|------------|---------------|-----------------------------------------------------------------------------|
| `currquantity`   | `number`   |               | The current quantity of the item.                                            |
| `incDecQuantity` | `function` |               | A function to handle the increment or decrement of the quantity.             |
| `changeQty`      | `function` |               | A function to update the quantity value when entered manually or after modification. |

## Example Usage

```jsx
import React, { useState } from "react";
import QuantityCtrl from "fdk-react-templates/components/shipments-update-item/quantity-ctrl/quantity-ctrl";
import "fdk-react-templates/components/shipments-update-item/quantity-ctrl/quantity-ctrl.css";

const App = () => {
  const [currQuantity, setCurrQuantity] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    setCurrQuantity(newQuantity);
  };

  const handleIncrementDecrement = (value) => {
    setCurrQuantity((prevQuantity) => Math.max(0, prevQuantity + value));
  };

  return (
    <div>
      <QuantityCtrl
        currquantity={currQuantity}
        changeQty={handleQuantityChange}
        incDecQuantity={handleIncrementDecrement}
      />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).