# ShareCartModal Component

## Overview
The `ShareCartModal` component displays a modal for sharing the shopping cart. It shows a QR code, options to share via social media, and a loading indicator while the sharing process is ongoing.

## Features
- **QR Code Display**: Shows a QR code for easy sharing.
- **Social Media Sharing**: Provides buttons to share the cart on Facebook and Twitter.
- **Copy to Clipboard**: Allows users to copy the cart link to the clipboard.
- **Loading Indicator**: Displays a loader while the sharing process is in progress.

## Usage
To use the `ShareCartModal` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import ShareCartModal from 'fdk-react-templates/page-layouts/cart/Components/share-cart-modal/share-cart-modal';
import 'fdk-react-templates/page-layouts/cart/Components/share-cart-modal/share-cart-modal.css';

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isShareLoading, setShareLoading] = useState(false);
  const qrCodeHtml = "<svg>Your QR Code Here</svg>"; // Replace with actual QR code SVG

  const handleCopyToClipboardClick = () => {
    console.log('Link copied to clipboard');
  };

  const handleFacebookShareClick = () => {
    console.log('Shared on Facebook');
  };

  const handleTwitterShareClick = () => {
    console.log('Shared on Twitter');
  };

  const handleCloseModalClick = () => {
    setModalOpen(false);
  };

  const handleShareClick = () => {
    setShareLoading(true);
    // Simulate sharing action
    setTimeout(() => {
      setShareLoading(false);
    }, 2000);
  };

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Open Share Modal</button>
      <ShareCartModal
        isOpen={isModalOpen}
        title="Spread the shopping delight! Scan the QR code & share!"
        qrCode={qrCodeHtml}
        isShareLoading={isShareLoading}
        onCopyToClipboardClick={handleCopyToClipboardClick}
        onFacebookShareClick={handleFacebookShareClick}
        onTwitterShareClick={handleTwitterShareClick}
        onCloseDialogClick={handleCloseModalClick}
      />
    </div>
  );
};

export default App;

```

### Props
- **isOpen** (boolean, optional): Determines whether the modal is open. Defaults to `false`.
- **title** (string, optional): The title to display in the modal. Defaults to an empty string.
- **qrCode** (string, optional): The QR code HTML to display in the modal. Defaults to an empty string.
- **isShareLoading** (boolean, optional): Indicates whether the sharing action is in progress. Defaults to `false`.
- **onCopyToClipboardClick** (function, optional): Callback function triggered when the copy to clipboard action is initiated.
- **onFacebookShareClick** (function, optional): Callback function triggered when the Facebook share button is clicked.
- **onTwitterShareClick** (function, optional): Callback function triggered when the Twitter share button is clicked.
- **onCloseDialogClick** (function, optional): Callback function triggered when the modal is closed.

```
This README provides a detailed overview of the `ShareCartModal` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.