# OrderTrackingDetails Component

## Overview

The `OrderTrackingDetails` component displays detailed information about a user's order shipments. It allows users to track their order by entering an Order ID, view shipment details, and manage their shipments.


## Usage

To use the `OrderTrackingDetails` component, import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import OrderTrackingDetails from "fdk-react-templates/pages/order/order-tracking-details/order-tracking-details";
import "fdk-react-templates/pages/order/order-tracking-details/order-tracking-details.css";

const App = () => {
  const orderShipments = { /* your order shipment data */ };
  const invoiceDetails = { /* your invoice details */ };

  const getShipmentDetails = () => {
    // Your logic to fetch shipment details
  };

  return (
    <OrderTrackingDetails
      invoiceDetails={invoiceDetails}
      isLoading={false}
      orderShipments={orderShipments}
      getShipmentDetails={getShipmentDetails}
      selectedShipment={orderShipments?.shipments[0]} // Example selected shipment
      isShipmentLoading={false}
    />
  );
};

export default App;
```

## Props

- **invoiceDetails**: Details related to the invoice.
- **isLoading**: Boolean indicating if the order details are currently loading.
- **orderShipments**: An object containing information about the shipments associated with the order.
- **getShipmentDetails**: A function to fetch shipment details.
- **selectedShipment**: The currently selected shipment details.
- **isShipmentLoading**: Boolean indicating if the shipment details are currently loading.

## Component Structure

The `OrderTrackingDetails` component consists of the following key sections:

1. **Order ID Input**: Text input for users to enter their Order ID.
2. **Track Button**: A button that triggers the tracking of the order.
3. **Error Message**: Shown conditionally when an invalid Order ID is entered.
4. **Loader**: Displays a loading spinner while fetching order details.
5. **Empty State**: Displays a message when there are no shipments available.
6. **Order Shipment Details**: Displays the order shipment information, including a list of items.
7. **Shipment Tracking**: Shows tracking details for the selected shipment.
8. **Shipment Breakup**: Displays the cost breakdown for the shipment.

## State Management

- **orderId**: The current value of the Order ID input field.
- **showError**: Boolean that determines if the error message should be displayed.
- **show**: Controls the visibility of additional shipment bags.
- **selectedShipmentBag**: Holds the details of the currently selected shipment.

## Event Handlers

- **trackOrder**: Validates the Order ID length and navigates to the order tracking page if valid. Sets the error state if invalid.
- **toggelInit**: Navigates to the shipment details page based on the selected shipment bag.
- **showMore**: Sets the state to show additional shipment bags.
- **showLess**: Resets the state to hide additional shipment bags.

## Effects

- **useEffect**: Fetches shipment details when the component mounts and when the shipment ID changes.
- **useEffect**: Updates the selected shipment bag based on the selected shipment.

## Helper Functions

- **getBag**: Returns the bags associated with the selected shipment.
- **getSlicedGroupedShipmentBags**: Returns a sliced array of shipment bags based on the current visibility state.
