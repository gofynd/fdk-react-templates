import React, { useState } from "react";
import * as styles from "./order-tracking.less";
import { useNavigate, useGlobalTranslation } from "fdk-core/utils";

function OrderTracking({ instMob }) {
  const { t } = useGlobalTranslation("translation");
  const [showDetails, setShowDetails] = useState(false);
  const [image, setImage] = useState("/public/assets/pngs/inst_mob.png");
  const [orderId, setOrderId] = useState("");
  const [showError, setShowError] = useState(false);
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
        <div className={`${styles.trackOrder}`}>
          <div className={`${styles.orderTitle}`}>{t("resource.order.where_is_my_order")}?</div>
          <div
            className={`${styles.error} ${styles.regularxxs} ${showError ? styles.visible : ""} `}
          >
            {t("resource.order.invalid_order_id")}
          </div>
          <div className={`${styles.orderId}`}>
            <input
              type="text"
              className={`${styles.commonInput}`}
              value={orderId}
              placeholder={t("resource.order.enter_order_id")}
              maxLength="20"
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className={`${styles.trackBtn}`}>
            <button
              type="button"
              className={`${styles.commonBtn}`}
              onClick={trackOrder}
            >
              {t("resource.order.track_order_caps")}
            </button>
          </div>
          <div
            className={`${styles.details} ${styles.regularxxs}`}
            onClick={() => setShowDetails(!showDetails)}
          >
            {t("resource.order.where_is_order_id")}?
          </div>
          {showDetails && (
            <div>
              <img src={instMob} alt={image} className={`${styles.demoImg}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
