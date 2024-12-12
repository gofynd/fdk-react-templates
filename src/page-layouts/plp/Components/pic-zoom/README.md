# PicZoom Component

### Overview
The `PicZoom` component displays different types of media (images, videos, 3D models) with interactive features such as muting, video playback, and zoom. It supports image previews, video control (play, pause, mute), and a 3D model viewer.

## Features
- **Supports Multiple Media Types**: Displays images, videos, and 3D models.
- **Video Controls**: Includes play/pause, mute/unmute, replay, and full-screen toggle for video content.
- **3D Model Viewer**: Allows the user to view 3D models with an auto-rotate feature.
- **Interactive Zoom**: Click on the image to zoom or view it in full-screen mode.
- **Loading and Error Handling**: Handles image and video loading states and ensures smooth transitions between media types.

## Usage
To use the `PicZoom` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from "react";
import PicZoom from "fdk-react-templates/page-layouts/plp/Components/pic-zoom/pic-zoom";
import "fdk-react-templates/page-layouts/plp/Components/pic-zoom/pic-zoom.css";

const App = () => (
  <PicZoom
    source="https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0106989XS/f-kWoL2ask-JC0106989-(6).jpg"
    type="image"
    alt="Product Image"
    currentIndex={0}
    onClickImage={(index) => console.log("Clicked image index:", index)}
  />
);

export default App;

```


### Props
- **source** (string, required): The source URL of the image, video, or 3D model.
- **type** (string, optional): The type of media to display (`image`, `video`, `3d_model`).
- **alt** (string, optional): The alt text for the image.
- **currentIndex** (number, required): The index of the current media item.
- **resumeVideo** (boolean, optional): Whether to resume the video playback automatically when the component renders.
- **globalConfig** (object, optional): Global configuration for media display (such as aspect ratio, image fill).
- **customClass** (string, optional): Custom CSS class to apply to the component.
- **onClickImage** (function, required): Callback function when an image is clicked.
- **isLoading** (boolean, optional): Whether the media is still loading.
- **hideImagePreview** (boolean, optional): Whether to hide the image preview (default is `false`).

```
This README provides a detailed overview of the `PicZoom` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
