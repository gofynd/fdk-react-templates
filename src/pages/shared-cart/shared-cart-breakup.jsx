import React from "react";
import * as styles from "./shared-cart.less";
import {
  currencyFormat,
  formatLocale,
  numberWithCommas,
  translateDynamicLabel,
} from "../../helper/utils";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import { useGlobalStore, useFPI, useGlobalTranslation } from "fdk-core/utils";

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
        <div className={styles.desc}>
          {title || t("resource.cart.offers_and_coupons")}
        </div>
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
  const { t } = useGlobalTranslation("translation");
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
              <div>{translateDynamicLabel(item.display, t)}</div>
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
              <div>{translateDynamicLabel(item.display, t)}</div>
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

const SharedCartBreakupContainer = ({
  sharedCartData = {},
  couponProps = {},
  bagItems = [],
  showReplaceBtn = false,
  onMergeBagClick = () => {},
  onAddToBagClick = () => {},
  onReplaceBagClick = () => {},
}) => {
  const { t } = useGlobalTranslation("translation");

  return (
    <>
      <SharedCartCoupons {...couponProps} />
      <SharedCartBreakup breakup={sharedCartData?.breakup_values?.display} />
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
    </>
  );
};

export default SharedCartBreakupContainer;
export { SharedCartCoupons, SharedCartBreakup };
