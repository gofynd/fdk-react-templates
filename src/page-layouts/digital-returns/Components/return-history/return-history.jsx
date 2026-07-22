import React, { useState } from "react";
import * as styles from "./return-history.less";
import { RETURN_DUMMY_IMAGE } from "../shared/dummy-image";

const formatDate = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  const formatted = raw.match(/^(\d{1,2})\s*[/-]\s*(\d{1,2})\s*[/-]\s*(\d{4})$/);
  if (formatted) {
    return `${formatted[1].padStart(2, "0")} / ${formatted[2].padStart(2, "0")} / ${formatted[3]}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return raw;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd} / ${mm} / ${yyyy}`;
};

const getReturnShipments = (entry) => {
  const shipments = entry?.shipments || [];
  const returnShipments = shipments.filter((shipment) => {
    const title = String(shipment?.shipment_status?.title || "").toLowerCase();
    return shipment?.return_meta || title.includes("return");
  });
  return returnShipments.length ? returnShipments : shipments;
};

const getImages = (entry) => {
  if (Array.isArray(entry?.images)) {
    return entry.images
      .map((image, index) =>
        typeof image === "string"
          ? {
              id: `${entry?.orderId || entry?.returnId || "return"}-${index}`,
              src: image,
              alt: entry?.productName || "Product",
            }
          : image
      )
      .filter((image) => image?.src || image?.url);
  }
  if (Array.isArray(entry?.items)) {
    return entry.items
      .map((item, index) => ({
        id: item?.id || item?.line_number || `${entry?.orderId || "return"}-${index}`,
        src: item?.image || item?.imageUrl || item?.productImage,
        alt: item?.name || item?.productName || "Product",
      }))
      .filter((image) => image.src);
  }
  if (Array.isArray(entry?.products)) {
    return entry.products
      .map((product, index) => ({
        id: product?.id || `${entry?.orderId || "return"}-${index}`,
        src: product?.image || product?.imageUrl || product?.productImage,
        alt: product?.name || product?.productName || "Product",
      }))
      .filter((image) => image.src);
  }
  const images = [];
  getReturnShipments(entry).forEach((shipment) => {
    shipment?.bags?.forEach((bag) => {
      const src = bag?.item?.image?.[0];
      if (src) {
        images.push({
          id: `${shipment?.shipment_id || "shipment"}-${bag?.id}`,
          src,
          alt: bag?.item?.name || "Product",
        });
      }
    });
  });
  if (!images.length && (entry?.productName || entry?.orderDetails?.productName)) {
    return [
      {
        id: `${entry?.returnId || entry?.orderId || "return"}-placeholder`,
        src: RETURN_DUMMY_IMAGE,
        alt: entry?.productName || entry?.orderDetails?.productName || "Product",
      },
    ];
  }
  return images;
};

const getTotal = (entry) => {
  if (entry?.total != null) return { amount: entry.total, symbol: entry.symbol || "₹" };
  if (entry?.price != null) return { amount: entry.price, symbol: entry.symbol || "₹" };
  if (entry?.orderDetails?.price != null) {
    return { amount: entry.orderDetails.price, symbol: entry.symbol || "₹" };
  }
  if (Array.isArray(entry?.items)) {
    return {
      amount: entry.items.reduce((sum, item) => sum + Number(item?.price || item?.amount || 0), 0),
      symbol: entry.symbol || "₹",
    };
  }
  let amount = 0;
  let symbol = "₹";
  getReturnShipments(entry).forEach((shipment) => {
    shipment?.bags?.forEach((bag) => {
      amount += bag?.prices?.amount_paid || 0;
      if (bag?.prices?.currency_symbol) symbol = bag.prices.currency_symbol;
    });
  });
  return { amount, symbol };
};

const getStatus = (entry) => {
  const shipment = getReturnShipments(entry)[0] || entry?.shipments?.[0];
  return (
    entry?.statusLabel ||
    entry?.returnStatusLabel ||
    entry?.status ||
    entry?.returnStatus ||
    shipment?.return_meta?.status_label ||
    shipment?.return_meta?.return_status_label ||
    shipment?.return_meta?.status ||
    shipment?.return_meta?.return_status ||
    shipment?.shipment_status?.title ||
    "Pending return"
  );
};

const getStatusTone = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("refund") || s.includes("approved") || s.includes("complete")) {
    return "success";
  }
  if (s.includes("closed") || s.includes("cancel") || s.includes("reject")) {
    return "danger";
  }
  if (s.includes("pending") || s.includes("initiated") || s.includes("return")) {
    return "warning";
  }
  return "neutral";
};

const getPrimaryReturnShipment = (entry) =>
  getReturnShipments(entry)[0] || entry?.shipments?.find(Boolean) || {};

const getReturnId = (entry) => {
  const shipment = getPrimaryReturnShipment(entry);
  const meta = shipment?.return_meta || {};
  return (
    entry?.returnId ||
    entry?.return_id ||
    meta.return_id ||
    meta.returnId ||
    meta.id ||
    shipment?.return_id ||
    shipment?.shipment_id ||
    "150788"
  );
};

