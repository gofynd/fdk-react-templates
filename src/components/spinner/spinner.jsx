import React from "react";
import * as styles from "./spinner.less";

function Spinner({ customClassName }) {
  return (
    <div className={`${styles.spinContainer} ${customClassName}`}>
      <div className={styles.spinner}></div>
    </div>
  );
}

export default Spinner;
