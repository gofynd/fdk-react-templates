import React from "react";
import Skeleton from "../../../components/core/skeletons/skeleton";
import * as styles from "./checkout-payment-skeleton.less";

function CheckoutPaymentSkeleton() {
  return (
    <div className={styles.paymentSkeleton}>
      <div className={styles.leftNav}>
        <div className={styles.navItem}>
          <Skeleton type="circle" width={38} height={38} />
          <Skeleton type="text" width="60%" height={18} />
        </div>
        <div className={styles.navItem}>
          <Skeleton type="circle" width={38} height={38} />
          <Skeleton type="text" width="70%" height={18} />
        </div>
        <div className={styles.navItem}>
          <Skeleton type="circle" width={38} height={38} />
          <Skeleton type="text" width="55%" height={18} />
        </div>
        <div className={styles.navItem}>
          <Skeleton type="circle" width={38} height={38} />
          <Skeleton type="text" width="50%" height={18} />
        </div>
        <div className={styles.navItem}>
          <Skeleton type="circle" width={38} height={38} />
          <Skeleton type="text" width="65%" height={18} />
        </div>
      </div>

      <div className={styles.rightPanel}>
        <Skeleton type="text" width={180} height={18} />

        <div className={styles.field}>
          <Skeleton type="box" height={48} />
        </div>
        <div className={styles.field}>
          <Skeleton type="box" height={48} />
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <Skeleton type="box" height={48} />
          </div>
          <div className={styles.colSmall}>
            <Skeleton type="box" height={48} />
          </div>
        </div>

        <div className={styles.checkboxRow}>
          <Skeleton type="box" width={16} height={16} />
          <Skeleton type="text" width={230} height={14} />
        </div>

        <div className={styles.payButton}>
          <Skeleton type="box" height={48} />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPaymentSkeleton;


