import React from "react";
import styles from "./loader.less";

const Loader = (props) => {
  return (
    <div className={styles["page-loader-container"]}>
      <div className={styles.loader}></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
