## AccountLocked Component

## Overview
The `AccountLocked` component displays a message indicating that the user's account is locked. It provides information on how to restore the account through a support email and includes a button to navigate back to the home page.

## Features

- **Dynamic Support Email**: Displays the support email address if the account is active and a support email is available.
- **Informational Messages**: Clearly communicates the account status and restoration instructions.
- **Action Button**: Provides a button to continue, which triggers the `openHomePage` function.

## Usage
To use the `AccountLocked` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import AccountLocked from 'fdk-react-templates/page-layouts/auth/account-locked/account-locked';
import 'fdk-react-templates/page-layouts/auth/account-locked/account-locked.css';

function App() {
  const emailInfo = {
    active: true,
    email: [{ value: 'support@example.com' }],
  };

  const handleOpenHomePage = () => {
    console.log("Navigating to home page...");
    // Implement navigation logic here
  };

  return (
    <AccountLocked
      email={emailInfo}
      openHomePage={handleOpenHomePage}
    />
  );
}

export default App;

```

### Props

- **email**: Object containing user email information. It has the following structure:
  - **active**: Boolean indicating if the support email is active. Default is `false`.
  - **email**: Array of email objects. Each email object should have a `value` property representing the email address.
  
- **openHomePage**: Function callback triggered when the "Continue" button is clicked, used to navigate back to the home page.

```
This README provides a detailed overview of the `AccountLocked` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
