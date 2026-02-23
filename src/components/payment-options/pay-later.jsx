import React from "react";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import { useViewport } from "../../helper/hooks";

function PayLater({
  // data
  selectedTabData,
  selectedPayLater,
  selectedPaymentPayload,

  // ui
  styles,
  t,
  SvgWrapper,
  StickyPayNow,

  // helpers
  getNormalisedList,
  getPayLaterBorder,
  translateDynamicLabel,
  getCurrencySymbol,
  getTotalValue,

  // actions
  removeDialogueError,
  selectMop,
  proceedToPay,
  acceptOrder,

  // payment state
  enableLinkPaymentOption,
  isPaymentLoading,
  loader,
  onPriceDetailsClick,
}) {
  const isTablet = useViewport(0, 768);

  return (
    <div>
      <div className={`${styles.payLaterHeader} ${styles["view-mobile-up"]}`}>
        {t("resource.checkout.select_pay_later_option")}
      </div>
      <div className={styles.modeOption}>
        {getNormalisedList(selectedTabData)?.map(
          (payLater, index) =>
            !payLater.isDisabled && (
              <div
                key={payLater.id}
                className={`${styles.modeItemWrapper} ${getPayLaterBorder(payLater)}`}
                onClick={() => {
                  removeDialogueError();
                  selectMop("PL", "PL", payLater.code);
                }}
              >
                <label id={payLater.id}>
                  <div className={styles.modeItem}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className={styles.modeItemLogo}>
                        <img
                          src={payLater?.logo_url?.small}
                          alt={payLater?.display_name}
                        />
                      </div>
                      <div className={styles.modeItemName}>
                        {translateDynamicLabel(payLater?.display_name ?? "", t)}
                      </div>
                    </div>
                    <div className={styles.onMobileView}>
                      {(!selectedPayLater ||
                        selectedPayLater.code !== payLater.code) && (
                        <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                      )}
                      {selectedPayLater &&
                        selectedPayLater.code === payLater.code && (
                          <SvgWrapper svgSrc={"radio-selected"}></SvgWrapper>
                        )}
                    </div>
                  </div>
                </label>

                <div className={styles.modePay}>
                  {isTablet ? (
                    <StickyPayNow
                      customClassName={styles.visibleOnTab}
                      value={priceFormatCurrencySymbol(
                        getCurrencySymbol,
                        getTotalValue()
                      )}
                      onPriceDetailsClick={onPriceDetailsClick}
                      disabled={!selectedPayLater.code}
                      enableLinkPaymentOption={enableLinkPaymentOption}
                      isPaymentLoading={isPaymentLoading}
                      loader={loader}
                      proceedToPay={() => {
                        proceedToPay("PL", selectedPaymentPayload);
                        acceptOrder();
                      }}
                    />
                  ) : (
                    selectedPayLater.code &&
                    selectedPayLater.code === payLater.code && (
                      <button
                        className={`${styles.commonBtn} ${styles.payBtn}`}
                        onClick={() => {
                          proceedToPay("PL", selectedPaymentPayload);
                          acceptOrder();
                        }}
                        disabled={isPaymentLoading}
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
            )
        )}
      </div>
    </div>
  );
}

export default PayLater;
