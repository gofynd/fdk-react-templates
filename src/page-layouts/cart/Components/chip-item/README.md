# ChipItem Component

## Overview
The `ChipItem` component represents an individual item in a shopping cart, displaying relevant details such as the product image, name, size, quantity control, price, and promotional offers. It also allows users to update the cart, change sizes, and view promotional details.

## Features
- **Display Product Details**: Shows product image, brand, name, size, and price.
- **Quantity Control**: Users can increase or decrease the item quantity.
- **Size Selection**: Users can select a size for the product if applicable.
- **Promotional Offers**: Displays applied promotions and offers a modal for details.
- **Error Handling**: Provides feedback for quantity limits and stock availability.

## Usage
To use the `ChipItem` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React, { useState } from "react";
import ChipItem from "fdk-react-templates/page-layouts/cart/Components/chip-item/chip-item";
import "fdk-react-templates/page-layouts/cart/Components/chip-item/chip-item.css";

const App = () => {
  const [sizeModal, setSizeModal] = useState(null);
  const [currentSizeModalSize, setCurrentSizeModalSize] = useState(null);

  const itemDetails = {
    bulk_offer: {},
    coupon_message: "",
    custom_order: {
      manufacturing_time: 0,
      manufacturing_time_unit: "days",
      is_custom_order: false,
    },
    discount: "2% OFF",
    is_set: false,
    key: "10160451_8",
    message: "",
    moq: {
      minimum: 1,
    },
    parent_item_identifiers: {
      identifier: null,
      parent_item_size: null,
      parent_item_id: null,
    },
    product_ean_id: null,
    quantity: 1,
    availability: {
      deliverable: true,
      is_valid: true,
      other_store_quantity: 1,
      out_of_stock: false,
      sizes: ["8", "9", "10"],
      available_sizes: [
        {
          display: "8",
          is_available: true,
          value: "8",
        },
        {
          display: "9",
          is_available: true,
          value: "9",
        },
        {
          display: "10",
          is_available: true,
          value: "10",
        },
      ],
    },
    article: {
      _custom_json: {},
      cart_item_meta: {},
      extra_meta: {},
      gift_card: {
        gift_price: 0,
        display_text: "",
        is_gift_applied: false,
      },
      identifier: {
        sku_code: "GR1238",
      },
      is_gift_visible: false,
      meta: {},
      mto_quantity: 0,
      parent_item_identifiers: null,
      product_group_tags: null,
      quantity: 99997,
      seller_identifier: "GR1238",
      size: "8",
      tags: [],
      uid: "66ea694423f059fcebf1658b",
      seller: {
        name: "Theme Marketplace Websites - Kanchan (DNT)",
        uid: 5178,
      },
      price: {
        base: {
          currency_code: "INR",
          currency_symbol: "₹",
          effective: 73000,
          marked: 75000,
        },
        converted: {
          currency_code: "INR",
          currency_symbol: "₹",
          effective: 73000,
          marked: 75000,
        },
      },
    },
    price_per_unit: {
      base: {
        currency_code: "INR",
        currency_symbol: "₹",
        effective: 73000,
        marked: 75000,
        selling_price: 73000,
      },
      converted: {
        currency_code: "INR",
        currency_symbol: "₹",
        effective: 73000,
        marked: 75000,
        selling_price: 73000,
      },
    },
    product: {
      _custom_json: {},
      attributes: {
        essential: "Yes",
        gender: ["Women", "Girls"],
        primary_color: "White",
        "generic-name": "Generic Name",
        primary_material: "Platinum",
        care_instructions: "Care Instructions",
        "net-quantity": "1 N",
        "diamond-weight": "1.5 Carat - 7.3 mm",
        "colour-stone-weight": "Colour Stone Weight",
        "colour-stone-name": "Colour Stone Name",
        "marketer-name": "Varniya",
        "marketer-address": "Juhu, Mumbai",
        name: "Gabriella Diamond Ring Twenty Four",
        "custom-attribute-1": "Custom Attribute 1",
        "custom-attribute-2": "Custom Attribute 2",
        "custom-attribute-3": "Custom Attribute 3",
        "custom-attribute-4": "Custom Attribute 4",
        "custom-attribute-5": "Custom Attribute 5",
        "metal-purity": "18K White Gold",
        "diamond-quality": "VVS2 - E",
        brand_name: "Varniya",
        primary_color_hex: "FFFFFF",
      },
      item_code: "GR123",
      name: "Gabriella Diamond Ring Twenty Four",
      slug: "gabriella-diamond-ring-10160410-10160451",
      tags: [],
      type: "product",
      uid: 10160451,
      brand: {
        name: "Varniya",
        uid: 7911,
      },
      action: {
        type: "page",
        url: "https://api.fynd.com/platform/content/v1/products/gabriella-diamond-ring-10160410-10160451/",
      },
      categories: [
        {
          name: "Rings",
          uid: 223,
        },
      ],
      images: [
        {
          aspect_ratio: "16:25",
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/tzT736EDl-Gabriella-Diamond-Ring.webp",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/tzT736EDl-Gabriella-Diamond-Ring.webp",
        },
        {
          aspect_ratio: "16:25",
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/YocX5bD5b-1239148.png",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/YocX5bD5b-1239148.png",
        },
        {
          aspect_ratio: "16:25",
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/TP_MHJugj-Gabriella-Diamond-Ring-Twenty-Four.gif",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/TP_MHJugj-Gabriella-Diamond-Ring-Twenty-Four.gif",
        },
        {
          aspect_ratio: "16:25",
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/hyYae0D4i-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/hyYae0D4i-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
        },
        {
          aspect_ratio: "16:25",
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/ylC9OZeK_-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/ylC9OZeK_-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
        },
        {
          aspect_ratio: "16:25",
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/r5BZnmmI6-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/r5BZnmmI6-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
        },
        {
          aspect_ratio: "16:25",
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/nqh2uGyLr-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/nqh2uGyLr-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
        },
        {
          aspect_ratio: "16:25",
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/6zACyJCbR-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
          url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/6zACyJCbR-Gabriella-Diamond-Ring-Twenty-Four.jpeg",
        },
      ],
    },
    promo_meta: {
      message: null,
    },
    promotions_applied: [],
    charges: [],
    coupon: {
      code: null,
      discount_single_quantity: null,
      discount_total_quantity: null,
    },
    identifiers: {
      identifier: "SpQAQA5bSna85MHNLvtq4A",
    },
    price: {
      base: {
        currency_code: "INR",
        currency_symbol: "₹",
        effective: 73000,
        marked: 75000,
      },
      converted: {
        currency_code: "INR",
        currency_symbol: "₹",
        effective: 73000,
        marked: 75000,
      },
    },
    delivery_promise: {
      formatted: null,
      timestamp: null,
      iso: null,
    },
  };

  const handleUpdate = (newDetails) => {
    console.log("Update cart with:", newDetails);
  };

  const cartItemsWithActualIndex = [itemDetails];
  const singleItem = itemDetails;
  const isPromoModalOpen = false;
  const cartItems = { "10160451_8": itemDetails };

  const handleRemove = () => {
    console.log("Item removed");
  };

  const handleOpenPromoModal = () => {
    console.log("Promo modal opened");
  };

  const handleClosePromoModal = () => {
    console.log("Promo modal closed");
  };

  return (
    <ChipItem
      isCartUpdating={false}
      singleItemDetails={itemDetails}
      onUpdateCartItems={handleUpdate}
      currentSize="M"
      itemIndex={0}
      sizeModalItemValue={cartItems[sizeModal]}
      currentSizeModalSize={currentSizeModalSize}
      setCurrentSizeModalSize={setCurrentSizeModalSize}
      setSizeModal={setSizeModal}
      productImage={itemDetails?.product?.images[0]?.url}
      sizeModal={sizeModal}
      cartItems={cartItems}
      cartItemsWithActualIndex={cartItemsWithActualIndex}
      singleItem={singleItem}
      isPromoModalOpen={isPromoModalOpen}
      onRemoveIconClick={handleRemove}
      onOpenPromoModal={handleOpenPromoModal}
      onClosePromoModal={handleClosePromoModal}
    />
  );
};

