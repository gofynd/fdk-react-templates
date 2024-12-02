# ListingDescription Component

The `ListingDescription` component is used to display a product or item description with a "Read More" / "Read Less" toggle. If the description is long, it initially shows only a truncated version (up to 600 characters) and allows the user to expand it. If the description is shorter than 600 characters, it is displayed in full.

## Features
- **Truncated Description**: If the description is longer than 600 characters, it is truncated with a "Read More" option to expand the full text.
- **Read More / Read Less Toggle**: The user can toggle between showing the full description or just the truncated version.
- **Conditional Rendering**: If there is no description, the component will return `null` and render nothing.

## Props

| Prop Name       | Prop Type    | Default Value | Description                                                                 |
|-----------------|--------------|---------------|-----------------------------------------------------------------------------|
| `description`   | `string`     | `""`          | The description text to be displayed. If the length exceeds 600 characters, it will be truncated. |

## Example Usage

```jsx
import React from "react";
import ListingDescription from "fdk-react-templates/components/listing-description/listing-description";
import "fdk-react-templates/components/listing-description/listing-description.css";

const App = () => (
  <ListingDescription description="This is a product description that might be very long, depending on the content. It will be truncated if it exceeds 600 characters." />
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).