# Checkout Component

## Overview
The Checkout component manages the checkout process, including address entry, shipment options, payment methods, and price breakdown.

## Features
- **Address Management**: Handles user address input and displays it during checkout.
- **Shipment Options**: Displays shipment options and allows users to select their preferred shipment method.
- **Payment Processing**: Facilitates payment options and processes payment information.
- **Price Breakdown**: Shows a summary of the items in the cart and their respective costs.

## Usage
To use the `Checkout` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from 'react';
import Checkout from 'fdk-react-templates/pages/checkout';

const App = () => {
  const breakupValues = [
    { key: 'subtotal', value: 100 },
    { key: 'tax', value: 10 },
    { key: 'total', value: 110 }
  ];

  const cartItemsCount = 2;

  const address = {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345"
  };

  const showShipment = true;
  const showPayment = true;

  const shipments = [
    { method: 'Standard Shipping', cost: 5 },
    { method: 'Express Shipping', cost: 15 }
  ];

  const payment = {
    method: 'Credit Card',
    details: {
      cardNumber: '**** **** **** 1234',
      expiry: '12/25'
    }
  };

  const showPaymentOptions = true;
  const setShowShipment = () => {};
  const setShowPayment = () => {};
  const mapApiKey = "your-google-map-api-key";
  const showGoogleMap = true;
  const loader = false;

  return (
    <Checkout
      breakupValues={breakupValues}
      cartItemsCount={cartItemsCount}
      address={address}
      showShipment={showShipment}
      showPayment={showPayment}
      shipments={shipments}
      payment={payment}
      showPaymentOptions={showPaymentOptions}
      setShowShipment={setShowShipment}
      setShowPayment={setShowPayment}
      mapApiKey={mapApiKey}
      showGoogleMap={showGoogleMap}
      loader={loader}
    />
  );
};

export default App;

```

### Props
- **breakupValues** (array, required): Values for the price breakup display.
- **cartItemsCount** (number, required): Total count of items in the cart.
- **address** (object, required): The user's shipping address.
- **showShipment** (boolean, required): Flag to control the visibility of shipment options.
- **showPayment** (boolean, required): Flag to control the visibility of payment options.
- **shipments** (array, required): List of available shipments for selection.
- **payment** (object, required): Payment details.
- **showPaymentOptions** (boolean, required): Flag to show payment options.
- **setShowShipment** (function, required): Function to update shipment visibility.
- **setShowPayment** (function, required): Function to update payment visibility.
- **mapApiKey** (string, optional): API key for Google Maps integration.
- **showGoogleMap** (boolean, optional): Flag to show Google Map for address selection.
- **loader** (boolean, optional): Flag to display a loader during processing.

```
This README provides a detailed overview of the `Checkout` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
