import React from "react";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import { useViewport } from "../../helper/hooks";

function OtherPay({
  otherPaymentOptions,
  selectedOtherPayment,
  selectedPaymentPayload,
  styles,
  t,
  SvgWrapper,
  StickyPayNow,
  getOPBorder,
  getCurrencySymbol,
  getTotalValue,
  selectMop,
  removeDialogueError,
  proceedToPay,
  acceptOrder,
  enableLinkPaymentOption,
  isPaymentLoading,
  loader,
  onPriceDetailsClick,
}) {
  const isTablet = useViewport(0, 768);

  const OtherItem = ({ other }) => {
    return (
      <div
        className={`${styles.modeItemWrapper} ${getOPBorder(other?.list?.[0])}`}
        onClick={() => {
          removeDialogueError();
          if (other?.list?.[0]?.code) {
            selectMop("Other", other?.name, other?.list?.[0]?.code);
          }
        }}
      >
        <label>
          <div className={styles.modeItem}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className={styles.modeItemLogo}>
                <img
                  src={other?.list?.[0]?.logo_url?.small}
                  alt={other?.list?.[0]?.display_name}
                />
              </div>
              <div className={styles.modeItemName}>
                {other?.list?.[0]?.display_name ?? ""}
              </div>
            </div>
            <div className={`${styles.otherLeft} ${styles.onMobileView}`}>
              {(!selectedOtherPayment ||
                selectedOtherPayment?.code !== other?.list?.[0]?.code) && (
                <SvgWrapper svgSrc={"radio"}></SvgWrapper>
              )}
              {selectedOtherPayment &&
                selectedOtherPayment?.code === other?.list?.[0]?.code && (
                  <SvgWrapper svgSrc="radio-selected" />
                )}
            </div>
            {/* <div className={styles.otherMiddle}>
                        <img
                          src={op?.list[0].logo_url?.small}
                          alt={op.display_name}
                        />
                      </div>
                      <div className={styles.otherRight}>{op.display_name}</div> */}
          </div>
        </label>
        <div className={styles.otherPay}>
          {isTablet ? (
            <StickyPayNow
              customClassName={styles.visibleOnTab}
              value={priceFormatCurrencySymbol(
                getCurrencySymbol,
                getTotalValue()
              )}
              onPriceDetailsClick={onPriceDetailsClick}
              disabled={!selectedOtherPayment?.code}
              enableLinkPaymentOption={enableLinkPaymentOption}
              isPaymentLoading={isPaymentLoading}
              loader={loader}
              proceedToPay={() => {
                proceedToPay("Other", selectedPaymentPayload);
                acceptOrder();
              }}
            />
          ) : (
            selectedOtherPayment?.code &&
            selectedOtherPayment.code === other?.list?.[0]?.code && (
              <button
                className={`${styles.commonBtn} ${styles.payBtn}`}
                onClick={() => {
                  proceedToPay("Other", selectedPaymentPayload);
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
    );
  };

  return (
    <div>
      <div className={`${styles.otherHeader} ${styles["view-mobile-up"]}`}>
        {t("resource.common.select_payment_option")}
      </div>
      <div className={styles.modeOption}>
        {otherPaymentOptions?.length &&
          otherPaymentOptions.map((op, index) => (
            <React.Fragment key={index}>
              <OtherItem other={op} />
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}

export default OtherPay;
