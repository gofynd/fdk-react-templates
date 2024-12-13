# ShipmentUpdateItem Component

The `ShipmentUpdateItem` component manages the quantity of an item in a shipment. It allows users to increase or decrease the quantity, formats prices, and handles errors related to quantity limits.

## Features
- **Quantity Management**: Adjust the quantity of an item within the shipment.
- **Price Formatting**: Displays prices with currency symbols, formatted correctly.
- **Error Handling**: Displays error messages for invalid quantity changes (e.g., exceeding limits or negative values).
- **Dynamic Bag Updates**: Updates the associated bag IDs based on the current quantity.

## Props

| Prop Name         | Prop Type  | Default Value | Description                                                                 |
|-------------------|------------|---------------|-----------------------------------------------------------------------------|
| `selectedBagId`   | `string`   | `undefined`   | The ID of the selected bag.                                                |
| `item`            | `object`   | `undefined`   | The item object containing details about the item.                         |
| `item.quantity`   | `number`   | `undefined`   | The current quantity of the item.                                          |
| `item.bag_ids`    | `array`    | `undefined`   | An array of bag IDs associated with the item.                              |
| `item.prices`     | `object`   | `undefined`   | An object containing price details of the item.                            |
| `item.prices.currency_symbol` | `string` | `"₹"`        | The currency symbol for the item's price.                                  |

## Example Usage

```jsx
import React from "react";
import ShipmentUpdateItem from "fdk-react-templates/components/shipments-update-item/shipments-update-item";
import "fdk-react-templates/components/shipments-update-item/shipments-update-item.css";

const App = () => {
  const item = {
    quantity: 3,
    bag_ids: ["bag1", "bag2", "bag3"],
    prices: { price_effective: 1000, currency_symbol: "₹" },
    item: {
      image: ["https://example.com/image.jpg"],
      name: "T-Shirt",
      brand: { name: "BrandName" },
      size: "M",
    },
  };

  return (
    <ShipmentUpdateItem selectedBagId="bag1" item={item} />
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).