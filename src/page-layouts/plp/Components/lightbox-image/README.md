# LightboxImage Component

## Overview
The `LightboxImage` component displays images, videos, or 3D models in a lightbox gallery. It provides a media viewer with controls for navigation, playback, and muting, as well as support for thumbnails and a fullscreen lightbox experience.

## Features
- **Image, Video, and 3D Model Support**: Displays different types of media, including images, YouTube videos, and 3D models.
- **Navigation**: Includes buttons to navigate to the previous or next media item.
- **Video Controls**: Play, pause, mute/unmute, and restart video playback.
- **Thumbnail Preview**: Displays thumbnails for quick navigation through the gallery.
- **Auto-Play**: Optionally auto-plays videos and sets auto-rotation for 3D models.
- **Responsive Layout**: Supports different screen sizes and ensures proper media aspect ratios.

## Usage
To use the `SizeGuide` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from "react";
// import LightboxImage from "../pdp/components/lightbox-image/lightbox-image";
import LightboxImage from "fdk-react-templates/page-layouts/plp/Components/lightbox-image/lightbox-image";
import "fdk-react-templates/page-layouts/plp/Components/lightbox-image/lightbox-image.css";

const App = () => {
  const images = [
    {
      alt: "Naksh Off-White Straight Kurta And Dupatta (Set of 2)",
      type: "image",
      url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0106989XS/I889rObqRI-JC0106989-(2).jpg",
    },
    {
      alt: "Naksh Off-White Straight Kurta And Dupatta (Set of 2)",
      type: "image",
      url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0106989XS/sYVQBDEkWX-JC0106989-(3).jpg",
    },
    {
      alt: "Naksh Off-White Straight Kurta And Dupatta (Set of 2)",
      type: "image",
      url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0106989XS/I-THGeggFW-JC0106989-(4).jpg",
    },
    {
      alt: "Naksh Off-White Straight Kurta And Dupatta (Set of 2)",
      type: "image",
      url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0106989XS/i-mIlQVMou-JC0106989-(5).jpg",
    },
    {
      alt: "Naksh Off-White Straight Kurta And Dupatta (Set of 2)",
      type: "image",
      url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0106989XS/f-kWoL2ask-JC0106989-(6).jpg",
    },
  ];

  return (
    <LightboxImage
      images={images}
      showLightBox={true}
      showThumbs={true}
      autoPlay={false}
      autoPlayTime={3000}
      closeGallery={() => console.log("Gallery closed")}
      currentIndex={0}
    />
  );
};

export default App;


```

### Props
- **images** (Array, required): An array of objects representing images, videos, or 3D models to be displayed. Each object must have `url`, `type`, and `alt` properties.
- **disableScroll** (Boolean, optional): If true, disables scrolling when the lightbox is open (default is true).
- **showLightBox** (Boolean, optional): If true, the lightbox will be displayed (default is false).
- **startAt** (Number, optional): The index of the media to start at (default is 0).
- **nThumbs** (Number, optional): The number of thumbnails to display (default is 5).
- **showThumbs** (Boolean, optional): If true, thumbnails are shown (default is true).
- **autoPlay** (Boolean, optional): If true, videos auto-play (default is false).
- **autoPlayTime** (Number, optional): Time in milliseconds for auto-play (default is 3000).
- **siteLoading** (Boolean, optional): If true, displays a loading indicator (default is null).
- **showCaption** (Boolean, optional): If true, captions are shown for each media item (default is false).
- **lengthToLoadMore** (Number, optional): The length to trigger loading more items (default is 0).
- **closeText** (String, optional): The text for the close button (default is "Close (Esc)").
- **previousText** (String, optional): The text for the previous button (default is "Previous").
- **nextText** (String, optional): The text for the next button (default is "Next").
- **previousThumbText** (String, optional): The text for the previous thumbnail button (default is "Previous").
- **nextThumbText** (String, optional): The text for the next thumbnail button (default is "Next").
- **iconColor** (String, optional): The color of the icons.
- **globalConfig** (Object, optional): Global configuration for image aspect ratio, background color, etc.
- **toggleResumeVideo** (Function, optional): A function to resume video playback when needed.
- **currentIndex** (Number, optional): The current index of the selected media.
- **closeGallery** (Function, required): A function to close the gallery.

```
This README provides a detailed overview of the `SizeGuide` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
