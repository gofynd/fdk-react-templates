# OrderShipment Component

The `OrderShipment` component displays shipment details for an order. It shows the shipment information, including product names, total items, shipment status, and the option to reorder items if eligible. The component also allows toggling visibility of the shipment details.

## Features
- **Shipment Details**: Displays the shipment ID, product names, and the number of items in each shipment.
- **Shipment Status**: Shows the current status of the shipment with a color indicator.
- **Toggle Visibility**: Allows the user to expand and collapse the shipment details.
- **Reorder Option**: If the user is eligible, provides an option to reorder items from the shipment.
- **Admin View**: Displays the brand name if the user is an admin.

## Props

| Prop Name          | Prop Type     | Default Value | Description                                                                 |
|--------------------|---------------|---------------|-----------------------------------------------------------------------------|
| `orderInfo`        | `object`      | `undefined`   | Information about the order, including shipment details.                    |
| `onBuyAgainClick`  | `function`    | `() => {}`     | Function to handle the "Buy Again" button click.                            |
| `isBuyAgainEligible`| `boolean`    | `false`       | Determines if the user is eligible to buy the items in the order again.     |

## Example Usage

```jsx
import React from "react";
import OrderShipment from "fdk-react-templates/components/order-shipment/order-shipment"; 
import "fdk-react-templates/components/order-shipment/order-shipment.css"; 

const App = () => {
    const orderInfo = {
      order_id: "12345",
      order_created_ts: "2024-11-18T12:00:00Z",
      shipments: [
        {
          shipment_id: "98765",
          bags: [
            {
              item: {
                name: "Product 1",
                image: ["image_url"],
              },
              quantity: 1,
            },
          ],
          shipment_status: {
            title: "Shipped",
            hex_code: "#00FF00",
          },
        },
      ],
    }

  return ( 
    <OrderShipment
        orderInfo={orderInfo}
        onBuyAgainClick={(order) => console.log("Buying again:", order)}
        isBuyAgainEligible={true}
    />
  )
};

export default App;

```
## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).