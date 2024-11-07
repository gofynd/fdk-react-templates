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
import React from 'react';
import Cart from 'fdk-react-templates/pages/cart';

const App = () => {
  const cartData = {
    messages: [],
    items: [],
  };

  const cartItems = {
    item1: { id: 1, name: 'Product 1', quantity: 1, price: 100 },
    item2: { id: 2, name: 'Product 2', quantity: 2, price: 150 },
  };

  const cartItemsWithActualIndex = {
    0: cartItems.item1,
    1: cartItems.item2,
  };

  const breakUpValues = {
    subtotal: 400,
    tax: 40,
    total: 440,
  };

  const deliveryLocationProps = {
    address: "123 Main St, Anytown, CA 12345",
    isEditable: true,
  };

  const cartCouponProps = {
    couponCode: '',
    discount: 0,
  };

  const cartGstProps = {
    gstNumber: '',
  };

  const cartCommentProps = {
    comment: '',
  };

  const cartShareProps = {
    shareLink: 'http://example.com/share-cart',
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

```
This README provides a detailed overview of the `Cart` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.