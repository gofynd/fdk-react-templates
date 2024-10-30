# ForgotPassword Component

## Overview

The `ForgotPassword` component provides a form for users to request a password reset by entering their email address. It validates the input, handles errors, and displays a success message upon form submission. Users can also resend the reset email if needed.

### Features

- **Email Input**: Allows users to enter their email for password reset.
- **Form Validation**: Validates the email input and displays error messages if invalid.
- **Success Feedback**: Shows a success message when the reset link is sent.
- **Resend Email**: Offers the option to resend the reset link.
- **Navigation**: Includes a "Back to Login" button for easy redirection.

## Usage
To use the `ForgotPassword` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import ForgotPassword from 'fdk-react-templates/pages/forgot-password';

const handleForgotPasswordSubmit = (data) => {
  console.log("Reset password request submitted:", data);
};

const handleBackToLogin = () => {
  console.log("Navigating back to login");
};

const handleResendEmail = (email) => {
  console.log("Resending reset link to:", email);
};

const App = () => (
  <ForgotPassword
    onForgotPasswordSubmit={handleForgotPasswordSubmit}
    onBackToLoginClick={handleBackToLogin}
    onResendEmailClick={handleResendEmail}
  />
);

export default App;

```

### Props

- **isFormSubmitSuccess** (boolean): Indicates whether the form submission was successful. Defaults to false.
- **error** (object): Error object used for displaying validation or server-side errors. Defaults to null.
- **onForgotPasswordSubmit** (function): Callback function triggered when the form is submitted. Defaults to an empty function.
- **onBackToLoginClick** (function): Callback function triggered when the "Back to login" button is clicked. Defaults to an empty function.
- **onResendEmailClick** (function): Callback function triggered when the "Resend email" button is clicked, passing the form's email value as an argument. Defaults to an empty function.

```
This README provides a detailed overview of the `ForgotPassword` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
