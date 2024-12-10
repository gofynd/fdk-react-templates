# Cart Component

## Overview
The `Cart` component provides a comprehensive interface for managing a shopping cart in an e-commerce platform. It includes functionality for displaying cart items, applying coupons, adding comments, managing the delivery location, and displaying a price summary. The component also handles various user interactions, such as logging in, removing items, and proceeding to checkout.

## Features
- **Cart Item Display**: Displays cart items with detailed product information, including images, size, and the ability to modify quantity or remove items.
- **Coupon Management**: Allows users to apply coupons for discounts directly within the cart.
- **Delivery Location Management**: Handles the selection and display of the delivery location for the order.
- **Comments**: Users can add comments for specific instructions or requests related to the order.
- **GST Input**: Provides an option to enter GST details if applicable.
- **Price Breakup**: Displays a detailed price breakdown, including item prices, taxes, and total amounts.
- **Cart Sharing**: Enables the user to share their cart with others using a unique link.
- **Sticky Footer**: Includes a persistent footer with checkout actions that adapts based on login status.
- **Remove Item Modal**: A modal popup that allows users to remove items from the cart with an option to move items to the wishlist.

## Usage
To use the `Cart` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from "react";
import Cart from "fdk-react-templates/pages/cart";
import "fdk-react-templates/pages/cart/cart.css";

