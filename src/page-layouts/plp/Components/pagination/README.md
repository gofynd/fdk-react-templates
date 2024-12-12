# Pagination Component

## Overview
The `Pagination` component is designed to display a pagination control for navigating through multiple pages of content. It supports navigation between pages, displaying previous and next buttons, and highlighting the current page. It is highly customizable and uses the `FDKLink` component for navigation.

## Features
- **Page Navigation**: Allows users to navigate through different pages of content using the previous and next buttons.
- **Current Page Highlighting**: The current page is highlighted with an active style.
- **Scroll to Top**: Automatically scrolls the page to the top when navigating to a new page.
- **Customizable Links**: You can pass custom links for the "previous" and "next" page navigation.

## Usage
To use the `Pagination` component, you need to import it into your React application and provide the required props.

### Example
```jsx
import React from 'react';
import Pagination from 'fdk-react-templates/page-layouts/plp/Components/pagination/pagination';
import 'fdk-react-templates/page-layouts/plp/Components/pagination/pagination.css';

const pages = [
  { index: 1, link: "/page/1" },
  { index: 2, link: "/page/2" },
  { index: 3, link: "/page/3" },
];

const App = () => (
  <Pagination
    current={2}
    hasPrevious={true}
    hasNext={true}
    pages={pages}
    prevPageLink="/page/1"
    nextPageLink="/page/3"
  />
);

export default App;

```


### Props
- **current** (number, optional): The current active page. Default is `1`.
- **hasPrevious** (boolean, optional): Determines if the "previous" page link is active. Default is `false`.
- **hasNext** (boolean, optional): Determines if the "next" page link is active. Default is `true`.
- **pages** (array, optional): An array of page objects containing `index` and `link` for each page. Default is an empty array.
- **prevPageLink** (string, optional): The link for the previous page. Default is an empty string.
- **nextPageLink** (string, optional): The link for the next page. Default is an empty string.


```
This README provides a detailed overview of the `Pagination` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
