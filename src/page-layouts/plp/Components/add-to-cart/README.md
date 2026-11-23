# AddToCart Component

## Overview
The `AddToCart` component handles the display of product details, including images, variants, sizes, price, and the ability to add a product to the cart or proceed to checkout.

## Features
- **Product Information Display**: Displays product name, brand, price, short description, and images.
- **Size Selection**: Allows users to select a size, with options for size block display or dropdown.
- **Buy Now and Add to Cart Buttons**: Provides buttons to add the product to the cart or proceed to checkout based on configuration.
- **Loading State**: Displays a loading indicator while the product data is being fetched.
- **Size Guide**: Optionally displays a size guide for the product.
- **Delivery Information**: Displays delivery-related details for the product.
- **Product Availability**: Displays availability based on stock and custom order conditions.


## Usage
To use the `AddToCart` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from "react";
import AddToCart from "fdk-react-templates/page-layouts/plp/Components/add-to-cart/add-to-cart";
import "fdk-react-templates/page-layouts/plp/Components/add-to-cart/add-to-cart.css";

const App = () => {
  const [selectedSize, setSelectedSize] = useState("");

  const handleSizeSelection = (size) => {
    setSelectedSize(size?.value);
  };

  const productData = {
    product: {
      brand: {
        name: "KAARAH BY KAAVYA",
        uid: 3352,
      },
      color: null,
      item_code: "KR-265",
      item_type: "standard",
      has_variant: false,
      uid: 8688863,
      custom_config: {
        _app: {},
      },
      media: [
        {
          alt: "Pink Co-Ordinate Set With a Front Tie -up",
          meta: null,
          type: "image",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/3bFMfDlUu-Pink-Co-Ordinate-Set-With-a-Front-Tie-up.jpeg",
        },
        {
          alt: "Pink Co-Ordinate Set With a Front Tie -up",
          meta: null,
          type: "image",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/z5WitxUbw-Pink-Co-Ordinate-Set-With-a-Front-Tie-up.jpeg",
        },
        {
          alt: "Pink Co-Ordinate Set With a Front Tie -up",
          meta: null,
          type: "image",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/oKJkaYpFZ-Pink-Co-Ordinate-Set-With-a-Front-Tie-up.jpeg",
        },
      ],
      sizes: {
        discount: "42% OFF",
        multi_size: true,
        sellable: true,
        size_chart: {
          description: null,
          headers: {
            col_1: {
              convertable: false,
              value: "SIZE",
            },
            col_2: {
              convertable: true,
              value: "CHEST",
            },
            col_3: {
              convertable: true,
              value: "WAIST",
            },
            col_4: {
              convertable: true,
              value: "HIP",
            },
            col_5: {
              convertable: true,
              value: "SHOULDER",
            },
            col_6: {
              convertable: true,
              value: "ARMHOLE",
            },
          },
          image:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/size-guide/free/original/ABVHMHWT_-Logo.jpeg",
          size_tip: "",
          sizes: [
            {
              col_1: "XS",
              col_2: "36",
              col_3: "33",
              col_4: "39",
              col_5: "13.5",
              col_6: "15",
            },
            {
              col_1: "S",
              col_2: "38",
              col_3: "35",
              col_4: "41",
              col_5: "14",
              col_6: "15",
            },
            {
              col_1: "M",
              col_2: "40",
              col_3: "37",
              col_4: "43",
              col_5: "14.5",
              col_6: "16",
            },
            {
              col_1: "L",
              col_2: "43",
              col_3: "40",
              col_4: "46",
              col_5: "15",
              col_6: "17",
            },
            {
              col_1: "XL",
              col_2: "46",
              col_3: "43",
              col_4: "49",
              col_5: "16",
              col_6: "18.5",
            },
          ],
          title: "KAARAH WOMEN CLOTHING",
          unit: "in",
        },
        sizes: [
          {
            dimension: {
              height: 5,
              is_default: true,
              length: 44,
              unit: "cm",
              width: 40,
            },
            display: "XL",
            is_available: true,
            quantity: 7,
            seller_identifiers: ["KR-265"],
            value: "XL",
            weight: {
              is_default: true,
              shipping: 300,
              unit: "gram",
            },
          },
        ],
        stores: {
          count: 1,
        },
        price: {
          effective: {
            currency_code: "INR",
            currency_symbol: "₹",
            max: 8950,
            min: 8950,
          },
          marked: {
            currency_code: "INR",
            currency_symbol: "₹",
            max: 15450,
            min: 15450,
          },
        },
      },
      custom_order: {
        is_custom_order: true,
        manufacturing_time: 3,
        manufacturing_time_unit: "days",
      },
      description:
        "<p>Pink co-ordinate set with organza on the sleeves.There is a separate belt which has hand work on it .The top is chanderi silk &amp; pants are modal satin.<br /><br /></p>",
      discount: null,
      moq: {
        increment_unit: 1,
        maximum: null,
        minimum: 1,
      },
      name: "Pink Co-Ordinate Set With a Front Tie -up",
      net_quantity: {
        unit: null,
        value: null,
      },
      price: null,
      rating: null,
      rating_count: null,
      seo: {
        description: "Pink Co-Ordinate Set With a Front Tie -up",
        title: "Pink Co-Ordinate Set With a Front Tie -up",
      },
      short_description: "Pink Co-Ordinate Set With a Front Tie -up",
      slug: "pink-co-ordinate-set-with-a-front-tie-up-8688863",
      type: "product",
      variants: [],
      action: null,
    },
    productPrice: {
      article_id: "20584_KR-265",
      discount: "42% OFF",
      is_cod: true,
      is_gift: false,
      item_type: "standard",
      long_lat: [{}, {}],
      pincode: 400098,
      quantity: 7,
      seller_count: null,
      special_badge: null,
      price_per_piece: {
        currency_code: "INR",
        currency_symbol: "₹",
        effective: 8950,
        marked: 15450,
        selling: 8950,
      },
      price: {
        currency_code: "INR",
        currency_symbol: "₹",
        effective: 8950,
        marked: 15450,
        selling: 8950,
      },
      price_per_unit: {
        currency_code: "INR",
        currency_symbol: "₹",
        price: 8950,
        unit: "nos",
      },
      seller: {
        count: null,
        name: "Theme Marketplace Websites - Kanchan (DNT)",
        uid: 5178,
      },
      set: null,
      store: {
        uid: 20584,
        name: "Astra Location 1",
        count: 1,
      },
      article_assignment: {
        level: "multi-companies",
        strategy: "optimal",
      },
      delivery_promise: {
        max: null,
        min: null,
      },
    },
  };

  const deliveryInfoProps = {
    pincode: "123456",
    tat: {
      max: null,
      min: null,
    },
    selectPincodeError: false,
    pincodeErrorMessage: "",
  };

  return (
    <AddToCart
      isLoading={false}
      productData={productData}
      pdpPageConfig={{
        variants: true,
        tax_label: "Price inclusive of all tax",
        item_code: true,
        product_details_bullets: true,
        show_size_guide: true,
        show_offers: true,
        hide_single_size: false,
        size_selection_style: "dropdown",
        variant_position: "accordion",
        mandatory_pincode: true,
        preselect_size: true,
      }}
      slug="pink-co-ordinate-set-with-a-front-tie-up-8688863"
      selectedSize={selectedSize}
      onSizeSelection={handleSizeSelection}
      addProductForCheckout={(event, size, isBuyNow) => {
        // Add product to cart or checkout logic
      }}
      deliveryInfoProps={deliveryInfoProps}
    />
  );
};

