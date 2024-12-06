/**
 * ChipReviewItem is a React component that displays a review item for a product.
 * It uses several useMemo hooks to optimize performance by memoizing values.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.item - The item object containing product details.
 * @param {Array} props.articles - An array of article objects related to the item.
 *
 * @returns {JSX.Element} A JSX element representing the review item.
 */

import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { isRunningOnClient } from "../../../helper/utils";

const FyHTMLRenderer = ({ htmlContent, customClass, showDots = false }) => {
  const [newContent, setNewContent] = useState(htmlContent);
  useEffect(() => {
    if (htmlContent && showDots) {
      setNewContent((pre) => {
        return String(htmlContent).concat("...");
      });
    }
  }, [htmlContent]);
  return (
    <div className={customClass}>
      {isRunningOnClient() ? parse(newContent) : null}
    </div>
  );
};

export default FyHTMLRenderer;
