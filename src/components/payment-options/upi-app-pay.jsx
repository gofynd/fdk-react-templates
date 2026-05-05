import React from "react";
import Modal from "../core/modal/modal";
import { formatTime } from "../../helper/utils";
import { useViewport } from "../../helper/hooks";
import { priceFormatCurrencySymbol } from "../../helper/utils";

function UpiAppPayment({
  isChromeOrSafari,
  upiApps,
  selectedUpiIntentApp,
  setSelectedUpiIntentApp,
  selectedUpiRef,
  setvpa,
  setUPIError,
  cancelQrPayment,
  getSvgNameForApp,
  upiAppData,
  selectMop,
  removeDialogueError,
  showUpiRedirectionModal,
  setShowUpiRedirectionModal,
  cancelUpiAppPayment,
  t,
  SvgWrapper,
  styles,
  showUPIModal,
  cancelUPIPayment,
  isPaymentLoading,
  isUPIError,
  StickyPayNow,
  acceptOrder,
  getCurrencySymbol,
  getTotalValue,
  onPriceDetailsClick,
  enableLinkPaymentOption,
  loader,
  disbaleCheckout,
  vpa,
  timeRemaining,
}) {
  const isTablet = useViewport(0, 768);

  const upiDisplayWrapperStyle = {
    padding: "24px",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const upiHeadingStyle = {
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: "140%",
    textAlign: "center",
    color: "var(--textHeading)",
  };

  const upiVpaStyle = {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "140%",
    textAlign: "center",
    marginTop: "16px",
    color: "var(--textBody)",
  };

  const upiLabelWrapperStyle = {
    margin: "16px 0px",
  };

  const timeDisplayStyle = {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "140%",
    textAlign: "center",
    color: "var(--textBody)",
    marginBottom: "16px",
  };

  const timeDisplaySpanStyle = {
    borderRadius: "40px",
    border: "0.5px solid var(--successText)",
    backgroundColor: "var(--successBackground)",
    padding: "2px 7px",
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: "140%",
    color: "var(--successText)",
  };

  const cancelBtnStyle = {
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: "140%",
    textTransform: "uppercase",
    textAlign: "center",
    color: "var(--buttonLink)",
  };

  return (
    <>
      <div className={styles.upiMop}>
        {" "}
        {isTablet && isChromeOrSafari && (
          <div>
            {upiApps?.length > 0 &&
              upiApps
                .filter((app) =>
                  ["gpay", "google_pay", "phonepe", "paytm"].includes(app)
                )
                .map((app) => {
                  const svgName = getSvgNameForApp(app);
                  const displayKey = svgName;
                  return (
                    <label
                      key={app}
                      onClick={() => {
                        setSelectedUpiIntentApp(app);
                        selectedUpiRef.current = null;
                        setvpa("");
                        setUPIError(false);
                        cancelQrPayment();
                      }}
                      className={`${styles.upiApp} ${!upiApps?.includes("any") ? styles.notBorderBottom : ""} ${selectedUpiIntentApp === app ? styles.selectedUpiApp : ""}`}
                    >
                      <div className={styles.logo}>
                        <SvgWrapper svgSrc={svgName} />
                      </div>
                      <p className={styles.displayName}>
                        {upiAppData[displayKey]?.displayName}
                      </p>
                      {(!selectedUpiIntentApp ||
                        selectedUpiIntentApp !== app) && (
                        <SvgWrapper
                          svgSrc={"radio"}
                          className={styles.onMobileView}
                        />
                      )}
                      {selectedUpiIntentApp && selectedUpiIntentApp === app && (
                        <SvgWrapper
                          svgSrc={"radio-selected"}
                          className={styles.onMobileView}
                        />
                      )}
                    </label>
                  );
                })}
            {upiApps?.length > 0 && upiApps?.includes("any") && (
              <label
                key="any"
                onClick={() => {
                  setSelectedUpiIntentApp("any");
                  selectedUpiRef.current = "any";
                  selectMop("UPI", "UPI", "UPI");
                  removeDialogueError();
                  setShowUpiRedirectionModal(true);
                }}
                className={styles.moreApps}
              >
                <div className={styles.logo}>
                  <SvgWrapper svgSrc="more-upi-apps" />
                </div>
                <p className={styles.displayName}>
                  {upiAppData.any?.displayName}
                </p>
                <div className={styles.rightArrow}>
                  <SvgWrapper svgSrc="arrow-right" />
                </div>
              </label>
            )}
          </div>
        )}
        <div style={{ position: "relative" }}>
          <div className={styles.upiPay}>
            {isTablet ? (
              <StickyPayNow
                customClassName={styles.visibleOnTab}
                disabled={!selectedUpiIntentApp || isUPIError}
                value={priceFormatCurrencySymbol(
                  getCurrencySymbol,
                  getTotalValue()
                )}
                onPriceDetailsClick={onPriceDetailsClick}
                enableLinkPaymentOption={enableLinkPaymentOption}
                isPaymentLoading={isPaymentLoading}
                loader={loader}
                proceedToPay={() => {
                  if (disbaleCheckout?.message) {
                    acceptOrder();
                  }
                  selectMop("UPI", "UPI", "UPI");
                }}
              />
            ) : (
              (vpa || selectedUpiIntentApp) && (
                <button
                  className={`${styles.commonBtn} ${styles.payBtn}`}
                  onClick={() => {
                    if (disbaleCheckout?.message) {
                      acceptOrder();
                    } else {
                      removeDialogueError();
                    }
                    selectMop("UPI", "UPI", "UPI");
                    cancelQrPayment();
                  }}
                  disabled={!selectedUpiIntentApp || isPaymentLoading}
                >
                  {!isPaymentLoading ? (
                    <>
                      {t("resource.common.pay_caps")}{" "}
                      {priceFormatCurrencySymbol(
                        getCurrencySymbol,
                        getTotalValue()
                      )}
                    </>
                  ) : (
                    loader
                  )}
                </button>
              )
            )}
          </div>
        </div>
      </div>
      {showUPIModal && (
        // <UktModal
        //   isOpen={showUPIModal}
        //   modalClass={styles.upiPoll}
        //   isCancelable={true}
        //   showHeader={false}
        //   title="" // hideHeader is simulated by leaving title empty and customizing CSS if needed
        // >

        <Modal
          isOpen={showUPIModal}
          headerClassName={styles.modalHeader}
          bodyClassName={styles.modalBody}
          isCancellable={false}
          title=""
          hideHeader={true}
        >
          <div style={upiDisplayWrapperStyle}>
            <div style={upiHeadingStyle}>
              {t("resource.checkout.complete_your_payment")}
            </div>
            <div style={upiVpaStyle}>
              {t("resource.checkout.sent_to")} {vpa}
            </div>
            <div style={upiLabelWrapperStyle}>
              <SvgWrapper svgSrc="upi-payment-popup" />
            </div>
            <div style={timeDisplayStyle}>
              {t("resource.checkout.valid_for")}{" "}
              <span style={timeDisplaySpanStyle}>
                {formatTime(timeRemaining)}
              </span>{" "}
              {t("resource.common.minutes")}
            </div>
            <div style={cancelBtnStyle} onClick={cancelUPIPayment}>
              {t("resource.checkout.cancel_payment_caps")}
            </div>
          </div>
        </Modal>
      )}
      {showUpiRedirectionModal && (
        <Modal isOpen={showUpiRedirectionModal} hideHeader={true}>
          <div className={styles.upiRedirectionModal}>
            <div className={styles.loader}></div>
            <p className={styles.title}>
              {t("resource.checkout.finalising_payment")}
            </p>
            <p className={styles.message}>
              {t("resource.checkout.redirecting_upi")}
            </p>
            <div
              style={cancelBtnStyle}
              onClick={() => {
                setShowUpiRedirectionModal(false);
                cancelUpiAppPayment();
              }}
            >
              {t("resource.checkout.cancel_payment_caps")}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default UpiAppPayment;
