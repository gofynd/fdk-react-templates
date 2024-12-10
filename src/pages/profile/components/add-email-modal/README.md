## AddEmailModal Component

## Overview
The `AddEmailModal` component is a modal dialog that provides a form for adding a new email address. It features client-side validation and integrates with React Hook Form for handling form input and validation. The component also provides feedback to users when the submission is loading.

## Features
- **Form Handling with Validation**: Uses `react-hook-form` for form input handling, including validation for email addresses.
- **Loading State**: Shows a loading indicator while the email is being processed.
- **Modal Presentation**: Displays a modal with a form for user interaction.
- **Error Display**: Shows validation error messages directly below the input field.

## Usage
To use the `AddEmailModal` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React, { useState } from 'react';
import AddEmailModal from 'fdk-react-templates/pages/profile/components/add-email-modal/add-email-modal';
import'fdk-react-templates/pages/profile/components/add-email-modal/add-email-modal.css';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddEmail = async (email) => {
    console.log('Adding email:', email);
    // Simulate an API call
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Open Add Email Modal</button>
      <AddEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEmail}
      />
    </>
  );
};

export default App;
```

### Props
- **isOpen** (boolean, required): Determines whether the modal is open or closed.
- **onClose** (function, required): A callback function triggered when the modal is closed.
- **onAdd** (function, required): A callback function triggered when the form is submitted. Receives the submitted email as an argument.

This README provides a detailed overview of the `AddEmailModal` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.



