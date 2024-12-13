
# ScrollTop Component

The `ScrollTop` component is a React component that provides a button to smoothly scroll the page back to the top when clicked. The button appears when the user scrolls past a specified point on the page.

## Behavior

- The button becomes visible when the user scrolls down more than 200 pixels.
- When clicked, the button scrolls the page smoothly back to the top.

## Dependencies

- **SvgWrapper**: Used to render the scroll icon within the button.
- **scroll-top.less**: The component uses styles defined in this CSS module for styling.

## Example Usage

To use the `ScrollTop` component, simply import and include it in your layout:

```jsx
import React from "react";
import ScrollTop from "fdk-react-templates/components/scroll-top/scroll-top";
import "fdk-react-templates/components//scroll-top/scroll-top.css";

function App() {
  return (
    <div>
      {/* Other content */}
      <ScrollTop />
    </div>
  );
}

export default App;
```

## Component Structure

```jsx
import React, { useState, useEffect } from "react";
import * as styles from "./scroll-top.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function ScrollTop() {
  const [isActive, setIsActive] = useState(false);

  const scrollToTop = () => {
    window?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (window?.scrollY > 200) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  useEffect(() => {
    window?.addEventListener("scroll", handleScroll);
    return () => {
      window?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={\`\${styles.scrollTop} \${isActive ? styles.isVisible : ""}\`}
      onClick={scrollToTop}
    >
      <span className={styles.scrollTopIcon}>
        <SvgWrapper svgSrc="scroll-top" />
      </span>
      <span className={styles.scrollTopText}>Back to top</span>
    </button>
  );
}

export default ScrollTop;
```

## Styling

This component relies on `scroll-top.less` for styling, which should include styles for:

- `.scrollTop`: Base style for the scroll-to-top button.
- `.isVisible`: Style to make the button visible when scrolled past 200 pixels.
- `.scrollTopIcon`: Style for the icon wrapper.
- `.scrollTopText`: Style for the "Back to top" text.

## Installation

Ensure the required dependencies are installed, including any icon libraries used in `SvgWrapper`. 

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).