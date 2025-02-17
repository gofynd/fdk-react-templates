import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as styles from "./sticky-pay-now.less";

const StickyPayNow = ({
  disabled = false,
  value = "",
  onPriceDetailsClick = () => {},
  proceedToPay = () => {},
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`${styles.stickyBtnContainer}`}
        key="pay-now-container"
        // initial={{ opacity: 0, y: "100%" }}
        // animate={{ opacity: 1, y: "0%" }}
        // exit={{ opacity: 0, y: "100%" }}
        // transition={{ duration: 0.5 }}
      >
        <div className={`${styles.stickyBtnContainer1}`}>
          <div className={styles.priceContainerMobile}>
            <div className={styles.totalPrice}>{value}</div>
            <div
              className={`${styles.viewPriceBtn} ${styles.viewPBtn}`}
              onClick={onPriceDetailsClick}
            >
              View Price Details
            </div>
          </div>
          <button
            className={`${styles.cartCheckoutBtn} ${styles.checkoutButton}`}
            disabled={disabled}
            onClick={proceedToPay}
          >
            PAY NOW
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default StickyPayNow;
