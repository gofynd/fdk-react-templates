# HTMLContent Component

The `HTMLContent` component renders raw HTML content passed via the `content` prop. It uses `dangerouslySetInnerHTML` to inject HTML directly into the component, which can be useful for rendering rich text or HTML content from an external source.

## Features
- **Dynamic HTML Rendering**: Renders HTML content passed as a string.
- **Ref Forwarding**: Supports ref forwarding to access the DOM node.
- **Hydration Warning Suppression**: Suppresses hydration warnings during server-side rendering.
- **Data Attribute**: Includes a `data-testid` for testing purposes.

## Props

| Prop Name  | Prop Type    | Default Value | Description                                                                 |
|------------|--------------|---------------|-----------------------------------------------------------------------------|
| `content`  | `string`     | `""`          | The raw HTML content to be rendered inside the component.                    |

## Example Usage

```jsx
import React from "react";
import HTMLContent from "fdk-react-templates/components/core/html-content/html-content";

const App = () => {
  const htmlContent = "<p>This is some <strong>HTML</strong> content.</p>";

  return (
    <HTMLContent content={htmlContent} />
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).
