# FyHTMLRenderer Component

The `FyHTMLRenderer` component is used to render HTML content safely in a React application. It allows you to display raw HTML content while optionally truncating it with an ellipsis ("...") when the `showDots` prop is enabled.

## Features
- **Dynamic HTML Rendering**: Renders HTML content passed as a prop.
- **Ellipsis Truncation**: Optionally truncates content with "..." based on the `showDots` prop.
- **Client-Side Rendering**: Ensures the content is only parsed on the client side using the `isRunningOnClient` utility.

## Props

| Prop Name      | Prop Type      | Default Value | Description                                                                 |
|----------------|----------------|---------------|-----------------------------------------------------------------------------|
| `htmlContent`  | `string`       | `null`        | The HTML content to be rendered.                                              |
| `customClass`  | `string`       | `""`          | Custom class name for styling the component.                                 |
| `showDots`     | `boolean`      | `false`       | If `true`, the content is truncated with an ellipsis ("...") at the end.      |

## Example Usage

```jsx
import React from "react";
import FyHTMLRenderer from "fdk-react-templates/components/core/html-renderer/fy-html-renderer";

const App = () => (
  <FyHTMLRenderer
    htmlContent="<p>This is some <strong>HTML</strong> content.</p>"
    customClass="html-renderer"
    showDots={true}
  />
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).


