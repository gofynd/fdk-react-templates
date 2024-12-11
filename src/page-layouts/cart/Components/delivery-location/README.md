## DeliveryLocation Component

## Overview
The `DeliveryLocation` component allows users to enter a delivery PIN code, select an address from existing addresses, and add new addresses. It manages modals for PIN code entry, address selection, and adding new addresses.

## Features
- **PIN Code Management**: Users can enter and validate a delivery PIN code.
- **Address Selection**: Users can select from default and other available addresses.
- **Add New Address**: Users can add a new address with location details.

## Usage
To use the `DeliveryLocation` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from 'react';
import DeliveryLocation from 'fdk-react-templates/page-layouts/cart/Components/delivery-location/delivery-location';
import 'fdk-react-templates/page-layouts/cart/Components/delivery-location/delivery-location.css';

const App = () => {
  const pincode = "123456";
  const pinError = { message: "Invalid PIN code" };
  const defaultAddressList = [{ id: "1", address: "123 Main St, City, State" }];
  const additionalAddressList = [{ id: "2", address: "456 Side St, City, State" }];
  const currentlySelectedAddressId = "1";
  const googleMapsApiKey = "YOUR_MAP_API_KEY";
  const addressSelectionError = { id: "1", message: "Address not deliverable" };

  return (
    <DeliveryLocation
      pincode={pincode}
      error={pinError}
      isPincodeModalOpen={true}
      isAddressModalOpen={false}
      isAddAddressModalOpen={false}
      defaultAddress={defaultAddressList}
      otherAddresses={additionalAddressList}
      selectedAddressId={currentlySelectedAddressId}
      mapApiKey={googleMapsApiKey}
      showGoogleMap={true}
      getLocality={(pincode) => console.log(`Fetching locality for ${pincode}`)}
      selectAddress={() => console.log('Address selected')}
      addrError={addressSelectionError}
      onChangeButtonClick={() => console.log('Change PIN code clicked')}
      onAddButtonClick={() => console.log('Add new address clicked')}
      onPincodeSubmit={(data) => console.log('Submitted PIN code:', data.pincode)}
      onCloseModalClick={() => console.log('Modal closed')}
      setSelectedAddressId={(id) => console.log('Selected Address ID:', id)}
      addAddress={(newAddress) => console.log('New address added:', newAddress)}
    />
  );
};

export default App;

```

### Props
- **pincode** (string, optional): The initial value of the PIN code to display.
- **error** (object, optional): An error object that provides details about any error related to the PIN code submission.
- **isPincodeModalOpen** (boolean, optional): Controls the visibility of the PIN code modal.
- **isAddressModalOpen** (boolean, optional): Controls the visibility of the address selection modal.
- **isAddAddressModalOpen** (boolean, optional): Controls the visibility of the add new address modal.
- **defaultAddress** (array, optional): An array of default addresses for the user. Each address should have an `id` and relevant address details.
- **otherAddresses** (array, optional): An array of additional addresses available for selection. Each address should have an `id` and relevant address details.
- **selectedAddressId** (string, optional): The ID of the currently selected address.
- **mapApiKey** (string, optional): The API key for Google Maps integration, used for geolocation features.
- **showGoogleMap** (boolean, optional): Indicates whether to display Google Maps for address selection.
- **getLocality** (function, optional): A function that retrieves locality details based on the entered PIN code.
- **selectAddress** (function, optional): A callback function that is triggered when the user selects an address from the list.
- **addrError** (object, optional): An object containing error information for address-related issues, with properties `id` and `message`.
- **onChangeButtonClick** (function, optional): A callback function that is triggered when the user clicks to change the PIN code.
- **onAddButtonClick** (function, optional): A callback function that is triggered when the user clicks to add a new address.
- **onPincodeSubmit** (function, optional): A callback function that is triggered when the PIN code form is submitted.
- **onCloseModalClick** (function, optional): A callback function that is triggered when a modal needs to be closed.
- **setSelectedAddressId** (function, optional): A function that updates the selected address ID in the parent component.
- **addAddress** (function, optional): A function that handles adding a new address.

```
This README provides a detailed overview of the `DeliveryLocation` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.