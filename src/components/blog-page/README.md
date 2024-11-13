# BlogPage Component

## Overview

The `BlogPage` component displays detailed information about a specific blog post. It includes the blog's content, metadata such as the author and publish date, and provides navigation links for social sharing. This component enhances the user experience by presenting blog content in a structured and engaging format.

## Features

- **Loading State**: Displays a loader while blog details are being fetched.
- **Dynamic Content**: Renders blog content and images dynamically based on the provided `blogDetails` prop.
- **Sidebar Navigation**: Optionally displays a sidebar with recent and top viewed blogs based on the props provided.
- **Social Sharing Links**: Allows users to share the blog post on various social media platforms.

## Usage

To use the `BlogPage` component, import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import BlogPage from "./BlogPage";

const App = () => {
  const socialLinks = [
    { link: 'https://twitter.com', title: 'Twitter' },
    { link: 'https://facebook.com', title: 'Facebook' },
  ];

  const blogDetails = {
    title: 'Example Blog Post',
    slug: 'example-blog-post',
    author: { name: 'Author Name' },
    publish_date: '2024-10-28T12:00:00Z',
    feature_image: { secure_url: 'https://example.com/image.jpg' },
    content: [{ value: '<p>Blog content here...</p>' }],
    tags: ['tag1', 'tag2'],
  };

  const sliderProps = {
    show_recent_blog: true,
    show_top_blog: true,
    fallbackImg: 'https://example.com/fallback.jpg',
  };

  return (
    <div>
      <BlogPage
        socialLinks={socialLinks}
        blogDetails={blogDetails}
        sliderProps={sliderProps}
        footerProps={{ /* footer props here */ }}
        topViewedBlogs={[/* array of top viewed blogs */]}
        recentBlogs={[/* array of recent blogs */]}
        isBlogDetailsLoading={false}
      />
    </div>
  );
};

export default App;
```

## Props

- **socialLinks**: An array of objects containing `link` and `title` for social media sharing options.
- **blogDetails**: An object with details about the blog post, including `title`, `slug`, `author`, `publish_date`, `feature_image`, and `content`.
- **sliderProps**: An object that controls the visibility of the sidebar sections, such as recent and top viewed blogs.
- **footerProps**: Props for the footer component.
- **topViewedBlogs**: An array of top viewed blog posts for sidebar display.
- **recentBlogs**: An array of recent blog posts for sidebar display.
- **isBlogDetailsLoading**: A boolean indicating whether the blog details are still loading.

## Component Structure

The `BlogPage` component consists of the following key sections:

1. **Loader**: Displays a loading spinner while the blog details are being fetched.
2. **Breadcrumb Navigation**: Shows the path to the current blog post with links to the home and blog pages.
3. **Blog Metadata**: Includes the blog's title, author, publish date, and any associated tags.
4. **Featured Image**: Displays the main image associated with the blog post.
5. **Blog Content**: Renders the main content of the blog using `HTMLContent`.
6. **Sidebar**: Optionally displays recent and top viewed blogs if enabled.
7. **Footer**: Renders the footer component.

## State Management

- **containerRef**: A reference for the blog content container, used for scrolling and other interactions.

## Utility Functions

- **getFormattedDate(dateString)**: Converts a UTC date string into a localized date format.
- **isSidebarDisplayed()**: Determines whether to show the sidebar based on `sliderProps`.
- **blogTag()**: Retrieves the primary tag of the blog, excluding certain predefined tags.

## Event Handling

The component does not manage state directly related to user input but reacts to prop changes and manages the loading state accordingly.