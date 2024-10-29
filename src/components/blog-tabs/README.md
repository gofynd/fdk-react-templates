# BlogTabs Component

## Overview

The `BlogTabs` component displays a tabbed interface that allows users to view either the top viewed blogs or recently published blogs. It provides a clear and organized way for users to navigate through blog content based on their interests.

## Features

- **Dynamic Tabs**: Users can switch between "Top Viewed" and "Recently Published" blogs.
- **Conditional Rendering**: Tabs and content are rendered only if the corresponding props are enabled.
- **Responsive Design**: Styled using modular CSS for better maintainability.

## Usage

To use the `BlogTabs` component, import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import BlogTabs from "./BlogTabs";

const App = () => {
  const topViewedBlogs = [
    { id: 1, slug: "blog-post-1", title: "Blog Post 1", feature_image: { secure_url: "https://example.com/image1.jpg" } },
    { id: 2, slug: "blog-post-2", title: "Blog Post 2", feature_image: { secure_url: "https://example.com/image2.jpg" } },
  ];

  const recentBlogs = [
    { id: 3, slug: "blog-post-3", title: "Blog Post 3", feature_image: { secure_url: "https://example.com/image3.jpg" } },
    { id: 4, slug: "blog-post-4", title: "Blog Post 4", feature_image: { secure_url: "https://example.com/image4.jpg" } },
  ];

  return (
    <BlogTabs
      show_filters={true}
      show_recent_blog={true}
      show_top_blog={true}
      topViewedBlogs={topViewedBlogs}
      recentBlogs={recentBlogs}
      fallback_image="https://example.com/fallback.jpg"
    />
  );
};

export default App;
```

## Props

- **show_filters**: A boolean that determines whether to display filter options.
- **show_recent_blog**: A boolean that enables the display of recently published blogs.
- **show_search**: A boolean that indicates whether to show a search option (not implemented in the provided code).
- **show_tags**: A boolean that indicates whether to show tags (not implemented in the provided code).
- **show_top_blog**: A boolean that enables the display of top viewed blogs.
- **fallback_image**: A string representing the URL for a fallback image to display if no image is available.
- **topViewedBlogs**: An array of blog objects representing the top viewed blogs.
- **recentBlogs**: An array of blog objects representing the recently published blogs.

## Component Structure

The `BlogTabs` component consists of the following key sections:

1. **Tab Menu**: Contains buttons to switch between "Top Viewed" and "Recently Published" tabs.
2. **Content Area**: Displays the corresponding blogs based on the selected tab.
   - **Top Viewed Blogs**: Renders a list of top viewed blogs when the "Top Viewed" tab is active.
   - **Recently Published Blogs**: Renders a list of recently published blogs when the "Recently Published" tab is active.

## State Management

- **sideTab**: A state variable that tracks which tab is currently active (either "tab1" for top viewed blogs or "tab2" for recent blogs).

## Event Handling

The component manages tab switching through the `setSideTab` function, allowing users to dynamically change the displayed content based on their selection.