export default App;

```

### Props
- **isCartUpdating** (boolean, optional): Indicates if the cart is currently being updated.
- **singleItemDetails** (object): Details of the product item including availability, price, and promotions.
- **onUpdateCartItems** (function): Function to update the cart with new item details.
- **currentSize** (string): The currently selected size of the item.
- **productImage** (string): URL of the product image.
- **itemIndex** (number): The index of the item in the cart.
- **sizeModalItemValue** (object): The value for the size modal, containing product details.
- **currentSizeModalSize** (string): The size currently selected in the size modal.
- **setCurrentSizeModalSize** (function): Function to set the current size in the size modal.
- **setSizeModal** (function): Function to toggle the visibility of the size modal.
- **sizeModal** (boolean): Indicates if the size modal is open.
- **cartItems** (array): Array of items in the cart.
- **cartItemsWithActualIndex** (array): Array of items with their actual indices.
- **singleItem** (object): The single item being represented.
- **isPromoModalOpen** (boolean): Indicates if the promotional modal is open.
- **onRemoveIconClick** (function, optional): Callback function when the remove icon is clicked.
- **onOpenPromoModal** (function): Function to open the promotional modal.
- **onClosePromoModal** (function): Function to close the promotional modal.

```
This README provides a detailed overview of the `ChipItem` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.