const App = () => {
  const cartData = {
    messages: [],
    items: [],
  };

  const cartItems = {
    item1: {
      bulk_offer: {},
      coupon_message: "",
      custom_order: {
        manufacturing_time_unit: "days",
        is_custom_order: false,
        manufacturing_time: 0,
      },
      discount: "50% OFF",
      is_set: false,
      key: "12232398_OS",
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
        sizes: ["OS"],
        available_sizes: [
          {
            display: "OS",
            is_available: true,
            value: "OS",
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
        uid: "66ed3efad1d1bcf044aee7ac",
        seller: {
          name: "Theme Marketplace Websites - Kanchan (DNT)",
          uid: 5178,
        },
        price: {
          base: {
            currency_code: "INR",
            currency_symbol: "₹",
            effective: 499,
            marked: 1000,
          },
          converted: {
            currency_code: "INR",
            currency_symbol: "₹",
            effective: 499,
            marked: 1000,
          },
        },
      },
      price_per_unit: {
        base: {
          currency_code: "INR",
          currency_symbol: "₹",
          effective: 499,
          marked: 1000,
          selling_price: 499,
        },
        converted: {
          currency_code: "INR",
          currency_symbol: "₹",
          effective: 499,
          marked: 1000,
          selling_price: 499,
        },
      },
      product: {
        _custom_json: {},
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
        tags: [],
        type: "product",
        uid: 12232398,
        brand: {
          name: "Flashh",
          uid: 2644,
        },
        action: {
          type: "page",
          url: "https://api.fynd.com/platform/content/v1/products/pound-cake-12232398/",
        },
        categories: [
          {
            name: "Cakes",
            uid: 2027,
          },
        ],
        images: [
          {
            aspect_ratio: "16:25",
            secure_url:
              "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/zOqYcp92J-HIGHRESPoundCakeCloseUp-Square.jpg",
            url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/zOqYcp92J-HIGHRESPoundCakeCloseUp-Square.jpg",
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
        identifier: "GVJwjRK4S86xstIVNLdOw",
      },
      price: {
        base: {
          currency_code: "INR",
          currency_symbol: "₹",
          effective: 499,
          marked: 1000,
        },
        converted: {
          currency_code: "INR",
          currency_symbol: "₹",
          effective: 499,
          marked: 1000,
        },
      },
      delivery_promise: {
        formatted: {
          max: "Sun, 01 Dec",
          min: "Wed, 27 Nov",
        },
        timestamp: {
          max: 1733041815,
          min: 1732697655,
        },
        iso: {
          max: "2024-12-01T08:30:15Z",
          min: "2024-11-27T08:54:15Z",
        },
      },
    },
  };

  const cartItemsWithActualIndex = {
    0: cartItems.item1,
  };

  const breakUpValues = {
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
    loyalty_points: {
      applicable: 0,
      description:
        "Your cashback, reward points, and refund amount get credited to Fynd Cash which can be redeemed while placing an order.",
      is_applied: false,
      total: 0,
    },
    raw: {
      cod_charge: 0,
      convenience_fee: 0,
      coupon: 0,
      delivery_charge: 500,
      discount: -501,
      fynd_cash: 0,
      gift_card: 0,
      gst_charges: 23.76,
      mop_total: 0,
      mrp_total: 1000,
      subtotal: 499,
      total: 999,
      vog: 475.24,
      you_saved: 0,
      total_charge: 0,
    },
  };

  const deliveryLocationProps = {
    address: "123 Main St, Anytown, CA 12345",
    isEditable: true,
  };

  const cartCouponProps = {
    couponCode: "",
    discount: 0,
  };

  const cartGstProps = {
    gstNumber: "",
  };

  const cartCommentProps = {
    comment: "",
  };

  const cartShareProps = {
    shareLink: "http://example.com/share-cart",
  };

  return (
    <Cart
      isCartUpdating={false}
      isLoggedIn={true}
      cartData={cartData}
      checkoutMode="self"
      cartItems={cartItems}
      cartItemsWithActualIndex={cartItemsWithActualIndex}
      breakUpValues={breakUpValues}
      cartItemCount={2}
      isAnonymous={false}
      isValid={true}
      isNotServicable={false}
      isOutOfStock={false}
      currencySymbol="₹"
      onUpdateCartItems={() => {}}
      deliveryLocationProps={deliveryLocationProps}
      cartCouponProps={cartCouponProps}
      isGstInput={true}
      isPlacingForCustomer={false}
      isShareCart={false}
      cartGstProps={cartGstProps}
      cartCommentProps={cartCommentProps}
      cartShareProps={cartShareProps}
      isRemoveModalOpen={false}
      isPromoModalOpen={false}
      onGotoCheckout={() => {}}
      onRemoveIconClick={() => {}}
      onRemoveButtonClick={() => {}}
      onWishlistButtonClick={() => {}}
      onCloseRemoveModalClick={() => {}}
      onPriceDetailsClick={() => {}}
      updateCartCheckoutMode={() => {}}
      onOpenPromoModal={() => {}}
      onClosePromoModal={() => {}}
    />
  );
};

export default App;

```

### Props

- **isCartUpdating** (boolean): Indicates if the cart is currently being updated.
- **isLoggedIn** (boolean, optional): Determines if the user is logged in. Defaults to false.
- **cartData** (object): Data related to the cart, including messages and items.
- **checkoutMode** (string): The mode for checkout, e.g., "self" or "other".
- **cartItems** (object): Object containing the items in the cart.
- **cartItemsWithActualIndex** (object): Indexed cart items for further operations.
- **breakUpValues** (object): Price breakdown values, used for calculating the total price.
- **cartItemCount** (number): The number of items in the cart.
- **isAnonymous** (boolean): Indicates if the user is anonymous (not logged in).
- **isValid** (boolean): Determines if the cart is valid for checkout.
- **isNotServicable** (boolean): Indicates if the items in the cart are not serviceable to the delivery location.
- **isOutOfStock** (boolean): Checks if the items in the cart are out of stock.
- **currencySymbol** (string): The symbol used for displaying currency.
- **onUpdateCartItems** (function): Function to update items in the cart.
- **deliveryLocationProps** (object): Props for the delivery location component.
- **cartCouponProps** (object): Props for the coupon component.
- **isGstInput** (boolean, optional): Indicates if the GST input is enabled. Defaults to true.
- **isPlacingForCustomer** (boolean): Determines if the user is placing the order on behalf of a customer.
- **isShareCart** (boolean): Determines if the cart-sharing feature is enabled.
- **cartGstProps** (object): Props for the GST component.
- **cartCommentProps** (object): Props for the comment component.
- **cartShareProps** (object): Props for the cart-sharing component.
- **isRemoveModalOpen** (boolean, optional): Determines if the remove item modal is open. Defaults to false.
- **isPromoModalOpen** (boolean, optional): Determines if the promo modal is open. Defaults to false.
- **onGotoCheckout** (function, optional): Function to proceed to the checkout process.
- **onRemoveIconClick** (function, optional): Function triggered when the remove icon is clicked.
- **onRemoveButtonClick** (function, optional): Function to remove an item from the cart.
- **onWishlistButtonClick** (function, optional): Function to add an item to the wishlist.
- **onCloseRemoveModalClick** (function, optional): Function to close the remove item modal.
- **onPriceDetailsClick** (function, optional): Function triggered when the price details are clicked.
- **updateCartCheckoutMode** (function, optional): Function to update the checkout mode.
- **onOpenPromoModal** (function, optional): Function to open the promo modal.
- **onClosePromoModal** (function, optional): Function to close the promo modal.

### Page Configuration

These configurations allow you to customize the Cart Landing Page on the Fynd platform. The configuration controls the appearance and behavior of the cart page, including options for sharing the cart.

| **Configuration** | **Type**    | **Default Value** | **Description**                                                               |
|-------------------|-------------|-------------------|-------------------------------------------------------------------------------|
| `share_cart`      | `checkbox`  | `true`            | Enables or disables the option to share the cart. When enabled, users can share their cart with others. |

#### Steps to Modify Page Configuration via Fynd Platform

1. **Log in to the Fynd Platform:**
   - Go to [Fynd Platform](https://platform.fynd.com) and log in with your credentials.

2. **Navigate to Your Company:**
   - Once logged in, select your company from the list.

3. **Select the Theme:**
   - In the sidebar, under **Sales Channel**, select your sales channel.
   - Then, under **Appearance**, click on **Themes**.
   - In the current theme, click on **Edit**. Here, you can preview and configure the theme.

4. **Navigate to the Cart Page Configuration:**
   - Within the theme editor, navigate to the **Single Checkout** page.
   - You can use the dropdown on the top to select the desired page. 
   - Under the **Configuration** section, locate and click on the **Page** settings for that page.

5. **Modify Cart Landing Page Configurations:**
   - Adjust the configuration for the Cart Landing Page based on your needs. For example:
     - Enable or disable the **Share Cart** feature, allowing customers to share their cart with others.

6. **Preview Changes:**
   - Preview the updates made to the Cart Landing Page in real-time to ensure it looks and functions as expected.

7. **Save and Publish:**
   - After confirming your changes, click on **Save**. This will publish the updated configurations for the Cart Landing Page.

8. **Test Your Storefront:**
   - Visit your store's live URL and navigate to the Cart Landing Page to confirm that the changes are reflected and working as intended.

By following these steps, you can easily customize the Cart Landing Page configurations to suit your business needs.

```
This README provides a detailed overview of the `Cart` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.