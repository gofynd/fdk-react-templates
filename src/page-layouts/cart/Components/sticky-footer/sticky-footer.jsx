import React from "react";
import { numberWithCommas, currencyFormat } from "../../../../helper/utils";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./sticky-footer.less";

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
}) {
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
              {`Redeem Rewards Points Worth ${numberWithCommas(rewardPoints)}`}
            </span>
            <SvgWrapper svgSrc="reward-icon-mobile" />
          </div>
        </div>
      ) : (
        !isLoggedIn && (
          <div className={`${styles.billContainer} ${styles.billContainer2}`}>
            {totalPrice > 0 && (
              <div className={styles.getTotalPrice}>
                <span className={styles.nccPrice}>Total Price:</span>
                <span className={styles.nccTotalPrice}>
                  {currencyFormat(numberWithCommas(totalPrice), currencySymbol)}
                </span>
              </div>
            )}
            <div
              className={`${styles.viewPriceBtn} ${styles.nccViewBtn}`}
              onClick={onPriceDetailsClick}
            >
              View Bill
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
            LOGIN
          </button>

          {isAnonymous && (
            <button
              className={`${styles.cartCheckoutBtn} ${styles.cartCheckoutBtn3}`}
              disabled={!isValid || isOutOfStock || isNotServicable}
              onClick={onCheckoutClick}
            >
              Continue as Guest
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
              {currencyFormat(numberWithCommas(totalPrice), currencySymbol)}
            </div>
            <div
              className={`${styles.viewPriceBtn} ${styles.viewPBtn}`}
              onClick={onPriceDetailsClick}
            >
              View Price Details
            </div>
          </div>
          <button
            className={`${styles.cartCheckoutBtn} ${styles.priceContainerMobileCheckoutBtn} ${styles.checkoutButton}`}
            disabled={!isValid || isOutOfStock || isNotServicable}
            onClick={onCheckoutClick}
          >
            CHECKOUT
            <SvgWrapper svgSrc="angle-right" />
          </button>
        </div>
      )}
    </div>
  );
}

export default StickyFooter;
