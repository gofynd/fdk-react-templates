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

To use the `ProductListing` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import Wishlist from 'fdk-react-templates/pages/wishlist/wishlist.js';

const App = () => {
  const products = [
    { uid: '1', slug: 'product-1', /* other product data */ },
    { uid: '2', slug: 'product-2', /* other product data */ },
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

- **breadcrumb**: An array of breadcrumb items to display navigation links.
- **isProductCountDisplayed**: A boolean indicating whether to show the product count. Defaults to true.
- **productCount**: A number representing the total count of products. Defaults to 0.
- **title**: A string for the title of the product listing. Defaults to an empty string.
- **description**: A string providing additional details about the product listing. Defaults to an empty string.
- **isScrollTop**: A boolean to determine if a scroll-to-top button should be displayed. Defaults to true.
- **filterList**: An array of filter items available for the product listing. Defaults to an empty array.
- **selectedFilters**: An array of currently applied filters. Defaults to an empty array.
- **sortList**: An array of sorting options available. Defaults to an empty array.
- **sortModalProps**: An object containing props for the sort modal. Defaults to an empty object.
- **filterModalProps**: An object containing props for the filter modal. Defaults to an empty object.
- **loadingOption**: A string to specify the loading method ("pagination", "infinite", "view_more"). Defaults to "pagination".
- **paginationProps**: An object containing props for the pagination component. Defaults to an empty object.
- **isProductLoading**: A boolean indicating whether the products are currently loading. Defaults to false.
- **isPageLoading**: A boolean indicating whether the entire page is loading. Defaults to false.
- **productList**: An array of products to display. Defaults to an empty array.
- **columnCount**: An object specifying the number of columns for different screen sizes (desktop, tablet, mobile). Defaults to {    desktop: 4, tablet: 3, mobile: 1 }.
- **isProductOpenInNewTab**: A boolean indicating whether product links should open in a new tab. Defaults to false.
- **isBrand**: A boolean indicating whether to display the brand name on the product cards. Defaults to true.
- **isSaleBadge**: A boolean indicating whether to display a sale badge on the product cards. Defaults to true.
- **isPrice**: A boolean indicating whether to display the price on the product cards. Defaults to true.
- **isHdimgUsed**: A boolean indicating whether to use high-definition images. Defaults to false.
- **isImageFill**: A boolean indicating whether to fill the image container. Defaults to false.
- **showImageOnHover**: A boolean indicating whether to show the image on hover. Defaults to false.
- **isResetFilterDisable**: A boolean indicating whether the reset filter option should be disabled. Defaults to false.
- **imageBackgroundColor**: A string representing the background color of the product image. Defaults to an empty string.
- **imagePlaceholder**: A string for the placeholder image URL when the actual image is not available. Defaults to an empty string.
- **aspectRatio**: A string specifying the aspect ratio for images.
- **isWishlistIcon**: A boolean indicating whether to display the wishlist icon. Defaults to true.
- **WishlistIconComponent**: A custom component for the wishlist icon.
- **followedIdList**: An array of IDs for followed products. Defaults to an empty array.
- **listingPrice**: A string specifying how to display the price (e.g., "range"). Defaults to "range".
- **banner**: An object containing banner details (e.g., images, redirect links). Defaults to an empty object.
- **onColumnCountUpdate**: A function to handle column count updates.
- **onResetFiltersClick**: A function to handle the reset filters action.
- **onFilterUpdate**: A function to handle filter updates.
- **onSortUpdate**: A function to handle sorting updates.
- **onFilterModalBtnClick**: A function to handle filter modal button clicks.
- **onSortModalBtnClick**: A function to handle sort modal button clicks.
- **onWishlistClick**: A function to handle wishlist icon clicks.
- **onViewMoreClick**: A function to handle the view more action.
- **onLoadMoreProducts**: A function to load more products when needed.
- **EmptyStateComponent**: A component to display when no products are found. Defaults to a standard empty state message.

```

This README provides a detailed overview of the `Wishlist` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
