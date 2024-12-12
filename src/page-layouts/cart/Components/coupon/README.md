# Coupon Component

## Overview
The `Coupon` component allows users to apply coupons and view applicable offers. It displays a list of available coupons, allows users to input coupon codes, and shows the success status upon applying a coupon.

## Features
- **Apply Coupons**: Users can apply coupon codes to receive discounts.
- **View Coupon List**: Displays a list of applicable coupons.
- **Coupon Success Notification**: Shows a modal with success details when a coupon is successfully applied.

## Usage
To use the `ChipItem` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import Coupon from 'fdk-react-templates/page-layouts/cart/Components/coupon/coupon';
import 'fdk-react-templates/page-layouts/cart/Components/coupon/coupon.css';

const App = () => {
  const [couponCode, setCouponCode] = useState('');
  const [isCouponListModalOpen, setCouponListModalOpen] = useState(false);
  
  const handleApplyCouponClick = (code) => {
    setCouponCode(code);
    // Logic for applying coupon
  };

  return (
    <Coupon
      title="Exclusive Coupons"
      couponCode={couponCode}
      isCouponListModalOpen={isCouponListModalOpen}
      availableCouponList={[
        { coupon_code: 'SAVE10', title: 'Save 10%', message: 'Get 10% off your order', expires_on: '2024-12-31', is_applicable: true },
        { coupon_code: 'FREESHIP', title: 'Free Shipping', message: 'Enjoy free shipping on orders over ₹500', expires_on: '2024-11-15', is_applicable: true }
      ]}
      onApplyCouponClick={handleApplyCouponClick}
      onCouponBoxClick={() => setCouponListModalOpen(true)}
      onCouponListCloseModalClick={() => setCouponListModalOpen(false)}
    />
  );
};

export default App;

```

### Props
- **title** (string, optional): The title displayed in the coupon section. Default is "COUPONS".
- **subtitle** (string, optional): The subtitle for additional instructions. Default is "View all offers".
- **couponId** (string, optional): The ID of the currently applied coupon.
- **couponCode** (string, optional): The code of the currently applied coupon.
- **couponValue** (number, optional): The value of the discount from the applied coupon.
- **hasCancel** (boolean, optional): Indicates if the coupon can be removed. Default is false.
- **currencySymbol** (string, optional): The currency symbol to use. Default is "₹".
- **error** (string, optional): Error message to display if coupon application fails.
- **successCoupon** (object, optional): Object containing details of the successfully applied coupon.
- **couponSuccessGif** (string, optional): URL for the success GIF to display upon applying a coupon.
- **isCouponListModalOpen** (boolean, optional): Controls the visibility of the coupon list modal.
- **isCouponSuccessModalOpen** (boolean, optional): Controls the visibility of the coupon success modal.
- **availableCouponList** (array, optional): List of available coupons to display.
- **onCouponBoxClick** (function, optional): Callback for when the coupon box is clicked.
- **onCouponListCloseModalClick** (function, optional): Callback for closing the coupon list modal.
- **onCouponSuccessCloseModalClick** (function, optional): Callback for closing the coupon success modal.
- **onApplyCouponClick** (function, optional): Callback for applying a coupon.
- **onRemoveCouponClick** (function, optional): Callback for removing a coupon.


```
This README provides a detailed overview of the `Coupon` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
