import React, { useMemo } from "react";
import * as styles from "./shared-cart.less";
import { useGlobalTranslation } from "fdk-core/utils";
import SharedCartItems from "./shared-cart-items";
import SharedCartBreakupContainer from "./shared-cart-breakup";

const SharedCart = ({
  sharedCartData = {},
  bagItems = [],
  showReplaceBtn = false,
  onMergeBagClick = () => {},
  onAddToBagClick = () => {},
  onReplaceBagClick = () => {},
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
    const bagItemsLength = bagItems?.length || 0;
    let itmStrng =
      bagItemsLength > 1
        ? t("resource.common.item_simple_text_plural")
        : t("resource.common.item_simple_text");
    return `(${bagItemsLength} ${itmStrng} | ${getPieces} ${t("resource.common.qty")})`;
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
          <SharedCartItems bagItems={bagItems} />
          <div className={styles.breakUpContainer}>
            <SharedCartBreakupContainer
              sharedCartData={sharedCartData}
              couponProps={sharedCartCouponProps}
              bagItems={bagItems}
              showReplaceBtn={showReplaceBtn}
              onMergeBagClick={onMergeBagClick}
              onAddToBagClick={onAddToBagClick}
              onReplaceBagClick={onReplaceBagClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedCart;
