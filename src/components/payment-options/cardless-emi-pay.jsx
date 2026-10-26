import React from "react";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import { useViewport } from "../../helper/hooks";

function CardLessEmi({
  // data
  selectedTabData,
  selectedCardless,
  selectedPaymentPayload,

  // ui
  styles,
  t,
  SvgWrapper,
  StickyPayNow,
  // helpers
  getCardlessBorder,
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
      <div className={`${styles.cardlessHeader} ${styles["view-mobile-up"]}`}>
        {t("resource.checkout.select_emi_option")}
      </div>
      <div className={styles.modeOption}>
        {selectedTabData.list?.map((emi) => (
          <div
            key={emi?.display_name}
            className={`${styles.modeItemWrapper} ${getCardlessBorder(emi)}`}
            onClick={() => {
              removeDialogueError();
              selectMop("CARDLESS_EMI", "CARDLESS_EMI", emi.code);
            }}
          >
            <label>
              <div className={styles.modeItem}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={styles.modeItemLogo}>
                    <img src={emi?.logo_url?.small} alt={emi?.display_name} />
                  </div>
                  <div className={styles.modeItemName}>
                    {translateDynamicLabel(emi?.display_name ?? "", t)}
                  </div>
                </div>
                <div className={styles.onMobileView}>
                  {!selectedCardless || selectedCardless.code !== emi.code ? (
                    <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                  ) : (
                    <SvgWrapper svgSrc={"radio-selected"}></SvgWrapper>
                  )}
                </div>
              </div>
            </label>
            {selectedCardless.code === emi.code && selectedCardless.code && (
              <div className={styles.modePay}>
                {isTablet ? (
                  <StickyPayNow
                    customClassName={styles.visibleOnTab}
                    value={priceFormatCurrencySymbol(
                      getCurrencySymbol,
                      getTotalValue()
                    )}
                    onPriceDetailsClick={onPriceDetailsClick}
                    enableLinkPaymentOption={enableLinkPaymentOption}
                    isPaymentLoading={isPaymentLoading}
                    loader={loader}
                    proceedToPay={() => {
                      proceedToPay("CARDLESS_EMI", selectedPaymentPayload);
                      acceptOrder();
                    }}
                  />
                ) : (
                  <button
                    className={`${styles.commonBtn} ${styles.payBtn}`}
                    onClick={() => {
                      proceedToPay("CARDLESS_EMI", selectedPaymentPayload);
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
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardLessEmi;
