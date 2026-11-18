import React from "react";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import { useViewport } from "../../helper/hooks";
import Modal from "../core/modal/modal";

function CodPayment({
  styles,
  t,
  codCharges,
  getCurrencySymbol,
  proceedToPay,
  selectedPaymentPayload,
  isPaymentLoading,
  loader,
  isCodModalOpen,
  setIsCodModalOpen,
  setTab,
  setSelectedTab,
  SvgWrapper,
  getTotalValue,
  Spinner,
  isCouponValid,
  mopSelectionLoading,
  isPaymentDisabled = false,
  splitCodAction,
}) {
  const isTablet = useViewport(0, 768);
  const shouldShowSplitCodAction = splitCodAction?.visible === true;
  const renderSplitCodAction = () => (
    <div className={styles.splitPaymentCodAction}>
      {splitCodAction?.title && (
        <p className={styles.splitPaymentCodTitle}>{splitCodAction.title}</p>
      )}
      <button
        className={styles.splitPaymentCodButton}
        disabled={
          splitCodAction?.disabled ||
          mopSelectionLoading ||
          isPaymentLoading ||
          isPaymentDisabled
        }
        onClick={splitCodAction?.onContinue}
        type="button"
      >
        {splitCodAction?.buttonLabel || "Continue To Pay"}
      </button>
    </div>
  );

  return (
    <div>
      {!isTablet ? (
        <div>
          <div className={`${styles.codHeader} ${styles["view-mobile-up"]}`}>
            {t("resource.checkout.cash_on_delivery")}
          </div>
          <p className={styles.codTitle}>
            {t("resource.checkout.pay_on_delivery")}
          </p>
          {codCharges > 0 && (
            <div className={styles.codInfo}>
              +{priceFormatCurrencySymbol(getCurrencySymbol, codCharges)}{" "}
              {t("resource.checkout.cod_extra_charge")}
            </div>
          )}
          {shouldShowSplitCodAction ? (
            renderSplitCodAction()
          ) : (
            <div className={styles.codPay}>
              <button
                className={`${styles.commonBtn} ${styles.payBtn}`}
                onClick={() => proceedToPay("COD", selectedPaymentPayload)}
                disabled={
                  mopSelectionLoading ||
                  isPaymentLoading ||
                  !isCouponValid ||
                  isPaymentDisabled
                }
              >
                {!isPaymentLoading ? t("resource.checkout.place_order") : loader}
              </button>
            </div>
          )}
        </div>
      ) : (
        <Spinner />
      )}
      {isCodModalOpen && isTablet && (
        <Modal isOpen={isCodModalOpen} hideHeader={true}>
          <div className={styles.codModal}>
            <div className={styles.codIconsContainer}>
              <SvgWrapper svgSrc="cod-icon"></SvgWrapper>
              <span
                className={styles.closeCodModal}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCodModalOpen(false);
                  setTab("");
                  setSelectedTab("");
                  console.log("close modal");
                }}
              >
                <SvgWrapper svgSrc="closeBold"></SvgWrapper>
              </span>
            </div>
            <div>
              <p className={styles.message}>
                {t("resource.checkout.confirm_cod")}
              </p>
              {codCharges > 0 && (
                <p className={styles.codCharges}>
                  +{priceFormatCurrencySymbol(getCurrencySymbol, codCharges)}{" "}
                  {t("resource.checkout.extra_charges")}
                </p>
              )}
            </div>
            {shouldShowSplitCodAction ? (
              renderSplitCodAction()
            ) : (
              <button
                className={`${styles.commonBtn} ${styles.payBtn}`}
                onClick={() => proceedToPay("COD", selectedPaymentPayload)}
                disabled={
                  mopSelectionLoading || isPaymentLoading || isPaymentDisabled
                }
              >
                {!isPaymentLoading ? (
                  <>
                    {t("resource.checkout.continue_with_cod")}{" "}
                    {priceFormatCurrencySymbol(
                      getCurrencySymbol,
                      getTotalValue(),
                      "en-IN",
                      null,
                      true
                    )}
                  </>
                ) : (
                  loader
                )}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CodPayment;
