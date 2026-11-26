# Login Component

### Overview
The `Login` component provides a login interface where users can either log in via password or OTP. It includes functionality for switching between login modes, viewing terms and privacy, and toggling to the registration page if enabled.

### Features

- **Logo Display**: Displays logos for desktop and mobile versions based on the `logo` prop.
- **Password Login**: Provides a form for password-based login when `isPassword` is enabled.
- **OTP Login**: Provides a form for OTP-based login when `isOtp` is enabled.
- **Login Mode Toggle**: Allows users to switch between password and OTP login modes.
- **Registration Toggle**: Shows a button to navigate to the registration page if `isRegisterEnabled` is `true`.
- **Terms and Privacy**: Displays terms and privacy information at the bottom of the login form.

## Usage
To use the `Login` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import Login from 'fdk-react-templates/pages/login';
import 'fdk-react-templates/pages/login/login.css';


const App = () => {
  const handleLoginFormSubmit = (data) => {
    console.log("Login form submitted:", data);
  };

  const handleRegisterButtonClick = () => {
    console.log("Navigate to register page");
  };

  const handleLoginToggleClick = () => {
    console.log("Toggled login mode");
  };

  const handleForgotPasswordClick = () => {
    console.log("Forgot password clicked");
  };

  const handleOtpSubmit = (otp) => {
    console.log("OTP submitted:", otp);
  };

  const handleResendOtpClick = () => {
    console.log("Resend OTP clicked");
  };

  const logoData = {
    desktop: { url: 'https://example.com/desktop-logo.png', link: '/', alt: 'Desktop Logo' },
    mobile: { url: 'https://example.com/mobile-logo.png', link: '/', alt: 'Mobile Logo' },
  };

  return (
    <Login
      logo={logoData}
      title="Welcome Back"
      subTitle="Please log in to continue"
      isPassword={true}
      isOtp={true}
      showLoginToggleButton={true}
      isRegisterEnabled={true}
      registerButtonLabel="Sign Up Now"
      onLoginToggleClick={handleLoginToggleClick}
      onRegisterButtonClick={handleRegisterButtonClick}
      onLoginFormSubmit={handleLoginFormSubmit}
      mobileInfo={{ number: '+123456789' }}
      otpResendTime={30}
      otpError={null}
      isFormSubmitSuccess={false}
      onOtpSubmit={handleOtpSubmit}
      onResendOtpClick={handleResendOtpClick}
      loginButtonText="Login"
      isForgotPassword={true}
      passwordError={null}
      onForgotPasswordClick={handleForgotPasswordClick}
    />
  );
}

export default App;

```

### Props

- **logo**: Object for displaying logo images on desktop and mobile versions.
- **title**: Title displayed at the top of the login form. Default is `"Login"`.
- **subTitle**: Subtitle displayed under the title. Default is `"Login to Shop"`.
- **isPassword**: Boolean to toggle the password-based login form. Default is `true`.
- **isOtp**: Boolean to toggle the OTP-based login form. Default is `true`.
- **showLoginToggleButton**: Boolean to display the button for toggling between login modes (password/OTP). Default is `true`.
- **isRegisterEnabled**: Boolean to enable the button for navigating to the registration page. Default is `true`.
- **registerButtonLabel**: Label for the register button. Default is `"GO TO REGISTER"`.
- **onLoginToggleClick**: Callback function for handling the login mode toggle button click.
- **onRegisterButtonClick**: Callback function for handling the register button click.
- **onLoginFormSubmit**: Callback function for submitting the login form (both password and OTP).
- **mobileInfo**: Information about the user's mobile number.
- **submittedMobile**: Boolean to indicate if the mobile number was submitted for OTP.
- **otpResendTime**: Time remaining before the OTP can be resent.
- **otpError**: Error message for OTP submission.
- **isFormSubmitSuccess**: Boolean to indicate if the form was successfully submitted.
- **onOtpSubmit**: Callback function for submitting the OTP form.
- **onResendOtpClick**: Callback function for handling OTP resend button click.
- **loginButtonText**: Text to display on the login button.
- **isForgotPassword**: Boolean to enable the "Forgot Password" option.
- **passwordError**: Error message for password submission.
- **onForgotPasswordClick**: Callback function for handling the "Forgot Password" button click.

```
This README provides a detailed overview of the `Login` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
