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
import React from "react";
import ProductListing from "fdk-react-templates/pages/product-listing/product-listing";
import "fdk-react-templates/pages/product-listing/index.css";

const App = () => {
  const props = {
    globalConfig: {},
    productCount: 1,
    imageBackgroundColor: "#FAFAFA",
    imagePlaceholder: "placeholder.png",
    isBrand: true,
    isHdimgUsed: false,
    isImageFill: true,
    isPageLoading: false,
    isPrice: true,
    isProductCountDisplayed: true,
    isProductLoading: false,
    isProductOpenInNewTab: false,
    isResetFilterDisable: true,
    isSaleBadge: true,
    isScrollTop: true,
    isWishlistIcon: true,
    showAddToCart: true,
    listingPrice: "range",
    loadingOption: "pagination",
    onColumnCountUpdate: () => {},
    onFilterModalBtnClick: () => {},
    onFilterUpdate: () => {},
    onLoadMoreProducts: () => {},
    onResetFiltersClick: () => {},
    onSortModalBtnClick: () => {},
    onSortUpdate: (value) => {},
    onViewMoreClick: () => {},
    onWishlistClick: (data) => {},
    addToCartModalProps: {
      isOpen: false,
      isLoading: false,
      productData: {
        product: {},
        productPrice: {},
      },
      pdpPageConfig: {},
      slug: "",
      selectedSize: "",
      showSizeDropdown: false,
      showSizeGuide: false,
      sizeError: false,
      deliverInfoProps: {
        pincode: "",
        selectPincodeError: false,
        pincodeErrorMessage: "",
        fpi: {
          PaymentGateways: {},
          store: {
            liftedStore: {},
          },
          domain: "http://127.0.0.1:5001",
          authorizationHeader:
            "Bearer NjY4NzY1ZTFjOTg0MDE2ZDc4MjIyYTIxOm1pcHNleFVFWA==",
          getters: {},
          custom: {},
          theme: {},
          payment: {},
        },
      },
    },
    filterModalProps: {
      isOpen: false,
      filters: [
        {
          key: {
            display: "Department",
            kind: "multivalued",
            logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/department.png",
            name: "department",
          },
          values: [
            {
              count: 399,
              currency_code: null,
              currency_symbol: null,
              display: "Fashion",
              display_format: null,
              is_selected: false,
              max: null,
              min: null,
              query_format: null,
              selected_max: null,
              selected_min: null,
              value: "fashion",
            },
          ],
        },
      ],
      onApplyBtnClick: () => {},
      onCloseModalClick: () => {},
      onFilterUpdate: () => {},
      onResetBtnClick: () => {},
    },
    filterList: [
      {
        isOpen: true,
        key: {
          display: "Department",
          kind: "multivalued",
          logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/department.png",
          name: "department",
        },
        values: [
          {
            count: 399,
            currency_code: null,
            currency_symbol: null,
            display: "Fashion",
            display_format: null,
            is_selected: true,
            max: null,
            min: null,
            query_format: null,
            selected_max: null,
            selected_min: null,
            value: "fashion",
          },
        ],
      },
    ],
    selectedFilters: [
      {
        key: {
          display: "Department",
          kind: "multivalued",
          logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/department.png",
          name: "department",
        },
        values: [
          {
            count: 399,
            currency_code: null,
            currency_symbol: null,
            display: "Fashion",
            display_format: null,
            is_selected: true,
            max: null,
            min: null,
            query_format: null,
            selected_max: null,
            selected_min: null,
            value: "fashion",
          },
        ],
      },
    ],
    paginationProps: {
      current: 1,
      hasNext: true,
      hasPrevious: false,
      prevPageLink: "",
      nextPageLink: "/products?page_no=2",
      pages: [
        {
          link: "/products?page_no=1",
          index: 1,
        },
        {
          link: "/products?page_no=2",
          index: 2,
        },
        {
          link: "/products?page_no=3",
          index: 3,
        },
        {
          link: "/products?page_no=4",
          index: 4,
        },
        {
          link: "/products?page_no=5",
          index: 5,
        },
      ],
    },
    banner: {
      desktopBanner:
        "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/company/5178/applications/668765e1c984016d78222a21/theme/pictures/free/original/theme-image-1729075185068.jpeg",
      mobileBanner:
        "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/company/5178/applications/668765e1c984016d78222a21/theme/pictures/free/original/theme-image-1731395820966.jpeg",
      redirectLink: "https://glam.fynd.io/categories",
    },
    sortModalProps: {
      isOpen: false,
      sortList: [
        {
          display: "Latest Products",
          is_selected: true,
          logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/latest-products.png",
          name: "Latest Products",
          value: "latest",
        },
        {
          display: "Popularity",
          is_selected: false,
          logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/popular.png",
          name: "Popularity",
          value: "popular",
        },
        {
          display: "Price Low to High",
          is_selected: false,
          logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/price-asc.png",
          name: "Price Low to High",
          value: "price_asc",
        },
      ],
      onResetBtnClick: () => {},
      onCloseModalClick: () => {},
      onApplyBtnClick: () => {},
    },
    productList: [
      {
        brand: {
          name: "Naksh Jaipur",
        },
        price: {
          effective: {
            currency_code: "INR",
            currency_symbol: "₹",
            max: 2850,
            min: 2850,
          },
          marked: {
            currency_code: "INR",
            currency_symbol: "₹",
            max: 2850,
            min: 2850,
          },
        },
        media: [
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
        ],
        variants: [],
        slug: "naksh-off-white-straight-kurta-and-dupatta-set-of-2-11651220",
        uid: 11651220,
        sellable: true,
        teaser_tag: "Hand Block Printed",
        discount: "",
        name: "Naksh Off-White Straight Kurta And Dupatta (Set of 2)",
      },
    ],
    sortList: [
      {
        display: "Latest Products",
        is_selected: true,
        logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/latest-products.png",
        name: "Latest Products",
        value: "latest",
      },
      {
        display: "Popularity",
        is_selected: false,
        logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/popular.png",
        name: "Popularity",
        value: "popular",
      },
      {
        display: "Price Low to High",
        is_selected: false,
        logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/misc/default-assets/original/price-asc.png",
        name: "Price Low to High",
        value: "price_asc",
      },
    ],
  };

  return <ProductListing {...props} />;
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
- **showAddToCart**: A boolean indicating whether to show add to cart. Defaults to false.
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

### Page Configuration

This configuration allows you to customize the **Product Listing Page** on the Fynd platform. It controls the layout, appearance, and behavior of the product grid, banners, and other product-related features.

| **Configuration**             | **Type**       | **Default Value**  | **Description**                                                                                   |
|-------------------------------|----------------|--------------------|---------------------------------------------------------------------------------------------------|
| `desktop_banner`              | `image_picker` | `""`               | Upload the banner image for desktop view. This image is displayed on the product listing page.     |
| `mobile_banner`               | `image_picker` | `""`               | Upload the banner image for mobile view. This image is displayed on the product listing page for mobile users. |
| `banner_link`                 | `url`          | `""`               | Specify the URL to redirect users when they click on the banner image.                            |
| `product_number`              | `checkbox`     | `true`             | Enable or disable displaying product numbers on the product listing page.                         |
| `loading_options`             | `select`       | `pagination`       | Sets the loading style for product content. Options: **View More**, **Infinite Loading**, or **Pagination**. |
| `back_top`                    | `checkbox`     | `true`             | Enable or disable the "Back to Top" button on the product listing page.                           |
| `in_new_tab`                  | `checkbox`     | `true`             | Enables or disables opening product links in a new tab for desktop users.                         |
| `hide_brand`                  | `checkbox`     | `false`            | Hide or show the brand name on the product listing page.                                          |
| `grid_desktop`                | `select`       | `4`                | Sets the default grid layout for desktop. Options: **4 Cards** or **2 Cards**.                    |
| `grid_tablet`                 | `select`       | `3`                | Sets the default grid layout for tablet. Options: **3 Cards** or **2 Cards**.                     |
| `grid_mob`                    | `select`       | `1`                | Sets the default grid layout for mobile. Options: **2 Cards** or **1 Card**.                      |
| `description`                 | `textarea`     | `""`               | Adds a description for the product listing page.                                                  |

#### Steps to Modify Page Configuration via Fynd Platform

1. **Log in to the Fynd Platform:**
   - Go to [Fynd Platform](https://platform.fynd.com) and log in with your credentials.

2. **Navigate to Your Company:**
   - Once logged in, select your company from the list.

3. **Select the Theme:**
   - In the sidebar, under **Sales Channel**, select your sales channel.
   - Then, under **Appearance**, click on **Themes**.
   - In the current theme, click on **Edit**. Here, you can preview and configure the theme.  
     Here's a sample [theme](https://platform.fynd.com/company/5178/application/668765e1c984016d78222a21/themes/668768e7e21c099a562b5d56/edit).

4. **Navigate to the Page Configuration:**
   - Within the theme editor, navigate to the **Product Listing Page**.
   - You can use the dropdown on the top to select the desired page.
   - Under the **Configuration** section, locate and click on the **Page** settings for the Product Listing Page.

5. **Modify Page Configurations:**
   - Adjust the settings for the Product Listing Page based on your requirements:
     - Upload desktop and mobile banner images.
     - Set the `banner_link` to redirect users to a specific URL.
     - Configure product grid layouts for desktop, tablet, and mobile.
     - Adjust loading options, such as pagination style or infinite scrolling.
     - Enable/disable product number display, back to top button, and other options as needed.

6. **Preview Changes:**
   - Preview the updates made to the page in real-time to ensure they look and function as expected.

7. **Save and Publish:**
   - After confirming your changes, click on **Save**. This will publish the updated configurations for the Product Listing Page.

8. **Test Your Storefront:**
   - Visit your store's live URL and navigate to the Product Listing Page to confirm the changes are reflected and working as intended.

By following these steps, you can easily customize the Product Listing Page configuration to suit your business needs.

```
This README provides a detailed overview of the `ProductListing` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
