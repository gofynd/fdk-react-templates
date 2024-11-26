## LoginRegisterToggle

## Overview
The `LoginRegisterToggle` component renders a button that allows users to toggle between login and registration views.

## Features

- **Toggle Functionality**: Provides a mechanism to switch between login and registration interfaces.
- **Customizable Label**: Allows the button label to be set via props, making it flexible for different contexts.
- **Event Handling**: Supports custom click handling through the `onClick` prop.
- **Accessibility**: Includes a button element, which is inherently accessible and can be easily focused and activated.

## Usage
To use the `LoginRegisterToggle` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import LoginRegisterToggle from 'fdk-react-templates/page-layouts/auth/login-regiter-toggle/login-regiter-toggle';
import 'fdk-react-templates/page-layouts/auth/login-regiter-toggle/login-regiter-toggle.css';

const App = () => {

  return ( 
    <LoginRegisterToggle 
      label="GO TO REGISTER" 
      onClick={() => console.log('Toggle clicked')} 
    />
  );
}

export default App;

```

### Props

- **label** (`string`, optional): The label for the toggle button. Default is `"GO TO REGISTER"`.
- **onClick** (`function`, optional): Callback function invoked when the toggle button is clicked. Default is an empty function.

```
This README provides a detailed overview of the `LoginRegisterToggle` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
