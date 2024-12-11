# AddressItem Component

The `AddressItem` component represents a single address entry that can be selected, displayed, and optionally edited. It supports displaying the address details, address type, phone number, and custom slots for additional content.

## Features
- **Address Display**: Displays the address details such as area, city, landmark, phone number, etc.
- **Address Selection**: Includes a checkbox for selecting the address (optional).
- **Custom Content Slots**: Allows rendering of additional custom content in the header, below the name, and below the address.
- **Address Type Display**: Optionally displays the type of address (e.g., "Home", "Work").

## Props

| Prop Name                    | Prop Type        | Default Value     | Description                                                                 |
|------------------------------|------------------|-------------------|-----------------------------------------------------------------------------|
| `showAddressSelectionCheckbox` | `boolean`        | `false`           | Flag to show or hide the checkbox for selecting the address.                |
| `showAddressType`             | `boolean`        | `true`            | Flag to show or hide the address type (e.g., Home, Work).                   |
| `selectedAddressId`           | `string`         | `""`              | The ID of the currently selected address, used to highlight the selected address. |
| `addressItem`                 | `object`         | Default Address Object | The address object containing details like area, city, landmark, etc.     |
| `onAddressSelect`             | `function`       | `() => {}`        | Callback function to handle the selection of an address when clicked.      |
| `headerRightSlot`             | `component`      | `<></>`           | Custom React component to render additional content to the right of the header (e.g., edit or delete buttons). |
| `belowNameSlot`               | `component`      | `<></>`           | Custom React component to render additional content below the name field. |
| `belowAddressSlot`            | `component`      | `<></>`           | Custom React component to render additional content below the address fields. |
| `containerClassName`          | `string`         | `""`              | Custom class to apply external styling to the container. |

## Example Usage

```jsx
import React, { useState } from "react";
import AddressItem from "fdk-react-templates/components/address-item/address-item";
import "fdk-react-templates/components/address-item/address-item.css";

const App = () => {
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const address = {
    id: "1",
    name: "John Doe",
    address: "123 Main St",
    area: "Downtown",
    landmark: "Near Central Park",
    city: "New York",
    area_code: "10001",
    country_phone_code: "1",
    phone: "1234567890",
    address_type: "Home",
  };

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  return (
    <div>
      <AddressItem
        selectedAddressId={selectedAddressId}
        addressItem={address}
        onAddressSelect={handleAddressSelect}
        headerRightSlot={<button>Edit</button>}
        belowNameSlot={<span>Additional info below name</span>}
        belowAddressSlot={<span>Map link below address</span>}
        containerClassName="custom-class"
      />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

