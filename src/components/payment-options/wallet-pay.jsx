import React from "react";
import Modal from "../core/modal/modal";
import { priceFormatCurrencySymbol } from "../../helper/utils";
import { useViewport } from "../../helper/hooks";

function WalletPayment({
  selectedTabData,
  walletSearchText,
  setWalletSearchText,
  selectedWallet,
  selectMop,
  removeDialogueError,
  onPriceDetailsClick,
  enableLinkPaymentOption,
  isPaymentLoading,
  loader,
  getCurrencySymbol,
  getTotalValue,
  proceedToPay,
  acceptOrder,
  disbaleCheckout,
  setOpenMoreWalletModal,
  openMoreWalletModal,
  translateDynamicLabel,
  t,
  SvgWrapper,
  styles,
  StickyPayNow,
  getWalletdBorder,
  selectedPaymentPayload,
}) {
  const isTablet = useViewport(0, 768);
  const initialVisibleWalletCount = 3;
  const topWallets =
    selectedTabData?.list?.slice(0, initialVisibleWalletCount) ?? [];
  const restWallets =
    selectedTabData?.list?.slice(initialVisibleWalletCount) ?? [];
  const filteredWallets = restWallets?.filter((wlt) =>
    wlt?.display_name?.toLowerCase().includes(walletSearchText?.toLowerCase())
  );

  const WalletItem = ({ wlt, openMoreWalletModal = false }) => {
    return (
      <div
        key={wlt?.code}
        className={`${styles.modeItemWrapper} ${getWalletdBorder(wlt)}`}
        onClick={(e) => {
          removeDialogueError();
          selectMop("WL", "WL", wlt?.code);
        }}
      >
        <label>
          <div className={styles.modeItem}>
            <div className={styles.logoNameContainer}>
              <div className={styles.modeItemLogo}>
                <img src={wlt?.logo_url?.small} alt={wlt?.display_name} />
              </div>
              <div className={styles.modeItemName}>
                {translateDynamicLabel(wlt?.display_name ?? "", t)}
              </div>
            </div>
            <div className={`${styles.walletLeft} ${styles.onMobileView}`}>
              {(!selectedWallet || selectedWallet.code !== wlt.code) && (
                <SvgWrapper svgSrc={"radio"}></SvgWrapper>
              )}
              {selectedWallet && selectedWallet.code === wlt.code && (
                <SvgWrapper svgSrc={"radio-selected"}></SvgWrapper>
              )}
            </div>
          </div>
        </label>

        <div className={styles.modePay}>
          {!openMoreWalletModal && isTablet ? (
            <StickyPayNow
              customClassName={styles.visibleOnTab}
              value={priceFormatCurrencySymbol(
                getCurrencySymbol,
                getTotalValue()
              )}
              onPriceDetailsClick={onPriceDetailsClick}
              disabled={!selectedWallet.code}
              enableLinkPaymentOption={enableLinkPaymentOption}
              isPaymentLoading={isPaymentLoading}
              loader={loader}
              proceedToPay={() => {
                proceedToPay("WL", selectedPaymentPayload);
                acceptOrder();
              }}
            />
          ) : (
            selectedWallet.code &&
            selectedWallet.code === wlt.code && (
              <button
                className={styles.payBtn}
                onClick={() => {
                  proceedToPay("WL", selectedPaymentPayload);
                  if (disbaleCheckout?.message) {
                    setOpenMoreWalletModal(false);
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
      <div className={`${styles.walletHeader} ${styles["view-mobile-up"]}`}>
        {t("resource.checkout.select_wallet")}
      </div>
      <div className={styles.modeOption}>
        {topWallets?.map((wlt, index) => (
          <WalletItem wlt={wlt} key={index} />
        ))}
        {restWallets.length > 0 && (
          <div
            className={`${styles.modeItemWrapper} ${styles.otherBorder}`}
            onClick={() => {
              removeDialogueError();
              setOpenMoreWalletModal(true);
            }}
          >
            <div className={styles.modeItem}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div className={styles.modeItemLogo}>
                  <span className={styles.moreWlIcon}>
                    <SvgWrapper
                      className={styles.svgColor}
                      svgSrc="more-wallets"
                    />
                  </span>
                </div>
                <div className={styles.moreModeName}>
                  {t("resource.checkout.other_wallets")}
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
          isOpen={openMoreWalletModal}
          headerClassName={styles.modalHeader}
          bodyClassName={`${styles.modalBody} ${styles.bodyContainer}`}
          closeDialog={() => {
            setOpenMoreWalletModal(false);
            setWalletSearchText("");
          }}
          title={t("resource.checkout.select_wallet")}
        >
          <div className={styles.searchBox}>
            <SvgWrapper svgSrc="search" className={styles.searchIcon} />
            <input
              type="text"
              defaultValue={walletSearchText}
              onChange={(e) => setWalletSearchText(e?.target?.value)}
              placeholder={t("resource.checkout.search_for_wallets")}
            />
          </div>
          {filteredWallets?.length === 0 ? (
            <p className={styles.noResultFound}>
              {t("resource.common.empty_state")}
            </p>
          ) : (
            filteredWallets.map((wlt, index) => (
              <WalletItem
                openMoreWalletModal={openMoreWalletModal}
                wlt={wlt}
                key={`mi-${index}`}
              />
            ))
          )}
        </Modal>
      </div>
    </div>
  );
}

export default WalletPayment;
