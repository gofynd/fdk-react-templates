/**
 * ReturnForm — the main Figma "Returns" screen.
 *
 * Layout (Figma /Desktop/DigitalReturn/Default at 1440px):
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │                          Returns                              │
 *   ├──────────────────────────────┬───────────────────────────────┤
 *   │  PLEASE SELECT ITEMS         │   ORDER DETAILS                │
 *   │  AND REASON                  │                                │
 *   │                              │   Order ID                     │
 *   │  For seamless returns…       │   1147104                      │
 *   │                              │                                │
 *   │  ☐ [img] item details        │   Order date                   │
 *   │  ☐ [img] item details        │   13 / 11 / 2025               │
 *   │       (per-item reason       │                                │
 *   │       dropdown when checked) │   [    CONFIRM    ]            │
 *   └──────────────────────────────┴───────────────────────────────┘
 *
 * On mobile/tablet the two columns stack vertically.
 *
 * State variations from Figma (handled internally + via FyDropdown):
 *   - Default        : nothing checked
 *   - ItemSelected   : checkbox + per-item reason dropdown appears
 *   - DropdownOpen   : reason dropdown expanded
 *   - InputFilledIn  : reason chosen
 *   - InputFilledIn/Error : Confirm clicked with no items → inline error
 */
import React, { useMemo, useState } from "react";
import * as styles from "./return-form.less";
import FyDropdown from "../../../../components/core/fy-dropdown/fy-dropdown";
import FyInput from "../../../../components/core/fy-input/fy-input";
import ReturnsActionButton from "../shared/returns-action-button/returns-action-button";
import { RETURN_DUMMY_IMAGE } from "../shared/dummy-image";

