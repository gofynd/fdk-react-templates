# EmptyState Component

The `EmptyState` component is used to display a message when there is no data to show. It can include an optional icon, title, description, and a button that links to another page. The component adjusts the description's styling based on the screen size.

## Features
- **Customizable Title and Description**: Allows for custom titles and descriptions to inform the user of the empty state.
- **Optional Icon**: Displays an icon when provided.
- **Responsive Design**: Adjusts the description's font size based on whether the device is mobile or not.
- **Button Navigation**: Includes a button that can link to a specified page or route.

## Props

| Prop Name       | Prop Type     | Default Value  | Description                                                                 |
|-----------------|---------------|----------------|-----------------------------------------------------------------------------|
| `title`         | `string`      | "No Data Found" | The title text to display in the empty state message.                       |
| `description`   | `string`      | -              | The description text to provide more context in the empty state.            |
| `btnLink`       | `string`      | "/"            | The URL to navigate to when the button is clicked.                          |
| `btnTitle`      | `string`      | "RETURN TO HOMEPAGE" | The text to display inside the button.                                      |
| `iconSrc`       | `string`      | -              | The source URL of an optional icon to display in the empty state.           |

## Example Usage

```jsx
import React from "react";
import EmptyState from "fdk-react-templates/components/empty-state/empty-state";
import "fdk-react-templates/components/empty-state/empty-state.css";

const App = () => {
  return (
    <div>
      <EmptyState
        title="No Orders Available"
        description="You don't have any orders at the moment."
        btnLink="/orders"
        btnTitle="Go to Orders"
        iconSrc="path/to/icon.png"
      />
    </div>
  );
};

export default App;


```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).