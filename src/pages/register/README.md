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
import Register from 'fdk-react-templates/pages/register';
import 'fdk-react-templates/pages/register/register.css';

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

### Page Configuration

This configuration allows you to customize the **Register Page** on the Fynd platform. It controls the layout and appearance of the registration page, including the banner settings.

| **Configuration**             | **Type**       | **Default Value**  | **Description**                                                                                   |
|-------------------------------|----------------|--------------------|---------------------------------------------------------------------------------------------------|
| `image_layout`                | `select`       | `no_banner`        | Choose the image layout for the registration page. Options: **No Banner**, **Right Banner**, or **Left Banner**. |
| `image_banner`                | `image_picker` | `""`               | Upload the banner image to be displayed on the registration page.                                  |

#### Steps to Modify Page Configuration via Fynd Platform

1. **Log in to the Fynd Platform:**
   - Go to [Fynd Platform](https://platform.fynd.com) and log in with your credentials.

2. **Navigate to Your Company:**
   - Once logged in, select your company from the list.

3. **Select the Theme:**
   - In the sidebar, under **Sales Channel**, select your sales channel.
   - Then, under **Appearance**, click on **Themes**.
   - In the current theme, click on **Edit**. Here, you can preview and configure the theme.  
     Here's a sample [theme](https://platform.fynd.com/company/5178/application/668765e1c984016d78222a21/themes/668768e7e21c099a562b5d56/edit).

4. **Navigate to the Page Configuration:**
   - Within the theme editor, navigate to the **Register Page**.
   - You can use the dropdown on the top to select the desired page.
   - Under the **Configuration** section, locate and click on the **Page** settings for the Register Page.

5. **Modify Page Configurations:**
   - Adjust the settings for the Register Page based on your requirements:
     - Select the appropriate image layout for the registration page.
     - Upload the banner image for the registration page.

6. **Preview Changes:**
   - Preview the updates made to the page in real-time to ensure they look and function as expected.

7. **Save and Publish:**
   - After confirming your changes, click on **Save**. This will publish the updated configurations for the Register Page.

8. **Test Your Storefront:**
   - Visit your store's live URL and navigate to the Register Page to confirm the changes are reflected and working as intended.

By following these steps, you can easily customize the Register Page configuration to match your business needs.

```
This README provides a detailed overview of the `Register` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.