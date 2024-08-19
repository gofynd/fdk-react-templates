import React from "react";
import * as styles from "./loader.less";

const Loader = (props) => {
  return (
    <div className={styles["page-loader-container"]}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loader;
