import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { currencyFormat, numberWithCommas } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./coupon.less";
import Modal from "../../../../components/core/modal/modal";

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
  handleRemoveQr = null,
}) {
  const couponTitleText = useMemo(() => {
    if (hasCancel) {
      return `${couponCode} APPLIED`;
    }
    return "Apply Coupons";
  }, [hasCancel, couponCode]);

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
    watch,
    reset,
  } = useForm({
    defaultValues: {
      couponInput: "",
    },
  });

  useEffect(() => {
    handleRemoveQr?.handleQr();
  }, [successCoupon?.is_applied]);

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
        closeDialog={(e) => {
          onCouponListCloseModalClick(e);
          reset();
        }}
        modalType="right-modal"
        headerClassName={styles.modalHeader}
        title="Apply Coupon"
        titleClassName={styles.modalTitle}
      >
        <div className={styles.modalContent}>
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
              <button
                disabled={!watch("couponInput")}
                className={styles.checkBtn}
                type="submit"
              >
                APPLY
              </button>
            </form>
            {availableCouponList?.length > 0 ? (
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
            ) : (
              <NoCouponsAvailable />
            )}
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
          onClick={() => {
            applyCoupon(couponCode);
          }}
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
    <Modal
      hideHeader={true}
      isOpen={isOpen}
      closeDialog={closeDialog}
      modalType="center-modal"
      containerClassName={styles.couponSuccessModalContainer}
    >
      <div className={styles.couponSuccessModalContent}>
        <img
          className={styles.couponSuccessGif}
          src={couponSuccessGif}
          alt="coupon-success"
        />
        <div className={styles.couponSuccessIcon}>
          <span>
            <SvgWrapper svgSrc="coupon-success" />
          </span>
        </div>
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

function NoCouponsAvailable() {
  return (
    <div className={styles.noCouponsAvailable}>
      <div className={styles.iconContainer}>
        <SvgWrapper svgSrc="NoCoupons" />
      </div>
      <div className={styles.textContainer}>
        <h3 className={styles.fontHeader}>No coupons available</h3>
        <p className={styles.fontBody}>
          If you have a coupon code try typing it in the coupon code box above
        </p>
      </div>
    </div>
  );
}

export default Coupon;