const getReturnMethod = (entry) => {
  const shipment = getPrimaryReturnShipment(entry);
  const meta = shipment?.return_meta || {};
  return (
    entry?.returnMethod ||
    entry?.return_method ||
    meta.return_method ||
    meta.returnMethod ||
    meta.method ||
    shipment?.return_method ||
    "Post"
  );
};

const getRefundMethod = (entry) => {
  const shipment = getPrimaryReturnShipment(entry);
  const meta = shipment?.return_meta || {};
  const refund = shipment?.refund_details || {};
  return (
    entry?.refundMethod ||
    entry?.refund_method ||
    meta.refund_method ||
    meta.refundMethod ||
    refund.refund_method ||
    refund.mode ||
    refund.method ||
    "VISA Credit card"
  );
};

const normalizeProductItem = (item, entry, index) => {
  const price = item?.price || item?.amount || item?.amount_paid || 0;
  const markedPrice =
    item?.markedPrice || item?.price_marked || item?.value_of_good || price;
  return {
    id: item?.id || item?.line_number || `${entry?.orderId || "return"}-${index}`,
    image: item?.image || item?.imageUrl || item?.productImage,
    name: item?.name || item?.productName || "Returned item",
    size: item?.size || "S",
    color: item?.color || item?.colorName || item?.colour || "Colour name",
    quantity: item?.quantity || 1,
    price,
    markedPrice,
    symbol: entry?.symbol || item?.symbol || "₹",
  };
};

const getLineItems = (entry) => {
  if (Array.isArray(entry?.items)) {
    return entry.items.map((item, index) => normalizeProductItem(item, entry, index));
  }
  if (Array.isArray(entry?.products)) {
    return entry.products.map((item, index) => normalizeProductItem(item, entry, index));
  }

  const items = [];
  getReturnShipments(entry).forEach((shipment) => {
    shipment?.bags?.forEach((bag, index) => {
      const prices = bag?.prices || {};
      const price = prices.amount_paid || prices.price_effective || 0;
      items.push({
        id: `${shipment?.shipment_id || entry?.orderId || "return"}-${bag?.id || index}`,
        image: bag?.item?.image?.[0],
        name: bag?.item?.name || "Returned item",
        size: bag?.item?.size || bag?.size || "S",
        color:
          bag?.item?.color ||
          bag?.item?.color_name ||
          bag?.meta?.color ||
          "Colour name",
        quantity: bag?.quantity || 1,
        price,
        markedPrice: prices.price_marked || prices.value_of_good || price,
        symbol: prices.currency_symbol || entry?.symbol || "₹",
      });
    });
  });
  return items;
};

const getItemCount = (entry) =>
  getLineItems(entry).reduce((sum, item) => sum + Number(item.quantity || 1), 0);

const getItemCountLabel = (count) => {
  const safeCount = Number(count) || 0;
  return `${safeCount} ${safeCount === 1 ? "item" : "items"}`;
};

const getRefundFee = (entry, symbol = "₹") => {
  const shipment = getPrimaryReturnShipment(entry);
  const meta = shipment?.return_meta || {};
  const refund = shipment?.refund_details || {};
  const rawFee =
    entry?.refundFee ||
    entry?.refund_fee ||
    meta.return_fee ||
    meta.refund_fee ||
    refund.return_fee ||
    refund.refund_fee ||
    refund.fee;
  const amount = rawFee != null && rawFee !== "" ? Number(rawFee) : 4;
  return {
    amount: Number.isFinite(amount) ? amount : 4,
    symbol,
  };
};

const normalizeList = (returnsList) => {
  if (Array.isArray(returnsList)) return returnsList;
  if (Array.isArray(returnsList?.items)) return returnsList.items;
  if (Array.isArray(returnsList?.returns)) return returnsList.returns;
  return [];
};

