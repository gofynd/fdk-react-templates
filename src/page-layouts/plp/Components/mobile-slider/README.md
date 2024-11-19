# MobileSlider Component

## Overview
The `MobileSlider` component is a responsive carousel designed for mobile devices. It supports multiple media types such as images, videos (including YouTube), and 3D models, with smooth transitions and user interaction features like mute, play/pause, and full-screen modes. It also integrates with the `FyImage` component for image rendering and the `Viewer3D` component for displaying 3D models.

## Features
- **Responsive Slider**: Displays images, videos, and 3D models in a responsive carousel optimized for mobile screens.
- **Media Types**: Supports images, videos (YouTube and MP4), and 3D models.
- **Video Controls**: Mute, play/pause, and replay options for videos.
- **3D Model Viewer**: Displays interactive 3D models with an auto-rotate option.
- **Custom Order Badge**: Displays a "Made to Order" badge for products with a custom order option.
- **Lazy Load**: Images are loaded lazily to optimize performance.


## Usage
To use the `MobileSlider` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from "react";
import MobileSlider from 'fdk-react-templates/page-layouts/plp/Components/mobile-slider/mobile-slider';
import 'fdk-react-templates/page-layouts/plp/Components/mobile-slider/mobile-slider.css';

const images = [
  { type: "image", url: "/path/to/image1.jpg", alt: "Image 1" },
  { type: "video", url: "/path/to/video.mp4", alt: "Video 1" },
  { type: "3d_model", url: "/path/to/model.obj", alt: "3D Model" },
];

const App = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = () => {
    console.log("Image clicked");
  };

  return (
    <MobileSlider
      images={images}
      globalConfig={{ img_fill: true }}
      onImageClick={handleImageClick}
      setCurrentImageIndex={setCurrentImageIndex}
    />
  );
};

export default App;

```

### Props
- **images** (array, optional): An array of media objects that can be images, videos, or 3D models. Each object should have a `type` (`image`, `video`, or `3d_model`) and `url`. Default is an empty array.
- **globalConfig** (object, optional): Global configuration settings for the component, including image aspect ratio, background color, and fill settings.
- **onImageClick** (function, optional): A callback function triggered when an image or video is clicked. Default is `undefined`.
- **product** (object, optional): The product data, used for displaying the "Made to Order" badge if the product is a custom order.
- **setCurrentImageIndex** (function, optional): A function to update the current image index during slide transitions.
- **slideTabCentreNone** (boolean, optional): Controls whether the center padding and centering behavior should be applied in the slider. Default is `false`.

```
This README provides a detailed overview of the `MobileSlider` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
