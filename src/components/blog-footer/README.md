# BlogFooter

The `BlogFooter` component is designed to display a footer section at the bottom of a blog page. It can show a title, a description, and a call-to-action button, providing additional context or links for the user.

## Features
- **Conditional Rendering**: The footer only renders if at least one of the props (`title`, `description`, or `button_text`) is provided.
- **Styled Components**: Utilizes modular CSS for maintainable and customizable styling.
- **Link Navigation**: The button can navigate to a specified link using the `FDKLink` component.

## Props

| Prop Name       | Prop Type     | Default Value  | Description                                                                 |
|-----------------|---------------|----------------|-----------------------------------------------------------------------------|
| `title`         | String        | `null`         | A string representing the title of the footer section.                      |
| `description`   | String        | `null`         | A string providing additional information or context displayed below the title. |
| `button_text`   | String        | `null`         | A string for the text to be displayed on the call-to-action button.          |
| `button_link`   | String        | `null`         | A string that represents the URL to navigate to when the button is clicked.  |

## Example Usage

```jsx
import React from "react";
import BlogFooter from "fdk-react-templates/components/blog-footer/blog-footer";
import "fdk-react-templates/components/blog-footer/blog-footer.css";

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

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).
