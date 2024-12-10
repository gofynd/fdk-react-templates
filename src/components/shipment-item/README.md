# Shipment Item Component

The `ShipmentItem` component displays information about a single shipment item, including product details, pricing, and optionally, a selection radio button or an image link for tracking. It supports different display types such as "my-orders" and "tracking".

## Features
- **Price Formatting**: Displays the price with a currency symbol and formatted with commas.
- **Selectable Items**: In "my-orders" type, the user can select a shipment item using a radio button (if the item is cancellable or returnable).
- **Product Info**: Displays product image, brand, size, quantity, and price.
- **Tracking Info**: For the "tracking" type, it shows product images with links to the product details page and can include shipment tracking information.

## Props

| Prop Name        | Prop Type    | Default Value | Description                                                                 |
|------------------|--------------|---------------|-----------------------------------------------------------------------------|
| `bag`            | `object`     |               | The shipment item object containing product, pricing, and quantity details. |
| `initial`        | `boolean`    | `false`       | Determines if it's an initial state, which affects rendering the radio button. |
| `shipment`       | `object`     |               | An object containing shipment details, including tracking URL (for "tracking" type). |
| `deliveryAddress`| `object`     |               | An object containing delivery address details (only used in tracking type). |
| `selectId`       | `string`     |               | The ID of the currently selected shipment item.                             |
| `onChangeValue`  | `function`   |               | A function that is called when a shipment item is selected.                 |
| `type`           | `string`     | `my-orders`   | The display type, which can be `"my-orders"` or `"tracking"`.               |

## Example Usage

```jsx
import React, { useState } from "react";
import ShipmentItem from "fdk-react-templates/components/shipment-item/shipment-item";
import "fdk-react-templates/components/shipment-item/shipment-item.css";

const App = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);

  const handleSelectShipment = (id) => {
    setSelectedShipment(id);
  };

  const bag = {
    id: "1",
    item: {
      name: "Product Name",
      image: ["https://example.com/image.jpg"],
      brand: { name: "Brand Name" },
      slug_key: "product-slug",
      size: "M",
    },
    quantity: 2,
    prices: {
      currency_symbol: "$",
      price_effective: 20.00,
    },
    can_cancel: true,
    can_return: false,
  };

  const shipment = {
    track_url: "https://tracking-url.com",
    tracking_no: "12345",
  };

  return (
    <div>
      <ShipmentItem
        bag={bag}
        shipment={shipment}
        initial={false}
        selectId={selectedShipment}
        onChangeValue={handleSelectShipment}
        type="my-orders"
      />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).