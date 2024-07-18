import React, { useState, useMemo } from "react";
import { currencyFormat } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./coupon.less";
import Modal from "../../../../components/core/modal/modal";

function Coupon({
  coupons,
  title,
  subtitle,
  hasCancel,
  code,
  discount,
  uid,
  currencySymbol,
  applyCoupon,
  removeCoupon,
}) {
  const { available_coupon_list: availableCouponList } = coupons;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const openCouponModal = () => {
    setIsModalOpen(true);
  };
  const closeCouponModal = () => {
    setIsModalOpen(false);
  };
  const updateCouponCode = (event) => {
    setCouponCode(event.target.value);
  };
  const couponTitleText = useMemo(() => {
    if (hasCancel) {
      return `${code} APPLIED`;
    }
    return "Apply Coupons";
  }, [hasCancel]);

  const handleRemoveCoupon = (e) => {
    if (hasCancel) {
      removeCoupon(uid);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <>
      <div className={styles.couponBoxContainer}>
        <div className={styles.couponBoxTitle}>{title}</div>
        <div className={styles.couponApplyBox} onClick={openCouponModal}>
          <SvgWrapper className={styles.couponIcon} svgSrc="coupon-icon" />
          <div className={styles.couponApplyTitle}>
            <div className={styles.applyTxt}>{couponTitleText}</div>
            {discount > 0 ? (
              <div>
                <span>You've saved </span>
                <span>{currencyFormat(discount, currencySymbol)}</span>
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
        isOpen={isModalOpen}
        closeDialog={closeCouponModal}
        modalType="right-modal"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>Apply Coupon</div>
            <SvgWrapper
              className={styles.crossIcon}
              svgSrc="cross-black"
              onClick={closeCouponModal}
            />
          </div>
          <div className={styles.modalBody}>
            <div className={styles.couponInputBox}>
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={updateCouponCode}
              />
              <button
                className={styles.checkBtn}
                onClick={() => applyCoupon(couponCode)}
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
                  <CouponItem {...coupon} applyCoupon={applyCoupon} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
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

export default Coupon;
