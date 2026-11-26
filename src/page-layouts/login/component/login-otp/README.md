# LoginOtp Component

## Overview
The `LoginOtp` component is a form used to request and verify OTP (One Time Password) for login purposes. It includes phone number input, OTP input, and the ability to resend the OTP. It uses `react-hook-form` for form handling and validation.

## Features
- **Phone Number Input**: Allows users to input their phone number and validates its format.
- **OTP Input**: After submitting the phone number, the user receives an OTP to verify their phone number.
- **Resend OTP**: Users can resend the OTP after a certain timeout period.
- **OTP Form Submit**: Handles the OTP submission and displays an error message if the OTP is invalid.
- **Dynamic Form Switching**: Depending on whether the form submission is successful, it switches between the phone input and OTP verification forms.

## Usage
To use the `LoginOtp` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import LoginOtp from 'fdk-react-templates/page-layouts/login/component/login-otp/login-otp';
import 'fdk-react-templates/page-layouts/login/component/login-otp/login-otp.css';

const App = () => {
  const [otpError, setOtpError] = useState(null);
  const [otpResendTime, setOtpResendTime] = useState(0);
  const [submittedMobile, setSubmittedMobile] = useState('');

  const handleLoginFormSubmit = (data) => {
    console.log('Phone number submitted:', data);
    setSubmittedMobile(data.phone.mobile);
  };

  const handleOtpSubmit = (data) => {
    console.log('OTP submitted:', data);
    // Handle OTP verification logic here
  };

  const handleResendOtpClick = () => {
    console.log('Resending OTP...');
    setOtpResendTime(30); // Reset resend time
  };

  return (
    <div>
      <LoginOtp
        mobileInfo={{ mobile: '', countryCode: '91', isValidNumber: false }}
        submittedMobile={submittedMobile}
        otpResendTime={otpResendTime}
        otpError={otpError}
        onLoginFormSubmit={handleLoginFormSubmit}
        onOtpSubmit={handleOtpSubmit}
        onResendOtpClick={handleResendOtpClick}
      />
    </div>
  );
};

export default App;

```

### Props
- **mobileInfo** (object, optional): An object containing the initial phone number information (country code, mobile number, and validity status).
- **submittedMobile** (string, optional): The mobile number submitted to receive the OTP.
- **otpResendTime** (number, optional): The time remaining before the OTP can be resent (in seconds).
- **otpError** (string, optional): An error message related to OTP submission, if any.
- **isFormSubmitSuccess** (boolean, optional): If true, the form switches to OTP input after phone number submission.
- **onLoginFormSubmit** (function, optional): Callback for when the phone number form is submitted.
- **onOtpSubmit** (function, optional): Callback for when the OTP form is submitted.
- **onResendOtpClick** (function, optional): Callback for when the "Resend OTP" button is clicked.

```
This README provides a detailed overview of the `LoginOtp` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.