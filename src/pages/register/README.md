## Register Component

### Overview
The `Register` component provides a registration interface for new users, allowing them to fill in personal details such as name, email, mobile number, and password. It includes validation for each field and handles form submission. If registration is successful, it displays a verification component.

## Features

- **Form Fields**: Allows users to input their first name, last name, email, mobile number, password, and confirm password.
- **Field Validation**: Validates each input field with appropriate error messages.
- **Toggle Password Visibility**: Users can toggle the visibility of the password and confirm password fields.
- **Mobile Number Input**: Integrates a separate `MobileNumber` component for mobile number input and validation.
- **Conditional Rendering**: Displays the verification component if the registration is successful.
- **Dynamic Labels**: Adjusts labels for email and mobile fields based on the requirement level (hard/soft).

## Usage
To use the `Register` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import Register from 'fdk-react-templates/pages/Register';

const App = () => {
  const handleLoginButtonClick = () => {
    console.log("Navigate to login page");
  };

  const handleRegisterFormSubmit = (data) => {
    console.log("Registration data submitted:", data);
    // Simulate successful registration
    setTimeout(() => {
      // You can set the success state here
    }, 2000);
  };

  const verifyDetailsProps = {
    // Add any props needed for the verification component
  };

  return (
    <Register
      isFormSubmitSuccess={false}
      isMobile={true}
      mobileLevel="hard"
      isEmail={true}
      emailLevel="hard"
      error={null}
      loginButtonLabel="GO TO LOGIN"
      onLoginButtonClick={handleLoginButtonClick}
      onRegisterFormSubmit={handleRegisterFormSubmit}
      verifyDetailsProp={verifyDetailsProps}
    />
  );
}

export default App;

```

### Props

- **isFormSubmitSuccess**: Boolean indicating whether the registration form has been successfully submitted. Default is `false`.
- **isMobile**: Boolean to enable or disable the mobile number input field. Default is `true`.
- **mobileLevel**: String indicating the level of mobile number requirement, can be `"hard"` or `"soft"`. Default is `"hard"`.
- **isEmail**: Boolean to enable or disable the email input field. Default is `true`.
- **emailLevel**: String indicating the level of email requirement, can be `"hard"` or `"soft"`. Default is `"hard"`.
- **error**: Object containing error details to display on the form. Default is `null`.
- **loginButtonLabel**: String for the label of the login button. Default is `"GO TO LOGIN"`.
- **onLoginButtonClick**: Function callback triggered when the login button is clicked.
- **onRegisterFormSubmit**: Function callback triggered when the registration form is submitted.
- **verifyDetailsProp**: Object containing props for the verification component displayed after a successful registration.

```
This README provides a detailed overview of the `Register` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.