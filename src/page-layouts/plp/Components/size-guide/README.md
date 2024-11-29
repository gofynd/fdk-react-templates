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
import React, { useState } from 'react';
import SizeGuide from 'fdk-react-templates/page-layouts/plp/Components/size-guide/size-guide';
import 'fdk-react-templates/page-layouts/plp/Components/size-guide/size-guide.css';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const productMeta = {
    size_chart: {
      title: "Size Chart",
      headers: {
        chest: { value: "Chest", convertable: true },
        waist: { value: "Waist", convertable: true }
      },
      sizes: [
        { chest: "38", waist: "30" },
        { chest: "40", waist: "32" }
      ],
      image: "/path/to/size-guide.jpg"
    }
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Size Guide</button>
      <SizeGuide isOpen={isOpen} productMeta={productMeta} onCloseDialog={handleCloseDialog} />
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

