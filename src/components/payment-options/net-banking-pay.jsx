import React from "react";
import Modal from "../core/modal/modal";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import { useViewport } from "../../helper/hooks";

function NetBankingPay({
  selectedTabData,
  nbSearchText,
  setNbSearchText,
  selectedNB,
  selectMop,
  removeDialogueError,

  // pay flow props (same pattern as wallet)
  onPriceDetailsClick,
  enableLinkPaymentOption,
  isPaymentLoading,
  loader,
  getCurrencySymbol,
  getTotalValue,
  proceedToPay,
  acceptOrder,
  disbaleCheckout,

  // modal state
  openMoreNbModal,
  setOpenMoreNbModal,

  // ui helpers
  translateDynamicLabel,
  t,
  SvgWrapper,
  styles,
  StickyPayNow,
  getNBBorder,

  // payload
  selectedPaymentPayload,
}) {
  const isTablet = useViewport(0, 768);

  const initialVisibleBankCount = 4;
  const topBanks =
    selectedTabData?.list?.slice(0, initialVisibleBankCount) ?? [];
  const restBanks = selectedTabData?.list?.slice(initialVisibleBankCount) ?? [];

  const filteredBanks = restBanks?.filter((nb) =>
    nb?.display_name?.toLowerCase().includes(nbSearchText?.toLowerCase())
  );

  const NbItem = ({ nb, openMoreNbModal = false }) => {
    return (
      <div
        className={`${styles.modeItemWrapper} ${getNBBorder(nb)}`}
        onClick={() => {
          removeDialogueError();
          selectMop("NB", "NB", nb?.code);
        }}
      >
        <label>
          <div className={styles.modeItem}>
            <div className={styles.logoNameContainer}>
              <div className={styles.modeItemLogo}>
                <img src={nb?.logo_url?.small} alt={nb?.display_name} />
              </div>
              <div className={styles.modeItemName}>
                {translateDynamicLabel(nb?.display_name ?? "", t)}
              </div>
            </div>

            <div className={`${styles.nbLeft} ${styles.onMobileView}`}>
              {(!selectedNB || selectedNB?.code !== nb?.code) && (
                <SvgWrapper svgSrc="radio" />
              )}
              {selectedNB?.code === nb?.code && (
                <SvgWrapper svgSrc="radio-selected" />
              )}
            </div>
          </div>
        </label>

        <div className={styles.modePay}>
          {!openMoreNbModal && isTablet ? (
            <StickyPayNow
              customClassName={styles.visibleOnTab}
              value={priceFormatCurrencySymbol(
                getCurrencySymbol,
                getTotalValue()
              )}
              onPriceDetailsClick={onPriceDetailsClick}
              disabled={!selectedNB?.code}
              enableLinkPaymentOption={enableLinkPaymentOption}
              isPaymentLoading={isPaymentLoading}
              loader={loader}
              proceedToPay={() => {
                proceedToPay("NB", selectedPaymentPayload);
                acceptOrder();
              }}
            />
          ) : (
            selectedNB?.code === nb?.code && (
              <button
                className={`${styles.commonBtn} ${styles.payBtn}`}
                onClick={() => {
                  proceedToPay("NB", selectedPaymentPayload);
                  if (disbaleCheckout?.message) {
                    setOpenMoreNbModal(false);
                    acceptOrder();
                  }
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
                  <span>{loader}</span>
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
      <div className={`${styles.nbHeader} ${styles["view-mobile-up"]}`}>
        {t("resource.checkout.select_bank")}
      </div>

      <div className={styles.modeOption}>
        {topBanks?.map((nb, index) => (
          <NbItem nb={nb} key={`nb-${index}`} />
        ))}

        {selectedTabData?.list?.length > initialVisibleBankCount && (
          <div
            className={`${styles.modeItemWrapper} ${styles.otherBorder}`}
            onClick={() => {
              removeDialogueError();
              setOpenMoreNbModal(true);
            }}
          >
            <div className={styles.modeItem}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div className={styles.modeItemLogo}>
                  <span>
                    <SvgWrapper
                      svgSrc="other-banks"
                      className={styles.svgColor}
                    />
                  </span>
                </div>
                <div className={styles.moreModeName}>
                  {t("resource.checkout.other_banks")}
                </div>
              </div>

              <span className={styles.moreModeIcon}>
                <SvgWrapper svgSrc="accordion-arrow" />
              </span>
            </div>
          </div>
        )}

        <Modal
          containerClassName={styles.moreOptionContainer}
          isOpen={openMoreNbModal}
          headerClassName={styles.modalHeader}
          bodyClassName={`${styles.modalBody} ${styles.bodyContainer}`}
          closeDialog={() => {
            setOpenMoreNbModal(false);
            setNbSearchText("");
          }}
          title={t("resource.checkout.select_bank")}
        >
          <div className={styles.searchBox}>
            <SvgWrapper svgSrc="search" className={styles.searchIcon} />
            <input
              type="text"
              value={nbSearchText} // ✅ controlled (better than defaultValue)
              onChange={(e) => setNbSearchText(e.target.value)}
              placeholder={t("resource.checkout.search_for_banks")}
            />
          </div>

          {filteredBanks?.length === 0 ? (
            <p className={styles.noResultFound}>
              {t("resource.common.empty_state")}
            </p>
          ) : (
            filteredBanks?.map((nb, index) => (
              <NbItem
                nb={nb}
                openMoreNbModal={openMoreNbModal}
                key={`mi-${index}`}
              />
            ))
          )}
        </Modal>
      </div>
    </div>
  );
}

export default NetBankingPay;
