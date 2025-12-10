# BlogList Component

## Overview
The `BlogList` component displays a list of blogs with various functionalities, including filtering, searching, and pagination. It utilizes several other components to enhance its functionality.

## Dependencies

- `react`
- `react-router-dom`
- `react-slick`
- `fdk-core/components`
- Custom components:
  - `SvgWrapper`
  - `FyImage`
  - `BlogTabs`
  - `BlogFooter`
  - `EmptyState`
  - `InfiniteLoader`
  - `Pagination`
  - `Loader`
- Utility functions from `../../helper/utils`

## Usage

To use the `BlogList` component, import it into your React application and provide the required props.


## Example


```jsx
import React, { useState } from "react";
import BlogList from "fdk-react-templates/pages/blog";
import "fdk-react-templates/pages/blog/blog.css";

const App = () => {
  const blogs = {
    items: [
      { id: 1, title: "React Tips", tags: ["React"], publish_date: "2024-11-27" },
      { id: 2, title: "JavaScript Tricks", tags: ["JavaScript"], publish_date: "2024-11-26" },
    ],
    page: { item_total: 2 },
    filters: { tags: ["React", "JavaScript"] },
  };

  const sliderBlogs = {
    items: [
      { id: 1, title: "Featured Blog", tags: ["Featured"], publish_date: "2024-11-25" },
    ],
  };

  const paginationProps = { currentPage: 1, hasNext: false };

  const onLoadMoreProducts = () => {
    console.log("Load more blogs...");
  };

  return (
    <BlogList
      blogs={blogs}
      totalBlogsList={{ page: { item_total: 2 } }}
      sliderBlogs={sliderBlogs}
      footerProps={{ someProp: "value" }}
      sliderProps={{ show_blog_slide_show: true, show_search: true }}
      paginationProps={paginationProps}
      onLoadMoreProducts={onLoadMoreProducts}
      isLoading={false}
      isBlogPageLoading={false}
      ssrSearch=""
      ssrFilters={[]}
    />
  );
};

export default App;
```

## Props

### BlogList Props

- `blogs`: An object containing the list of blogs and pagination details.
- `sliderBlogs`: An object for slider functionality, containing blog items for the slider.
- `footerProps`: Props to be passed to the `BlogFooter` component.
- `sliderProps`: Configuration for the slider (e.g., autoplay, slide interval).
- `paginationProps`: Props for pagination handling.
- `onLoadMoreProducts`: Function to load more products when using infinite scrolling.
- `isLoading`: Boolean indicating if blogs are being loaded.
- `isBlogPageLoading`: Boolean indicating if the blog page is loading.
- `ssrSearch`: Server-side rendered search query.
- `ssrFilters`: Server-side rendered filters.

## Component Structure

### MemoizedSlide

- Renders a single slide in the blog slider.
- Displays the blog's title, summary, publication date, and an image.

### BlogList

- Main component structure containing:
  - Slider for featured blogs.
  - Filter and search functionality.
  - List of blogs displayed in a grid.
  - Pagination or infinite loader based on props.
  - Sidebar for additional blog-related content.

## State Management

The component manages its state with React's `useState` and `useEffect` hooks, including:

- `blogFilter`: Stores the current applied filters.
- `searchText`: Stores the text input for searching blogs.
- `blogCount`: Keeps track of the total number of blogs.
- `windowWidth`: Monitors the window width for responsive design.
- `config`: Configuration for the slider.

## Event Handlers

- `removeFilter(filter)`: Removes a specified filter from the state and updates the URL.
- `searchTextUpdate(value)`: Updates the search text state and URL query parameters.
- `resetFilters()`: Resets all filters and updates the URL.
- `toggleTagFilter(tag)`: Toggles the state of a tag filter in the URL.

## Utility Functions

- `getFormattedDate(dateString)`: Formats a UTC date string to a local date format.
- `getBlogTag(tags)`: Extracts the appropriate blog tag.
- `escapeRegExp(str)`: Escapes special characters in a string for regex.
- `getBlogTitle(title)`: Returns a highlighted blog title based on the search text.

## Page Configurations

These configurations allow you to customize the blog page on the Fynd platform. They control the appearance and behavior of the blog slide show, filters, and other blog-related features.

