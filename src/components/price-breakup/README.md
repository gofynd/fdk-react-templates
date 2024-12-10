Here is the `README.md` documentation for the `PriceBreakup` component, including a table for the props with their data types and default values.

---

# PriceBreakup Component

This component represents a Cart and checkout Price Breakup. It can be used across the application wherever a Price Breakup is required (Cart / Checkout/ Order Details/ Order Confirmation).

## Props

| Prop Name                 | Data Type   | Default Value                                                    | Description                                                        |
| ------------------------- | ----------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `title`                   | `string`    | `"PRICE SUMMARY"`                                                | The heading/title of the price breakup card.                       |
| `breakUpValues`           | `array`     | `[]`                                                             | Data that you have to pass from getters or GraphQL Queries or API. |
| `showItemsCount`          | `boolean`   | `true`                                                           | It is a flag to hide/show items count.                             |
| `cartItemCount`           | `number`    | `0`                                                              | Item count for which breakup is displayed.                         |
| `currencySymbol`          | `string`    | `"₹"`                                                            | Currency Symbol for showing discount amount.                       |
| `showTotalDiscount`       | `boolean`   | `true`                                                           | Show total discount with greeting at the bottom of card.           |
| `includeZeroValues`       | `boolean`   | `false`                                                          | To include Zero amount values from `breakUpValues` data.           |
| `discountGreetingMessage` | `string`    | `"Yayy!!! You've saved"`                                         | Discount Greeting Message shown at bottom of Card.                 |
| `greetingIcon`            | `component` | `<SvgWrapper svgSrc="celebration" className={styles.svgIcon} />` | React component to show Greeting icon like celebration.            |
| `cardBorderRadius`        | `string`    | `"8px"`                                                          | String value in `px` for card border radius.                       |

## Example Usage

```jsx
import React from "react";
import PriceBreakup from "fdk-react-templates/components/price-breakup/price-breakup";
import "fdk-react-templates/components/price-breakup/price-breakup.css";

const orderData = {
  breakup_values: [
    {
      currency_code: "INR",
      currency_symbol: "₹",
      display: "Total MRP",
      key: "mrp_total",
      message: [],
      value: 23593,
      preset: null,
    },
    {
      currency_code: "INR",
      currency_symbol: "₹",
      display: "Discount",
      key: "discount",
      message: [],
      value: -700,
      preset: null,
    },
    {
      currency_code: "INR",
      currency_symbol: "₹",
      display: "Subtotal",
      key: "subtotal",
      message: [],
      value: 22893,
      preset: null,
    },
    {
      currency_code: "INR",
      currency_symbol: "₹",
      display: "Total",
      key: "total",
      message: [],
      value: 22893,
      preset: null,
    },
  ],
};

const App = () => (
  <PriceBreakup
    breakUpValues={orderData?.breakup_values}
    cartItemCount={2}
    currencySymbol={orderData?.breakup_values?.[0]?.currency_symbol}
  />
);

export default App;

```

## Default Props

For Default Props refer `defaultProps` at the bottom of the `PriceBreakup` component definition:

```jsx
PriceBreakup.defaultProps = {
  title: "PRICE SUMMARY",
  breakUpValues: [],
  showItemsCount: true,
  cartItemCount: 0,
  currencySymbol: "₹",
  showTotalDiscount: true,
  includeZeroValues: false,
  discountGreetingMessage: "Yayy!!! You've saved",
  greetingIcon: <SvgWrapper svgSrc="celebration" className={styles.svgIcon} />,
  cardBorderRadius: "8px",
};
```

---

This documentation provides a clear understanding of the `PriceBreakup` component, its props, default values, and how to use it.
