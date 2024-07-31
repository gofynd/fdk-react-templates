# ProductListing Component

## Overview

The `ProductListing` component is a part of the FDK React Templates library. It is designed to display a list of products with various features such as sorting, filtering, and pagination. The component leverages several utilities and components from the `fdk-core` package to provide a robust and flexible product listing page.

## Features

- **Dynamic Product Listing:** Automatically fetches and displays a list of products.
- **Sorting and Filtering:** Provides options to sort products and apply filters.
- **Responsive Design:** Supports different grid layouts for desktop, tablet, and mobile views.
- **Pagination:** Includes pagination controls to navigate through product pages.
- **Loading States:** Displays a loader during API requests and shows a "No Products Found" message if no products are available.

## Usage

To use the `ProductListing` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import ProductListing from "fdk-react-templates/Astra/pages/product-listing/product-listing.js";
import Loader from "./path-to-your-loader/Loader";
import PageNotFound from "./path-to-your-page-not-found/PageNotFound";

const App = () => {
  return (
    <div>
      <ProductListing Loader={Loader} PageNotFound={PageNotFound} />
    </div>
  );
};

APP.serverFetch = ProductListing.serverFetch

export default App;
```

### Props

- **Loader**: A component to display while data is loading.
- **PageNotFound**: A component to display when no products are found.

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

### Functions

- **updateSelection**: Updates the current sort selection and navigates to the updated URL.
- **updateFilterQuery**: Updates the filter query parameters and refreshes the product list.
- **resetFilters**: Resets all applied filters.
- **getPaginationValue**: Computes the pagination values based on the current page and total items.

---

This README provides a detailed overview of the `ProductListing` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.