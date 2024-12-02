/**
 * A functional component that renders a loading spinner with customizable styles.
 *
 * @param {Object} props - The properties object.
 * @param {string} [props.containerClassName] - Optional additional class name(s) for the container div.
 * @param {string} [props.loaderClassName] - Optional additional class name(s) for the loader div.
 * @returns {JSX.Element} A JSX element containing a styled loading spinner.
 */

import React from "react";
import * as styles from "./loader.less";

const Loader = ({ containerClassName, loaderClassName, ...props }) => {
  const customContainerClass = `${styles["page-loader-container"]} ${containerClassName ?? ""}`;
  const customLoaderClass = `${styles.loader} ${loaderClassName ?? ""}`;

  return (
    <div className={customContainerClass}>
      <div className={customLoaderClass}></div>
    </div>
  );
};

export default Loader;
