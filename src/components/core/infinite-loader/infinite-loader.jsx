/**
 * A React functional component that implements infinite scrolling functionality.
 * It uses the Intersection Observer API to detect when the last element in the list
 * is visible in the viewport and triggers the `loadMore` function to fetch more data.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the component.
 * @param {boolean} props.isLoading - A flag indicating whether data is currently being loaded.
 * @param {React.ReactNode} props.loader - A loader component or element to be displayed while loading.
 * @param {Function} props.loadMore - A function to be called to load more data.
 * @param {boolean} props.hasNext - A flag indicating whether there are more items to load.
 *
 * @returns {JSX.Element} A React component that renders its children and a loader if more items are available.
 */

import React, { useEffect, useRef } from "react";
import * as styles from "./infinite-loader.less";

const InfiniteLoader = ({ children, isLoading, loader, loadMore, hasNext }) => {
  const observer = useRef();
  const lastElementRef = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNext && !isLoading) {
        loadMore();
      }
    });

    if (lastElementRef.current)
      observer.current.observe(lastElementRef.current);
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, hasNext, loadMore]);

  return (
    <>
      {children}
      <div ref={lastElementRef}>{hasNext && (loader || <Loader />)}</div>
    </>
  );
};

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <span className={styles.loaderIcon}>
        <svg
          width="100%"
          height="auto"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 174C140.869 174 174 140.869 174 100C174 59.1309 140.869 26 100 26C59.1309 26 26 59.1309 26 100C26 140.869 59.1309 174 100 174Z"
            stroke="#4E3F09"
            strokeWidth="20"
            strokeDasharray="348.72 120.24"
          />
        </svg>
      </span>
    </div>
  );
};

export default InfiniteLoader;
