# Email Component

## Overview

The `Email` component allows users to manage their email addresses by verifying, adding, setting a primary email, and deleting emails. It provides a user-friendly interface for interacting with email-related actions.

## Features

- **Email Verification**: Allows users to send verification links to their email addresses. A "Verify" button appears for unverified emails.
- **Set Primary Email**: Users can set one of their verified emails as the primary email with a "Set Primary" button.
- **Add New Email**: Provides functionality to add a new email address using a modal.
- **Delete Email**: Users can remove an email from their list, which triggers a confirmation modal.
- **Loading State**: Displays loading indicators on buttons when actions are being processed, such as verification and setting the primary email.
- **Responsive UI**: The component is designed to be user-friendly and responsive, providing visual feedback for actions taken on the email addresses.

## Usage
To use the `Email` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import Email from 'fdk-react-templates/pages/profile/email';


const emailData = [
  { email: "example1@mail.com", verified: true, primary: true },
  { email: "example2@mail.com", verified: false, primary: false },
];

const sendVerificationLinkToEmail = async (email) => {
  // Logic to send verification link
};

const setEmailAsPrimary = async (email) => {
  // Logic to set email as primary
};

const addEmail = async (email) => {
  // Logic to add new email
};

const deleteEmail = async (email) => {
  // Logic to delete email
};

const App = () => (
  <Email
    emails={emailData}
    sendVerificationLinkToEmail={sendVerificationLinkToEmail}
    setEmailAsPrimary={setEmailAsPrimary}
    addEmail={addEmail}
    deleteEmail={deleteEmail}
  />
);

export default App;
```

### Props

- **sendVerificationLinkToEmail**: A function to send a verification link to the specified email address.
- **setEmailAsPrimary**: A function to set the specified email address as the primary email.
- **addEmail**: A function to add a new email address.
- **deleteEmail**: A function to delete a specified email address.
- **emails**: An array of email objects, each containing details about the email (e.g., email, verified, primary).

```
This README provides a detailed overview of the `Email` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
