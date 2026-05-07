/**
 * Tracking — shows the live status of an initiated return.
 * Receives a tracking object with at minimum: returnId, status, timeline.
 */
import React from "react";
import * as styles from "./tracking.less";
import ReturnsActionButton from "../shared/returns-action-button/returns-action-button";

const DEFAULT_STAGES = [
  { key: "initiated", label: "Return initiated" },
  { key: "picked_up", label: "Picked up / Dropped off" },
  { key: "in_transit", label: "In transit" },
  { key: "received", label: "Received & inspected" },
  { key: "refunded", label: "Refund issued" },
];

const Tracking = ({
  trackingData = null,
  onBack = () => {},
  isLoading = false,
}) => {
  const status = trackingData?.status || "initiated";
  const stages = trackingData?.timeline?.length
    ? trackingData.timeline
    : DEFAULT_STAGES;
  const currentIdx = Math.max(
    0,
    stages.findIndex(
      (s) => (s.key || s.status || "").toLowerCase() === String(status).toLowerCase()
    )
  );

  return (
    <div className={styles.tracking}>
      <h1 className={styles.title}>Returns</h1>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Return ID</span>
          <span className={styles.summaryValue}>
            {trackingData?.returnId || "—"}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Current status</span>
          <span className={styles.summaryStatus}>
            {(stages[currentIdx]?.label) ||
              status ||
              "—"}
          </span>
        </div>
        {trackingData?.expectedDays && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Expected processing</span>
            <span className={styles.summaryValue}>
              {trackingData.expectedDays}
            </span>
          </div>
        )}
      </div>

      <ol className={styles.timeline} aria-label="Return progress">
        {stages.map((stage, idx) => {
          const isDone = idx <= currentIdx;
          const isActive = idx === currentIdx;
          return (
            <li
              key={stage.key || idx}
              className={`${styles.timelineStep} ${
                isDone ? styles.done : ""
              } ${isActive ? styles.active : ""}`}
            >
              <span className={styles.timelineDot} aria-hidden="true" />
              <span className={styles.timelineLabel}>
                {stage.label || stage.status || stage.key}
              </span>
            </li>
          );
        })}
      </ol>

      <ReturnsActionButton
        type="button"
        tone="outlined"
        onClick={onBack}
        disabled={isLoading}
      >
        BACK TO ORDERS
      </ReturnsActionButton>
    </div>
  );
};

export default Tracking;
