import React, { useMemo } from "react";
import {
  convertDate,
  getAddressStr,
  numberWithCommas,
} from "../../helper/utils";
import * as styles from "./order-status.less";
import PriceBreakup from "../../components/price-breakup/price-breakup";
import CartGiftItem from "./components/cart-gift-item/cart-gift-item";
import FyButton from "../../components/core/fy-button/fy-button";
import Modal from "../../components/core/modal/modal";
import { FDKLink } from "fdk-core/components";
import TrueCheckIcon from "../../assets/images/true-check.svg";

const orderFailurePageInfo = {
  link: "",
  linktext: "RETRY",
  text: "Oops! Your payment failed!",
  subText: "You can retry checkout or take another option for payment.",
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
    name: "John Doe",
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
            <div className={styles.orderConfirmed}>ORDER CONFIRMED</div>
            <div className={styles.successMsg}>
              Thank you for shopping with us! Your order is placed successfully
            </div>
            <div className={styles.orderId}>
              ORDER ID: <span>{orderData.order_id}</span>
            </div>
            <div className={styles.orderTime}>
              Placed on:
              <span> {convertDate(orderData.order_created_time)}</span>
            </div>
            <div className={styles.trackOrderBtn}>
              <a href={orderLink} style={{ display: "inline-block" }}>
                <FyButton
                  type="button"
                  variant="outlined"
                >
                  TRACK ORDER
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
                    <div className={styles["mode"]}>PAYMENT MODE</div>
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
                              {paymentInfo?.display_name || "COD"}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                  <div className={styles["delivery-wrapper"]}>
                    <div className={styles["delivery-header"]}>
                      DELIVERY ADDRESS
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
              <p className={styles.title}>Fetching Order Details</p>
              <p className={styles.message}>Please do not press back button</p>
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
          <span>{orderFailurePageInfo.text}</span>
          <span className={styles.subtext}>{orderFailurePageInfo.subText}</span>
          <button
            className={`${styles.commonBtn} ${styles.linkBtn} ${styles.boldSm}`}
            onClick={onOrderFailure}
          >
            {orderFailurePageInfo.linktext}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;

function ShipmentItem({ shipment, index, shipmentLength, orderLink = "" }) {
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
          <p className={styles.shipmentNumber}>{`Shipment ${
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
          Status: <span>{shipment?.shipment_status?.title}</span>
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
                  Size: &nbsp;
                  {product?.item?.size}
                </div>
                <div className={styles.sizeQuantity}>
                  Qty:&nbsp;
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
                <label htmlFor={product?.id}>Gift wrap Added</label>
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
