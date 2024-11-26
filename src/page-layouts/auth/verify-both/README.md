## VerifyBoth Component

### Overview
The `VerifyBoth` component manages the verification process for both mobile and email OTPs. It conditionally renders the mobile and email verification sections based on the provided props, handling the display of error messages and OTP submission functionality.

### Features
- **Conditional Rendering**: Displays mobile and/or email OTP verification forms based on the provided props.
- **Dynamic Error Handling**: Handles and displays form errors for both mobile and email verification.
- **Resend OTP Functionality**: Provides options to resend the OTP for both mobile and email with countdown timers.

## Usage
To use the `VerifyBoth` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import VerifyBoth from 'fdk-react-templates/page-layouts/auth/verify-both/verify-both';
import 'fdk-react-templates/page-layouts/auth/verify-both/verify-both.css';

function App() {
  const [submittedMobile, setSubmittedMobile] = useState("1234567890");
  const [mobileOtpResendTime, setMobileOtpResendTime] = useState(30);
  const [mobileFormError, setMobileFormError] = useState(null);
  const [submittedEmail, setSubmittedEmail] = useState("user@example.com");
  const [emailOtpResendTime, setEmailOtpResendTime] = useState(30);
  const [emailFormError, setEmailFormError] = useState(null);

  const handleMobileVerifySubmit = (data) => {
    console.log("Mobile OTP submitted:", data);
    // Implement verification logic here
  };

  const handleResendMobileOtp = () => {
    console.log("Resending mobile OTP...");
    // Implement resend logic here
  };

  const handleEmailVerifySubmit = (data) => {
    console.log("Email OTP submitted:", data);
    // Implement verification logic here
  };

  const handleResendEmailOtp = () => {
    console.log("Resending email OTP...");
    // Implement resend logic here
  };

  return (
    <VerifyBoth
      submittedMobile={submittedMobile}
      mobileOtpResendTime={mobileOtpResendTime}
      mobileFormError={mobileFormError}
      submittedEmail={submittedEmail}
      emailOtpResendTime={emailOtpResendTime}
      emailFormError={emailFormError}
      onVerifyMobileSubmit={handleMobileVerifySubmit}
      onResendMobileOtpClick={handleResendMobileOtp}
      onVerifyEmailSubmit={handleEmailVerifySubmit}
      onResendEmailOtpClick={handleResendEmailOtp}
    />
  );
}

export default App;

```
### Props

- **isShowMobileOtp** (boolean, optional): Determines whether to show the mobile OTP verification section. Default is true.
- **isShowEmailOtp** (boolean, optional): Determines whether to show the email OTP verification section. Default is true.
- **submittedMobile** (string, optional): The mobile number to which the OTP was sent. Default is an empty string.
- **mobileOtpResendTime** (number, optional): The remaining time (in seconds) to resend the mobile OTP. Default is 0.
- **mobileFormError** (object, optional): Error object for mobile OTP form validation. Default is null.
- **submittedEmail** (string, optional): The email address to which the OTP was sent. Default is an empty string.
- **emailOtpResendTime** (number, optional): The remaining time (in seconds) to resend the email OTP. Default is 0.
- **emailFormError** (object, optional): Error object for email OTP form validation. Default is null.
- **onVerifyMobileSubmit** (function, required): Callback function triggered when the mobile OTP is submitted.
- **onResendMobileOtpClick** (function, required): Callback function triggered when the "Resend OTP" button for mobile is clicked.
- **onVerifyEmailSubmit** (function, required): Callback function triggered when the email OTP is submitted.
- **onResendEmailOtpClick** (function, required): Callback function triggered when the "Resend OTP" button for email is clicked.

```
This README provides a detailed overview of the `VerifyBoth, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
