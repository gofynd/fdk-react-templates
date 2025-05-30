import React, { useState } from "react";
import * as styles from "./order-tracking.less";
import { useNavigate, useGlobalTranslation } from "fdk-core/utils";
import FyInput from "../../components/core/fy-input/fy-input";
import FyButton from "../../components/core/fy-button/fy-button";

function OrderTracking({ instMob }) {
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
  return (
    <div className="basePageContainer margin0auto">
      <div className={`${styles.trackOrderCntr}`}>
        <h2 className={`${styles.orderTitle}`}>{t("resource.order.where_is_order_id")}?</h2>
        <div className={`${styles.trackOrder}`}>
          <FyInput
            label={isFocussed || orderId ? t("resource.order.enter_order_id")  : ""}
            labelVariant="floating"
            value={orderId}
            placeholder={!isFocussed ? t("resource.order.enter_order_id") : ""}
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
            {t("resource.order.track_order_caps")}
          </FyButton>
          <FyButton
            className={styles.btn}
            variant="text"
            onClick={() => setShowDetails(!showDetails)}
          >
           {t("resource.order.where_is_order_id")}?
          </FyButton>
          {showDetails && (
            <div>
              <img
                src={instMob}
                alt={`${t("resource.order.where_is_order_id")}?`}
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
