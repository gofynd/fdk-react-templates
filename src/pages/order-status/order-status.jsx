import React, { useMemo } from "react";
import {
  convertDate,
  formatLocale,
  getAddressStr,
  numberWithCommas,
  priceFormatCurrencySymbol,
  translateDynamicLabel,
  getProductImgAspectRatio,
} from "../../helper/utils";
import * as styles from "./order-status.less";
import PriceBreakup from "../../components/price-breakup/price-breakup";
import CartGiftItem from "./components/cart-gift-item/cart-gift-item";
import FyButton from "../../components/core/fy-button/fy-button";
import Modal from "../../components/core/modal/modal";
import { FDKLink } from "fdk-core/components";
import { useGlobalStore, useFPI, useGlobalTranslation } from "fdk-core/utils";
import TrueCheckIcon from "../../assets/images/true-check.svg";
import { BagImage, BundleBagImage } from "../../components/bag/bag";
import Accordion from "../../components/accordion/accordion";

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
  getGroupedShipmentBags,
  globalConfig,
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  function getOrderLink() {
    const basePath = isLoggedIn
      ? "/profile/orders/"
      : `/order-tracking/${orderData?.order_id}`;
    return locale && locale !== "en" ? `/${locale}${basePath}` : basePath;
  }

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
            <div className={styles.orderConfirmed}>
              {t("resource.order.order_confirmed_caps")}
            </div>
            <div className={styles.successMsg}>
              {t("resource.order.order_success")}
            </div>
            <div className={styles.orderId}>
              {t("resource.order.order_id_caps")}:{" "}
              <span>{orderData.order_id}</span>
            </div>
            <div className={styles.orderTime}>
              {t("resource.order.placed_on")}:
              <span>
                {convertDate(
                  orderData.order_created_ts,
                  formatLocale(locale, countryCode, true)
                )}
              </span>
            </div>
            <div className={styles.trackOrderBtn}>
              <a href={getOrderLink()} style={{ display: "inline-block" }}>
                <FyButton type="button" variant="outlined">
                  {t("resource.order.track_order_caps")}
                </FyButton>
              </a>
              <a
                className={styles.continueBtn}
                href={locale && locale !== "en" ? `/${locale}` : "/"}
              >
                <FyButton variant="contained" color="primary" type="button">
                  {t("resource.common.continue_shopping")}
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
                    orderLink={getOrderLink()}
                    getGroupedShipmentBags={getGroupedShipmentBags}
                    globalConfig={globalConfig}
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
                    <div className={styles["mode"]}>
                      {t("resource.common.payment_mode")}
                    </div>
                    {(() => {
                      // Aggregate paymentInfos by mode (using a map)
                      const paymentInfos = (orderData?.shipments || [])
                        .flatMap(shipment => shipment?.payment_info || [])
                        .filter(Boolean);

                      // We'll group by unique "mode" (or fallback to display_name)
                      const paymentModeMap = {};

                      paymentInfos.forEach((paymentInfo) => {
                        // Use a composite key in case display_name is duplicated but mode differs
                        const modeKey = paymentInfo?.mode || paymentInfo?.display_name || "OTHER";
                        if (!paymentModeMap[modeKey]) {
                          paymentModeMap[modeKey] = {
                            ...paymentInfo,
                            amount: Number(paymentInfo?.amount) || 0,
                          };
                        } else {
                          // Sum up the amount
                          paymentModeMap[modeKey].amount += Number(paymentInfo?.amount) || 0;
                        }
                      });

                      const mergedPaymentInfos = Object.values(paymentModeMap);

                      if (mergedPaymentInfos.length > 0) {
                        return mergedPaymentInfos.map((paymentInfo, idx) => (
                          <div
                            key={`${paymentInfo?.display_name || paymentInfo?.mode}-${idx}`}
                            className={styles["mode-data"]}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between"
                            }}
                          >
                            <span style={{ display: "flex", alignItems: "center" }}>
                              <img
                                src={
                                  paymentInfo?.logo ||
                                  "https://cdn.iconscout.com/icon/premium/png-512-thumb/debit-card-10-742447.png?f=webp&w=256"
                                }
                                alt={paymentInfo?.mode}
                              />
                              <span className={styles["mode-name"]} style={{ marginLeft: 12, marginTop: 6 }}>
                                {translateDynamicLabel(paymentInfo?.display_name, t) || t("resource.order.cod")}
                              </span>
                            </span>
                            <span className={styles["mode-amount"]}>
                              {paymentInfo?.amount !== undefined && paymentInfo?.amount !== null
                                ? priceFormatCurrencySymbol(
                                    paymentInfo?.currency_symbol ||
                                      orderData?.breakup_values?.[0]?.currency_symbol,
                                    paymentInfo?.amount
                                  )
                                : null}
                            </span>
                          </div>
                        ));
                      }
                      // If paymentInfos is empty, render nothing
                      return null;
                    })()}
                  </div>
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
                          {translateDynamicLabel(
                            getAddressData?.address_type
                              ?.charAt(0)
                              ?.toUpperCase() +
                              getAddressData?.address_type.slice(1),
                            t
                          )}
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
              <p className={styles.title}>
                {t("resource.order.fetching_order_details")}
              </p>
              <p className={styles.message}>
                {t("resource.order.please_do_not_press_back_button")}
              </p>
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
          <span className={styles.subtext}>
            {t(orderFailurePageInfo.subText)}
          </span>
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

