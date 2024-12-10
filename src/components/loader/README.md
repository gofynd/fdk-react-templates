# Loader Component

The `Loader` component is used to display a loading animation or spinner. It can be customized with additional class names for the container and the loader itself.

## Features
- **Customizable classes**: Allows customization of both the container and loader styles via `containerClassName` and `loaderClassName` props.
- **Simple integration**: Easy to add to any page or component where loading indication is required.

## Props

| Prop Name          | Prop Type     | Default Value   | Description                                                   |
|--------------------|---------------|-----------------|---------------------------------------------------------------|
| `containerClassName` | `string`      | `""`            | Custom class name for the loader container.                   |
| `loaderClassName`    | `string`      | `""`            | Custom class name for the loader element.                     |

## Example Usage

```jsx
import React from "react";
import Loader from "fdk-react-templates/components/loader/loader"; 
import "fdk-react-templates/components/loader/loader.css"; 

const App = () => (
  <div>
    <Loader containerClassName="custom-container" loaderClassName="custom-loader" />
  </div>
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).