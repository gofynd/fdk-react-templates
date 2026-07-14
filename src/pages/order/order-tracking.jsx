import React, { useState } from "react";
import * as styles from "./order-tracking.less";
import { useNavigate, useGlobalTranslation } from "fdk-core/utils";
import FyInput from "../../components/core/fy-input/fy-input";
import FyButton from "../../components/core/fy-button/fy-button";

function OrderTracking({
  instMob,
  title,
  inputPlaceholder,
  trackButtonText,
  orderHelpText,
  buttonText,
  helpText,
  typographyCss,
}) {
  const { t } = useGlobalTranslation("translation");
  const [showDetails, setShowDetails] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [showError, setShowError] = useState(false);
  const [isFocussed, setIsFocussed] = useState(false);
  const navigate = useNavigate();

  const trackOrder = () => {
    if (orderId.length <= 10) {
      setShowError(true);
      return;
    }
    navigate(`/order-tracking/${orderId}`);
  };
  const orderTitle = title?.value || title || "Track Your Shipment";
  const orderInputPlaceholder =
    inputPlaceholder?.value ||
    inputPlaceholder ||
    t("resource.order.enter_your_order_number");

  const trackButtonLabel =
    trackButtonText?.value ||
    trackButtonText ||
    buttonText?.value ||
    buttonText ||
    "Check Status";
  const orderHelpLabel =
    orderHelpText?.value ||
    orderHelpText ||
    helpText?.value ||
    helpText ||
    "Need help finding your order number?";

  return (
    <div
      className={`basePageContainer margin0auto order-tracking-section ${
        typographyCss ? styles.customTypography : ""
      }`}
    >
      {typographyCss && <style>{typographyCss}</style>}
      <div className={`${styles.trackOrderCntr}`}>
        <h2 className={`${styles.orderTitle}`}>{orderTitle}</h2>
        <div className={`${styles.trackOrder}`}>
          <FyInput
            label={
              isFocussed || orderId ? t("resource.order.enter_order_id") : ""
            }
            labelVariant="floating"
            value={orderId}
            placeholder={!isFocussed ? orderInputPlaceholder : ""}
            maxLength="20"
            error={showError}
            errorMessage={t("resource.order.invalid_order_id")}
            onChange={(e) => setOrderId(e.target.value)}
            onFocus={() => setIsFocussed(true)}
            onBlur={() => setIsFocussed(false)}
            className={styles.orderIdInput}
          />
          <FyButton
            className={styles.btn}
            variant="contained"
            size="medium"
            onClick={trackOrder}
          >
            {trackButtonLabel}
          </FyButton>
          <FyButton
            className={styles.btn}
            variant="text"
            onClick={() => setShowDetails(!showDetails)}
          >
            {orderHelpLabel}
          </FyButton>
          {showDetails && (
            <div>
              <img
                src={instMob}
                alt={orderHelpLabel}
                className={`${styles.demoImg}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
