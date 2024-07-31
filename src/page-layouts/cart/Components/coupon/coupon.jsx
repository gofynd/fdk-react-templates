import React, { useState, useMemo } from "react";
import { currencyFormat } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./coupon.less";
import Modal from "../../../../components/core/modal/modal";
// import couponSuccessGif from "../../../../assets/images/coupon-success.gif";

function Coupon({
  isOpen = false,
  title = "COUPONS",
  subtitle = "View all offers",
  couponId = "",
  couponCode = "",
  couponValue = 0,
  hasCancel = false,
  currencySymbol = "₹",
  availableCouponList = [],
  onCouponBoxClick = () => {},
  onCouponCloseDialogClick = () => {},
  onApplyCouponClick = () => {},
  onRemoveCouponClick = () => {},
}) {
  const [couponInputValue, setCouponInputValue] = useState("");

  const couponTitleText = useMemo(() => {
    if (hasCancel) {
      return `${couponCode} APPLIED`;
    }
    return "Apply Coupons";
  }, [hasCancel]);

  const handleRemoveCoupon = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasCancel) {
      onRemoveCouponClick(couponId);
    }
  };

  return (
    <>
      <div className={styles.couponBoxContainer}>
        <div className={styles.couponBoxTitle}>{title}</div>
        <div className={styles.couponApplyBox} onClick={onCouponBoxClick}>
          <SvgWrapper className={styles.couponIcon} svgSrc="coupon-icon" />
          <div className={styles.couponApplyTitle}>
            <div className={styles.applyTxt}>{couponTitleText}</div>
            {couponValue > 0 ? (
              <div>
                <span>You've saved </span>
                <span>{currencyFormat(couponValue, currencySymbol)}</span>
              </div>
            ) : (
              <div className={styles.couponMetaDesc}>{subtitle}</div>
            )}
          </div>
          <button
            className={hasCancel ? styles.removeIcon : styles.arrowIcon}
            aria-label={hasCancel ? "Remove coupon" : "Open coupon drawer"}
            onClick={handleRemoveCoupon}
          >
            <SvgWrapper
              svgSrc={hasCancel ? "cross-bold" : "cart-arrow-right"}
            />
          </button>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        closeDialog={onCouponCloseDialogClick}
        modalType="right-modal"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>Apply Coupon</div>
            <SvgWrapper
              className={styles.crossIcon}
              svgSrc="cross-black"
              onClick={onCouponCloseDialogClick}
            />
          </div>
          <div className={styles.modalBody}>
            <div className={styles.couponInputBox}>
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponInputValue}
                onChange={(e) => setCouponInputValue(e.target.value)}
              />
              <button
                className={styles.checkBtn}
                onClick={() => onApplyCouponClick(couponInputValue)}
              >
                CHECK
              </button>
            </div>
            <div>
              <div className={styles.couponListTitle}>
                Select from Applicable Coupons
              </div>
              <div className={styles.couponList}>
                {availableCouponList?.map((coupon) => (
                  <CouponItem
                    {...coupon}
                    applyCoupon={onApplyCouponClick}
                    key={coupon?.coupon_code}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* <CouponSuccessModal
        isOpen={true}
        coupon={{ code: "123", value: 20, is_applied: true }}
      /> */}
    </>
  );
}

function CouponItem({
  coupon_code: couponCode,
  title,
  message,
  expires_on: expiresOn,
  is_applicable: isApplicable,
  applyCoupon,
}) {
  return (
    <div
      className={`${styles.couponItem} ${
        !isApplicable ? styles.opacity02 : ""
      }`}
    >
      <div>
        <div className={styles.couponCode}>{couponCode}</div>
        <div className={styles.couponTitle}>{title}</div>
        <div className={styles.couponMessage}>{message}</div>
        <div className={styles.couponExpire}>{expiresOn}</div>
      </div>
      {isApplicable && (
        <button
          className={styles.couponApplyBtn}
          onClick={() => applyCoupon(couponCode)}
        >
          APPLY
        </button>
      )}
    </div>
  );
}

// function CouponSuccessModal({ isOpen, coupon, onCloseDialogClick }) {
//   return (
//     <Modal isOpen={isOpen} closeDialog={onCloseDialogClick}>
//       <div className={styles.modalContent}>
//         <img
//           className={styles.couponSuccessGif}
//           src={couponSuccessGif}
//           alt="coupon-success"
//         />
//         <span className={styles.couponSuccessIcon}>
//           {/* <fdk-inline-svg
//                         :src="'coupon-success'"
//                         class="coupon-icon"
//                     ></fdk-inline-svg> */}
//         </span>
//         {coupon.code && coupon.is_applied && (
//           <div className={styles.modalBody}>
//             <div>
//               <div className={styles.couponHeading}>
//                 '{coupon.code}' Applied
//               </div>
//               <div className={styles.couponValue}>
//                 {/* {getPriceFormat(currencySymbol, getCouponValue(coupon.value))} */}
//                 ₹2,000
//               </div>
//               <div className={styles.couponValueSubheading}>
//                 savings with this coupon
//               </div>
//             </div>
//             <button
//               className={styles.bodyFooterBtn}
//               onClick={onCloseDialogClick}
//             >
//               WOHOOO!!
//             </button>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// }

export default Coupon;