const formatOrderDate = (date) => {
  if (!date) return "";
  // already pre-formatted strings pass through
  if (typeof date === "string" && date.includes("/")) return date;
  try {
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd} / ${mm} / ${yyyy}`;
  } catch {
    return String(date);
  }
};

const getOrderItemQuantity = (item) => Math.max(1, Number(item?.qty) || 1);

const ReturnForm = ({
  orderData = null,
  returnReasons = [],
  onSubmit = () => {},
  isLoading = false,
}) => {
  const items = orderData?.items || [];
  // Normalise the reasons array — the consumer's config (digital-returns-config.js)
  // uses `{ id, label }`, while alternative shapes use `{ value, label }` or
  // `{ key, display }`. Map all of them to FyDropdown's `{ key, display }` shape.
  const reasonOptions = useMemo(
    () =>
      (returnReasons || []).map((r) => ({
        key: r.id || r.value || r.key,
        display: r.label || r.display,
      })),
    [returnReasons]
  );

  // Map of itemId → { checked: bool, reason: string, quantity: number, feedback: string }
  const [selections, setSelections] = useState({});
  const [submitError, setSubmitError] = useState("");

  // CONFIRM is enabled only when at least one item is checked AND every
  // checked item has a reason chosen (Figma: button is in light/disabled
  // state until the form is valid).
  const checkedSelections = Object.values(selections).filter(
    (v) => v?.checked
  );
  const isFormValid =
    checkedSelections.length >= 1 &&
    checkedSelections.every(
      (v) =>
        !!v?.reason &&
        Number(v?.quantity) > 0 &&
        !!String(v?.feedback || "").trim()
    );

  const getMaxQuantity = (itemId) => {
    const item = items.find((i) => String(i.id) === String(itemId));
    return getOrderItemQuantity(item);
  };

  const clampQuantity = (raw, max) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return 1;
    return Math.min(Math.max(1, Math.floor(n)), Math.max(1, max));
  };

  const toggleItem = (item) => {
    const itemId = item?.id;
    const max = getOrderItemQuantity(item);

    setSelections((prev) => {
      const wasChecked = prev[itemId]?.checked;
      if (wasChecked) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      const next = { ...prev };
      const existing = next[itemId] || {};
      next[itemId] = {
        checked: true,
        reason: existing.reason || "",
        // Default to full quantity so single-unit lines behave as before;
        // multi-unit lines surface the stepper for the user to lower.
        quantity: clampQuantity(existing.quantity ?? max, max),
        feedback: existing.feedback || "",
      };
      return {
        ...next,
      };
    });
    if (submitError) setSubmitError("");
  };

  const setReason = (itemId, reasonKey) => {
    setSelections((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {
          checked: true,
          quantity: getMaxQuantity(itemId),
          feedback: "",
        }),
        reason: reasonKey,
      },
    }));
  };

  const setFeedback = (itemId, feedback) => {
    setSelections((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {
          checked: true,
          reason: "",
          quantity: getMaxQuantity(itemId),
        }),
        feedback,
      },
    }));
  };

  const setQuantity = (itemId, nextQty) => {
    setSelections((prev) => {
      const max = getMaxQuantity(itemId);
      const existing = prev[itemId] || {
        checked: true,
        reason: "",
        feedback: "",
      };
      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity: clampQuantity(nextQty, max),
        },
      };
    });
  };

  const handleConfirm = () => {
    const selected = Object.entries(selections)
      .filter(([, v]) => v?.checked)
      .map(([itemId, v]) => {
        const item = items.find((i) => String(i.id) === String(itemId));
        return {
          itemId,
          quantity: clampQuantity(v.quantity, getOrderItemQuantity(item)),
          reason: v.reason,
          feedback: v.feedback || "",
          item,
        };
      });

    if (selected.length === 0) {
      setSubmitError("Please select at least one item to return.");
      return;
    }
    const missingReason = selected.find((s) => !s.reason);
    if (missingReason) {
      setSubmitError("Please choose a reason for each selected item.");
      return;
    }
    const missingFeedback = selected.find(
      (s) => !String(s.feedback || "").trim()
    );
    if (missingFeedback) {
      setSubmitError("Please provide feedback for the selected item.");
      return;
    }

    onSubmit({ selectedItems: selected });
  };

  return (
    <div className={styles.returnForm}>
      <h1 className={styles.title}>Returns</h1>

      <div className={styles.grid}>
        {/* LEFT — items + reasons */}
        <section className={styles.itemsCol} aria-labelledby="items-heading">
          <h2 id="items-heading" className={styles.colHeading}>
            PLEASE SELECT ITEMS AND REASON
          </h2>
          <p className={styles.colSubheading}>
            For seamless returns, kindly combine all selected items in one
            parcel. If multiple parcels are required, please repeat the return
            process for each parcel.
          </p>

          {items.length === 0 && (
            <p className={styles.emptyItems}>
              No items available to return for this order.
            </p>
          )}

          {items.length > 0 && orderData?.hasReturnableItems === false && (
            <p className={styles.noReturnableItemsNote} role="status">
              You&rsquo;ve already returned every item from this order. The
              items below are shown for reference.
            </p>
          )}

          <ul className={styles.itemList}>
            {items.map((item) => {
              const isReturned = item.status === "previously_returned";
              const sel = selections[item.id];
              const isChecked = !!sel?.checked;
              const maxQuantity = getOrderItemQuantity(item);
              const currentQuantity = clampQuantity(
                sel?.quantity ?? maxQuantity,
                maxQuantity
              );
              const canDecrement =
                !isReturned && isChecked && currentQuantity > 1;
              const canIncrement =
                !isReturned && isChecked && currentQuantity < maxQuantity;
              const rowClass = isReturned
                ? `${styles.itemRow} ${styles.itemRowReturned}`
                : styles.itemRow;
              const statusBadgeLabel =
                item.statusLabel || "Already returned";
              return (
                <li
                  key={item.id}
                  className={rowClass}
                  aria-disabled={isReturned || undefined}
                >
                  <label className={styles.itemMain}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={isReturned ? false : isChecked}
                      onChange={
                        isReturned ? undefined : () => toggleItem(item)
                      }
                      disabled={isLoading || isReturned}
                      aria-label={
                        isReturned
                          ? `${item.name} — already returned`
                          : `Select ${item.name} for return`
                      }
                    />
                    <div className={styles.itemPanel}>
                      <div className={styles.itemThumbWrap}>
                        <img
                          src={item.image || RETURN_DUMMY_IMAGE}
                          alt={item.name || "Product image"}
                          className={styles.itemThumb}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = RETURN_DUMMY_IMAGE;
                          }}
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <p className={styles.itemName}>{item.name}</p>
                        {isReturned && (
                          <span
                            className={styles.itemStatusBadge}
                            aria-label={`Status: ${statusBadgeLabel}`}
                          >
                            {statusBadgeLabel}
                          </span>
                        )}
                        <dl className={styles.itemMetaList}>
                          {item.size && (
                            <div className={styles.itemMetaRow}>
                              <dt>Size:</dt>
                              <dd>{item.size}</dd>
                            </div>
                          )}
                          {item.color && (
                            <div className={styles.itemMetaRow}>
                              <dt>Colour:</dt>
                              <dd>{item.color}</dd>
                            </div>
                          )}
                          {item.qty != null && (
                            <div className={styles.itemMetaRow}>
                              <dt>Qty:</dt>
                              <dd>{item.qty}</dd>
                            </div>
                          )}
                          {item.sku && (
                            <div className={styles.itemMetaRow}>
                              <dt>Product no:</dt>
                              <dd>{item.sku}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  </label>

                  {!isReturned && isChecked && (
                    <div className={styles.reasonWrap}>
                      <FyDropdown
                        placeholder="REASON FOR RETURN*"
                        options={reasonOptions}
                        value={
                          sel.reason
                            ? reasonOptions.find((o) => o.key === sel.reason)
                            : undefined
                        }
                        // FyDropdown's onChange receives the value at
                        // option[dataKey] (default "key") — NOT the option
                        // object — so this arg is already the string key,
                        // e.g. "size_color_mismatch".
                        onChange={(value) => setReason(item.id, value || "")}
                        required
                        disableSearch
                        disabled={isLoading}
                        containerClassName={styles.formField}
                      />

                      {maxQuantity > 1 && (
                        <div
                          className={`${styles.formField} ${styles.quantityStepperField}`}
                          role="group"
                          aria-label={`Return quantity, max ${maxQuantity}`}
                        >
                          <span className={styles.quantityStepperLabel}>
                            QUANTITY
                          </span>
                          <div className={styles.quantityStepperControls}>
                            <button
                              type="button"
                              className={styles.quantityStepperButton}
                              onClick={() =>
                                setQuantity(item.id, currentQuantity - 1)
                              }
                              disabled={!canDecrement || isLoading}
                              aria-label="Decrease return quantity"
                            >
                              −
                            </button>
                            <span
                              className={styles.quantityStepperValue}
                              aria-live="polite"
                            >
                              {currentQuantity}
                            </span>
                            <button
                              type="button"
                              className={styles.quantityStepperButton}
                              onClick={() =>
                                setQuantity(item.id, currentQuantity + 1)
                              }
                              disabled={!canIncrement || isLoading}
                              aria-label="Increase return quantity"
                            >
                              +
                            </button>
                            <span className={styles.quantityStepperMax}>
                              of {maxQuantity}
                            </span>
                          </div>
                        </div>
                      )}

                      <FyInput
                        multiline
                        inputVariant="outlined"
                        placeholder="Please leave us feedback (optional)"
                        value={sel?.feedback || ""}
                        onChange={(e) => setFeedback(item.id, e.target.value)}
                        disabled={isLoading}
                        containerClassName={`${styles.formField} ${styles.feedbackField}`}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* RIGHT — order details + confirm */}
        <aside className={styles.orderCol} aria-labelledby="order-heading">
          <h2 id="order-heading" className={styles.colHeading}>
            ORDER DETAILS
          </h2>

          <dl className={styles.orderDetails}>
            <div className={styles.orderRow}>
              <dt>Order ID</dt>
              <dd>{orderData?.orderId || "—"}</dd>
            </div>
            <div className={styles.orderRow}>
              <dt>Order date</dt>
              <dd>{formatOrderDate(orderData?.orderDate)}</dd>
            </div>
          </dl>

          {submitError && (
            <p className={styles.inlineError} role="alert">
              {submitError}
            </p>
          )}

          <ReturnsActionButton
            type="button"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading || !isFormValid}
          >
            CONFIRM
          </ReturnsActionButton>
        </aside>
      </div>
    </div>
  );
};

export default ReturnForm;
