# Shipment Address Component

The `ShipmentAddress` component displays a formatted address, including the recipient's name, phone number, and various address details. It also handles optional fields such as sector, city, and pincode.

## Features
- **Formatted address display**: Displays the address in a structured format.
- **Optional field handling**: The component handles optional fields like sector and pincode, showing them when available.
- **Styled output**: Address details are styled with classes for a consistent design.

## Props

| Prop Name   | Prop Type  | Default Value | Description                                                           |
|-------------|------------|---------------|-----------------------------------------------------------------------|
| `address`   | `object`   | `null`        | The address object containing details such as `name`, `phone`, `address`, `area`, `landmark`, `sector`, `city`, and `pincode`. |

## Example Usage

```jsx
import React from "react";
import ShipmentAddress from "fdk-react-templates/components/shipment-address/shipment-address";
import "fdk-react-templates/components/shipment-address/shipment-address.css";

const App = () => {
  const address = {
    name: "John Doe",
    phone: "123-456-7890",
    address: "123 Main St",
    area: "Downtown",
    landmark: "Near Park",
    sector: "5A",
    city: "Cityville",
    pincode: "123456",
  };

  return (
    <div>
      <ShipmentAddress address={address} />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).