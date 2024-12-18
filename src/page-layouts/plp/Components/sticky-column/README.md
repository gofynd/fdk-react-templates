# StickyColumn Component

The `StickyColumn` component provides a sticky scrolling behavior for its child elements. It calculates and updates its position dynamically to maintain a smooth scrolling experience, respecting offsets and boundaries.

## Features
- **Sticky Positioning**: Keeps the element fixed within a scrolling viewport while respecting its container boundaries.
- **Dynamic Offset Handling**: Calculates and adjusts top offset dynamically based on the sticky header height.
- **Smooth Scrolling**: Ensures a smooth scroll update using `requestAnimationFrame`.

## Usage
To use the `StickyColumn` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import StickyColumn from "fdk-react-templates/page-layouts/plp/Components/sticky-column/sticky-column";

const App = () => {
  return (
    <div style={{ display: "flex", height: "200vh" }}>
      <StickyColumn>
        <div style={{ padding: "20px", backgroundColor: "#f4f4f4" }}>
          <p>Sticky content goes here!</p>
        </div>
      </StickyColumn>
      <div style={{ flex: 1, marginLeft: "20px" }}>
        <p>Scroll to see the sticky column in action.</p>
      </div>
    </div>
  );
};

export default App;

```
### Props
- **children** (ReactNode): The content to be rendered inside the sticky column. It can include any React element or components.

```
This README provides a detailed overview of the `SizeGuide` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
