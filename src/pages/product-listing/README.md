# ProductListing Component

## Overview

The `ProductListing` component is a part of the FDK React Templates library. It is designed to display a list of products with various features such as sorting, filtering, and pagination. The component leverages several utilities and components from the `fdk-core` package to provide a robust and flexible product listing page.

## Features

- **Pagination:** Includes pagination controls to navigate through product pages.
- **Loading States:** Displays a loader during API requests and shows a "No Products Found" message if no products are available.
- **Responsive Design**: Adapts to different screen sizes with customizable column counts for desktop, tablet, and mobile views.
- **Dynamic Filtering**: Allows users to filter products based on selected criteria, with the ability to reset filters.
- **Sorting Options**: Provides various sorting methods to organize product listings by price, popularity, or other attributes.
- **Loading States**: Includes loading indicators for both products and the page, enhancing user experience during data fetching.
- **Empty State Handling**: Displays a customizable component when there are no products available, ensuring clear communication with users.
- **Wishlist Functionality**: Supports adding products to a wishlist, allowing users to save items for later consideration.
- **High-Definition Images**: Option to display high-resolution images for improved visual quality.
- **Customizable Modals**: Offers configurable modal components for sorting and filtering, enhancing interaction with users.
- **Image Placeholders**: Provides fallback images when actual product images are unavailable, maintaining design integrity.
- **Event Callbacks**: Includes multiple event handlers for various user actions (e.g., sorting, filtering, loading more products) for better integration with other components and services.
- **Breadcrumb Navigation**: Supports breadcrumb navigation to improve usability and help users trace their path back through categories.
- **Banner Integration**: Allows for the inclusion of promotional banners with links, enhancing marketing opportunities within the listing.
- **Custom Styling Options**: Provides flexibility in styling through props like imageBackgroundColor, aspectRatio, and custom components for wishlist icons.

## Usage

To use the `ProductListing` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import ProductListing from 'fdk-react-templates/pages/product-listing/product-listing.js';
import EmptyState from './EmptyState';
import SortModal from './SortModal';
import FilterModal from './FilterModal';

const App = () => {
  const products = [
    { id: 1, name: 'Product 1', price: 29.99 },
    { id: 2, name: 'Product 2', price: 19.99 },
    // ...more products
  ];

  return (
    <ProductListing
      breadcrumb={[{ label: 'Home', link: '/' }, { label: 'Products', link: '/products' }]}
      isProductCountDisplayed={true}
      productCount={products.length}
      title="Product Listing"
      description="Browse our selection of products."
      filterList={[{ label: 'Category', options: ['Electronics', 'Books', 'Clothing'] }]}
      selectedFilters={['Electronics']}
      sortList={[{ label: 'Price', value: 'price' }, { label: 'Popularity', value: 'popularity' }]}
      loadingOption="pagination"
      paginationProps={{ currentPage: 1, totalPages: 10 }}
      isProductLoading={false}
      isPageLoading={false}
      productList={products}
      columnCount={{ desktop: 4, tablet: 3, mobile: 1 }}
      isProductOpenInNewTab={true}
      isBrand={true}
      isSaleBadge={true}
      isPrice={true}
      imagePlaceholder="https://example.com/placeholder.png"
      aspectRatio="16:9"
      isWishlistIcon={true}
      followedIdList={[1, 2]}
      listingPrice="range"
      banner={{ image: 'https://example.com/banner.jpg', link: '/banner-link' }}
      onColumnCountUpdate={(count) => console.log('Column count updated to:', count)}
      onResetFiltersClick={() => console.log('Filters reset')}
      onFilterUpdate={(filters) => console.log('Filters updated:', filters)}
      onSortUpdate={(sort) => console.log('Sort updated:', sort)}
      onFilterModalBtnClick={() => console.log('Filter modal opened')}
      onSortModalBtnClick={() => console.log('Sort modal opened')}
      onWishlistClick={(productId) => console.log('Wishlist clicked for product:', productId)}
      onViewMoreClick={() => console.log('View more clicked')}
      onLoadMoreProducts={() => console.log('Load more products clicked')}
      EmptyStateComponent={EmptyState}
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

## Configuration

The `ProductListing` component can be configured using the following settings:

```json
{
  "props": [
    {
      "type": "checkbox",
      "id": "product_number",
      "label": "Show product numbers",
      "default": true
    },
    {
      "id": "loading_options",
      "type": "select",
      "options": [
        {
          "value": "view_more",
          "text": "View More"
        },
        {
          "value": "infinite",
          "text": "Infinite Loading"
        },
        {
          "value": "pagination",
          "text": "Pagination"
        }
      ],
      "default": "infinite",
      "label": "Loading Options"
    },
    {
      "type": "checkbox",
      "id": "back_top",
      "label": "Show back to top button",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "in_new_tab",
      "label": "Open product in new tab",
      "default": true,
      "info": "Open product in new tab for desktop"
    },
    {
      "type": "checkbox",
      "id": "hide_brand",
      "label": "Hide Brand Name",
      "default": false,
      "info": "Check to hide Brand name"
    },
    {
      "id": "grid_desktop",
      "type": "select",
      "options": [
        {
          "value": "desktop-grid-4",
          "text": "4 Cards"
        },
        {
          "value": "desktop-grid-2",
          "text": "2 Cards"
        }
      ],
      "default": "desktop-grid-4",
      "label": "Default grid layout desktop"
    },
    {
      "id": "grid_tablet",
      "type": "select",
      "options": [
        {
          "value": "tablet-grid-3",
          "text": "3 Cards"
        },
        {
          "value": "tablet-grid-2",
          "text": "2 Cards"
        }
      ],
      "default": "tablet-grid-3",
      "label": "Default grid layout tablet"
    },
    {
      "id": "grid_mob",
      "type": "select",
      "options": [
        {
          "value": "mob-grid-2",
          "text": "2 Cards"
        },
        {
          "value": "mob-grid-1",
          "text": "1 Card"
        }
      ],
      "default": "mob-grid-1",
      "label": "Default grid layout mobile"
    },
    {
      "id": "description",
      "type": "textarea",
      "default": "",
      "label": "Description"
    },
    {
      "type": "extension",
      "id": "extension",
      "label": "Extension Positions",
      "info": "Handle extension in these positions",
      "positions": [
        {
          "value": "bottom_left_corner",
          "text": "Bottom left corner of image"
        }
      ],
      "default": {}
    }
  ]
}
```

This README provides a detailed overview of the `ProductListing` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
