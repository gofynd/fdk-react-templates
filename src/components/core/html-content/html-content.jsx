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
