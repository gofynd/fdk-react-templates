# PaymentDetailCard Component

The `PaymentDetailCard` component displays payment details for an order, including payment method, amount, and currency format. It shows the logo and display name of the payment method, along with the corresponding price formatted with the correct currency symbol.

## Features
- **Payment Method Information**: Displays the payment method's logo and name.
- **Amount Display**: Shows the amount for the payment, either from `paymentInfo.amount` or from `breakup.total`.
- **Currency Formatting**: Formats the amount with the appropriate currency symbol using `priceFormatCurrencySymbol`.

## Props

| Prop Name          | Prop Type     | Default Value | Description                                                                 |
|--------------------|---------------|---------------|-----------------------------------------------------------------------------|
| `breakup`          | `array`       | `[]`          | An array containing the payment breakup details, including the total amount.|
| `paymentInfo`      | `object`      | `undefined`   | An object containing the payment method information, such as `logo`, `display_name`, and `amount`. |

## Example Usage

```jsx
import React from "react";
import PaymentDetailCard from "fdk-react-templates/components/payment-detail-card/payment-detail-card"; 
import "fdk-react-templates/components/payment-detail-card/payment-detail-card.css"; 

const App = () => (
  <PaymentDetailCard
    breakup={[
      { name: "total", value: "1000", currency_symbol: "₹" },
    ]}
    paymentInfo={{
      display_name: "Credit Card",
      logo: "credit-card-logo-url",
      amount: 1000,
    }}
  />
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).