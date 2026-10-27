import React from "react";
import * as styles from "./b2b-moq-wrapper.less";

const B2bMOQWrapper = ({ productDetails }) => {
  const { moq } = productDetails.product;

  if (!moq) return null;

  return (
    <div className={styles.moqWrapper}>
      <div className={styles.moqSection}>
        <p>
          Min Order Qty :{" "}
          <span className={styles.moqValue}>{moq?.minimum || 1}</span>
        </p>

        {moq?.maximum && (
          <>
            <span>|</span>
            <p>
              Max Order Qty :{" "}
              <span className={styles.moqValue}>{moq?.maximum}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default B2bMOQWrapper;
