# Wishlist Component

## Overview

The `Wishlist` component displays a list of products that a user has saved for later consideration. It features a breadcrumb navigation, a title, a count of the items in the wishlist, and support for infinite scrolling to load more products.

## Features

- **Responsive Design**: Adapts to various screen sizes with a grid layout.
- **Infinite Scrolling**: Loads more products as the user scrolls down.
- **Customizable Product Cards**: Supports various props to customize the appearance of product cards.
- **Dynamic Breadcrumb Navigation**: Displays a breadcrumb for easy navigation back to previous pages.
- **Empty State Handling**: Displays a customizable empty state component when there are no products.
- **Product Linking**: Links to product detail pages with customizable target behavior.
- **Event Handlers**: Provides callback functions for loading more products and handling wishlist icon clicks.

## Usage
To use the `Wishlist` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import Wishlist from 'fdk-react-templates/pages/wishlist';
import 'fdk-react-templates/pages/wishlist/wishlist.css';

const App = () => {
    const products = [
      {
        "brand": {
          "name": "Naksh Jaipur"
        },
        "price": {
          "effective": {
            "currency_code": "INR",
            "currency_symbol": "₹",
            "max": 1750,
            "min": 1750
          },
          "marked": {
            "currency_code": "INR",
            "currency_symbol": "₹",
            "max": 1750,
            "min": 1750
          }
        },
        "media": [
          {
            "alt": "Naksh White A-Line Kurta With Printed Side Kalis",
            "type": "image",
            "url": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0107033XS/SI8hdVwxHc-JC0107033-(1).jpg"
          },
          {
            "alt": "Naksh White A-Line Kurta With Printed Side Kalis",
            "type": "image",
            "url": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0107033XS/0I7bHbAWX8-JC0107033-(2).jpg"
          },
          {
            "alt": "Naksh White A-Line Kurta With Printed Side Kalis",
            "type": "image",
            "url": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0107033XS/IW2f5U8kkR-JC0107033-(3).jpg"
          },
          {
            "alt": "Naksh White A-Line Kurta With Printed Side Kalis",
            "type": "image",
            "url": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0107033XS/cGjz2gWg5l-JC0107033-(4).jpg"
          },
          {
            "alt": "Naksh White A-Line Kurta With Printed Side Kalis",
            "type": "image",
            "url": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/JC0107033XS/LQC7QVxZqZp-JC0107033-(5).jpg"
          }
        ],
        "variants": [],
        "slug": "naksh-white-a-line-kurta-with-printed-side-kalis-11408898",
        "uid": 11408898,
        "sellable": true,
        "teaser_tag": null,
        "discount": "",
        "name": "Naksh White A-Line Kurta With Printed Side Kalis"
      }
    ];

  const handleLoadMore = () => {
    // Logic to load more products
  };

  const handleWishlistClick = (productId) => {
    // Logic for handling wishlist item click
  };

  return (
    <Wishlist
      breadcrumb={[{ name: 'Home', link: '/' }, { name: 'Wishlist', link: '/wishlist' }]}
      title="My Saved Items"
      productList={products}
      totalCount={products.length}
      onLoadMore={handleLoadMore}
      onWishlistClick={handleWishlistClick}
      EmptyStateComponent={() => <div>Your wishlist is empty.</div>}
    />
  );
};

export default App;
```

### Props

- **breadcrumb**: An array of breadcrumb items for navigation.
- **title**: A string for the title of the wishlist. Defaults to "Wishlist".
- **productList**: An array of products to display in the wishlist.
- **totalCount**: A number representing the total count of products in the wishlist.
- **isBrand**: A boolean indicating whether to display the brand name on the product card. Defaults to true.
- **isSaleBadge**: A boolean indicating whether to display a sale badge on the product card. Defaults to true.
- **isPrice**: A boolean indicating whether to display the product price on the card. Defaults to true.
- **isHdimgUsed**: A boolean indicating whether to use high-definition images for the products. Defaults to false.
- **aspectRatio**: A string to define the aspect ratio of the product images.
- **isProductOpenInNewTab**: A boolean indicating whether the product link should open in a new tab. Defaults to false.
- **showImageOnHover**: A boolean indicating whether to show images on hover. Defaults to false.
- **listingPrice**: A string to define how the listing price is displayed. Defaults to "range".
- **WishlistIconComponent**: A component to customize the wishlist icon displayed on the product card.
- **isImageFill**: A boolean indicating whether the product image should fill its container.
- **imageBackgroundColor**: A string to define the background color of the image container.
- **hasNext**: A boolean indicating whether there are more products to load.
- **isLoading**: A boolean indicating whether products are currently being loaded.
- **EmptyStateComponent**: A component to display when the wishlist is empty.
- **onLoadMore**: A function to call when loading more products.
- **onWishlistClick**: A function to call when the wishlist icon is clicked.
- **imagePlaceholder**: A string for the URL of a placeholder image to display when actual product images are unavailable.

```

This README provides a detailed overview of the `Wishlist` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
