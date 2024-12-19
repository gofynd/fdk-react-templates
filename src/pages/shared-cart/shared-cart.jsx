import React, { useState, useMemo, useEffect } from "react";
import * as styles from "./shared-cart.less";
import { currencyFormat, numberWithCommas } from "../../helper/utils";
import ChipReviewItem from "../../components/chip-review-item/chip-review-item";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";

const SharedCart = ({
  sharedCartData = {},
  bagItems = [],
  showReplaceBtn = false,
  onMergeBagClick = () => {},
  onAddToBagClick = () => {},
  onReplaceBagClick = () => {},
}) => {
  const getPieces = useMemo(() => {
    return (
      sharedCartData?.items?.reduce(
        (total, item) => total + item.quantity,
        0
      ) || 0
    );
  }, [sharedCartData]);

  const itemCountLabel = useMemo(() => {
    let itmStrng = bagItems.length > 1 ? "Items" : "Item";
    return `(${bagItems.length} ${itmStrng} | ${getPieces} Qty)`;
  }, [bagItems, getPieces]);

  const sharedCartCouponProps = useMemo(() => {
    let couponBreakup = sharedCartData?.breakup_values?.coupon;
    let couponAttrs = {
      icon: "coupon",
      title: "Offers & Coupons",
    };
    if (couponBreakup && couponBreakup?.code && couponBreakup?.is_applied) {
      couponAttrs.hasCancel = true;
      couponAttrs.subtitle = `Applied: ${couponBreakup.code}`;
    } else {
      couponAttrs.hasCancel = false;
      couponAttrs.subtitle = `No coupon applied`;
    }
    return couponAttrs;
  }, [sharedCartData]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.sharedCartContainer}>
        <div className={styles.title}>
          Shared bag
          <span className={styles.subTitle}>{itemCountLabel}</span>
        </div>
        <div className={styles.sharedCart}>
          <div className={styles.itemContainer}>
            {bagItems.map((item, index) => (
              <ChipReviewItem
                key={index}
                item={item.item}
                articles={item.articles}
              />
            ))}
          </div>
          <div className={styles.breakUpContainer}>
            <SharedCartCoupons {...sharedCartCouponProps} />
            <SharedCartBreakup
              breakup={sharedCartData?.breakup_values?.display}
            />
            <div className={styles.shareBtnContainer}>
              {showReplaceBtn ? (
                <button
                  disabled={bagItems?.length < 1}
                  className={styles.shareBtn}
                  onClick={onMergeBagClick}
                >
                  Merge Bag
                </button>
              ) : (
                <button
                  disabled={bagItems?.length < 1}
                  className={styles.shareBtn}
                  onClick={onAddToBagClick}
                >
                  Add To Bag
                </button>
              )}
              {showReplaceBtn && (
                <button
                  disabled={bagItems?.length < 1}
                  className={styles.shareBtn}
                  onClick={onReplaceBagClick}
                >
                  Replace Bag
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedCart;

const SharedCartCoupons = ({
  title = "Offers & Coupons",
  subtitle = "",
  icon = "coupon",
  hasCancel = false,
}) => {
  return (
    <div className={styles.list}>
      <span className={styles.icons}>
        <SvgWrapper svgSrc={icon} />
      </span>
      <div className={styles.offer}>
        <div className={styles.desc}>{title}</div>
        <div
          className={`${styles.subDesc} ${hasCancel ? styles.couponApplied : ""}`}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

const SharedCartBreakup = ({ breakup = [] }) => {
  return (
    <div className={styles.breakupWrapper}>
      {breakup.map((item, index) => (
        <div key={`${item.key}_${index}`}>
          {index != breakup.length - 1 && (
            <div
              className={`${styles.subTitle} ${Number(item.value) < 0 ? styles.discount : ""}`}
            >
              <div>{item.display}</div>
              <div className={styles.value}>
                <span>
                  {currencyFormat(
                    numberWithCommas(item.value),
                    item?.currency_symbol || "₹"
                  )}
                </span>
              </div>
            </div>
          )}
          {index === breakup.length - 1 && (
            <div className={styles.title}>
              <div>{item.display}</div>
              <div className={styles.value}>
                {currencyFormat(
                  numberWithCommas(item.value),
                  item?.currency_symbol || "₹"
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
