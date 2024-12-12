# SizeGuide Component

## Overview
The `SizeGuide` component displays a modal dialog for viewing the size guide and how to measure a product. It allows the user to toggle between the size guide and how to measure tabs, and switch between different measurement units (e.g., inches and centimeters). The component also renders the product's size chart, description, and an optional image.

## Features
- **Toggle Tabs**: Allows the user to switch between the "Size Guide" and "How to Measure" tabs.
- **Metric Conversion**: Supports converting measurements between inches and centimeters.
- **Dynamic Size Chart**: Displays the size chart with dynamic columns and rows based on the provided `productMeta`.
- **Size Guide Image**: Optionally displays a size guide image if provided in the `productMeta`.
- **Not Available State**: Shows a "Not available" message with a link to contact support if the size chart or image is unavailable.

## Usage
To use the `SizeGuide` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from "react";
import SizeGuide from "fdk-react-templates/page-layouts/plp/Components/size-guide/size-guide";
import "fdk-react-templates/page-layouts/plp/Components/size-guide/size-guide.css";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const productMeta = {
    size_chart: {
      description: null,
      headers: {
        col_1: {
          convertable: false,
          value: "Size- Kurti",
        },
        col_2: {
          convertable: true,
          value: "XS",
        },
        col_3: {
          convertable: true,
          value: "S",
        },
        col_4: {
          convertable: true,
          value: "M",
        },
        col_5: {
          convertable: true,
          value: "L",
        },
        col_6: {
          convertable: true,
          value: "XL",
        },
      },
      image:
        "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/size-guide/free/original/6eTylbjlG-Logo.png",
      size_tip: "Size Guide",
      sizes: [
        {
          col_1: "Chest-in",
          col_2: "36",
          col_3: "38",
          col_4: "40",
          col_5: "43",
          col_6: "46",
        },
        {
          col_1: "Waist-in",
          col_2: "33",
          col_3: "35",
          col_4: "37",
          col_5: "40",
          col_6: "43",
        },
        {
          col_1: "Hips-in",
          col_2: "39",
          col_3: "41",
          col_4: "43",
          col_5: "46",
          col_6: "49",
        },
        {
          col_1: "Shoulder-in",
          col_2: "13.5",
          col_3: "14",
          col_4: "14.5",
          col_5: "15",
          col_6: "16",
        },
        {
          col_1: "Size-Pant",
          col_2: "XS",
          col_3: "S",
          col_4: "M",
          col_5: "L",
          col_6: "XL",
        },
        {
          col_1: "Waist-in",
          col_2: "28",
          col_3: "30",
          col_4: "32",
          col_5: "34",
          col_6: "36",
        },
        {
          col_1: "Shoulder-in",
          col_2: "39",
          col_3: "41",
          col_4: "43",
          col_5: "46",
          col_6: "49",
        },
      ],
      title: "Naksh Jaipur Garment Measurements",
      unit: "in",
    },
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Size Guide</button>
      <SizeGuide
        isOpen={isOpen}
        productMeta={productMeta}
        onCloseDialog={handleCloseDialog}
      />
    </div>
  );
};

export default App;

```

### Props
- **isOpen** (boolean): Determines whether the modal is open or closed.
- **productMeta** (object): The metadata for the product, which includes the size chart, size chart headers, size chart sizes, and unit of measurement.
- **onCloseDialog** (function): A callback function that is invoked when the modal is closed.

```
This README provides a detailed overview of the `SizeGuide` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.