function ShipmentItem({
  shipment,
  index,
  shipmentLength,
  orderLink = "",
  getGroupedShipmentBags,
  globalConfig,
}) {
  const { t } = useGlobalTranslation("translation");
  const {
    bags: getBags,
    bundleGroups,
    bundleGroupArticles,
  } = useMemo(
    () => getGroupedShipmentBags(shipment?.bags, { includePromoBags: false }),
    [shipment?.bags]
  );

  const isShipmentCancelled = shipment?.shipment_status?.value === "cancelled";

  return (
    <div className={styles.shipmentItem} key={index}>
      <div className={styles.shipmentItemHead}>
        <div>
          <p
            className={styles.shipmentNumber}
          >{`${t("resource.common.shipment")} ${
            index + 1
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
          {t("resource.order.status")}:{" "}
          <span>{shipment?.shipment_status?.title}</span>
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
        {getBags?.map((item, index) => (
          <div className={styles.shipmentProdItemWrapper}>
            <ProductItem
              key={index}
              product={item}
              orderLink={orderLink}
              bundleGroups={bundleGroups}
              bundleGroupArticles={bundleGroupArticles}
              globalConfig={globalConfig}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductItem({
  product,
  orderLink = "",
  bundleGroups,
  bundleGroupArticles,
  globalConfig,
}) {
  const { t } = useGlobalTranslation("translation");
  const bundleGroupId = product?.bundle_details?.bundle_group_id;
  const aspectRatio = getProductImgAspectRatio(globalConfig);
  const isBundleItem =
    product?.bundle_details?.bundle_group_id &&
    bundleGroups &&
    bundleGroups[product?.bundle_details?.bundle_group_id]?.length > 0;
  const markedPriceCheck = product?.prices?.price_marked;
  const effectivePriceCheck = product?.prices?.price_effective;
  const customizationOptions = product?.meta?._custom_json?._display || [];

  const [items, setItems] = React.useState([
    { title: "Customization", content: customizationOptions, open: false },
  ]);

  const handleItemClick = (index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        open: !updatedItems[index].open,
      };
      return updatedItems;
    });
  };

  const getMarkedPrice = (item) => numberWithCommas(item?.prices?.price_marked);
  const getEffectivePrice = (item) =>
    numberWithCommas(item?.prices?.price_effective);

  const { name, brand, size, itemQty, markedPrice, effectivePrice } =
    useMemo(() => {
      if (isBundleItem) {
        // For bundles, sum all individual bag prices from the bundleGroups
        // This avoids the mutation issue where getGroupedShipmentBags modifies bundle_details
        const bundleBags = bundleGroups[bundleGroupId] || [];
        
        // Sum the ORIGINAL individual bag prices (not the modified base bag prices)
        const totalEffectivePrice = bundleBags.reduce((sum, bag) => {
          // If base bag has been aggregated by getGroupedShipmentBags, use financial_breakup instead
          const isAggregated = bag?.bundle_details?.is_base && 
                               bag?.prices?.price_effective > (bag?.financial_breakup?.[0]?.price_effective || bag?.prices?.price_effective);
          
          if (isAggregated) {
            return sum + (bag?.financial_breakup?.[0]?.price_effective || 0);
          }
          
          return sum + (bag?.prices?.price_effective || 0);
        }, 0);
        
        const totalMarkedPrice = bundleBags.reduce((sum, bag) => {
          const isAggregated = bag?.bundle_details?.is_base && 
                               bag?.prices?.price_marked > (bag?.financial_breakup?.[0]?.price_marked || bag?.prices?.price_marked);
          
          if (isAggregated) {
            return sum + (bag?.financial_breakup?.[0]?.price_marked || 0);
          }
          
          return sum + (bag?.prices?.price_marked || 0);
        }, 0);
        
        return {
          name: product?.bundle_details?.name,
          brand: "",
          size: "",
          itemQty: product?.bundle_details?.bundle_count,
          markedPrice: totalMarkedPrice,
          effectivePrice: totalEffectivePrice,
        };
      }
      return {
        name: product?.item?.name,
        brand: product?.item?.brand?.name,
        size: product?.item?.size,
        itemQty: product?.quantity,
        markedPrice: product?.prices?.price_marked,
        effectivePrice: product?.prices?.price_effective,
      };
    }, [product, isBundleItem, bundleGroups, bundleGroupId]);

  const getGiftItem = useMemo(() => {
    let bagItem = { ...product };
    if (bagItem.applied_promos) {
      bagItem.promotions_applied = bagItem.applied_promos;
      delete bagItem.applied_promos;
    }
    return bagItem;
  }, [product]);

  return (
    <FDKLink to={orderLink}>
      <div className={styles.shipmentProdItem}>
        <div className={styles.prodImg}>
          <BagImage
            bag={product}
            isBundle={isBundleItem}
            aspectRatio={aspectRatio}
          />
        </div>
        <div className={styles.prodItemData}>
          <div className={styles.productDetails}>
            {brand && <div className={styles.brandName}>{brand}</div>}
            <div className={styles.productName}>{name}</div>
            <div className={styles.sizeInfo}>
              <div className={styles.sizeQuantity}>
                {size && (
                  <div className={styles.size}>
                    {t("resource.common.size")}: &nbsp;
                    {size}
                  </div>
                )}
                <div className={styles.sizeQuantity}>
                  {t("resource.common.qty")}:&nbsp;
                  {itemQty}
                </div>
              </div>
            </div>
            <div className={styles.paymentInfo}>
              {effectivePrice > 0 && (
                <div className={styles.effectivePrice}>
                  {`${product?.prices?.currency_symbol}${numberWithCommas(effectivePrice)}`}
                </div>
              )}
              {markedPrice > 0 && effectivePrice !== markedPrice && (
                <div className={styles.markedPrice}>
                  {`${product?.prices?.currency_symbol}${numberWithCommas(markedPrice)}`}
                </div>
              )}
            </div>
            {customizationOptions.length > 0 && (
              <div className={styles.productCustomizationContainer}>
                <Accordion
                  key={`${product.shipment_id}`}
                  items={items}
                  onItemClick={handleItemClick}
                />
              </div>
            )}

            {/* Gift Wrap Display UI */}
            {product?.meta?.gift_card?.is_gift_applied && (
              <div className={styles["gift-wrap"]}>
                <input
                  type="checkbox"
                  id={product.id}
                  disabled={product}
                  checked={product?.meta?.gift_card?.is_gift_applied}
                />
                <label htmlFor={product?.id}>
                  {t("resource.order.gift_wrap_added")}
                </label>
              </div>
            )}
            {/* Show Free Gifts  Desktop */}
            {getGiftItem?.promotions_applied?.length > 0 && (
              <div className={styles["desktop-free-gift"]}>
                <CartGiftItem bagItem={getGiftItem}></CartGiftItem>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Show Free Gifts  Mobile */}
      {getGiftItem?.promotions_applied?.length > 0 && (
        <div className={styles["mobile-free-gift"]}>
          <CartGiftItem bagItem={getGiftItem}></CartGiftItem>
        </div>
      )}
    </FDKLink>
  );
}
