import React, { useMemo } from "react";
import * as styles from "./shared-cart.less";
import { currencyFormat, formatLocale, numberWithCommas } from "../../helper/utils";
import ChipReviewItem from "../../components/chip-review-item/chip-review-item";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import {
  useGlobalStore,
  useFPI,
  useGlobalTranslation
} from "fdk-core/utils";

const SharedCart = ({
  sharedCartData = {},
  bagItems = [],
  showReplaceBtn = false,
  onMergeBagClick = () => { },
  onAddToBagClick = () => { },
  onReplaceBagClick = () => { },
}) => {
  const { t } = useGlobalTranslation("translation");
  const getPieces = useMemo(() => {
    return (
      sharedCartData?.items?.reduce(
        (total, item) => total + item.quantity,
        0
      ) || 0
    );
  }, [sharedCartData]);

  const itemCountLabel = useMemo(() => {
    let itmStrng = bagItems.length > 1 ? t("resource.common.item_simple_text_plural") : t("resource.common.item_simple_text");
    return `(${bagItems.length} ${itmStrng} | ${getPieces} ${t("resource.common.qty")})`;
  }, [bagItems, getPieces]);

  const sharedCartCouponProps = useMemo(() => {
    let couponBreakup = sharedCartData?.breakup_values?.coupon;
    let couponAttrs = {
      icon: "coupon",
      title: t("resource.cart.offers_and_coupons"),
    };
    if (couponBreakup && couponBreakup?.code && couponBreakup?.is_applied) {
      couponAttrs.hasCancel = true;
      couponAttrs.subtitle = `${t("resource.common.applied")}: ${couponBreakup.code}`;
    } else {
      couponAttrs.hasCancel = false;
      couponAttrs.subtitle = t("resource.cart.no_coupon_applied");
    }
    return couponAttrs;
  }, [sharedCartData]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.sharedCartContainer}>
        <div className={styles.title}>
          {t("resource.cart.shared_bag")}
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
                  {t("resource.cart.merge_bag")}
                </button>
              ) : (
                <button
                  disabled={bagItems?.length < 1}
                  className={styles.shareBtn}
                  onClick={onAddToBagClick}
                >
                  {t("resource.cart.add_to_bag")}
                </button>
              )}
              {showReplaceBtn && (
                <button
                  disabled={bagItems?.length < 1}
                  className={styles.shareBtn}
                  onClick={onReplaceBagClick}
                >
                  {t("resource.cart.replace_bag")}
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
  title,
  subtitle = "",
  icon = "coupon",
  hasCancel = false,
}) => {
  const { t } = useGlobalTranslation("translation");
  return (
    <div className={styles.list}>
      <span className={styles.icons}>
        <SvgWrapper svgSrc={icon} />
      </span>
      <div className={styles.offer}>
        <div className={styles.desc}>{title || t("resource.cart.offers_and_coupons")}</div>
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
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
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
                    item?.currency_symbol || "₹",
                    formatLocale(locale, countryCode, true)
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
                  item?.currency_symbol || "₹",
                  formatLocale(locale, countryCode, true)
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
