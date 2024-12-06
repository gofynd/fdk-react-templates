# Phone Component

## Overview

The `Phone` component manages user mobile numbers by allowing users to verify, set a primary number, delete numbers, and add new numbers. It provides an intuitive interface for handling mobile number actions.

## Features

- **Mobile Number Verification**: Allows users to verify their mobile numbers. A "Verify" button appears for unverified numbers.
- **Set Primary Number**: Users can designate one of their verified numbers as the primary number with a "Set Primary" button.
- **Add New Mobile Number**: Provides functionality to add a new mobile number using a modal.
- **Delete Mobile Number**: Users can remove a mobile number from their list, triggering a confirmation modal.
- **Loading State**: Displays loading indicators on buttons during actions like setting a primary number and deleting a number.
- **Responsive UI**: Designed to be user-friendly, the component provides visual feedback for user actions related to mobile numbers.

## Usage
To use the `Phone` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import Phone from 'fdk-react-templates/pages/profile/phone';
import 'fdk-react-templates/pages/profile/phone/phone.css';

const phoneData = [
  { phone: "1234567890", verified: true, primary: true },
  { phone: "0987654321", verified: false, primary: false },
];

const setMobileNumberAsPrimary = async (phone) => {
  // Logic to set mobile number as primary
};

const deleteMobileNumber = async (phone) => {
  // Logic to delete mobile number
};

const sendOtpMobile = async (phone) => {
  // Logic to send OTP
};

const verifyMobileOtp = async (otp) => {
  // Logic to verify OTP
};

const resendOtp = async (phone) => {
  // Logic to resend OTP
};

const App = () => (
  <Phone
    phoneNumbers={phoneData}
    setMobileNumberAsPrimary={setMobileNumberAsPrimary}
    deleteMobileNumber={deleteMobileNumber}
    sendOtpMobile={sendOtpMobile}
    verifyMobileOtp={verifyMobileOtp}
    resendOtp={resendOtp}
  />
);

export default App;
```

### Props

- **setMobileNumberAsPrimary**: A function to set the specified mobile number as the primary number.
- **deleteMobileNumber**: A function to delete the specified mobile number.
- **phoneNumbers**: An array of mobile number objects, each containing details about the mobile number (e.g., phone, verified, primary).
- **sendOtpMobile**: A function to send an OTP to the specified mobile number.
- **verifyMobileOtp**: A function to verify the OTP entered by the user.
- **resendOtp**: A function to resend the OTP to the specified mobile number.

```
This README provides a detailed overview of the `Phone` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
