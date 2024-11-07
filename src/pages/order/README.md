# OrderTracking Component

## Overview

The `OrderTracking` component allows users to track their orders by entering an Order ID. It provides a simple interface for users to input their Order ID and view order details, enhancing the user experience in an e-commerce setting.

## Features

- **Input Validation**: Checks the length of the Order ID and displays an error message if it's invalid.
- **Dynamic Navigation**: Uses `react-router-dom` for navigation to the order tracking page.
- **Toggleable Details**: Users can view additional information about how to find their Order ID.
- **Responsive Design**: Styled with a modular CSS approach for better maintainability.

## Usage

To use the `OrderTracking` component, import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import OrderTracking from "./OrderTracking";

const App = () => {
  const instMob = "/path/to/your/image.png";

  return (
    <div>
      <OrderTracking instMob={instMob} />
    </div>
  );
};

export default App;
```

# Props

- **instMob**: A string representing the path to the image that shows how to find the Order ID. This image is displayed when users click to see more details.

## Component Structure

The `OrderTracking` component consists of the following key sections:

1. **Order Title**: Displays a title prompting the user to check their order status.
2. **Error Message**: Shown conditionally when an invalid Order ID is entered.
3. **Order ID Input**: Text input for users to enter their Order ID.
4. **Track Button**: A button that triggers the order tracking function.
5. **Details Toggle**: A clickable area that toggles the display of additional information regarding how to find the Order ID.
6. **Image Display**: Displays an instructional image when the user opts to see more details.

## State Management

- **showDetails**: Controls the visibility of additional information regarding the Order ID.
- **image**: Holds the path to the instructional image.
- **orderId**: The current value of the Order ID input field.
- **showError**: Boolean that determines if the error message should be displayed.

## Event Handlers

- **trackOrder**: Validates the Order ID length and navigates to the order tracking page if valid. Sets the error state if invalid.
- **onChange**: Updates the state for the Order ID as the user types.


