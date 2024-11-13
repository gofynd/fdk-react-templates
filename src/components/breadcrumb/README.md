# Breadcrumb Component

The `Breadcrumb` component provides a navigation aid that helps users understand their current location within a hierarchical structure of a website. It displays a trail of links from the home page to the current page, styled using `breadcrumb.less`.

## Props

| Prop     | Type     | Default Value                                                                                           | Description                                         |
|----------|----------|---------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `breadcrumb`  | Array   | `[]`                                                                                      | Title displayed on the empty state.                 |


## Example Usage

To use the `Breadcrumb` component, import it and include it in your component hierarchy as follows:

```jsx
import Breadcrumb from "path/to/breadcrumb";

const breadcrumbData = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products' },
  { label: 'Current Page' }
];


```

## Styling

The component applies styles from `breadcrumb.less`. Customize this stylesheet to adjust the layout and appearance of the `Breadcrumb` component.

## Breadcrumb Item Structure

Each item in the breadcrumb array should follow this structure:
```typescript
{
  label: string;  // Text to display
  link?: string;  // URL for the breadcrumb item (optional for last item)
}
```

## Installation

Ensure the following dependencies are installed:

```bash
npm install fdk-core
```

## Component Structure

```jsx
import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./breadcrumb.less";

const Breadcrumb = ({ breadcrumb = [] }) => {
  const itemsList = breadcrumb?.slice(0, breadcrumb?.length - 1);

  return (
    
      {itemsList.map((item, index) => (
        
          {item?.label}&nbsp; / &nbsp;
        
      ))}
      
        {breadcrumb?.[breadcrumb?.length - 1]?.label}
      
    
  );
};

export default Breadcrumb;
```

## Features

- Creates a hierarchical navigation trail
- Automatically separates items with forward slashes
- Highlights the current page (last item) with distinct styling
- Uses FDKLink component for navigation
- Responsive design that works across different screen sizes

## Best Practices

1. Always include a home page link as the first item
2. Keep labels concise and descriptive
3. Ensure links are valid and working
4. Maintain consistent naming conventions
5. Don't include a link for the current page (last item)

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).