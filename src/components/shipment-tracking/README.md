# Shipment Tracking Component

The `ShipmentTracking` component is designed to display detailed tracking information about a shipment, including its status, timestamps, and available links for actions like canceling, returning, or downloading invoices. It also allows users to navigate through the shipment's tracking events.

## Features
- **Shipment Status**: Displays the current status of the shipment (e.g., "In Transit").
- **Timestamps**: Shows the time when a tracking event occurred.
- **Tracking Details**: Toggles detailed tracking information if available.
- **Links for Actions**: Includes links for actions such as "Cancel", "Return", "Track", and "Download Invoice".
- **Expandable Tracking**: Allows users to expand detailed tracking information for each event.

## Props

| Prop Name        | Prop Type    | Default Value | Description                                                                 |
|------------------|--------------|---------------|-----------------------------------------------------------------------------|
| `tracking`       | `array`      | `[]`          | List of tracking events for the shipment. Each event contains a status, timestamp, and other details. |
| `shipmentInfo`   | `object`     |               | Object containing shipment details, including shipment ID, AWB number, and URLs for tracking or help. |
| `changeinit`     | `function`   |               | A function that handles the initialization of actions such as "Cancel" or "Return". |
| `invoiceDetails` | `object`     |               | Contains invoice details such as the success status and pre-signed URL for downloading the invoice. |

## Example Usage

```jsx
import React, { useState } from "react";
import ShipmentTracking from "fdk-react-templates/components/shipment-tracking/shipment-tracking";
import "fdk-react-templates/components/shipment-tracking/shipment-tracking.css";

const App = () => {
  const [showDetailedTracking, setShowDetailedTracking] = useState(false);

  const trackingData = [
    { 
      status: "In Transit", 
      created_ts: "2024-11-10T12:00:00Z", 
      is_current: true 
    },
    { 
      status: "Delivered", 
      created_ts: "2024-11-11T15:00:00Z", 
      is_passed: true 
    }
  ];

  const shipmentInfo = {
    shipment_id: "123456",
    awb_no: "AWB123456",
    track_url: "https://tracking-url.com",
    can_cancel: true,
    can_return: false,
    need_help_url: "https://help-url.com",
  };

  const invoiceDetails = {
    success: true,
    presigned_url: "https://invoice-url.com",
  };

  const changeInit = (item) => {
    console.log("Action initialized: ", item);
  };

  return (
    <div>
      <ShipmentTracking
        tracking={trackingData}
        shipmentInfo={shipmentInfo}
        changeinit={changeInit}
        invoiceDetails={invoiceDetails}
      />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).