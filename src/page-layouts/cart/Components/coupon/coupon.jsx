import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { currencyFormat, numberWithCommas } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./coupon.less";
import Modal from "../../../../components/core/modal/modal";
// import couponSuccessGif from "../../../../assets/images/coupon-success.gif";

function Coupon({
  title = "COUPONS",
  subtitle = "View all offers",
  couponId = "",
  couponCode = "",
  couponValue = 0,
  hasCancel = false,
  currencySymbol = "₹",
  error = null,
  successCoupon = {},
  couponSuccessGif = "",
  isCouponListModalOpen = false,
  isCouponSuccessModalOpen = false,
  availableCouponList = [],
  onCouponBoxClick = () => {},
  onCouponListCloseModalClick = () => {},
  onCouponSuccessCloseModalClick = () => {},
  onApplyCouponClick = () => {},
  onRemoveCouponClick = () => {},
}) {
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

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      couponInput: "",
    },
  });

  function handleCouponCodeSubmit({ couponInput }) {
    onApplyCouponClick(couponInput);
  }

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  return (
    <>
      <div className={styles.couponBoxContainer}>
        <div className={styles.couponBoxTitle}>{title}</div>
        <div className={styles.couponApplyBox} onClick={onCouponBoxClick}>
          <SvgWrapper className={styles.couponIcon} svgSrc="coupon-icon" />
          <div className={styles.couponApplyTitle}>
            <div className={styles.applyTxt}>{couponTitleText}</div>
            {couponValue > 0 ? (
              <div className={styles.couponAppliedSubtitles}>
                <span>You've saved </span>
                <span>
                  {currencyFormat(
                    numberWithCommas(couponValue),
                    currencySymbol
                  )}
                </span>
              </div>
            ) : (
              <div className={styles.couponMetaDesc}>{subtitle}</div>
            )}
          </div>
          <button
            className={hasCancel ? styles.removeIcon : styles.arrowIcon}
            aria-label={hasCancel ? "Remove coupon" : "Open coupon drawer"}
            onClick={(e) => {
              hasCancel ? handleRemoveCoupon(e) : onCouponBoxClick(e);
            }}
          >
            <SvgWrapper
              svgSrc={hasCancel ? "cross-bold" : "cart-arrow-right"}
            />
          </button>
        </div>
      </div>
      <Modal
        isOpen={isCouponListModalOpen}
        closeDialog={onCouponListCloseModalClick}
        modalType="right-modal"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>Apply Coupon</div>
            <SvgWrapper
              className={styles.crossIcon}
              svgSrc="cross-black"
              onClick={onCouponListCloseModalClick}
            />
          </div>
          <div className={styles.modalBody}>
            {errors?.root && (
              <div className={styles.cartErrorContainer}>
                <SvgWrapper svgSrc="error-info-icon" />
                <div className={styles.colorErrorNormal}>
                  {errors?.root?.message}
                </div>
              </div>
            )}
            <form
              className={styles.couponInputBox}
              onSubmit={handleSubmit(handleCouponCodeSubmit)}
            >
              <input
                type="text"
                placeholder="Enter Coupon Code"
                {...register("couponInput")}
              />
              <button className={styles.checkBtn} type="submit">
                CHECK
              </button>
            </form>
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
      <CouponSuccessModal
        isOpen={isCouponSuccessModalOpen}
        coupon={successCoupon}
        currencySymbol={currencySymbol}
        couponSuccessGif={couponSuccessGif}
        closeDialog={onCouponSuccessCloseModalClick}
      />
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

function CouponSuccessModal({
  isOpen = false,
  coupon = {},
  currencySymbol = "₹",
  couponSuccessGif = "",
  closeDialog = () => {},
}) {
  return (
    <Modal isOpen={isOpen} closeDialog={closeDialog} modalType="center-modal">
      <div className={styles.couponSuccessModalContent}>
        <img
          className={styles.couponSuccessGif}
          src={couponSuccessGif}
          alt="coupon-success"
        />
        <span className={styles.couponSuccessIcon}>
          <span>
            <SvgWrapper svgSrc="coupon-success" />
          </span>
        </span>
        {coupon?.code && coupon?.is_applied && (
          <div className={styles.modalBody}>
            <div>
              <div className={styles.couponHeading}>
                '{coupon?.code}' Applied
              </div>
              <div className={styles.couponValue}>
                {currencyFormat(numberWithCommas(coupon.value), currencySymbol)}
              </div>
              <div className={styles.couponValueSubheading}>
                savings with this coupon
              </div>
            </div>
            <button className={styles.bodyFooterBtn} onClick={closeDialog}>
              WOHOOO!!
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default Coupon;
