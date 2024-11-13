
# PageNotFound Component

The `PageNotFound` component provides a customizable "Page Not Found" view for displaying an empty state when a page or resource is unavailable. This component is styled using `page-not-found.less` and includes an image, title, and a button that links back to the homepage.

## Props

| Prop     | Type     | Default Value                                                                                           | Description                                         |
|----------|----------|---------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `title`  | string   | `"Page Not Found"`                                                                                      | Title displayed on the empty state.                 |
| `src`    | string   | `"https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyprod/wrkr/company/884/applications/000000000000000000000004/theme/pictures/free/original/empty-state.dad8145f254f744108af946933831880.png"` | URL for the image to display in the empty state. |

## Example Usage

To use the `PageNotFound` component, import it and include it in your component hierarchy as follows:

```jsx
import PageNotFound from "path/to/page-not-found";

<PageNotFound
  title="Sorry, this page is missing!"
  src="https://example.com/custom-image.png"
/>
```

## Styling

The component applies styles from `page-not-found.less`. Customize this stylesheet to adjust the layout and appearance of the `PageNotFound` component.

## Default Image and Title

The `PageNotFound` component provides a default image URL and title, so it can be used without props. If no `src` is provided, the component falls back to the default image.

## Installation

Ensure the following dependencies are installed:

```bash
npm install fdk-core
```

## Component Structure

```jsx
import React from "react";
import * as styles from "./page-not-found.less";
import { FDKLink } from "fdk-core/components";

function PageNotFound({ title, src }) {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.emptyState}>
        <img
          src={
            src ??
            "https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyprod/wrkr/company/884/applications/000000000000000000000004/theme/pictures/free/original/empty-state.dad8145f254f744108af946933831880.png"
          }
          alt=""
        />
        <div className={styles.noItems}>
          <p className={styles.title}>{title}</p>
        </div>
        <FDKLink to={"/"} className={styles.btnLink}>
          <button className={styles.backBtn}>
            <span> Go to Home</span>
          </button>
        </FDKLink>
      </div>
    </div>
  );
}

PageNotFound.defaultProps = {
  title: "Page Not Found",
};

export default PageNotFound;
```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).