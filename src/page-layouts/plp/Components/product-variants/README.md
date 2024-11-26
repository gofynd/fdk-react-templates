# ProductVariants Component

## Overview
The `ProductVariants` component displays a list of product variants (e.g., size, color, set) for a given product. It allows users to view and select different variants and either redirects to the product page or updates the selected variant depending on the `preventRedirect` prop.

## Features
- **Variant Display**: Renders variants based on different display types like image, color, and text.
- **Variant Selection**: Highlights the selected variant and updates the page accordingly.
- **Conditional Navigation**: Prevents navigation if `preventRedirect` is set, using `setSlug` to update the variant.
- **Image Handling**: Displays product variant images with fallback support.
- **Text-Based Variants**: Supports text-based variants for easy selection.

## Usage
To use the `ProductVariants` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from "react";
import ProductVariants from 'fdk-react-templates/page-layouts/plp/Components/product-variants/product-variants';
import 'fdk-react-templates/page-layouts/plp/Components/product-variants/product-variants.css';

const product = { is_set: false, /* other product details */ };
const variants = [
  // List of variant objects
];

const App = () => (
  <ProductVariants
    variants={variants}
    product={product}
    currentSlug="variant-slug"
    globalConfig={{ /* global config */ }}
    preventRedirect={false}
    setSlug={(slug) => console.log("Variant Slug:", slug)}
  />
);

export default App;

```


### Props
- **variants** (array, required): List of variants for the product.
- **product** (object, required): Product object containing details like whether the product is a set.
- **currentSlug** (string, optional): The current slug, used to identify the selected variant.
- **globalConfig** (object, optional): Global configuration, used for rendering images.
- **preventRedirect** (boolean, optional): Prevents automatic redirection to the product page, defaults to `false`.
- **setSlug** (function, optional): A function to set the slug for the selected variant when `preventRedirect` is true.

```
This README provides a detailed overview of the `ProductVariants` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
