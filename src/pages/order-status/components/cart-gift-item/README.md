# CartGiftItem Component

## Overview

The `CartGiftItem` component displays information about free gifts applied to a shopping cart item. It conditionally renders the details based on the promotions applied to the item, enhancing the shopping experience by informing users about free gifts.


## Example

```jsx
import React from "react";
import CartGiftItem from "fdk-react-templates/pages/order-status/components/cart-gift-item/cart-gift-item";
import "fdk-react-templates/pages/order-status/components/cart-gift-item/cart-gift-item.css";

const ExampleUsage = () => {
  const bagItem = {
    promotions_applied: [
      {
        applied_free_articles: [
          {
            article_id: "123",
            free_gift_item_details: {
              item_images_url: ["original_image_url"],
              item_name: "Free Gift Item",
              item_price_details: {
                effective: {
                  max: "100",
                },
              },
            },
            quantity: 1,
          },
        ],
      },
    ],
    price: {
      converted: {
        currency_symbol: "₹",
      },
    },
  };

  return <CartGiftItem bagItem={bagItem} />;
};

export default ExampleUsage;
```

## Props

- **bagItem**: An object representing the shopping cart item, which includes details about promotions and free gifts applied.

## Component Structure

The `CartGiftItem` component consists of the following key sections:

1. **Free Gift Box**: Contains the overall layout for displaying free gift information.
2. **Promotions Applied**: Displays the count of free gifts applied if any exist.
3. **Free Gift Items**: Iterates through the promotions applied to display individual free gift items, including:
   - Image of the free gift item.
   - Name of the free gift item.
   - Quantity of the free gift item.
   - Price details, indicating that the item is free.

## Conditional Rendering

The component returns `null` if:
- No promotions are applied.
- No free gift articles are found in the applied promotions.

## Utility Functions

- **isFreeGift(data)**: Checks if the promotion type is a free gift.
- **getFreeGiftImage(data)**: Modifies the image URL for size adjustment.
- **getCurrencySymbol**: Retrieves the currency symbol for the price display.