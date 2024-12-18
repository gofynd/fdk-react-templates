# ChipReviewItem Component

Displays a product's information, pricing details, and availability. It provides a summary of the product, including name, image, price, and discount. Additionally, it shows the total cost of the items, the quantity, and highlights any out-of-stock status. The component is responsive, adjusting the display of certain information for desktop and mobile views.

## Features
- **Product Information**: Displays product image, name, brand, and store details.
- **Pricing and Total**: Shows total price, quantity, and breakdown of price per piece if applicable.
- **Availability**: Highlights out-of-stock products and displays related messages.
- **Responsive Design**: Displays chip meta data differently for desktop and mobile views.

## Props

| Prop Name      | Prop Type      | Default Value | Description                                                                 |
|----------------|----------------|---------------|-----------------------------------------------------------------------------|
| `item`         | `object`       | {}            | The product item containing details like name, price, and availability.      |
| `articles`     | `array`        | []            | List of articles related to the item, used to calculate total and quantity. |

## Example Usage

```jsx
import React from "react";
import ChipReviewItem from "fdk-react-templates/components/chip-review-item/chip-review-item";
import "fdk-react-templates/components/chip-review-item/chip-review-item.css";

const App = () => {
  const item = {
    product: { slug: 'product-slug', name: 'Product Name', brand: { name: 'Brand' }, images: [{ url: 'product-image.jpg' }] },
    article: { size: 'M', store: { name: 'Store' }, seller: { name: 'Seller' }, discount: '10%' },
    price: { converted: { effective: 100, currency_symbol: '₹' }, marked: 120 },
    availability: { out_of_stock: false },
    is_set: false,
    quantity: 2,
  };

  const articles = [item];

  return (
    <ChipReviewItem item={item} articles={articles} />
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).