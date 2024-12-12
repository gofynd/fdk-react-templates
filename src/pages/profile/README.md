# ProfileDetails Component

## Overview

The `ProfileDetails` component allows users to view and update their profile information, including first name, last name, and gender. It uses React Hook Form for form handling and validation.

## Features

- **Form Handling**: The component uses react-hook-form to manage form data and validation.Fields include: firstName (required), lastName (required) and gender (radio input)
- **Default Values**: The form is pre-filled with values from userData, and the form resets when userData is updated.
- **Validation**: Displays errors if required fields (firstName, lastName) are left empty.
- **Save Button**: The "Save" button is disabled if there are validation errors or if the form data has not changed.
- **Loading State**: The component displays a loading state while the handleSave function is processing.
- **Radio Input for Gender**: Users can select their gender from a set of radio buttons, with options defined in the GENDER_OPTIONS constant

## Usage
To use the `ProfileDetails` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import ProfileDetails from 'fdk-react-templates/pages/profile';
import 'fdk-react-templates/pages/profile/profile-details.css';

const App = () => {

  const userData = {
  firstName: "John",
  lastName: "Doe",
  gender: "male"
  };

  const saveProfileData = async (data) => {
    // Logic to save profile data
    console.log("Profile data saved:", data);
  };

  return (
    <ProfileDetails userData={userData} handleSave={saveProfileData} />
  )
};

export default App;
```

### Props

- **userData**: An object containing the user's profile data (firstName, lastName, gender).
- **handleSave**: A function that handles saving the updated profile data. It should accept the form data as an argument.

```
This README provides a detailed overview of the `ProfileDetails` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
