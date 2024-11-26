# SvgWrapper Component

The `SvgWrapper` component is a utility wrapper for rendering SVG components based on a provided `svgSrc`. It maps the `svgSrc` to a corresponding SVG component using the `svgTitleComponentsMappings` constant. If the `svgSrc` matches an entry in the mappings, the associated SVG component is rendered, otherwise, it renders nothing.

## Features
- **Dynamic SVG Rendering**: Renders different SVG components based on the `svgSrc` prop.
- **Children Support**: Allows children to be passed into the rendered SVG component.
- **Flexible Prop Passing**: Accepts additional props that will be passed down to the rendered SVG component.

## Props

| Prop Name     | Prop Type     | Default Value | Description                                                             |
|---------------|---------------|---------------|-------------------------------------------------------------------------|
| `svgSrc`      | `string`      | -             | The source key used to look up the corresponding SVG component in the `svgTitleComponentsMappings`. |
| `children`    | `ReactNode`   | `undefined`   | Optional children to be rendered inside the SVG component.             |
| `...props`    | `object`      | -             | Any additional props will be passed to the rendered SVG component.     |

## Example Usage

```jsx
import React from "react";
import SvgWrapper from "fdk-react-templates/components/core/svg-wrapper/svg-wrapper";

const App = () => (
  <div>
    <h1>Dynamic SVG</h1>
    <SvgWrapper svgSrc="iconName" width="24" height="24" />
  </div>
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).