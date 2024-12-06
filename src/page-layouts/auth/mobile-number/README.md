## MobileNumber Component

## Overview
The `MobileNumber` component is a reusable input field that leverages the `react-international-phone` library to provide an enhanced international telephone input experience. It handles country code selection, phone number validation, and various customization options, making it suitable for international form inputs.

### Features

- **International Number Input**: Supports country code selection and phone number input with validation.
- **Real-Time Validation**: Validates the mobile number input as the user types, providing immediate feedback.
- **Dynamic Country Code**: Displays the default country code alongside the input field.
- **Error Handling**: Displays error messages when validation fails, enhancing user experience.
- **Customizable Styles**: Allows customization of CSS classes for various elements for easier styling.

## Usage
To use the `MobileNumber` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React, { useState } from 'react';
import MobileNumber from 'fdk-react-templates/page-layouts/auth/mobile-number/mobile-number';
import 'fdk-react-templates/page-layouts/auth/mobile-number/mobile-number.css';

function App() {
  const [mobile, setMobile] = useState("");

  const handleMobileChange = ({ mobile }) => {
    setMobile(mobile);
  };

  return (
    <MobileNumber
      mobile={mobile}
      onChange={handleMobileChange}
      label="Mobile Number"
      isRequired
    />
  );
}

export default App;

```

### Props

- **mobile** (`string`, optional): The initial mobile number value. Default is an empty string.
- **countryCode** (`string`, optional): The default country code for the mobile number. Default is `"91"` (India).
- **disable** (`boolean`, optional): Indicates whether the input field should be disabled. Default is `false`.
- **isShowLabel** (`boolean`, optional): Controls the visibility of the label. Default is `true`.
- **isRequired** (`string`, optional): Determines if the field is required. Accepts values `"required"` or `"optional"`. Default is `"required"`.
- **allowDropdown** (`boolean`, optional): Enables or disables the country code dropdown. Default is `true`.
- **isFocused** (`boolean`, optional): Sets focus on the input field when `true`. Default is `false`.
- **placeholder** (`string`, optional): Placeholder text for the input field. Default is an empty string.
- **label** (`string`, optional): The label text displayed above the input field. Default is an empty string.
- **error** (`object`, optional): An object containing error information, typically with a `message` property to display any validation errors.
- **onChange** (`function`, required): Callback function triggered when the mobile number changes. It receives an object containing the mobile number, country code, and validation status.
- **inputClassName** (`string`, optional): Additional CSS classes for the input field.
- **containerClassName** (`string`, optional): Additional CSS classes for the container wrapping the input field.
- **labelClassName** (`string`, optional): Additional CSS classes for the label.
- **inputContainerClassName** (`string`, optional): Additional CSS classes for the input and country selector wrapper.

### Note

If using the component in a modal make sure that the overflow property of the modal is set to visible

This README provides a detailed overview of the `MobileNumber` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
