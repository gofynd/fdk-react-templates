import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalTranslation } from "fdk-core/utils";
import * as styles from "./sticky-pay-now.less";

const StickyPayNow = ({
  disabled = false,
  value = "",
  onPriceDetailsClick = () => {},
  proceedToPay = () => {},
  btnTitle
}) => {
  const { t } = useGlobalTranslation("translation");
  
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
              {t("resource.cart.view_price_details")}
            </div>
          </div>
          <button
            className={`${styles.cartCheckoutBtn} ${styles.checkoutButton}`}
            onClick={proceedToPay}
          >
            {btnTitle || t('resource.cart.pay_now')}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default StickyPayNow;
