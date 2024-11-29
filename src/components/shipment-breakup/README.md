# Shipment Breakup Component

The `ShipmentBreakup` component displays the billing breakup of a shipment, showing various charges such as the total price, taxes, and other applicable costs. It formats the prices according to the currency symbol.

## Features
- **Price formatting**: Formats price values based on the currency symbol.
- **Billing details display**: Displays a list of billing items, including the total and other relevant charges.
- **Conditional rendering**: Filters out items with a value of zero and only displays meaningful billing information.

## Props

| Prop Name    | Prop Type   | Default Value | Description                                                                 |
|--------------|-------------|---------------|-----------------------------------------------------------------------------|
| `breakup`    | `array`     | `[]`          | An array of objects representing the billing breakup, each with `name`, `display`, `value`, and `currency_symbol` properties. |
| `shipmentInfo` | `object`   | `null`        | An object containing shipment-related details, including payment information (optional). |

## Example Usage

```jsx
import React from "react";
import ShipmentBreakup from "fdk-react-templates/components/shipment-breakup/shipment-breakup";
import "fdk-react-templates/components/shipment-breakup/shipment-breakup.css";

const App = () => {
  const breakup = [
    { name: "total", display: "Total", value: 100, currency_symbol: "$" },
    { name: "shipping", display: "Shipping", value: 10, currency_symbol: "$" },
    { name: "tax", display: "Tax", value: 5, currency_symbol: "$" },
  ];

  return (
    <div>
      <ShipmentBreakup breakup={breakup} shipmentInfo={null} />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).