## SetPassword Component

### Overview

The `SetPassword` component allows users to create a new password and confirm it. It provides validation to ensure that the password meets specified criteria and that the confirmation password matches the new password. The component displays error messages for invalid inputs and handles form submission through a callback function.

## Features

- **Password Input Fields**: Includes fields for entering and confirming a new password.
- **Field Validation**: Validates the new password for minimum length and complexity (at least 8 characters, 1 letter, 1 number, and 1 special character).
- **Confirmation Validation**: Ensures that the confirmation password matches the new password.
- **Dynamic Error Messages**: Displays error messages based on validation failures.
- **Error Handling**: Displays any root-level error passed through the `error` prop.
- **Submit Button State**: The submit button is disabled until the form is valid.

## Usage
To use the `SetPassword` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React, { useState } from 'react';
import SetPassword from 'fdk-react-templates/pages/set-password';

const App = () => {
  const [error, setError] = useState(null);

  const handleSetPasswordSubmit = (data) => {
    console.log("Password set:", data);
    // Simulate password setting logic here, and handle errors if needed
    const hasError = false; // Change based on actual logic
    if (hasError) {
      setError({ type: "manual", message: "Failed to set password" });
    }
  };

  return (
    <SetPassword
      error={error}
      onSetPasswordSubmit={handleSetPasswordSubmit}
    />
  );
}

export default App;

```

### Props

- **error**: Object containing error details to display on the form. Default is `null`.
- **onSetPasswordSubmit**: Function callback triggered when the password form is submitted.

```
This README provides a detailed overview of the `SetPassword` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
