# OrderTrackingDetails Component

## Overview

The `OrderTrackingDetails` component displays detailed information about a user's order shipments. It allows users to track their order by entering an Order ID, view shipment details, and manage their shipments.


## Usage

To use the `OrderTrackingDetails` component, import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import OrderTrackingDetails from "fdk-react-templates/pages/order/order-tracking-details/order-tracking-details";
import "fdk-react-templates/pages/order/order-tracking-details/order-tracking-details.css";

const App = () => {
  const orderShipments = {
    bags_for_reorder: [
      {
        item_id: 8910355,
        item_size: "90X90",
        quantity: 1,
        seller_id: 5178,
        store_id: 20584,
      },
    ],
    breakup_values: [
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "MRP Total",
        name: "mrp_total",
        value: 2790,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "Discount",
        name: "discount",
        value: 0,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "Sub Total",
        name: "sub_total",
        value: 2790,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "Promotion",
        name: "promotion",
        value: 0,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "Coupon",
        name: "coupon",
        value: 0,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "Reward Points",
        name: "reward_points",
        value: 0,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "Cashback Applied",
        name: "cashback_applied",
        value: 0,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "COD Charges",
        name: "cod_charges",
        value: 0,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "Gift Price",
        name: "gift_price",
        value: 0,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "Delivery Charges",
        name: "delivery_charges",
        value: 500,
      },
      {
        currency_code: "INR",
        currency_symbol: "₹",
        display: "Total",
        name: "total",
        value: 3290,
      },
    ],
    order_created_time: "2024-11-27T13:51:01.000Z",
    order_created_ts: "2024-11-27T08:21:00Z",
    order_id: "FY6746D66B0E527D9B5C",
    shipments: [
      {
        awb_no: "",
        beneficiary_details: false,
        can_break: {
          bag_confirmed: {
            can_break_entity: true,
          },
          manual_refund: {
            can_break_entity: false,
          },
          upcoming: {
            can_break_entity: false,
          },
          product_not_available: {
            can_break_entity: false,
          },
          cancelled_fynd: {
            can_break_entity: true,
          },
          store_reassigned: {
            can_break_entity: false,
          },
          bag_not_verified: {
            can_break_entity: false,
          },
          cancelled_customer: {
            can_break_entity: true,
          },
          bag_not_confirmed: {
            can_break_entity: true,
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
              brand: {
                logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/brands/pictures/square-logo/original/uwJ9z2q-s-Logo.jpeg",
                name: "ANWYN",
              },
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
        breakup_values: [
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "MRP Total",
            name: "mrp_total",
            value: 2790,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "Discount",
            name: "discount",
            value: 0,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "Sub Total",
            name: "sub_total",
            value: 2790,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "Promotion",
            name: "promotion",
            value: 0,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "Coupon",
            name: "coupon",
            value: 0,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "Reward Points",
            name: "reward_points",
            value: 0,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "Cashback Applied",
            name: "cashback_applied",
            value: 0,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "COD Charges",
            name: "cod_charges",
            value: 0,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "Gift Price",
            name: "gift_price",
            value: 0,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "Delivery Charges",
            name: "delivery_charges",
            value: 500,
          },
          {
            currency_code: "INR",
            currency_symbol: "₹",
            display: "Total",
            name: "total",
            value: 3290,
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
    total_shipments_in_order: 1,
    user_info: {
      email: null,
      first_name: "Abhay",
      gender: "male",
      last_name: "Zodape",
      mobile: "9822212527",
      name: null,
    },
  };

  const invoiceDetails = {
    /* your invoice details */
  };

  const getShipmentDetails = () => {
    // Your logic to fetch shipment details
  };

  return (
    <OrderTrackingDetails
      invoiceDetails={invoiceDetails}
      isLoading={false}
      orderShipments={orderShipments}
      getShipmentDetails={getShipmentDetails}
      isShipmentLoading={false}
    />
  );
};

export default App;

```

## Props

- **invoiceDetails**: Details related to the invoice.
- **isLoading**: Boolean indicating if the order details are currently loading.
- **orderShipments**: An object containing information about the shipments associated with the order.
- **getShipmentDetails**: A function to fetch shipment details.
- **selectedShipment**: The currently selected shipment details.
- **isShipmentLoading**: Boolean indicating if the shipment details are currently loading.

## Component Structure

The `OrderTrackingDetails` component consists of the following key sections:

1. **Order ID Input**: Text input for users to enter their Order ID.
2. **Track Button**: A button that triggers the tracking of the order.
3. **Error Message**: Shown conditionally when an invalid Order ID is entered.
4. **Loader**: Displays a loading spinner while fetching order details.
5. **Empty State**: Displays a message when there are no shipments available.
6. **Order Shipment Details**: Displays the order shipment information, including a list of items.
7. **Shipment Tracking**: Shows tracking details for the selected shipment.
8. **Shipment Breakup**: Displays the cost breakdown for the shipment.

## State Management

- **orderId**: The current value of the Order ID input field.
- **showError**: Boolean that determines if the error message should be displayed.
- **show**: Controls the visibility of additional shipment bags.
- **selectedShipmentBag**: Holds the details of the currently selected shipment.

## Event Handlers

- **trackOrder**: Validates the Order ID length and navigates to the order tracking page if valid. Sets the error state if invalid.
- **toggelInit**: Navigates to the shipment details page based on the selected shipment bag.
- **showMore**: Sets the state to show additional shipment bags.
- **showLess**: Resets the state to hide additional shipment bags.

## Effects

- **useEffect**: Fetches shipment details when the component mounts and when the shipment ID changes.
- **useEffect**: Updates the selected shipment bag based on the selected shipment.

## Helper Functions

- **getBag**: Returns the bags associated with the selected shipment.
- **getSlicedGroupedShipmentBags**: Returns a sliced array of shipment bags based on the current visibility state.
