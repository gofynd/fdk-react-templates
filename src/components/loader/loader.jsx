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
