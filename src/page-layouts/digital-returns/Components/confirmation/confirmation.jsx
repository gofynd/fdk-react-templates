/**
 * Confirmation — final step showing return summary, next steps, and
 * QR/label download buttons.
 */
import React from "react";
import * as styles from "./confirmation.less";
import ReturnsActionButton from "../shared/returns-action-button/returns-action-button";
import { RETURN_DUMMY_IMAGE } from "../shared/dummy-image";

const formatOrderDate = (date) => {
  if (!date) return "—";
  if (typeof date === "string" && date.includes("/")) return date;
  try {
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd} / ${mm} / ${d.getFullYear()}`;
  } catch {
    return String(date);
  }
};

const Confirmation = ({
  returnData = null,
  onNext = () => {},
  onDownloadQR = () => {},
  onDownloadLabel = () => {},
  isLoading = false,
}) => {
  const items = returnData?.selectedItems || [];

  return (
    <div className={styles.confirmation}>
      <h1 className={styles.title}>Returns</h1>

      <div className={styles.grid}>
        {/* LEFT — confirmation + next steps + label downloads */}
        <section className={styles.left}>
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>RETURN CONFIRMED</h2>
            <p className={styles.sectionBody}>
              Please find a summary of your return and next steps. You will
              receive a confirmation email to{" "}
              <strong>{returnData?.email || "—"}</strong>.
            </p>
          </div>

          <div className={styles.steps}>
            <article className={styles.step}>
              <h3 className={styles.stepTitle}>Pack</h3>
              <p className={styles.stepBody}>
                Place your item(s) in the original packaging you received or
                in a secure parcel.
              </p>
            </article>
            <article className={styles.step}>
              <h3 className={styles.stepTitle}>Pickup</h3>
              <p className={styles.stepBody}>
                Our courier will collect your parcel from your delivery address
                on this order. Please keep it packed and ready.
              </p>
            </article>
            <article className={styles.step}>
              <h3 className={styles.stepTitle}>Expect refund</h3>
              <p className={styles.stepBody}>
                Once received, your refund will be processed within the next
                14 days to your original payment method.
              </p>
            </article>
          </div>

          <div className={styles.labels}>
            <h3 className={styles.labelsHeading}>RETURN LABELS</h3>

            <div className={styles.labelRow}>
              <div className={styles.labelText}>
                <h4 className={styles.labelTitle}>Return QR code</h4>
                <p className={styles.labelDesc}>Show the return QR code.</p>
              </div>
              <ReturnsActionButton
                type="button"
                onClick={onDownloadQR}
                disabled={isLoading}
                className={styles.labelAction}
              >
                Download QR Code
              </ReturnsActionButton>
            </div>

            <div className={styles.labelRow}>
              <div className={styles.labelText}>
                <h4 className={styles.labelTitle}>Return label</h4>
                <p className={styles.labelDesc}>
                  Or print and attach the label to your parcel.
                </p>
              </div>
              <ReturnsActionButton
                type="button"
                tone="outlined"
                onClick={onDownloadLabel}
                disabled={isLoading}
                className={styles.labelAction}
              >
                Download Label
              </ReturnsActionButton>
            </div>
          </div>
        </section>

        {/* RIGHT — return summary */}
        <aside className={styles.right}>
          <h2 className={styles.sectionHeading}>RETURNS SUMMARY</h2>

          <ul className={styles.summaryItems}>
            {items.length === 0 && (
              <li className={styles.empty}>No items selected.</li>
            )}
            {items.map((entry, idx) => {
              const item = entry.item || entry;
              return (
                <li key={idx} className={styles.summaryItem}>
                  <div className={styles.summaryThumb}>
                    <img
                      src={item.image || RETURN_DUMMY_IMAGE}
                      alt={item.name || "Product image"}
                      className={styles.summaryThumbImg}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = RETURN_DUMMY_IMAGE;
                      }}
                    />
                  </div>
                  <div className={styles.summaryDetails}>
                    <p className={styles.summaryName}>{item.name}</p>
                    <dl className={styles.summaryMeta}>
                      {item.size && (
                        <div>
                          <dt>Size:</dt>
                          <dd>{item.size}</dd>
                        </div>
                      )}
                      {item.color && (
                        <div>
                          <dt>Colour:</dt>
                          <dd>{item.color}</dd>
                        </div>
                      )}
                      {item.qty != null && (
                        <div>
                          <dt>Qty:</dt>
                          <dd>{item.qty}</dd>
                        </div>
                      )}
                      {item.sku && (
                        <div>
                          <dt>Product no:</dt>
                          <dd>{item.sku}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </li>
              );
            })}
          </ul>

          <dl className={styles.summaryOrder}>
            <div className={styles.orderRow}>
              <dt>Order ID</dt>
              <dd>{returnData?.orderId || "—"}</dd>
            </div>
            <div className={styles.orderRow}>
              <dt>Order date</dt>
              <dd>{formatOrderDate(returnData?.orderDate)}</dd>
            </div>
            <div className={styles.orderRow}>
              <dt>Delivery address</dt>
              <dd className={styles.preLine}>{returnData?.address || "—"}</dd>
            </div>
            <div className={styles.orderRow}>
              <dt>Email</dt>
              <dd>{returnData?.email || "—"}</dd>
            </div>
          </dl>

        </aside>
      </div>
    </div>
  );
};

export default Confirmation;
