# OrdersHeader Component

The `OrdersHeader` component displays the header section of an orders page. It shows the title, subtitle, and filters like order date and order status. It also provides dropdown functionality for selecting different filters, such as order date and status.

## Features
- **Title and Subtitle**: Displays the main title and subtitle for the header section.
- **Dynamic Date Filter**: Allows the user to select a date filter from predefined options.
- **Order Status Filter**: Displays a dropdown for selecting order status.
- **Responsive Layout**: The layout adapts based on the `flag` prop, adjusting the margins accordingly.

## Props

| Prop Name        | Prop Type     | Default Value  | Description                                                       |
|------------------|---------------|----------------|-------------------------------------------------------------------|
| `title`          | `string`      | `""`           | The main title to be displayed in the header.                     |
| `subtitle`       | `string`      | `""`           | The subtitle to be displayed under the main title.                |
| `filters`        | `object`      | `undefined`    | The filter object containing available statuses and other filter options. |
| `flag`           | `boolean`     | `false`        | Determines whether additional styling (like margin) is applied.   |

## Example Usage

```jsx
import React from "react";
import OrdersHeader from "fdk-react-templates/components/order-header/order-header"; 
import "fdk-react-templates/components/order-header/order-header.css"; 

const App = () => (
  <OrdersHeader
    title="Order List"
    subtitle="View your recent orders"
    filters={{
      statuses: [
        { display: "Pending", is_selected: true },
        { display: "Shipped", is_selected: false },
        { display: "Delivered", is_selected: false },
      ],
    }}
    flag={false}
  />
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).