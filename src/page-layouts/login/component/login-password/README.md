# LoginPassword Component

## Overview
The `LoginPassword` component is a form used for logging in with either an email or phone number and a password. It includes features like password visibility toggle, phone number validation, and a forgot password option. It uses `react-hook-form` for form handling and validation.

## Features
- **Email or Phone Input**: Allows users to log in using either their email or phone number. The input dynamically switches based on the user's input.
- **Password Toggle**: Provides the ability to toggle between showing or hiding the password.
- **Forgot Password**: Includes a "Forgot Password?" button to trigger the password recovery process.
- **Form Validation**: Uses `react-hook-form` for form validation, including username, password, and phone number fields.
- **Error Handling**: Displays form error messages based on the validation result.
- **Submit Button**: A submit button that is disabled until the form is valid.


## Usage
To use the `LoginPassword` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from 'react';
import LoginPassword from 'fdk-react-templates/page-layouts/login/component/login-password/login-password';
import 'fdk-react-templates/page-layouts/login/component/login-password/login-password.css';

const App = () => {
  const handleLoginFormSubmit = (data) => {
    console.log('Login form submitted with data:', data);
  };

  const handleForgotPasswordClick = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div>
      <LoginPassword
        loginButtonText="Log In"
        onLoginFormSubmit={handleLoginFormSubmit}
        onForgotPasswordClick={handleForgotPasswordClick}
      />
    </div>
  );
};

export default App;

```

### Props
- **loginButtonText** (string, optional): Text for the login button (default is "LOGIN").
- **error** (object, optional): Error message to display at the top of the form (if any).
- **isForgotPassword** (boolean, optional): If true, shows the "Forgot Password?" button (default is true).
- **onForgotPasswordClick** (function, optional): Callback for when the "Forgot Password?" button is clicked.
- **onLoginFormSubmit** (function, optional): Callback for submitting the login form with the username (or phone number) and password.

```
This README provides a detailed overview of the `LoginPassword` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.