| **Configuration**       | **Type**         | **Default Value**           | **Description**                                                                                       |
|--------------------------|------------------|-----------------------------|-------------------------------------------------------------------------------------------------------|
| `show_blog_slide_show`   | `checkbox`      | `true`                      | Enables or disables the blog slide show on the blog page.                                             |
| `filter_tags`            | `tags-list`     | `""`                        | Filters blogs displayed in the slideshow by tags. Tags must match those used on the Fynd platform (case-sensitive), separated by commas. |
| `autoplay`               | `checkbox`      | `false`                     | Toggles automatic transitions between slides in the blog slideshow.                                   |
| `slide_interval`         | `range`         | `3.5`                       | Specifies the interval between slide transitions in seconds. Range: 0 to 10 seconds, adjustable in 0.5-second steps. |
| `btn_text`               | `text`          | `"Read More"`               | Sets the text for the button displayed on each blog slide.                                            |
| `show_tags`              | `checkbox`      | `true`                      | Displays tags associated with each blog in the slideshow.                                             |
| `show_search`            | `checkbox`      | `true`                      | Adds a search bar for users to search through blog content.                                           |
| `show_recent_blog`       | `checkbox`      | `true`                      | Displays the **Recently Published** section, featuring the latest five blogs.                         |
| `recent_blogs`           | `blog-list`     | `""`                        | Lists the blogs to be displayed in the **Recently Published** section.                                |
| `show_top_blog`          | `checkbox`      | `true`                      | Displays the **Top Viewed** section, which showcases blogs tagged with the `top5` value.              |
| `top_blogs`              | `blog-list`     | `""`                        | Lists the blogs to be displayed in the **Top Viewed** section.                                        |
| `show_filters`           | `checkbox`      | `true`                      | Enables or disables filter options for blogs, allowing users to refine visible content.               |
| `loading_options`        | `select`        | `"pagination"`              | Sets the loading style for blog content. Options: **Infinite Loading** or **Pagination**.             |
| `title`                  | `text`          | `"The Unparalleled Shopping Experience"` | Sets the heading for the blog page.                                                                  |
| `description`            | `textarea`      | `"Everything you need for that ultimate stylish wardrobe, Fynd has got it!"` | Adds a description for the blog section.                                                             |
| `button_text`            | `text`          | `"Shop Now"`                | Sets the label for the button displayed in the blog section.                                          |
| `button_link`            | `url`           | `""`                        | Specifies the URL the button redirects to.                                                           |
| `fallback_image`         | `image_picker`  | `""`                        | Defines a fallback image to be displayed if a blog lacks an image.                                    |

### Steps to Modify Page Configuration via Fynd Platform

1. **Log in to the Fynd Platform:**
   - Go to [Fynd Platform](https://platform.fynd.com) and log in with your credentials.

2. **Navigate to Your Company:**
   - Once logged in, select your company from the list.

3. **Select the Theme:**
   - In the sidebar, under **Sales Channel**, select your sales channel.
   - Then, under **Appearance**, click on **Themes**.
   - In the current theme, click on **Edit**. Here, you can preview and configure the theme.  
     Here's a sample [theme](https://platform.fynd.com/company/5178/application/668765e1c984016d78222a21/themes/668768e7e21c099a562b5d56/edit).

4. **Navigate to the Page Configuration:**
   - Within the theme editor, navigate to the **Blog** page. 
   - You can use the dropdown on the top to select the desired page.
   - Under the **Configuration** section, locate and click on the **Page** settings for that particular page.

5. **Modify Page Configurations:**
   - Adjust the settings for the selected page based on your requirements. For example:
     - Enable or disable features such as slideshows, filters, or search bars.
     - Update texts, images, or links for better customization.
     - Configure tags, loading options, or button properties as needed.

6. **Preview Changes:**
   - Preview the updates made to the page in real time to ensure they look and function as expected.

7. **Save and Publish:**
   - After confirming your changes, click on **Save**. This will publish the updated configurations for the selected page.

8. **Test Your Storefront:**
   - Visit your store's live URL and navigate to the updated page to confirm the changes are reflected and working as intended.

By following these steps, you can easily customize specific page configurations within the Fynd Platform to match your business needs.

## Conditional Rendering

The component conditionally renders elements based on the loading state, the presence of blogs, and applied filters.