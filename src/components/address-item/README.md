# AddressItem Component

The `AddressItem` component is used to display a single address item, with options for selecting, editing, and customizing its content. This component is particularly useful in applications where users need to manage multiple addresses, such as in e-commerce or delivery services.

## Props

| Prop                         | Type       | Default                                                                 | Description                                                                                 |
| ---------------------------- | ---------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `showAddressSelectionCheckbox`| `boolean`  | `false`                                                                 | Flag to show or hide the checkbox for selecting the address.                                |
| `showAddressType`             | `boolean`  | `true`                                                                  | Flag to show or hide the address type (e.g., Home, Work).                                   |
| `selectedAddressId`           | `string`   | `""`                                                                    | The ID of the currently selected address, used to determine which address is selected.       |
| `addressItem`                 | `object`   | `{ area: "", landmark: "", city: "", area_code: "", country_phone_code: "91", phone: "", name: "", address_type: "", sector: "" }` | The address object containing details like area, landmark, city, etc.                      |
| `onAddressSelect`             | `function` | `() => {}`                                                              | Callback function to handle the selection of an address. Called when the checkbox is clicked.|
| `headerRightSlot`             | `component`| `<></>`                                                                 | Custom React component to render additional content to the right of the header (e.g., edit or delete buttons). |
| `belowNameSlot`               | `component`| `<></>`                                                                 | Custom React component to render additional content below the name field.                    |
| `belowAddressSlot`            | `component`| `<></>`                                                                 | Custom React component to render additional content below the address fields.                |

## Default `addressItem` Structure

The `addressItem` prop is an object that should have the following structure:

```javascript
const AddressType = {
  area: "",
  landmark: "",
  city: "",
  area_code: "",
  country_phone_code: "91",
  phone: "",
  name: "",
  address_type: "",
  sector: "",
};
```

## Example Usage

```jsx
import React from 'react';
import AddressItem from './AddressItem';
import EditButton from './EditButton';
import AdditionalInfo from './AdditionalInfo';
import MapLink from './MapLink';

function AddressList({ addresses, selectedAddressId, handleAddressSelect }) {
  return (
    <div>
      {addresses.map(address => (
        <AddressItem
          key={address.id}
          selectedAddressId={selectedAddressId}
          addressItem={address}
          onAddressSelect={() => handleAddressSelect(address.id)}
          headerRightSlot={<EditButton address={address} />}
          belowNameSlot={<AdditionalInfo address={address} />}
          belowAddressSlot={<MapLink address={address} />}
        />
      ))}
    </div>
  );
}

export default AddressList;
```

In this example, the `AddressItem` component is used to render a list of `addresses`, with additional custom components passed in through the `headerRightSlot`, `belowNameSlot`, and `belowAddressSlot` props.

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

