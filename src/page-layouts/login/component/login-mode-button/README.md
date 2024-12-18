# LoginModeButton Component

## Overview
The `LoginModeButton` component is a button used to toggle between login modes (OTP or password). It displays a label that changes based on the current login mode (either "LOGIN WITH PASSWORD" or "LOGIN WITH OTP"). The component includes an icon and is designed to be used in authentication flows where the user can toggle between different login methods.

## Features
- **Toggle Login Mode**: The button label changes between "LOGIN WITH PASSWORD" and "LOGIN WITH OTP" depending on the current mode.
- **Icon Display**: Displays an icon (`login-icon`) alongside the label.
- **Customizable Callback**: A customizable `onLoginToggleClick` function is called when the button is clicked.

## Usage
To use the `LoginModeButton` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import LoginModeButton from 'fdk-react-templates/page-layouts/login/component/login-mode-button/login-mode-button';
import 'fdk-react-templates/page-layouts/login/component/login-mode-button/login-mode-button.css';

const App = () => {
  const [isOtp, setIsOtp] = useState(true);

  const handleLoginToggleClick = () => {
    setIsOtp((prev) => !prev); // Toggle between OTP and password login modes
  };

  return (
    <div>
      <LoginModeButton isOtp={isOtp} onLoginToggleClick={handleLoginToggleClick} />
    </div>
  );
};

export default App;

```

### Props
- **isOtp** (boolean, optional): A flag indicating whether the current login mode is OTP (defaults to true). If `true`, the label will display "LOGIN WITH PASSWORD"; if `false`, it will display "LOGIN WITH OTP".
- **onLoginToggleClick** (function, optional): A callback function that is called when the button is clicked, typically used to toggle the login mode.

```
This README provides a detailed overview of the `LoginModeButton` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.