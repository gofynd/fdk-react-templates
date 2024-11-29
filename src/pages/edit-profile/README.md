# EditProfile Component

## Overview

The `EditProfile` component renders a form for editing user profile details such as first name, last name, gender, email, and mobile number. It also handles form validation and allows users to log out or skip the form. Upon successful form submission, the component transitions to a verification process.

## Features

- **Form Fields**: First Name, Last Name, Gender, Email, Mobile Number
- **Validation**: The form includes client-side validation for the first name, last name, email, and mobile number fields.
Validation errors are displayed under each input field if validation fails. The email and mobile fields can be marked as required or optional based on the emailLevel and mobileLevel props.
bmission, the component transitions to the VerifyBoth component for verification, with props passed via verifyDetailsProp.

## Usage
To use the `EditProfile` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import EditProfile from 'fdk-react-templates/pages/edit-profile';
import 'fdk-react-templates/pages/edit-profile/edit-profile.css';

const user = {
  firstName: "John",
  lastName: "Doe",
  gender: "male",
  email: "john.doe@example.com",
  phone: {
    countryCode: "91",
    mobile: "1234567890",
    isValidNumber: true,
  },
};

const handleEditProfileSubmit = (data) => {
  console.log("Form submitted:", data);
};

const handleLogoutClick = () => {
  console.log("User logged out");
};

const handleSkipClick = () => {
  console.log("User skipped profile editing");
};

const App = () => (
  <EditProfile
    user={user}
    onEditProfileSubmit={handleEditProfileSubmit}
    onLogoutButtonClick={handleLogoutClick}
    onSkipButtonClick={handleSkipClick}
  />
);

export default App;

```

### Props

- **isFormSubmitSuccess** (boolean): Indicates whether the form submission was successful. Defaults to false.
- **user** (object): An object containing user details:
  - firstName (string): User’s first name. Defaults to an empty string.
  - lastName (string): User’s last name. Defaults to an empty string.
  - gender (string): User’s gender, default is "male".
  - email (string): User’s email address. Defaults to an empty string.
  - phone (object): User’s phone details:
  - countryCode (string): The country code for the phone number. Defaults to "91".
  - mobile (string): The mobile number. Defaults to an empty string.
  - isValidNumber (boolean): Whether the phone number is valid. Defaults to false.
- **isEmail** (boolean): Whether to display the email field. Defaults to true.
- **emailLevel** (string): The level of requirement for the email field. Accepts "hard" for required, "soft" for optional. Defaults to "hard".
- **primaryEmail** (object): An object containing information about the primary email. Defaults to an empty object.
- **isMobile** (boolean): Whether to display the mobile number field. Defaults to true.
- **mobileLevel** (string): The level of requirement for the mobile number field. Accepts "hard" for required, "soft" for optional. Defaults to "hard".
- **primaryPhone** (object): An object containing information about the primary phone number. Defaults to an empty object.
- **isLogoutButton** (boolean): Whether to show the "Logout" button. Defaults to true.
- **isSkipButton** (boolean): Whether to show the "Skip" button. Defaults to true.
- **error** (object): An error object that contains form validation error messages. Defaults to null.
- **verifyDetailsProp** (object): Props to be passed to the VerifyBoth component after form submission. Defaults to an empty object.
- **onEditProfileSubmit** (function): Callback function triggered when the form is submitted. Defaults to an empty function.
- **onLogoutButtonClick** (function): Callback function triggered when the "Logout" button is clicked. Defaults to an empty function.
- **onSkipButtonClick** (function): Callback function triggered when the "Skip" button is clicked. Defaults to an empty function.

```
This README provides a detailed overview of the `EditProfile` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
