# VerifyEmail Component

## Overview

The `VerifyEmail` component is responsible for verifying an email based on a query parameter (code) in the URL. It displays a success or failure message depending on the result of the email verification process.

## Features

- **URL Query Handling**: Retrieves the email verification code from the URL using useSearchParams.
- **Async Email Verification**: Asynchronously verifies the email using the provided verifyEmail function.
- **Error Handling**: Displays an error message if the verification fails or the code is invalid/expired.
- **Success Message**: Displays a success message when the email is successfully verified.

## Usage

To use the `VerifyEmail` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import VerifyEmail from 'fdk-react-templates/pages/verify-email/verify-email.js';

const handleEmailVerification = async (code) => {
  // Logic to verify the email using the provided code
  if (!code) {
    throw new Error('Invalid Code');
  }
  // Assume verification process here
};

const App = () => (
  <VerifyEmail verifyEmail={handleEmailVerification} />
);

export default App;
```

### Props

- **verifyEmail**: A function that takes the verification code as an argument and processes the email verification.

```

This README provides a detailed overview of the `VerifyEmail` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
