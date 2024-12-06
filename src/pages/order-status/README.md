# OrderStatus Component

## Overview

The `OrderStatus` component displays the status of a user's order, including details about the order, shipment information, and payment method. It provides feedback on whether the order was successfully placed or if there was a failure, enhancing the user experience in an e-commerce setting.

## Features

- **Order Confirmation**: Displays a confirmation message and order details if the order is successful.
- **Order Failure Handling**: Shows an error message and a retry option if the order fails.
- **Dynamic Display**: Adjusts content based on user login status and order success.
- **Shipment and Product Details**: Renders shipment items and their respective details, including images and pricing.

## Usage

To use the `OrderStatus` component, import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import OrderStatus from "fdk-react-templates/pages/order-status";
import "fdk-react-templates/pages/order-status/order-status.css";

const App = () => {
  const orderData = {
    order_created_time: "2024-11-27T13:51:01.000Z",
    order_created_ts: "2024-11-27T08:21:00Z",
    order_id: "FY6746D66B0E527D9B5C",
    total_shipments_in_order: 1,
    shipments: [
      {
        awb_no: "",
        beneficiary_details: false,
        can_break: {
          upcoming: {
            can_break_entity: false,
          },
          manual_refund: {
            can_break_entity: false,
          },
          bag_not_confirmed: {
            can_break_entity: true,
          },
          bag_confirmed: {
            can_break_entity: true,
          },
          product_not_available: {
            can_break_entity: false,
          },
          cancelled_fynd: {
            can_break_entity: true,
          },
          bag_not_verified: {
            can_break_entity: false,
          },
          cancelled_customer: {
            can_break_entity: true,
          },
          store_reassigned: {
            can_break_entity: false,
          },
        },
        can_cancel: true,
        can_return: false,
        comment: "",
        custom_meta: null,
        delivery_date: "",
        dp_name: "",
        need_help_url:
          "https://fynd.freshdesk.com/support/solutions/33000003306",
        order_id: "FY6746D66B0E527D9B5C",
        order_type: "HomeDelivery",
        refund_details: {
          rrn: "",
        },
        return_meta: null,
        returnable_date: "",
        shipment_created_at: "2024-11-27T13:51:07.000Z",
        shipment_id: "17326956605991881281",
        show_download_invoice: false,
        show_track_link: false,
        size_info: {
          ANS23BS143: {
            quantity: 1,
            quantities: 1,
            price_effective: 2790,
            amount_paid: 3290,
            price_marked: 2790,
            margin: 0,
          },
        },
        total_bags: 1,
        track_url: "",
        traking_no: "",
        bags: [
          {
            can_cancel: true,
            can_return: false,
            currency_code: null,
            currency_symbol: null,
            delivery_date: "",
            id: 38771041,
            line_number: 1,
            meta: {
              group_id: "",
              gift_card: {
                gift_price: 0,
                display_text: "",
                is_gift_applied: false,
              },
              _custom_json: {
                _display: [],
              },
              docket_number: "173269566059918812811",
              partial_can_ret: false,
              sequence_number: 1,
              country_of_origin: "India",
              parent_docket_number: "173269566059918812811",
              delivery_charges_hsn_code: "996819",
              multi_quantity_bag_enabled: false,
            },
            parent_promo_bags: {},
            quantity: 1,
            returnable_date: "",
            seller_identifier: "ANS23BS143",
            item: {
              code: "ANS23BS143",
              id: 8910355,
              image: [
                "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/270x0/anwyn/ANS23BS143/0/TTEzTGYT5y-bedsheets.jpg",
                "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/270x0/anwyn/ANS23BS143/1/876Wy8_9oI-bedsheets.jpg",
                "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/270x0/anwyn/ANS23BS143/2/-3SERT2KBH-bedsheets.jpg",
                "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/270x0/anwyn/ANS23BS143/3/LGbMok0yFz-bedsheets.jpg",
                "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/270x0/anwyn/ANS23BS143/4/Im1l6tcJlp-bedsheets.jpg",
              ],
              l1_categories: ["Bed"],
              l2_categories: ["Bed Linen"],
              l3_category_name: "Bed Sheets Sets",
              name: "Anwyn 300 TC King Size Cotton Bed-sheets",
              seller_identifier: "ANS23BS143",
              size: "90X90",
              slug_key: "anwyn-300-tc-king-size-cotton-bed-sheets-8910355",
            },
            prices: {
              added_to_fynd_cash: false,
              amount_paid: 3290,
              amount_paid_roundoff: 3290,
              brand_calculated_amount: 2790,
              cashback: 0,
              cashback_applied: 0,
              cod_charges: 0,
              coupon_effective_discount: 0,
              coupon_value: 0,
              currency_code: "INR",
              currency_symbol: "₹",
              delivery_charge: 500,
              discount: 0,
              fynd_credits: 0,
              gst_tax_percentage: 12,
              price_effective: 2790,
              price_marked: 2790,
              promotion_effective_discount: 0,
              refund_amount: 3290,
              refund_credit: 0,
              transfer_price: 0,
              value_of_good: 2491.08,
            },
          },
        ],
        shipment_status: {
          hex_code: "#02D1CB",
          title: "Placed",
          value: "processing",
        },
        tracking_details: [
          {
            is_current: true,
            is_passed: true,
            status: "Processing",
            time: "2024-11-27T13:51:07+00:00",
            value: null,
            created_ts: "2024-11-27T08:21:07Z",
            tracking_details: null,
          },
          {
            is_current: false,
            is_passed: false,
            status: "Confirmed",
            time: "",
            value: null,
            created_ts: "",
            tracking_details: null,
          },
          {
            is_current: false,
            is_passed: false,
            status: "DP Assigned",
            time: "",
            value: null,
            created_ts: "",
            tracking_details: null,
          },
          {
            is_current: false,
            is_passed: false,
            status: "In Transit",
            time: "",
            value: null,
            created_ts: "",
            tracking_details: null,
          },
          {
            is_current: false,
            is_passed: false,
            status: "Out for Delivery",
            time: "",
            value: null,
            created_ts: "",
            tracking_details: null,
          },
          {
            is_current: false,
            is_passed: false,
            status: "Delivered",
            time: "",
            value: null,
            created_ts: "",
            tracking_details: null,
          },
        ],
        user_info: {
          email: "abhayzodape@fynd.team",
          first_name: null,
          gender: "male",
          last_name: null,
          mobile: "9822212527",
          name: "Abhay Zodape",
        },
      },
    ],
    bags_for_reorder: [
      {
        item_id: 8910355,
        item_size: "90X90",
        quantity: 1,
        seller_id: 5178,
        store_id: 20584,
        article_assignment: {
          level: "multi-companies",
          strategy: "optimal",
        },
      },
    ],
  };

  return (
    <OrderStatus
      isLoggedIn={true}
      success="true"
      orderData={orderData}
      onOrderFailure={() => console.log("Retry payment")}
    />
  );
};

export default App;
```

## Props

- **isLoggedIn**: A boolean indicating if the user is logged in.
- **success**: A string indicating whether the order was successful ("true" or "false").
- **orderData**: An object containing order details, including shipments and pricing.
- **orderFailImg**: A string representing the path to the failure image.
- **OrderSuccessImg**: A string representing the path to the success image.
- **onOrderFailure**: A function to handle retrying the order in case of failure.
- **showPolling**: A boolean that determines if a polling component should be displayed.
- **pollingComp**: A component to display while polling for order status.
- **loader**: A component to show while loading order details.

## Component Structure

The `OrderStatus` component consists of the following key sections:

1. **Order Confirmation**: Displays when the order is successfully placed, including order ID and timestamp.
2. **Shipment Details**: Renders shipment information, including items, quantities, and pricing.
3. **Payment Information**: Displays the payment method used and delivery address details.
4. **Order Failure Message**: Shown conditionally if the order fails, with a retry option.

## State Management

The component uses local functions to manage data processing, such as calculating item counts and filtering bags, but does not maintain internal state beyond these calculations.

## Event Handlers

- **getOrderLink**: Generates a link to the user's order tracking or profile page based on login status.
- **onOrderFailure**: Handles actions when the order payment fails, allowing users to retry.
