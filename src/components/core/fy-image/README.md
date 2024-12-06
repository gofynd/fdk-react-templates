# FyImage Component

The `FyImage` component is a responsive image loader that supports lazy loading, aspect ratio control, image transformations, and fallback mechanisms for errors or placeholders. It automatically adjusts the image size based on screen breakpoints, making it efficient for various devices.

## Features
- **Responsive Image Handling**: Automatically adjusts image size based on breakpoints.
- **Lazy Loading**: Images are lazy-loaded to optimize performance.
- **Error Handling**: Displays a fallback image if the original image fails to load.
- **Aspect Ratio Control**: Supports fixed and mobile-specific aspect ratios for images.
- **Skeleton Loading**: Optionally shows a skeleton loader while the image is loading.
- **Overlay Support**: Optionally displays an overlay over the image.
- **Image Transformation**: Dynamically resizes images based on available sizes.

## Props

| Prop Name           | Prop Type        | Default Value    | Description                                                                 |
|---------------------|------------------|------------------|-----------------------------------------------------------------------------|
| `backgroundColor`   | `string`         | `#ffffff`        | Background color of the image container.                                     |
| `src`               | `string`         | `""`             | The source URL of the image to be displayed.                                 |
| `placeholder`       | `string`         | `""`             | The placeholder image URL to be shown when the image fails to load.          |
| `alt`               | `string`         | `""`             | Alternative text for the image.                                              |
| `isImageFill`       | `boolean`        | `false`          | Whether the image should fill the container completely.                      |
| `isFixedAspectRatio`| `boolean`        | `true`           | Whether to maintain a fixed aspect ratio for the image.                      |
| `aspectRatio`       | `number`         | `1`              | The aspect ratio of the image (width/height).                                |
| `mobileAspectRatio` | `number`         | `aspectRatio`    | The aspect ratio to be used for mobile devices.                              |
| `showSkeleton`      | `boolean`        | `false`          | Whether to display a skeleton loader while the image is loading.             |
| `showOverlay`       | `boolean`        | `false`          | Whether to display an overlay over the image.                               |
| `overlayColor`      | `string`         | `#ffffff`        | The color of the overlay.                                                   |
| `sources`           | `array`          | Breakpoint sizes | Breakpoint sizes for responsive image loading.                              |
| `isLazyLoaded`      | `boolean`        | `true`           | Whether the image should be lazy-loaded.                                     |
| `blurWidth`         | `number`         | `50`             | The width of the blurred image used in lazy loading.                         |
| `customClass`       | `string`         | `""`             | Custom class for styling the image container.                                |
| `globalConfig`      | `object`         | `null`           | Global configuration object for custom styles and settings.                 |
| `defer`             | `boolean`        | `true`           | Whether the image should be loaded with a low fetch priority (lazy loading). |

## Example Usage

```jsx
import React from "react";
import FyImage from "fdk-react-templates/components/core/fy-image/fy-image";
import "fdk-react-templates/components/core/fy-image/fy-image.css";

const App = () => (
  <FyImage
    src="https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/yqs0DrHeJ-continental-gt-650-thumbnail.jpg"
    alt="Example Image"
    isImageFill={true}
    aspectRatio={16 / 9}
    isLazyLoaded={true}
    placeholder="https://example.com/placeholder.jpg"
  />
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

