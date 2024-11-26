# product-card Component

The `product-card` component displays a product's details including its image, price, brand, and options like wishlist, add to cart, and sale badges.

## Features
- **Image Handling**: Supports hover images, fallback placeholders, and responsive image loading.
- **Price Display**: Option to display product price in different formats (min, max, or range).
- **Wishlist & Remove Icons**: Option to add/remove products to/from the wishlist and cart.
- **Variants**: Displays product color variants, with color swatches.
- **Badges**: Displays "Out of stock" or "Sale" badges based on product status.
- **Customizable Layout**: Adjusts grid layout based on device screen size.

## Props

| Prop Name            | Prop Type      | Default Value  | Description                                                                 |
|----------------------|----------------|----------------|-----------------------------------------------------------------------------|
| `product`            | `object`       | `null`          | The product object containing all necessary details (name, price, media, etc.). |
| `customClass`         | `array`        | `[]`            | Custom CSS class names for the component.                                    |
| `listingPrice`       | `string`       | `"range"`       | Defines how the price is displayed. Options are `min`, `max`, or `range`.   |
| `isHdimgUsed`        | `bool`         | `false`         | Determines whether high-definition images are used.                          |
| `aspectRatio`        | `number`       | `0.8`           | Aspect ratio for the product image.                                          |
| `isBrand`            | `bool`         | `true`          | Determines whether the brand name is displayed.                              |
| `isPrice`            | `bool`         | `true`          | Determines whether the price is displayed.                                   |
| `isSaleBadge`        | `bool`         | `true`          | Determines whether the sale badge is displayed.                              |
| `isWishlistIcon`     | `bool`         | `true`          | Determines whether the wishlist icon is displayed.                           |
| `isImageFill`        | `bool`         | `false`         | If true, the image will fill the container.                                  |
| `showImageOnHover`   | `bool`         | `false`         | If true, the hover image will be shown when the user hovers over the image.  |
| `imageBackgroundColor`| `string`      | `""`            | Background color for the image container.                                   |
| `imagePlaceholder`   | `string`       | `""`            | Fallback placeholder image URL when the actual image is unavailable.         |
| `columnCount`        | `object`       | `{ desktop: 4, tablet: 3, mobile: 1 }` | Specifies the number of columns in different screen sizes.                   |
| `WishlistIconComponent`| `function`    | `() => <SvgWrapper svgSrc="wishlist-plp" />` | Custom component for the wishlist icon.                                      |
| `isRemoveIcon`       | `bool`         | `false`         | If true, the remove icon will be displayed.                                  |
| `RemoveIconComponent`| `function`     | `() => <SvgWrapper svgSrc="item-close" />` | Custom component for the remove icon.                                        |
| `followedIdList`     | `array`        | `[]`            | List of followed product IDs.                                               |
| `onWishlistClick`    | `function`     | `() => {}`      | Callback function when the wishlist icon is clicked.                         |
| `handleAddToCart`    | `function`     | `() => {}`      | Callback function when the add to cart button is clicked.                    |
| `onRemoveClick`      | `function`     | `() => {}`      | Callback function when the remove icon is clicked.                           |
| `centerAlign`        | `bool`         | `false`         | If true, center-aligns the product name and price.                           |
| `showAddToCart`      | `bool`         | `false`         | If true, displays the "Add to Cart" button.                                  |

## Example Usage

```jsx
import React from "react";
import productCard from "fdk-react-templates/components/product-card/product-card";
import "fdk-react-templates/components/product-card/product-card.css";

const App = () => (
  <productCard
    product={productData}
    listingPrice="range"
    isHdimgUsed={true}
    isPrice={true}
    isSaleBadge={false}
    isWishlistIcon={true}
    onWishlistClick={handleWishlist}
    handleAddToCart={handleAddToCart}
    showAddToCart={true}
  />
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).