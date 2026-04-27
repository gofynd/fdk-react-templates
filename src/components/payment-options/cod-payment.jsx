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
}) {
  const isTablet = useViewport(0, 768);
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
          <div className={styles.codPay}>
            <button
              className={`${styles.commonBtn} ${styles.payBtn}`}
              onClick={() => proceedToPay("COD", selectedPaymentPayload)}
              disabled={isPaymentLoading}
            >
              {!isPaymentLoading ? t("resource.checkout.place_order") : loader}
            </button>
          </div>
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
            <button
              className={`${styles.commonBtn} ${styles.payBtn}`}
              onClick={() => proceedToPay("COD", selectedPaymentPayload)}
              disabled={isPaymentLoading}
            >
              {!isPaymentLoading ? (
                <>
                  {t("resource.checkout.continue_with_cod")}{" "}
                  {priceFormatCurrencySymbol(
                    getCurrencySymbol,
                    getTotalValue()
                  )}
                </>
              ) : (
                loader
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CodPayment;
