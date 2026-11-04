/**
 * A React functional component that renders HTML content safely using `dangerouslySetInnerHTML`.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.content - The HTML content to be rendered inside the div.
 * @param {React.Ref} ref - A React ref that is attached to the div element.
 *
 * @returns {JSX.Element} A JSX fragment containing a div element with the HTML content.
 *
 * @note The use of `dangerouslySetInnerHTML` can expose the application to XSS attacks if the content is not sanitized properly.
 */

import React, { forwardRef } from "react";

const HTMLContent = forwardRef(({ content }, ref) => {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <div
        data-testid="html-content"
        ref={ref}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
});

export default HTMLContent;
