import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "./order-tracking.less";
import FyInput from "../../components/core/fy-input/fy-input";
import FyButton from "../../components/core/fy-button/fy-button";

function OrderTracking({ instMob }) {
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
        <h2 className={`${styles.orderTitle}`}>Where is my order?</h2>
        <div className={`${styles.trackOrder}`}>
          <FyInput
            label={isFocussed || orderId ? "Enter Order ID" : ""}
            labelVariant="floating"
            value={orderId}
            placeholder={!isFocussed ? "Enter Order ID" : ""}
            maxLength="20"
            error={showError}
            errorMessage="Invalid Order Id"
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
            TRACK ORDER
          </FyButton>
          <FyButton
            className={styles.btn}
            variant="text"
            onClick={() => setShowDetails(!showDetails)}
          >
            WHERE IS ORDER ID?
          </FyButton>
          {showDetails && (
            <div>
              <img
                src={instMob}
                alt="where is order id ?"
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
