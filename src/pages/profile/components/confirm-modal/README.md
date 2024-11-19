## ConfirmModal Component

## Overview
The `ConfirmModal` component provides a modal dialog for displaying a confirmation prompt with customizable text and actions. It allows the user to either confirm or cancel an action, with separate callbacks for each option. The modal also shows a loading indicator while the confirmation action is being processed.

## Features
- **Customizable Header and Text**: Allows custom header and body text to be displayed in the modal.
- **Action Buttons**: Displays two buttons, a cancel button (left) and a confirm button (right), with customizable labels.
- **Loading State**: Shows a loading indicator on the confirm button while the confirmation action is being processed.
- **Callback Functions**: Provides callback functions for both confirm (`onConfirm`) and cancel (`onCancel`) actions.

### Example
```jsx
import React, { useState } from 'react';
import ConfirmModal from 'fdk-react-templates/pages/profile/components/confirm-modal/confirm-modal';
import 'fdk-react-templates/pages/profile/components/confirm-modal/confirm-modal.css';

const App = () => {

  const handleConfirm = async () => {
    console.log('Confirmed');
  };

  const handleCancel = () => {
    console.log('Cancelled');
  };

  const handleClose = () => {
    console.log("closed")
  }

  return (
    <>
      <ConfirmModal
        isOpen={true} //Set accordingly
        onClose={handleClose}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        header="Are you sure?"
        text="You are about to delete this item."
        leftButton="Cancel"
        rightButton="Delete"
      />
    </>
  );
};

export default App;

```

### Props
- **isOpen** (boolean, required): Determines whether the modal is open or closed.
- **onClose** (function, required): A callback function triggered when the modal is closed.
- **header** (string, optional): The title of the modal. Defaults to `"Confirm"`.
- **text** (string, optional): The text displayed in the body of the modal.
- **leftButton** (string, optional): The label for the left button (cancel). Defaults to `"No"`.
- **rightButton** (string, optional): The label for the right button (confirm). Defaults to `"Yes"`.
- **onConfirm** (function, required): A callback function triggered when the confirm button is clicked.
- **onCancel** (function, required): A callback function triggered when the cancel button is clicked.

This README provides a detailed overview of the `ConfirmModal` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.

