import React from "react";
import {
  numberWithCommas,
  priceFormatCurrencySymbol,
} from "../../../helper/utils";
import * as styles from "./single-shipment-content.less";
import { FDKLink } from "fdk-core/components";
import FreeGiftItem from "../../cart/Components/free-gift-item/free-gift-item";
import Shimmer from "../../../components/shimmer/shimmer";
import AppliedCouponIcon from "../../../assets/images/applied-coupon-small.svg";
import ShippingLogoIcon from "../../../assets/images/shipping-logo.svg";

function SingleShipmentContent({
  shipments,
  isShipmentLoading,
  showPaymentOptions,
  isHyperlocal = false,
  convertHyperlocalTat = () => {},
  loader,
  buybox = {},
  hurryUpThreshold = 10,
}) {
  const getShipmentItems = (shipment) => {
    let grpBySameSellerAndProduct = shipment?.items?.reduce((result, item) => {
      result[
        "" +
          item?.article?.seller?.uid +
          item?.article?.store?.uid +
          item?.product?.uid
      ] = (
        result[
          "" +
            item?.article?.seller?.uid +
            item?.article?.store?.uid +
            item?.product?.uid
        ] || []
      ).concat(item);
      return result;
    }, []);

    let updateArr = [];
    for (let key in grpBySameSellerAndProduct) {
      updateArr.push({
        item: grpBySameSellerAndProduct[key][0],
        articles: grpBySameSellerAndProduct[key],
      });
    }
    return updateArr;
  };
  const getProductImage = (product) => {
    if (product?.product?.images?.[0]?.url) {
      return product.product.images[0].url.replace("original", "resize-w:110");
    }
  };
  const getProductPath = (product) => {
    return "/product/" + product.product.slug;
  };
  const getCurrencySymbol = () => {
    return shipments?.[0]?.items?.[0]?.price?.converted?.currency_symbol || "₹";
  };

  const getMarkedPrice = (articles) => {
    let markedSum = articles.reduce((sum, artcl) => {
      sum += artcl.price.converted.marked;
      return sum;
    }, 0);
    let effective = articles.reduce((sum, artcl) => {
      sum += artcl.price.converted.effective;
      return sum;
    }, 0);
    return markedSum != effective ? numberWithCommas(markedSum) : null;
  };

  const getEffectivePrice = (articles) => {
    return numberWithCommas(
      articles.reduce((sum, artcl) => {
        sum += artcl.price.converted.effective;
        return sum;
      }, 0)
    );
  };

  return (
    <>
      {isShipmentLoading ? (
        <div className={styles.parent}>
          {loader || <Shimmer className={styles.shimmer} />}
        </div>
      ) : (
        <div className={styles.parent}>
          {shipments?.length > 0 &&
            shipments.map((item, index) => {
              const shipmentItems = getShipmentItems(item);
              return (
                <React.Fragment key={index + 2000}>
                  <div className={styles.reviewContentContainer}>
                    <div className={styles.shipmentWrapper}>
                      <div className={styles.shipmentHeading}>
                        <div className={styles.headerLeft}>
                          <div className={styles.shipmentNumber}>
                            Shipment {index + 1}/{shipments.length}
                          </div>
                          <div className={styles.itemCount}>
                            (
                            {`${shipmentItems.length} ${shipmentItems.length > 1 ? "Items" : "Item"}`}
                            )
                          </div>
                        </div>
                        {item?.promise && (
                          <div className={styles.deliveryDateWrapper}>
                            <div className={styles.shippingLogo}>
                              <ShippingLogoIcon />
                            </div>

                            <div className={styles.deliveryDate}>
                              {isHyperlocal
                                ? convertHyperlocalTat(item?.promise?.iso?.max)
                                : `Delivery by ${item?.promise?.formatted?.max}`}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        {shipmentItems.map((product, index) => (
                          <div
                            className={styles.item}
                            key={product?.item?.product?.name}
                          >
                            {product?.item?.coupon_message.length > 0 && (
                              <div className={styles.couponRibbon}>
                                <AppliedCouponIcon />
                                <span className={styles.ribbonMsg}>
                                  {product?.item?.coupon_message}
                                </span>
                              </div>
                            )}
                            <div className={styles.itemWrapper}>
                              <div className={styles.leftImg}>
                                <FDKLink to={getProductPath(product?.item)}>
                                  <img
                                    src={getProductImage(product?.item)}
                                    alt={product?.item?.product?.name}
                                  />
                                </FDKLink>
                              </div>
                              <div className={styles.rightDetails}>
                                <div className={styles.productDetails}>
                                  <div>
                                    <div className={styles.brandName}>
                                      {product?.item?.product?.brand?.name}
                                    </div>
                                    <div className={styles.productName}>
                                      {product?.item?.product?.name}
                                    </div>
                                  </div>
                                  <div className={styles.sizeInfo}>
                                    {product?.articles.map((article, index) => (
                                      <div
                                        className={styles.sizeQuantity}
                                        key={article?.article?.size + index}
                                      >
                                        <div className={styles.size}>
                                          Size: {article?.article.size}
                                        </div>
                                        <div className={styles.qty}>
                                          Qty: {article?.quantity}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className={styles.paymentInfo}>
                                  <div className={styles.priceWrapper}>
                                    <div className={styles.effectivePrice}>
                                      {priceFormatCurrencySymbol(
                                        getCurrencySymbol(),
                                        getEffectivePrice(product?.articles)
                                      )}
                                    </div>
                                    {!product.item.is_set &&
                                      getMarkedPrice(product?.articles) !==
                                        null && (
                                        <div className={styles.markedPrice}>
                                          {priceFormatCurrencySymbol(
                                            getCurrencySymbol(),
                                            getMarkedPrice(product?.articles)
                                          )}
                                        </div>
                                      )}
                                    <div className={styles.discount}>
                                      {product?.articles?.[0].discount}
                                    </div>
                                  </div>
                                  <div className={styles.offersWarning}>
                                    {product?.item?.article?.quantity <= hurryUpThreshold &&
                                      product?.item?.article?.quantity > 0 &&
                                      !buybox?.is_seller_buybox_enabled && (
                                        <div className={styles.limitedQnty}>
                                          Hurry! Only{" "}
                                          {product?.item?.article?.quantity}{" "}
                                          Left
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                              <FreeGiftItem
                                item={product?.item}
                                currencySymbol={
                                  product?.item?.price?.converted
                                    ?.currency_symbol ??
                                  product?.item?.price?.base?.currency_symbol
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          <div className={styles.proceedBtnWrapper}>
            <button className={styles.proceedBtn} onClick={showPaymentOptions}>
              Proceed To Pay
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleShipmentContent;

// className=("[a-z-]+")
// className={styles[$1]}
