import React from "react";
import {
  numberWithCommas,
  currencyFormat,
  formatLocale,
  isRunningOnClient,
} from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./sticky-footer.less";
import { useGlobalStore, useFPI, useGlobalTranslation } from "fdk-core/utils";

function StickyFooter({
  isLoggedIn = false,
  isValid = true,
  isOutOfStock = false,
  isNotServicable = false,
  isAnonymous = true,
  totalPrice = 0,
  currencySymbol = "₹",
  onLoginClick = () => {},
  onCheckoutClick = () => {},
  onPriceDetailsClick = () => {},
  order = {},
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  const isRewardPoints = false;
  const rewardPoints = 0;
  const isRewardPointsApplied = false;
  const updateRewardPoints = () => {};

  return (
    <div className={styles.stickyFooter}>
      {isRewardPoints && rewardPoints > 0 && isLoggedIn ? (
        <div
          className={`${styles.billContainer} ${styles.rewardPointCheckbox}`}
        >
          {isRewardPointsApplied ? (
            <input type="checkbox" checked onClick={updateRewardPoints()} />
          ) : (
            <input type="checkbox" onClick={updateRewardPoints()} />
          )}

          <div className={styles.rewardDiv}>
            <span className={styles.rewardPoi}>
              {`${t("resource.cart.redeem_rewards_points_worth")} ${numberWithCommas(rewardPoints)}`}
            </span>
            <SvgWrapper svgSrc="reward-icon-mobile" />
          </div>
        </div>
      ) : (
        !isLoggedIn && (
          <div className={`${styles.billContainer} ${styles.billContainer2}`}>
            {totalPrice > 0 && (
              <div className={styles.getTotalPrice}>
                <span className={styles.nccPrice}>
                  {t("resource.cart.total_price")}:
                </span>
                <span className={styles.nccTotalPrice}>
                  {currencyFormat(
                    numberWithCommas(totalPrice),
                    currencySymbol,
                    formatLocale(locale, countryCode, true)
                  )}
                </span>
              </div>
            )}
            <div
              className={`${styles.viewPriceBtn} ${styles.nccViewBtn}`}
              onClick={onPriceDetailsClick}
            >
              {t("resource.cart.view_bill")}
            </div>
          </div>
        )
      )}

      {!isLoggedIn && (
        <div className={`${styles.stickyBtnContainer} ${styles.nccStickyBtn}`}>
          <button
            className={`${styles.width40} ${styles.secondaryCheckoutBtn}`}
            onClick={onLoginClick}
          >
            {t("resource.auth.login.login_caps")}
          </button>

          {isAnonymous && (
            <button
              className={`${styles.cartCheckoutBtn} ${styles.cartCheckoutBtn3}`}
              disabled={
                !isValid || isOutOfStock || isNotServicable || !order?.enabled
              }
              onClick={onCheckoutClick}
            >
              {t("resource.section.cart.continue_as_guest")}
            </button>
          )}
        </div>
      )}
      {isLoggedIn && (
        <div
          className={`${styles.stickyBtnContainer} ${styles.stickyBtnContainer1}`}
        >
          <div className={styles.priceContainerMobile}>
            <div className={styles.totalPrice}>
              {currencyFormat(
                numberWithCommas(totalPrice),
                currencySymbol,
                formatLocale(locale, countryCode, true)
              )}
            </div>
            <div
              className={`${styles.viewPriceBtn} ${styles.viewPBtn}`}
              onClick={onPriceDetailsClick}
            >
              {t("resource.cart.view_price_details")}
            </div>
          </div>
          <button
            className={`${styles.cartCheckoutBtn} ${styles.priceContainerMobileCheckoutBtn} ${styles.checkoutButton}`}
            disabled={
              !isValid || isOutOfStock || isNotServicable || !order?.enabled
            }
            onClick={onCheckoutClick}
          >
            {t("resource.section.cart.checkout_button_caps")}
            <SvgWrapper
              svgSrc="angle-right"
              className={
                isRunningOnClient() && document.dir === "rtl"
                  ? styles.rotate180
                  : ""
              }
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default StickyFooter;
