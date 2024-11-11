# BlogFooter Component

## Overview

The `BlogFooter` component is designed to display a footer section at the bottom of the blog page. It can show a title, a description, and a call-to-action button, providing additional context or links for the user.

## Features

- **Conditional Rendering**: The footer only renders if at least one of the props (`title`, `description`, or `button_text`) is provided.
- **Styled Components**: Utilizes modular CSS for maintainable and customizable styling.
- **Link Navigation**: The button can navigate to a specified link using the `FDKLink` component.

## Usage

To use the `BlogFooter` component, import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import BlogFooter from "./BlogFooter";

const App = () => {
  return (
    <div>
      <BlogFooter
        title="Stay Updated!"
        description="Subscribe to our newsletter for the latest updates."
        button_text="Subscribe Now"
        button_link="/subscribe"
      />
    </div>
  );
};

export default App;
```

## Props

- **title**: A string representing the title of the footer section.
- **description**: A string providing additional information or context displayed below the title.
- **button_text**: A string for the text to be displayed on the call-to-action button.
- **button_link**: A string that represents the URL to navigate to when the button is clicked.

## Component Structure

The `BlogFooter` component consists of the following key sections:

1. **Footer Container**: Wraps the entire footer content for styling.
2. **Title**: Displays the footer title, if provided.
3. **Description**: Shows the description text, styled for readability.
4. **Call-to-Action Button**: Renders a button if `button_text` is provided, linking to `button_link`.

## State Management

The component does not manage internal state; it relies solely on props for its content.

## Event Handling

The component does not have internal event handling, but the button utilizes the `FDKLink` for navigation to the specified link when clicked.
