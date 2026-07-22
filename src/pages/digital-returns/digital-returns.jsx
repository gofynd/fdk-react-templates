/**
 * DigitalReturns page composer.
 *
 * Architecture (mirrors PLP):
 *   react-starter (thin)
 *     useDigitalReturns hook → data + API + step state
 *     pages/digital-returns.jsx → calls hook, passes props down
 *
 *   firestone (this file + sub-components)
 *     pages/digital-returns/digital-returns.jsx → orchestrates which step UI to render
 *     page-layouts/digital-returns/Components/* → individual step UIs
 *
 * The current step (request | form | method | confirmation | tracking)
 * is driven by the hook in react-starter; this component just renders the
 * appropriate sub-component for that step.
 */
import React from "react";
import * as styles from "../../styles/digital-returns.less";
import RequestReturn from "../../page-layouts/digital-returns/Components/request-return/request-return";
import ReturnForm from "../../page-layouts/digital-returns/Components/return-form/return-form";
import MethodSelection from "../../page-layouts/digital-returns/Components/method-selection/method-selection";
import Confirmation from "../../page-layouts/digital-returns/Components/confirmation/confirmation";
import Tracking from "../../page-layouts/digital-returns/Components/tracking/tracking";
import ReturnHistory from "../../page-layouts/digital-returns/Components/return-history/return-history";

const DigitalReturns = ({
  currentStep = "request",
  isLoading = false,
  error = null,
  // request step
  onRequestSubmit = () => {},
  // form step
  orderData = null,
  returnReasons = [],
  onFormSubmit = () => {},
  // method step
  onMethodSubmit = () => {},
  returnFee = 0,
  returnFeeCurrencySymbol = "₹",
  // confirmation step
  returnData = null,
  onConfirmationNext = () => {},
  onDownloadQR = () => {},
  onDownloadLabel = () => {},
  // tracking step
  trackingData = null,
  onBackToOrders = () => {},
  // history step
  returnsList = [],
  onReturnDetails = () => {},
}) => {
  const renderStep = () => {
    switch (currentStep) {
      case "history":
        return (
          <ReturnHistory
            returnsList={returnsList}
            onReturnDetails={onReturnDetails}
            isLoading={isLoading}
          />
        );
      case "request":
        return (
          <RequestReturn onSubmit={onRequestSubmit} isLoading={isLoading} />
        );
      case "form":
        return (
          <ReturnForm
            orderData={orderData}
            returnReasons={returnReasons}
            onSubmit={onFormSubmit}
            isLoading={isLoading}
          />
        );
      case "method":
        return (
          <MethodSelection
            orderData={orderData}
            onSubmit={onMethodSubmit}
            isLoading={isLoading}
            returnFee={returnFee}
            returnFeeCurrencySymbol={returnFeeCurrencySymbol}
          />
        );
      case "confirmation":
        return (
          <Confirmation
            returnData={returnData}
            onNext={onConfirmationNext}
            onDownloadQR={onDownloadQR}
            onDownloadLabel={onDownloadLabel}
            isLoading={isLoading}
          />
        );
      case "tracking":
        return (
          <Tracking
            trackingData={trackingData || returnData}
            onBack={onBackToOrders}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.digitalReturnsWrapper}>
      <div className={styles.digitalReturnsContainer}>
        {error && (
          <div className={styles.errorBanner} role="alert">
            <span>{error}</span>
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default DigitalReturns;
