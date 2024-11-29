# ShareCart Component

## Overview
The `ShareCart` component allows users to share their shopping cart with others. It displays a button for sharing the cart, and upon clicking, it opens a modal with options to share via QR code or social media.

## Features
- **Share Button**: Displays a button to share the shopping cart.
- **QR Code**: Allows users to share their cart via a QR code.
- **Social Media Sharing**: Provides options to share on Facebook and Twitter.

## Usage
To use the `ShareCart` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import ShareCart from 'fdk-react-templates/page-layouts/cart/Components/share-cart/share-cart';
import  'fdk-react-templates/page-layouts/cart/Components/share-cart/share-cart.css';

const App = () => {
  const [isShareLoading, setShareLoading] = useState(false);
  const [qrCode, setQrCode] = useState("http://example.com/qrcode");

  const handleCopyToClipboardClick = () => {
    console.log('Link copied to clipboard');
  };

  const handleFacebookShareClick = () => {
    console.log('Shared on Facebook');
  };

  const handleTwitterShareClick = () => {
    console.log('Shared on Twitter');
  };

  const handleShareClick = () => {
    setShareLoading(true);
    // Simulate sharing action
    setTimeout(() => {
      setShareLoading(false);
    }, 2000);
  };

  return (
      <ShareCart
        showCard={true}
        qrCode={qrCode}
        isShareLoading={isShareLoading}
        onCopyToClipboardClick={handleCopyToClipboardClick}
        onFacebookShareClick={handleFacebookShareClick}
        onTwitterShareClick={handleTwitterShareClick}
        onShareClick={handleShareClick}
      />
  );
};

export default App;

```

### Props
- **showCard** (boolean, optional): Determines whether to show the share card layout. Defaults to `false`.
- **qrCode** (string, optional): The QR code URL to be displayed in the modal. Defaults to an empty string.
- **isShareLoading** (boolean, optional): Indicates whether the sharing action is in progress. Defaults to `true`.
- **onCopyToClipboardClick** (function, optional): Callback function triggered when the copy to clipboard action is initiated.
- **onFacebookShareClick** (function, optional): Callback function triggered when the Facebook share button is clicked.
- **onTwitterShareClick** (function, optional): Callback function triggered when the Twitter share button is clicked.
- **onShareClick** (function, optional): Callback function triggered when the share button is clicked.

```
This README provides a detailed overview of the `ShareCart` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.

