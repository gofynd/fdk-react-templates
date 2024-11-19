# ImageSkeleton Component

The `ImageSkeleton` component is a placeholder skeleton loader for images. It displays a canvas element with specified width and aspect ratio, providing a visual indication that an image is loading. It adjusts the aspect ratio based on the device screen size (mobile or desktop).

## Features
- **Aspect Ratio Support**: Allows custom aspect ratios for both desktop and mobile devices.
- **Responsive Design**: Adjusts for mobile devices with a different aspect ratio.
- **Skeleton Loader**: Displays a loading skeleton in the form of a canvas element.

## Props

| Prop Name         | Prop Type   | Default Value | Description                                                             |
|-------------------|-------------|---------------|-------------------------------------------------------------------------|
| `aspectRatio`     | `number`    | `1`           | The aspect ratio for desktop (width/height).                             |
| `mobileAspectRatio`| `number`    | `1`           | The aspect ratio for mobile devices (width/height). Defaults to `aspectRatio`. |
| `width`            | `number`    | `100`         | The width of the skeleton loader.                                        |

## Example Usage

```jsx
import React from "react";
import ImageSkeleton from "fdk-react-templates/components/core/skeletons/image-skeleton";
import "fdk-react-templates/components/core/skeletons/skeletons.css";

const App = () => (
  <div>
    <h1>Loading Image...</h1>
    <ImageSkeleton width={200} aspectRatio={16 / 9} mobileAspectRatio={4 / 3} />
  </div>
);

export default App;


```
## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).