# BlogTabs

The `BlogTabs` component is used to display a side navigation with tabs for viewing blogs in different categories such as "Top viewed" and "Recently Published". It supports conditional rendering of various sections based on the passed props, allowing the flexibility to show different blog lists, filters, and search functionality.

## Features
- **Tab-based Layout**: Displays different categories such as "Top viewed" and "Recently Published" blogs based on the provided props.
- **Conditional Rendering**: Renders content based on the availability of data such as top blogs, recent blogs, and others.

## Props
| Prop Name            | Prop Type   | Default Value      | Description                                                                |
|----------------------|-------------|--------------------|----------------------------------------------------------------------------|
| **show_filters**      | boolean     | -                  | Whether to show the filters tab.                                           |
| **show_recent_blog**  | boolean     | -                  | Whether to display the "Recently Published" blog tab.                      |
| **show_search**       | boolean     | -                  | Whether to show the search functionality.                                   |
| **show_tags**         | boolean     | -                  | Whether to show the tags section.                                          |
| **show_top_blog**     | boolean     | -                  | Whether to display the "Top viewed" blog tab.                              |
| **fallback_image**    | string      | `""`               | Fallback image for the blogs if no feature image is provided.              |
| **topViewedBlogs**    | array       | `[]`               | List of top viewed blogs to be displayed.                                  |
| **recentBlogs**       | array       | `[]`               | List of recently published blogs to be displayed.                          |

## Example
```jsx
import React from 'react';
import BlogTabs from 'fdk-react-templates/components/blog-tabs/blog-tabs';
import 'fdk-react-templates/components/blog-tabs/blog-tabs.css';

const App = () => (
  <BlogTabs
    show_filters={true}
    show_recent_blog={true}
    show_search={false}
    show_tags={true}
    show_top_blog={true}
    fallback_image="default.jpg"
    topViewedBlogs={[{ id: 1, title: 'Blog 1', slug: 'blog-1', feature_image: { secure_url: 'image.jpg' } }]}
    recentBlogs={[{ id: 2, title: 'Blog 2', slug: 'blog-2', feature_image: { secure_url: 'image2.jpg' } }]}
  />
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).