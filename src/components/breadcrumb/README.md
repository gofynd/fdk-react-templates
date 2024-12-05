# Breadcrumb Component

The `Breadcrumb` component displays a navigation breadcrumb where each item is clickable except the last one, which is shown as the active item.

## Features
- **Breadcrumb Navigation**: Displays a navigation breadcrumb with clickable links for each item except the last one, which is shown as the active item.

## Props

| Prop Name      | Prop Type   | Default Value | Description                                                                 |
|----------------|-------------|---------------|-----------------------------------------------------------------------------|
| breadcrumb     | array       | `[]`          | An array of breadcrumb items, where each item contains `label` and `link` properties. |

## Example Usage
```jsx
import React from "react";
import Breadcrumb from "fdk-react-templates/components/breadcrumb/breadcrumb";
import "fdk-react-templates/components/breadcrumb/breadcrumb.css";

const App = () => (
  <Breadcrumb
    breadcrumb={[
      { label: "Home", link: "/" },
      { label: "Blog", link: "/blog" },
      { label: "Current Post", link: "/blog/current-post" }
    ]}
  />
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).