const ReturnHistory = ({
  returnsList = [],
  isLoading = false,
  onReturnDetails = () => {},
}) => {
  const items = normalizeList(returnsList);
  const [openKey, setOpenKey] = useState("");

  if (isLoading) {
    return <div className={styles.stateText}>Loading returns...</div>;
  }

  if (!items.length) {
    return (
      <div className={styles.emptyState}>
        <h1 className={styles.emptyTitle}>Return history</h1>
        <p className={styles.emptyCopy}>
          Return requests will appear here once they are submitted.
        </p>
      </div>
    );
  }

  return (
    <section className={styles.returnHistory} aria-labelledby="return-history-title">
      <h1 id="return-history-title" className={styles.title}>
        Return history
      </h1>

      <div className={styles.list}>
        {items.map((entry, index) => {
          const orderId = entry?.orderId || entry?.order_id || entry?.returnId || "—";
          const requestDate =
            entry?.initiatedAt ||
            entry?.createdAt ||
            entry?.created_at ||
            entry?.returnRequestedAt ||
            entry?.return_requested_at ||
            entry?.lastUpdatedAt ||
            entry?.updatedAt ||
            getReturnShipments(entry)[0]?.return_meta?.created_at ||
            getReturnShipments(entry)[0]?.return_meta?.return_requested_at ||
            getReturnShipments(entry)[0]?.shipment_created_at ||
            entry?.order_created_time;
          const status = getStatus(entry);
          const tone = getStatusTone(status);
          const images = getImages(entry);
          const total = getTotal(entry);
          const returnId = getReturnId(entry);
          const rowKey = `${orderId}-${returnId}-${index}`;
          const isOpen = openKey === "" ? index === 0 : openKey === rowKey;
          const lineItems = getLineItems(entry);
          const productItems = lineItems.length
            ? lineItems
            : images.map((image, imageIndex) => ({
                id: image.id || `${rowKey}-${imageIndex}`,
                image: image.src || image.url,
                name: image.alt || "Returned item",
                size: "S",
                color: "Colour name",
                quantity: 1,
                price: total.amount,
                markedPrice: total.amount,
                symbol: total.symbol,
              }));
          const itemCount = getItemCount(entry) || productItems.length;
          const itemCountLabel = getItemCountLabel(itemCount);
          const fee = getRefundFee(entry, total.symbol);

          return (
            <article key={rowKey} className={styles.item}>
              {index > 0 && <div className={styles.divider} />}

              <div className={styles.metaRow}>
                <div className={styles.metaCell}>
                  <span className={styles.label}>Order ID</span>
                  <span className={styles.value}>{orderId}</span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.label}>Return request date</span>
                  <span className={styles.value}>{formatDate(requestDate) || "—"}</span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.label}>Status</span>
                  <span className={`${styles.value} ${styles.status}`}>
                    <span
                      className={`${styles.statusDot} ${styles[tone]}`}
                      aria-hidden="true"
                    />
                    {status}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.detailButton}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Collapse" : "Expand"} return details for order ${orderId}`}
                  onClick={() => {
                    setOpenKey((currentKey) => {
                      if (currentKey === "") {
                        return index === 0 ? "__closed__" : rowKey;
                      }
                      return currentKey === rowKey ? "__closed__" : rowKey;
                    });
                  }}
                >
                  {isOpen ? "-" : "+"}
                </button>
              </div>

              {isOpen ? (
                <div className={styles.expanded}>
                  <div className={styles.detailGrid}>
                    <div className={styles.metaCell}>
                      <span className={styles.label}>Return ID</span>
                      <span className={styles.value}>{returnId}</span>
                    </div>
                    <div className={styles.metaCell}>
                      <span className={styles.label}>Return method</span>
                      <span className={styles.value}>{getReturnMethod(entry)}</span>
                    </div>
                    <div className={styles.metaCell}>
                      <span className={styles.label}>Refund method</span>
                      <span className={styles.value}>{getRefundMethod(entry)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.itemsButton}
                    aria-label={`View ${itemCountLabel} for order ${orderId}`}
                    onClick={() => onReturnDetails(entry)}
                  >
                    <span>[ {itemCountLabel} ]</span>
                    <span className={styles.itemsChevron} aria-hidden="true" />
                  </button>

                  {!!productItems.length && (
                    <div className={styles.productGrid}>
                      {productItems.map((item) => (
                        <article key={item.id} className={styles.productCard}>
                          {!!item.image && (
                            <div className={styles.productImage}>
                              <img
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className={styles.productInfo}>
                            <p className={styles.productName}>{item.name}</p>
                            <div className={styles.productMetaLine}>
                              <span className={styles.productPrice}>
                                {item.symbol}
                                {item.price}
                              </span>
                              {Number(item.markedPrice) > Number(item.price) && (
                                <span className={styles.productMarked}>
                                  {item.symbol}
                                  {item.markedPrice}
                                </span>
                              )}
                            </div>
                            <p className={styles.productVariant}>
                              {item.size || "S"} |{" "}
                              {item.color || "Colour name"}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  <div className={styles.feeRow}>
                    <span className={styles.feeLabel}>Return fee</span>
                    <span className={styles.feeAmount}>
                      - {fee.symbol}
                      {fee.amount}
                    </span>
                  </div>

                  <div className={`${styles.totalRow} ${styles.expandedTotal}`}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.taxLabel}>inc. taxes</span>
                    <span className={styles.totalAmount}>
                      {total.symbol}
                      {total.amount}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {!!images.length && (
                    <div className={styles.imageRow}>
                      {images.map((image) => (
                        <div
                          key={image.id || image.src}
                          className={styles.thumb}
                        >
                          <img
                            src={image.src || image.url}
                            alt={image.alt || "Product"}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.taxLabel}>inc. taxes</span>
                    <span className={styles.totalAmount}>
                      {total.symbol}
                      {total.amount}
                    </span>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ReturnHistory;
