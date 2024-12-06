# PageNotFound Component

The `PageNotFound` component is used to display a user-friendly message when a page cannot be found (e.g., 404 error page). It allows for customization of the displayed title and image, and includes a button to navigate back to the home page.

## Features
- **Customizable Title**: Allows customization of the "Page Not Found" title.
- **Customizable Image**: Allows customization of the image displayed when the page is not found.
- **Go to Home Button**: Includes a button that redirects users to the homepage.

## Props

| Prop Name    | Prop Type     | Default Value      | Description                                                                 |
|--------------|---------------|--------------------|-----------------------------------------------------------------------------|
| `title`      | `string`      | `"Page Not Found"` | The title to display in the empty state message.                             |
| `src`        | `string`      | `null`             | The URL of the image to display in the empty state. If not provided, a default image is used. |

## Example Usage

```jsx
import React from "react";
import PageNotFound from "fdk-react-templates/components/page-not-found/page-not-found";
import "fdk-react-templates/components/page-not-found/page-not-found.css";

const App = () => (
  <PageNotFound
    title="Oops! We couldn't find that page."
    src="https://path/to/your/custom/image.png"
  />
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).