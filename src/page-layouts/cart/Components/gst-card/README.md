# GstCard Component

## Overview
The `GstCard` component allows users to enter their GSTIN (Goods and Services Tax Identification Number), apply GST charges, and manage the application of GST credits. It provides visual feedback for successful application and error states.

## Features
- **Checkbox for GST Usage**: A checkbox to enable or disable the use of GST.
- **GST Number Input**: An input field to enter the GST number, which can trigger actions based on its state.
- **Validation Messages**: Displays success or error messages based on the GST number input and application state.

## Usage
To use the `GSTCard` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from "react";
import GstCard from "fdk-react-templates/page-layouts/cart/Components/gst-card/gst-card";
import "fdk-react-templates/page-layouts/cart/Components/gst-card/gst-card.css";

const App = () => {
  // Declared values for props with proper constant names
  const gstNumber = "27AAAAA0000A1Z5";
  const gstCharges = 1500;
  const isApplied = false;
  const error = {};

  const handleGstChange = (newGstNumber) => {
    console.log("GST Number changed:", newGstNumber);
  };

  const handleRemoveGstClick = () => {
    console.log("GST removed");
  };

  return (
    <GstCard
      gstNumber={gstNumber}
      gstCharges={gstCharges}
      isApplied={true}
      currencySymbol="₹"
      onGstChange={handleGstChange}
      onRemoveGstClick={handleRemoveGstClick}
    />
  );
};

export default App;

```

### Props
- **gstNumber** (string, optional): The GSTIN value entered by the user. Defaults to an empty string.
- **gstCharges** (number, optional): The GST charges associated with the entered GST number. Defaults to 0.
- **isApplied** (boolean, optional): Indicates whether the GST has been successfully applied. Defaults to `false`.
- **error** (object, optional): An object containing error information, with a `message` property for displaying error details.
- **currencySymbol** (string, optional): The symbol for the currency (e.g., "₹"). Defaults to "₹".
- **onGstChange** (function, optional): Callback function triggered when the GST number changes.
- **onRemoveGstClick** (function, optional): Callback function triggered when the user clicks to remove the GST number.

```
This README provides a detailed overview of the `GSTCard` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