export default App;

```
### Props
- **isLoading** (boolean, optional): Shows a loading indicator while the product data is being fetched. Defaults to `false`.
- **productData** (object, optional): Contains product data like `product`, `productPrice`, etc.
- **globalConfig** (object, optional): Global configuration for the product display.
- **pdpPageConfig** (object, optional): Page-specific configuration for the product display.
- **slug** (string, optional): The product slug used for identifying the product.
- **selectedSize** (string, optional): The currently selected size of the product.
- **showSizeDropdown** (boolean, optional): Controls whether the size dropdown is visible. Defaults to `false`.
- **deliverInfoProps** (object, optional): Props for the delivery info component.
- **sizeError** (boolean, optional): Displays an error if no size is selected.
- **handleSlugChange** (function, optional): Function to handle changes to the product slug.
- **onSizeSelection** (function, optional): Function to handle size selection.
- **handleShowSizeGuide** (function, optional): Function to handle the display of the size guide.
- **setShowSizeDropdown** (function, optional): Function to toggle the visibility of the size dropdown.
- **addProductForCheckout** (function, optional): Function to add the product to the cart or proceed to checkout.
- **handleViewMore** (function, optional): Function to handle the display of full product details.
- **handleClose** (function, optional): Function to close the component.

```
This README provides a detailed overview of the `AddToCart` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.