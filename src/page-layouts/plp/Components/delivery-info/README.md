## DeliveryInfo Component

## Overview
The `DeliveryInfo` component allows users to enter and validate a delivery pincode to check the availability of products in their location. It also displays the expected delivery date based on the provided pincode. The component manages the pincode state, handles validation errors, and updates delivery messages accordingly.

## Features
- **Pincode Input**: Users can input their delivery pincode to check availability.
- **Delivery Date**: Displays a message with the expected delivery date range.
- **Pincode Validation**: Validates the pincode and displays an error message if invalid.
- **Toggle Pincode Action**: Users can check the pincode status or change it.

## Usage
To use the `DeliveryInfo` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import DeliveryInfo from 'fdk-react-templates/page-layouts/plp/Components/delivery-info/delivery-info';
import 'fdk-react-templates/page-layouts/plp/Components/delivery-info/delivery-info.css';

const App = () => {
  const [pincode, setPincode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const checkPincode = async (pincode) => {
    // Simulate pincode validation
    if (pincode === "123456") {
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid pincode");
    }
  };

  const setCurrentPincode = (pincode) => {
    setPincode(pincode);
  };

  return (
    <DeliveryInfo
      pincode={pincode}
      selectPincodeError={false}
      storeInfo={{}}
      tat={{ min: '2024-11-16', max: '2024-11-20' }}
      pincodeErrorMessage={errorMessage}
      setCurrentPincode={setCurrentPincode}
      checkPincode={checkPincode}
      setPincodeErrorMessage={setErrorMessage}
    />
  );
};

export default App;

```

### Props
- **selectPincodeError** (boolean, optional): If there is an error with the pincode input.
- **storeInfo** (object, optional): Information about the store; not used directly in the component but could be useful for extended functionality.
- **tat** (object, optional): Contains delivery date information, including `min` and `max` dates.
- **pincode** (string, optional): The current pincode value to pre-fill the input.
- **pincodeErrorMessage** (string, optional): Error message to display if the pincode is invalid.
- **setCurrentPincode** (function, required): Function to set the current pincode.
- **checkPincode** (function, required): Function to check if the provided pincode is valid.
- **setPincodeErrorMessage** (function, required): Function to set the error message when pincode is invalid.

```
This README provides a detailed overview of the `DeliveryInfo` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.