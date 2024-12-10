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
import ProductVariants from "fdk-react-templates/page-layouts/plp/Components/product-variants/product-variants";
import "fdk-react-templates/page-layouts/plp/Components/product-variants/product-variants.css";

const product = { is_set: false /* other product details */ };
const variants = [
  // List of variant objects
];

const App = () => {
  const product = {
    brand: {
      name: "FusionWave",
      uid: 6299,
    },
    color: null,
    item_code: "iphone14pro-128White",
    item_type: "standard",
    has_variant: true,
    uid: 9502950,
    custom_config: {
      _app: {},
    },
    media: [
      {
        alt: "Iphone 14 Pro Max | White 128GB",
        meta: null,
        type: "image",
        url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/fusionwave/iphone14pro-128White/0/OZWghjtF4L-61nzPMNY8zL.jpg",
      },
      {
        alt: "Iphone 14 Pro Max | White 128GB",
        meta: null,
        type: "image",
        url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/D50yOjrbS-61Z-ep3MvAL._SL1500_.jpg",
      },
      {
        alt: "Iphone 14 Pro Max | White 128GB",
        meta: null,
        type: "image",
        url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/q6EzwDRKz-71qRoVobOL._SL1500_.jpg",
      },
      {
        alt: "Iphone 14 Pro Max | White 128GB",
        meta: null,
        type: "image",
        url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/--fj3x-ju-618FXgzn0BL._SL1500_.jpg",
      },
    ],
    sizes: {
      discount: "",
      multi_size: true,
      sellable: true,
      size_chart: {
        description: null,
        headers: null,
        image: null,
        size_tip: null,
        sizes: null,
        title: null,
        unit: null,
      },
      sizes: [
        {
          dimension: {
            height: 12,
            is_default: true,
            length: 12,
            unit: "cm",
            width: 12,
          },
          display: "512GB",
          is_available: true,
          quantity: 50,
          seller_identifiers: ["IPHONE14PRO-128WHITE"],
          value: "512GB",
          weight: {
            is_default: true,
            shipping: 122,
            unit: "gram",
          },
        },
      ],
      stores: {
        count: 1,
      },
      price: {
        effective: {
          currency_code: "INR",
          currency_symbol: "₹",
          max: 98000,
          min: 98000,
        },
        marked: {
          currency_code: "INR",
          currency_symbol: "₹",
          max: 98900,
          min: 98900,
        },
      },
    },
    custom_order: {
      is_custom_order: false,
      manufacturing_time: 0,
      manufacturing_time_unit: "days",
    },
    description:
      "Innovative, elegant, and powerful. Seamless design, top-notch performance, and advanced camera technology. Unparalleled security for your peace of mind.",
    discount: null,
    moq: {
      increment_unit: 1,
      maximum: null,
      minimum: 1,
    },
    name: "Iphone 14 Pro Max | White 128GB",
    net_quantity: {
      unit: null,
      value: null,
    },
    price: null,
    rating: null,
    rating_count: null,
    seo: {
      description: "",
      title: "Iphone 14 Pro Max | White 128GB",
    },
    short_description: "",
    slug: "iphone-14-pro-max-white-128gb-9502950",
    type: "product",
    variants: [
      {
        display_type: "color",
        header: "Additional Colors",
        items: [
          {
            _custom_meta: [],
            color: "9013FE",
            color_name: "Purple",
            is_available: true,
            medias: [
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/fusionwave/iphone14pro-128Purple/0/dT7HgmDl47-71yzJoE7WlL.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/uY8VY7JGr-61fUC17f8L._SL1500_.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/vFZq7TySi-71QU1-kvp0L._SL1500_.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/2UVgCcWZ1b-71QU1-kvp0L._SL1500_.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/c5lDTBice-61JhIHbz8qL._SL1500_.jpg",
              },
            ],
            name: "Iphone 14 Pro Max |  Purple 128GB",
            slug: "iphone-14-pro-max-purple-128gb-9502951",
            uid: 9502951,
            value: "9013FE",
          },
          {
            _custom_meta: [],
            color: "FFD700",
            color_name: "Gold",
            is_available: true,
            medias: [
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/fusionwave/iphone14pro-128Gold/0/5KahG2hRUx-71T5NVOgbpL.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/VKHgY9oPY-618-4t3xcbL._SL1500_.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/QT_qXi_U5-71qK2dh4o0L._SL1500_.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/_UMoznAXH-61clO95EgwL._SL1500_.jpg",
              },
            ],
            name: "Iphone 14 Pro Max | Gold 128GB",
            slug: "iphone-14-pro-max-gold-128gb-9502942",
            uid: 9502942,
            value: "FFD700",
          },
          {
            _custom_meta: [],
            color: "FFFFFF",
            color_name: "White",
            is_available: true,
            medias: [
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/fusionwave/iphone14pro-128White/0/OZWghjtF4L-61nzPMNY8zL.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/D50yOjrbS-61Z-ep3MvAL._SL1500_.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/q6EzwDRKz-71qRoVobOL._SL1500_.jpg",
              },
              {
                alt: "",
                type: "image",
                url: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/--fj3x-ju-618FXgzn0BL._SL1500_.jpg",
              },
            ],
            name: "Iphone 14 Pro Max | White 128GB",
            slug: "iphone-14-pro-max-white-128gb-9502950",
            uid: 9502950,
            value: "FFFFFF",
          },
        ],
        key: "primary_color",
      },
    ],
    action: null,
  };

  return (
    <ProductVariants
      variants={product?.variants}
      product={product}
      currentSlug={product?.slug}
      globalConfig={{}}
      preventRedirect={false}
      setSlug={(slug) => console.log("Variant Slug:", slug)}
    />
  );
};

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
