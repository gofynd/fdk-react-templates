# Comment Component

## Overview
The `Comment` component allows users to add and edit comments. It features a text input for quick comments and a modal for more detailed input. The component also provides feedback on character limits and displays error messages if the comment exceeds the allowed length.

### Features
- **Comment Input**: Allows users to enter a comment up to 500 characters.
- **Modal for Editing**: Users can open a modal to edit the comment for more detailed instructions.
- **Character Count Feedback**: Displays the current character count and provides an error message if the limit is exceeded.

## Usage
To use the `Comment` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React, { useState } from 'react';
import Comment from 'fdk-react-templates/page-layouts/cart/Components/comment/comment';
import 'fdk-react-templates/page-layouts/cart/Components/comment/comment.css';

const App = () => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (newComment) => {
    setComment(newComment);
  };

  return (
    <div>
      <Comment 
        comment={comment} 
        onCommentChange={handleCommentChange} 
      />
    </div>
  );
};

export default App;

```

### Props
- **comment** (string, optional): The current comment text. Default is an empty string.
- **onCommentChange** (function, optional): Callback function that is triggered when the comment text changes. Default is an empty function.

```
This README provides a detailed overview of the `Comment` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
