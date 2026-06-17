# StickyFooter Component

## Overview
The `StickyFooter` component provides a persistent footer in the shopping cart view, displaying total prices, login options, and checkout buttons based on the user's authentication status. It also allows users to redeem reward points if applicable.

## Features
- **Total Price Display**: Shows the total price of items in the cart.
- **Login Prompt**: Displays login and guest checkout buttons for users who are not logged in.
- **Reward Points**: Optionally shows a checkbox for redeeming reward points if the user is logged in and has points available.
- **Checkout Button**: Provides a checkout button that is enabled or disabled based on the cart's validity and item availability.

## Usage
To use the `StickyFooter` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import StickyFooter from 'fdk-react-templates/page-layouts/cart/Components/sticky-footer/sticky-footer';
import 'fdk-react-templates/page-layouts/cart/Components/sticky-footer/sticky-footer.css';

const App = () => {

  const handleLoginClick = () => {
     console.log('Proceeding to login...');
  };

  const handleCheckoutClick = () => {
    console.log('Proceeding to checkout...');
  };

  const handlePriceDetailsClick = () => {
    console.log('Viewing price details...');
  };

  return (
    <div>
      {/* Other components, e.g., cart items */}
      <StickyFooter
        isLoggedIn={true}
        totalPrice={1000}
        onLoginClick={handleLoginClick}
        onCheckoutClick={handleCheckoutClick}
        onPriceDetailsClick={handlePriceDetailsClick}
      />
    </div>
  );
};

export default App;

```

### Props
- **isLoggedIn** (boolean, optional): Indicates whether the user is logged in. Defaults to `false`.
- **isValid** (boolean, optional): Indicates whether the cart is {t("resource.checkout.valid_for")} checkout. Defaults to `true`.
- **isOutOfStock** (boolean, optional): Indicates if any items in the cart are out of stock. Defaults to `false`.
- **isNotServicable** (boolean, optional): Indicates if the delivery location is not serviceable. Defaults to `false`.
- **isAnonymous** (boolean, optional): Indicates whether the user is browsing as a guest. Defaults to `true`.
- **totalPrice** (number, optional): The total price of items in the cart. Defaults to `0`.
- **currencySymbol** (string, optional): The currency symbol to display with the total price. Defaults to "₹".
- **onLoginClick** (function, optional): Callback function triggered when the login button is clicked.
- **onCheckoutClick** (function, optional): Callback function triggered when the checkout button is clicked.
- **onPriceDetailsClick** (function, optional): Callback function triggered when the view price details button is clicked.

```
This README provides a detailed overview of the `StickyFooter` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.


