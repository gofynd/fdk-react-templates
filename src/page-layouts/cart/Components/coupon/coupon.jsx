import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  currencyFormat,
  formatLocale,
  numberWithCommas,
  translateDynamicLabel,
} from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./coupon.less";
import Modal from "../../../../components/core/modal/modal";
import { useGlobalStore, useFPI, useGlobalTranslation } from "fdk-core/utils";
import ForcedLtr from "../../../../components/forced-ltr/forced-ltr";

function Coupon({
  title,
  subtitle,
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
  currentStepIdx,
  setShowPayment = () => {},
  getTotalValue = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const [lastSubmittedCoupon, setLastSubmittedCoupon] = useState("");

  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  const couponTitleText = useMemo(() => {
    if (hasCancel) {
      return `${couponCode} ${t("resource.common.applied_caps")}`;
    }
    return t("resource.cart.apply_coupons");
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
    const trimmedInput = couponInput.trim();

    if (errors?.root && lastSubmittedCoupon === trimmedInput) {
      return;
    }

    setLastSubmittedCoupon(trimmedInput);
    onApplyCouponClick(couponInput);
  }

  useEffect(() => {
    if (!error) {
      setLastSubmittedCoupon("");
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      setError("root", error);
    } else {
      clearErrors("root");
    }
  }, [error]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "couponInput" && errors?.root) {
        console.log("clear");
        clearErrors("root");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, errors?.root, clearErrors]);

  return (
    <>
      <div className={styles.couponBoxContainer}>
        <div className={styles.couponBoxTitle}>
          {title || t("resource.cart.coupons_title")}
        </div>
        <div className={styles.couponApplyBox} onClick={onCouponBoxClick}>
          <SvgWrapper className={styles.couponIcon} svgSrc="coupon-icon" />
          <div className={styles.couponApplyTitle}>
            <div className={styles.applyTxt}>{couponTitleText}</div>
            {couponValue > 0 ? (
              <div className={styles.couponAppliedSubtitles}>
                <span>{t("resource.cart.you_have_saved")} </span>
                <span>
                  <ForcedLtr
                    text={currencyFormat(
                      numberWithCommas(couponValue),
                      currencySymbol,
                      formatLocale(locale, countryCode, true)
                    )}
                  />
                </span>
              </div>
            ) : (
              <div className={styles.couponMetaDesc}>
                {subtitle || t("resource.cart.view_all_offers")}
              </div>
            )}
          </div>
          <button
            className={hasCancel ? styles.removeIcon : styles.arrowIcon}
            aria-label={
              hasCancel
                ? t("resource.cart.remove_coupon")
                : t("resource.cart.open_coupon_drawer")
            }
            onClick={(e) => {
              if (currentStepIdx === 1 && getTotalValue() === 0) {
                setShowPayment(false);
              }
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
        title={t("resource.cart.apply_coupon")}
        titleClassName={styles.modalTitle}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalBody}>
            <form
              className={`${styles.couponInputBox}`}
              onSubmit={handleSubmit(handleCouponCodeSubmit)}
            >
              <input
                type="text"
                placeholder={t("resource.cart.enter_coupon_code")}
                {...register("couponInput")}
                className={`${errors?.root ? styles.hasError : ""}`}
              />
              <button
                disabled={
                  !watch("couponInput") ||
                  (errors?.root && lastSubmittedCoupon === watch("couponInput"))
                }
                className={styles.checkBtn}
                type="submit"
              >
                {t("resource.facets.apply_caps")}
              </button>
            </form>
            {errors?.root && (
              <div className={styles.errorContainer}>
                <span className={styles.errorText}>
                  {successCoupon?.message
                    ? successCoupon?.message
                    : translateDynamicLabel(errors?.root?.message, t)}
                </span>
              </div>
            )}
            {availableCouponList?.length > 0 ? (
              <div>
                <div className={styles.couponListTitle}>
                  {t("resource.cart.select_applicable_coupons")}
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
  const { t } = useGlobalTranslation("translation");
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
          {t("resource.facets.apply_caps")}
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
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
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
          alt={t("resource.cart.coupon_success")}
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
                '{coupon?.code}' {t("resource.common.applied")}
              </div>
              <div className={styles.couponValue}>
                {currencyFormat(
                  numberWithCommas(coupon.value),
                  currencySymbol,
                  formatLocale(locale, countryCode, true)
                )}
              </div>
              <div className={styles.couponValueSubheading}>
                {t("resource.cart.savings_with_this_coupon")}
              </div>
            </div>
            <button className={styles.bodyFooterBtn} onClick={closeDialog}>
              {t("resource.cart.wohooo")}!!
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

function NoCouponsAvailable() {
  const { t } = useGlobalTranslation("translation");
  return (
    <div className={styles.noCouponsAvailable}>
      <div className={styles.iconContainer}>
        <SvgWrapper svgSrc="NoCoupons" />
      </div>
      <div className={styles.textContainer}>
        <h3 className={styles.fontHeader}>
          {t("resource.cart.no_coupons_available")}
        </h3>
        <p className={styles.fontBody}>
          {t("resource.cart.coupon_code_prompt")}
        </p>
      </div>
    </div>
  );
}

export default Coupon;
