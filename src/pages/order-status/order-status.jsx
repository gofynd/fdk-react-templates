import React, { useMemo } from "react";
import {
  convertDate,
  formatLocale,
  getAddressStr,
  numberWithCommas,
} from "../../helper/utils";
import * as styles from "./order-status.less";
import PriceBreakup from "../../components/price-breakup/price-breakup";
import CartGiftItem from "./components/cart-gift-item/cart-gift-item";
import FyButton from "../../components/core/fy-button/fy-button";
import Modal from "../../components/core/modal/modal";
import { FDKLink } from "fdk-core/components";
import {
  useGlobalStore,
  useFPI,
  useGlobalTranslation
} from "fdk-core/utils";
import TrueCheckIcon from "../../assets/images/true-check.svg";

const orderFailurePageInfo = {
  link: "",
  linktext: "resource.common.retry_caps",
  text: "resource.common.oops_payment_failed",
  subText: "resource.common.retry_checkout_or_other_payment_option",
  icon: "",
};

function OrderStatus({
  isLoggedIn,
  success,
  orderData,
  orderFailImg = "",
  onOrderFailure,
  showPolling = false,
  pollingComp = null,
  loader,
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale
  const orderLink = useMemo(
    () =>
      isLoggedIn
        ? "/profile/orders/"
        : `/order-tracking/${orderData?.order_id || ""}`,
    [isLoggedIn, orderData?.order_id]
  );

  function getItemCount() {
    return orderData?.shipments?.reduce((total, ship) => {
      total += ship.bags.length;
      return total;
    }, 0);
  }

  function getFullAddress(addr) {
    if (addr) {
      return getAddressStr(addr, false);
    }
  }

  const getAddressData = orderData?.shipments?.[0]?.delivery_address || {
    name: t("resource.order.john_doe"),
    address_type: "Home",
    phone: "1234567890",
  };

  return success === "true" ? (
    <div className={styles.orders}>
      {orderData?.order_id ? (
        <div>
          <div className={styles.orderStatus}>
            <div>
              <TrueCheckIcon />
            </div>
            <div className={styles.orderConfirmed}>{t("resource.order.order_confirmed_caps")}</div>
            <div className={styles.successMsg}>
              {t("resource.order.order_success")}
            </div>
            <div className={styles.orderId}>
              {t("resource.order.order_id_caps")}: <span>{orderData.order_id}</span>
            </div>
            <div className={styles.orderTime}>
              {t("resource.order.placed_on")}:
              <span> {convertDate(orderData.order_created_time, formatLocale(locale, countryCode)
              )}</span>
            </div>
            <div className={styles.trackOrderBtn}>
              <a href={orderLink} style={{ display: "inline-block" }}>
                <FyButton
                  type="button"
                  variant="outlined"
                >
                  {t("resource.order.track_order_caps")}
                </FyButton>
              </a>
              <a
                href="/"
                style={{ display: "inline-block", paddingLeft: "12px" }}
              >
                <FyButton variant="contained" color="primary" type="button">
                  Continue Shopping
                </FyButton>
              </a>
            </div>
          </div>
          <div className={styles.orderDetail}>
            <div className={styles.leftOrderDetails}>
              <div className={`${styles.shipmentList} fontBody`}>
                {orderData?.shipments?.map((shipment, index) => (
                  <ShipmentItem
                    shipment={shipment}
                    index={index}
                    shipmentLength={orderData?.shipments?.length}
                    orderLink={orderLink}
                  />
                ))}
              </div>
            </div>
            <div className={styles.rightOrderDetails}>
              <div className={styles.orderStatusPriceBreakup}>
                <PriceBreakup
                  breakUpValues={orderData?.breakup_values}
                  cartItemCount={getItemCount()}
                  currencySymbol={
                    orderData?.breakup_values?.[0]?.currency_symbol
                  }
                />
              </div>
              {isLoggedIn && (
                <div className={`${styles["payment-address"]} fontBody`}>
                  <div className={styles["payment-wrapper"]}>
                    <div className={styles["mode"]}>{t("resource.common.payment_mode")}</div>
                    {orderData?.shipments?.[0]?.payment_info?.length > 0 &&
                      orderData?.shipments?.[0]?.payment_info?.map(
                        (paymentInfo) => (
                          <div
                            key={paymentInfo?.display_name}
                            className={styles["mode-data"]}
                          >
                            <span>
                              <img
                                src={
                                  paymentInfo?.logo ||
                                  "https://cdn.iconscout.com/icon/premium/png-512-thumb/debit-card-10-742447.png?f=webp&w=256"
                                }
                                alt={paymentInfo?.mode}
                              />
                            </span>
                            <span className={styles["mode-name"]}>
                              {paymentInfo?.display_name || t("resource.order.cod")}
                            </span>
                          </div>
                        )
                      )}
                  </div >
                  <div className={styles["delivery-wrapper"]}>
                    <div className={styles["delivery-header"]}>
                      {t("resource.order.delivery_address")}
                    </div>
                    <div className={styles["delivery-details"]}>
                      <div className={styles["name-label"]}>
                        <div className={styles["name"]}>
                          {getAddressData?.name}
                        </div>
                        <div className={styles["label"]}>
                          {getAddressData?.address_type
                            ?.charAt(0)
                            ?.toUpperCase() +
                            getAddressData?.address_type.slice(1)}
                        </div>
                      </div>
                      <div className={styles["address-phone"]}>
                        <div className={styles["address"]}>
                          {getFullAddress(getAddressData)}
                        </div>
                        <div className={styles.phone}>
                          {getAddressData?.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : showPolling ? (
        pollingComp
      ) : (
        <div>
          <Modal isOpen={true} hideHeader={true}>
            <div className={styles.orderStatusModal}>
              <div className={styles.loader}></div>
              <p className={styles.title}>{t("resource.order.fetching_order_details")}</p>
              <p className={styles.message}>{t("resource.order.please_do_not_press_back_button")}</p>
            </div>
          </Modal>
        </div>
      )}
    </div>
  ) : (
    <div>
      <div className={styles.orderFail}>
        <img src={orderFailImg} alt={orderFailImg} />
        <div className={styles.cartErrorText}>
          <span>{t(orderFailurePageInfo.text)}</span>
          <span className={styles.subtext}>{t(orderFailurePageInfo.subText)}</span>
          <button
            className={`${styles.commonBtn} ${styles.linkBtn} ${styles.boldSm}`}
            onClick={onOrderFailure}
          >
            {t(orderFailurePageInfo.linktext)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;

function ShipmentItem({ shipment, index, shipmentLength, orderLink = "" }) {
  const { t } = useGlobalTranslation("translation");
  const getBags = (bags) => {
    return bags.filter(
      (bag) => Object.keys(bag?.parent_promo_bags)?.length === 0
    );
  };

  const isShipmentCancelled = shipment?.shipment_status?.value === "cancelled";

  return (
    <div className={styles.shipmentItem} key={index}>
      <div className={styles.shipmentItemHead}>
        <div>
          <p className={styles.shipmentNumber}>{`${t("resource.common.shipment")} ${index + 1
            } / ${shipmentLength}`}</p>
          <h5 style={{ marginTop: "8px" }}>{shipment?.shipment_id}</h5>
        </div>
        <div
          className={styles.statusWrapper}
          style={{
            ...(isShipmentCancelled && {
              background: shipment?.shipment_status?.hex_code,
              color: "#fff",
            }),
          }}
        >
          {t("resource.order.status")}: <span>{shipment?.shipment_status?.title}</span>
        </div>
        <div
          className={styles.statusWrapperMobile}
          style={{
            ...(isShipmentCancelled && {
              background: shipment?.shipment_status?.hex_code,
              color: "#fff",
            }),
          }}
        >
          {shipment?.shipment_status?.title}
        </div>
      </div>
      <div className={styles.shipmentItemItemsData}>
        {getBags(shipment?.bags)?.map((item, index) => (
          <div className={styles.shipmentProdItemWrapper}>
            <ProductItem product={item} key={index} orderLink={orderLink} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductItem({ product, orderLink = "" }) {
  const { t } = useGlobalTranslation("translation");
  const markedPriceCheck = product?.prices?.price_marked;
  const effectivePriceCheck = product?.prices?.price_effective;

  const getMarkedPrice = (item) => numberWithCommas(item?.prices?.price_marked);
  const getEffectivePrice = (item) =>
    numberWithCommas(item?.prices?.price_effective);

  function getItem(bag) {
    let bagItem = { ...bag };
    if (bagItem.applied_promos) {
      bagItem.promotions_applied = bagItem.applied_promos;
      delete bagItem.applied_promos;
    }
    return bagItem;
  }

  return (
    <FDKLink to={orderLink}>
      <div className={styles.shipmentProdItem}>
        <div className={styles.prodImg}>
          <img src={product.item.image[0]} alt={product?.item?.name} />
        </div>
        <div className={styles.prodItemData}>
          <div className={styles.productDetails}>
            <div className={styles.brandName}>{product?.item?.brand?.name}</div>
            <div className={styles.productName}>{product?.item?.name}</div>
            <div className={styles.sizeInfo}>
              <div className={styles.sizeQuantity}>
                <div className={styles.size}>
                  {t("resource.common.size")}: &nbsp;
                  {product?.item?.size}
                </div>
                <div className={styles.sizeQuantity}>
                {t("resource.common.qty")}:&nbsp;
                  {product?.quantity}
                </div>
              </div>
            </div>
            <div className={styles.paymentInfo}>
              {effectivePriceCheck > 0 && (
                <div className={styles.effectivePrice}>
                  {`${product?.prices?.currency_symbol}${getEffectivePrice(
                    product
                  )}`}
                </div>
              )}
              {markedPriceCheck > 0 &&
                effectivePriceCheck !== markedPriceCheck && (
                  <div className={styles.markedPrice}>
                    {`${product?.prices?.currency_symbol}${getMarkedPrice(product)}`}
                  </div>
                )}
            </div>

            {/* Gift Wrap Display UI */}
            {product?.meta?.gift_card?.is_gift_applied && (
              <div className={styles["gift-wrap"]}>
                <input
                  type="checkbox"
                  id={product.id}
                  disabled={product}
                  checked={product?.meta?.gift_card?.is_gift_applied}
                />
                <label htmlFor={product?.id}>{t("resource.order.gift_wrap_added")}</label>
              </div>
            )}
            {/* Show Free Gifts  Desktop */}
            {getItem(product)?.promotions_applied?.length > 0 && (
              <div className={styles["desktop-free-gift"]}>
                <CartGiftItem bagItem={getItem(product)}></CartGiftItem>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Show Free Gifts  Mobile */}
      {getItem(product)?.promotions_applied?.length > 0 && (
        <div className={styles["mobile-free-gift"]}>
          <CartGiftItem bagItem={getItem(product)}></CartGiftItem>
        </div>
      )}
    </FDKLink>
  );
}
