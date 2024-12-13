# ImageGallery Component

## Overview
The `ImageGallery` component displays a gallery of images, videos, or 3D models, allowing users to view and navigate through the media. It features lightbox support, thumbnail navigation, and responsive design, providing an optimal viewing experience across devices.

## Features
- **Gallery Navigation**: Navigate through media items using arrows and thumbnails.
- **Lightbox Support**: Opens a fullscreen lightbox gallery for better viewing of media.
- **Responsive Design**: Automatically adjusts for desktop and mobile views.
- **Video Playback**: Play videos directly in the gallery with control over autoplay and video resume.
- **Thumbnail Preview**: Option to display a thumbnail navigation bar.
- **Custom Badges**: Displays custom badges like "Made to Order" for products.
- **Customizable Icons**: Option to customize the color of navigation icons.
- **Mobile Support**: Includes a mobile slider for optimal viewing on smaller screens.

## Usage
To use the `ImageGallery` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from "react";
import ImageGallery from "fdk-react-templates/page-layouts/plp/Components/image-gallery/image-gallery";
import "fdk-react-templates/page-layouts/plp/Components/image-gallery/image-gallery.css";

const App = () => {
  const images = [
    {
      alt: "Naksh Off-White Straight Kurta And Dupatta (Set of 2)",
      type: "image",
      url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0106989XS/U5B4N21Ed-JC0106989-(1).jpg",
    },
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
    {
      alt: null,
      type: "video",
      url: "/products/videos/item/free/original/soshzNvO0-Naksh-Off-White-Straight-Kurta-And-Dupatta-(Set-of-2).mp4",
    },
  ];

  const product = {
    custom_order: { is_custom_order: true },
  };

  const globalConfig = {
    img_fill: true,
    img_container_bg: "#fff",
  };

  return (
    <ImageGallery
      images={images}
      displayThumbnail={true}
      product={product}
      iconColor="#000"
      globalConfig={globalConfig}
      isLoading={false}
      hiddenDots={false}
      slideTabCentreNone={false}
      hideImagePreview={false}
    />
  );
};

export default App;

```


### Props
- **images** (Array, required): An array of media objects, each containing `url`, `type`, and `alt` properties. Types can include `image`, `video`, or `3d_model`.
- **displayThumbnail** (Boolean, optional): Determines whether thumbnails are shown in the gallery (default is true).
- **product** (Object, optional): The product associated with the gallery. Used for custom badges like "Made to Order".
- **iconColor** (String, optional): The color of the navigation icons (default is "").
- **globalConfig** (Object, optional): Global configuration for image display settings such as aspect ratio and image fill.
- **isLoading** (Boolean, optional): Indicates if the media is still loading (default is `false`).
- **hiddenDots** (Boolean, optional): If true, hides the thumbnail dots (default is `false`).
- **slideTabCentreNone** (Boolean, optional): If true, prevents centering the active slide in mobile view (default is `false`).
- **hideImagePreview** (Boolean, optional): If true, hides the image preview before opening the lightbox (default is `false`).

```
This README provides a detailed overview of the `ImageGallery` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
