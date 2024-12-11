# SharedCart Component

## Overview

The `SharedCart` component displays a user's shared cart items along with applied coupons, allowing them to view cart items before merging or adding them to their personal bag. It enhances the e-commerce experience by providing a clear overview of items in the shared cart.

## Features

- **Item Display**: Shows all items in the shared cart along with their details.
- **Coupons Display**: Displays applied coupons 
- **Merge/Add Options**: Offers buttons to either merge the shared cart with the user's bag or add items to the bag directly.

## Usage

To use the `SharedCart` component, import it into your React application and provide the required props.

### Example

```jsx
import React, { useMemo } from "react";
import SharedCart from "fdk-react-templates/pages/shared-cart";
import "fdk-react-templates/pages/shared-cart/shared-cart.css";

const App = () => {
  const sharedCart = {
    buy_now: false,
    id: "6746d7678af22de12cb08854",
    restrict_checkout: false,
    uid: "52910112",
    breakup_values: {
      coupon: {
        code: "",
        coupon_type: "cart",
        coupon_value: 0,
        description: "",
        is_applied: false,
        message: "Sorry! Invalid coupon",
        minimum_cart_value: 0,
        sub_title: "",
        title: "",
        type: "cash",
        uid: null,
        value: 0,
      },
      display: [
        {
          currency_code: "INR",
          currency_symbol: "₹",
          display: "Total MRP",
          key: "mrp_total",
          message: [],
          value: 1000,
          preset: null,
        },
        {
          currency_code: "INR",
          currency_symbol: "₹",
          display: "Discount",
          key: "discount",
          message: [],
          value: -501,
          preset: null,
        },
        {
          currency_code: "INR",
          currency_symbol: "₹",
          display: "Subtotal",
          key: "subtotal",
          message: [],
          value: 499,
          preset: null,
        },
        {
          currency_code: "INR",
          currency_symbol: "₹",
          display: "Delivery Charge",
          key: "delivery_charge",
          message: [
            "Delivery charges applicable ₹10.00 on order upto ₹100.00",
            "Delivery charges applicable ₹500.00 on order upto ₹20,000.00",
            "Free delivery on order above ₹20,000.00",
          ],
          value: 500,
          preset: null,
        },
        {
          currency_code: "INR",
          currency_symbol: "₹",
          display: "Total",
          key: "total",
          message: [],
          value: 999,
          preset: null,
        },
      ],
    },
    items: [
      {
        discount: "50% OFF",
        key: "12232398_OS",
        quantity: 1,
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
            sku_code: "CAK1",
          },
          is_gift_visible: false,
          meta: {},
          mto_quantity: 0,
          parent_item_identifiers: null,
          product_group_tags: null,
          quantity: 81,
          seller_identifier: "CAK1",
          size: "OS",
          tags: [],
          type: "article",
          uid: "66ed3efad1d1bcf044aee7ac",
          seller: {
            name: "Theme Marketplace Websites - Kanchan (DNT)",
            uid: 5178,
          },
          store: {
            name: "Coffee",
            store_code: "Coffee-01",
            uid: 83611,
          },
        },
        availability: {
          deliverable: true,
          is_valid: true,
          other_store_quantity: 1,
          out_of_stock: false,
          sizes: ["OS"],
        },
        product: {
          attributes: {
            essential: "Yes",
            "net-quantity": "1 N",
            "marketer-name": "Flash",
            "marketer-address": "India",
            name: "Pound Cake",
            brand_name: "Flashh",
          },
          item_code: "123255",
          name: "Pound Cake",
          slug: "pound-cake-12232398",
          type: "product",
          uid: 12232398,
          brand: {
            name: "Flashh",
            uid: 2644,
          },
          images: [
            {
              secure_url:
                "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/zOqYcp92J-HIGHRESPoundCakeCloseUp-Square.jpg",
              url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/zOqYcp92J-HIGHRESPoundCakeCloseUp-Square.jpg",
            },
          ],
        },
        price: {
          converted: {
            add_on: 499,
            currency_code: "INR",
            currency_symbol: "₹",
            effective: 499,
            marked: 1000,
            selling: 499,
          },
        },
      },
    ],
    shared_cart_details: {
      created_on: "2024-11-27T11:06:34.455000",
      meta: {},
      source: {
        user_agent: "axios/1.7.7",
      },
      token: "5NLkpeIt",
      user: {
        user_id: "66b31ef6b66f0bfc4df55f74",
        is_anonymous: false,
      },
    },
  };

  const bagItems = useMemo(() => {
    if (sharedCart && sharedCart?.items) {
      const allItems = sharedCart.items.map((item, index) => ({
        ...item,
        item_index: index,
      }));
      // return allItems;
      /* eslint no-param-reassign: "error" */
      const grpBySameSellerAndProduct = allItems.reduce((result, item) => {
        result[
          `${item.article.seller.uid}${item.article.store.uid}${item.product.uid}`
        ] = (
          result[
            `${item.article.seller.uid}${item.article.store.uid}${item.product.uid}`
          ] || []
        ).concat(item);
        return result;
      }, []);

      const updateArr = [];
      Object.entries(grpBySameSellerAndProduct).forEach(([key, value]) => {
        updateArr.push({
          item: value[0],
          articles: value,
        });
      });
      return updateArr;
    }
    return [];
  }, [sharedCart]);

  const handleMergeBagClick = () => {
    console.log("Merging bags...");
  };

  const handleAddToBagClick = () => {
    console.log("Adding to bag...");
  };

  return (
    <SharedCart
      sharedCartData={sharedCart}
      bagItems={bagItems}
      showReplaceBtn={true}
      onMergeBagClick={handleMergeBagClick}
      onAddToBagClick={handleAddToBagClick}
      onReplaceBagClick={() => console.log("Replacing bag...")}
    />
  );
};

export default App;

```

## Props

- **sharedCartData**: An object containing shared cart details, including items and coupon information.
- **bagItems**: An array of items derived from sharedCartItems.
- **showReplaceBtn**: A boolean indicating if the replace button should be shown.
- **onMergeBagClick**: A function triggered when the "Merge Bag" button is clicked.
- **onAddToBagClick**: A function triggered when the "Add To Bag" button is clicked.
- **onReplaceBagClick**: A function triggered when the "Replace Bag" button is clicked.

## Component Structure

The `SharedCart` component consists of the following key sections:

1. **Cart Title and Item Count**: Displays the title "Shared bag" along with the number of items and total quantity.
2. **Item Listing**: Renders each item in the shared cart using the `ChipReviewItem` component.
3. **Coupons and Breakup**: Displays applied coupons and any price breakdowns related to the shared cart.
4. **Action Buttons**: Provides buttons for merging or adding items to the bag and optionally replacing the bag.

## State Management

The component primarily uses `useMemo` for performance optimization to calculate derived values such as total pieces and item counts based on props, without maintaining internal state.

## Event Handlers

- **onMergeBagClick**: Handles the merging of shared and personal bags when the corresponding button is clicked.
- **onAddToBagClick**: Manages the action of adding items from the shared cart to the user's bag.
- **onReplaceBagClick**: Responsible for replacing the user's current bag with the shared bag when the replace button is clicked.