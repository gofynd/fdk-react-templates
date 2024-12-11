## AddPhoneModal Component

## Overview
The `AddPhoneModal` component provides a modal dialog for adding and verifying a phone number. It allows users to enter their phone number, receive an OTP (One-Time Password), and verify the OTP. It integrates with React Hook Form for form handling and provides feedback to users during submission, including loading indicators and the option to resend OTP.

## Features
- **Phone Number Input**: Allows the user to enter a phone number with validation using the `MobileNumber` component.
- **OTP Handling**: After submitting the phone number, the component shows a field for OTP entry and manages OTP submission and verification.
- **Resend OTP**: Provides the option to resend OTP after a specified timer.
- **Loading State**: Displays loading indicators while submitting the phone number or verifying OTP.
- **Modal Presentation**: Displays the modal with the appropriate title and form based on the current step (Add Number or Verify Number).
- **Error Display**: Shows error messages for invalid phone numbers or OTP.

## Usage
To use the `AddPhoneModal` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import AddPhoneModal from 'fdk-react-templates/pages/profile/components/add-phone-modal/add-phone-modal';
import 'fdk-react-templates/pages/profile/components/add-phone-modal/add-phone-modal.css';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sendOtpMobile = async ({ mobile, countryCode }) => {
    // Simulate sending OTP
    return new Promise((resolve) => setTimeout(() => resolve({ request_id: '123', resend_timer: 30 }), 2000));
  };

  const verifyMobileOtp = async ({ requestId, otp }) => {
    // Simulate OTP verification
    console.log('Verifying OTP for requestId:', requestId, 'with OTP:', otp);
  };

  const resendOtp = async ({ mobile, countryCode, token }) => {
    // Simulate resending OTP
    return new Promise((resolve) => setTimeout(() => resolve({ resend_timer: 30 }), 2000));
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Open Add Phone Modal</button>
      <AddPhoneModal
        sendOtpMobile={sendOtpMobile}
        verifyMobileOtp={verifyMobileOtp}
        resendOtp={resendOtp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default App;

```

### Props
- **sendOtpMobile** (function, required): A function to send the OTP to the phone number. It receives the mobile number and country code as arguments.
- **verifyMobileOtp** (function, required): A function to verify the OTP. It receives the request ID and OTP as arguments.
- **resendOtp** (function, required): A function to resend the OTP when the timer expires.
- **isOpen** (boolean, required): Determines whether the modal is open or closed.
- **onClose** (function, required): A callback function triggered when the modal is closed.

This README provides a detailed overview of the `AddPhoneModal` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
