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
import React from "react";
import BlogList from "./BlogList";

const App = () => {
  return (
    <div>
      <BlogList
        blogs={blogData}
        sliderBlogs={sliderData}
        footerProps={footerProps}
        sliderProps={sliderProps}
        paginationProps={paginationProps}
        onLoadMoreProducts={loadMore}
        isLoading={false} // Set loading state as needed
        isBlogPageLoading={false} // Set blog page loading state as needed
        ssrSearch={ssrSearch}
        ssrFilters={ssrFilters}
      />
    </div>
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

## Conditional Rendering

The component conditionally renders elements based on the loading state, the presence of blogs, and applied filters.