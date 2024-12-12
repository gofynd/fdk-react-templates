# InfiniteLoader Component

The `InfiniteLoader` component enables infinite scrolling by automatically loading more content when the user scrolls to the bottom. It leverages the Intersection Observer API to detect when the last element in the list is visible and triggers a `loadMore` function.

## Features
- **Infinite Scroll**: Automatically loads more content when the user reaches the end of the current content.
- **Custom Loader**: Supports a customizable loader that appears while new content is being fetched.
- **Optimized Intersection Observer**: Uses the Intersection Observer API for detecting when the last item is in view.

## Props

| Prop Name    | Prop Type   | Default Value | Description                                                                 |
|--------------|-------------|---------------|-----------------------------------------------------------------------------|
| `children`   | `node`      | N/A           | The content that will be displayed, which will trigger the loader when scrolled. |
| `isLoading`  | `boolean`   | `false`       | Indicates whether new content is being loaded.                              |
| `loader`     | `node`      | `<Loader />`  | The loader element to display while loading more content (optional).        |
| `loadMore`   | `function`  | N/A           | A function to fetch more data when the user reaches the end of the content. |
| `hasNext`    | `boolean`   | `true`        | Indicates whether there is more content to load.                            |

## Example Usage

```jsx
import React, { useState } from "react";
import InfiniteLoader from "fdk-react-templates/components/core/infinite-loader/infinite-loader";
import "fdk-react-templates/components/core/infinite-loader/infinite-loader.css";

const App = () => {
  const [items, setItems] = useState([...Array(20).keys()]);
  const [isLoading, setIsLoading] = useState(false);
  const hasNext = items.length < 100;

  const loadMore = () => {
    if (isLoading || !hasNext) return;

    setIsLoading(true);
    setTimeout(() => {
      setItems((prevItems) => [...prevItems, ...Array(20).keys()]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <InfiniteLoader isLoading={isLoading} loadMore={loadMore} hasNext={hasNext}>
      <ul>
        {items.map((item) => (
          <li key={item}>Item {item}</li>
        ))}
      </ul>
    </InfiniteLoader>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).