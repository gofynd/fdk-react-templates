import React, { useEffect } from "react";

function QrCodePaymet({
  isTablet,
  isQrMopPresent,
  isQrCodeVisible,
  qrCodeImage,
  isQrCodeLoading,
  countdown,
  formatTime,
  selectMop,
  cancelQrPayment,
  disbaleCheckout,
  acceptOrder,
  removeDialogueError,
  SvgWrapper,
  setCountdown,
  initializeOrResetQrPayment,
  t,
  styles,
}) {
  useEffect(() => {
    if (countdown > 0 && isQrCodeVisible) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Cleanup countdown interval
      return () => clearInterval(countdownInterval);
    } else if (countdown === 0) {
      initializeOrResetQrPayment();
    }
  }, [countdown]);

  return (
    <div>
      {!isTablet && isQrMopPresent && (
        <div>
          <p className={styles.upiSectionTitle}>
            {t("resource.checkout.upi_qr_code_caps")}
          </p>
          <div className={styles.upiQrCodeSection}>
            <div className={styles.upiQrCodeDescription}>
              <div>
                <p className={styles.scanQrTitle}>
                  {t("resource.checkout.scan_qr_to_pay")}
                </p>
                <p className={styles.scanQrDescripton}>
                  {t("resource.checkout.scan_qr_upi")}
                </p>
              </div>
              <div className={styles.scanQrApps}>
                <div className={styles.upiAppLogo}>
                  <SvgWrapper svgSrc="gpay" />
                </div>
                <div className={styles.upiAppLogo}>
                  <SvgWrapper svgSrc="phonepe" />
                </div>
                <div className={styles.upiAppLogo}>
                  <SvgWrapper svgSrc="bhim" />
                </div>
                <div className={styles.upiAppLogo}>
                  <SvgWrapper svgSrc="amazon-pay" />
                </div>
                <p className={styles.moreUpiApps}>
                  {t("resource.checkout.and_more")}
                </p>
              </div>
              {isQrCodeVisible && (
                <span className={styles.expiryText}>
                  {t("resource.checkout.valid_for")}
                  <span className={styles.countDown}>
                    {formatTime(countdown)}
                  </span>
                  <span className={styles.minutes}>
                    {t("resource.common.minutes")}
                  </span>
                </span>
              )}
              {isQrCodeVisible && (
                <p
                  className={styles.cancel}
                  onClick={() => {
                    cancelQrPayment();
                  }}
                >
                  {t("resource.facets.cancel_caps")}
                </p>
              )}
            </div>
            <div className={styles.upiQrCode}>
              {!isQrCodeVisible && (
                <SvgWrapper svgSrc="qr-code" className={styles.blurred} />
              )}
              {isQrCodeVisible && (
                <img
                  src={qrCodeImage}
                  className={styles.qrCode}
                  alt={t("resource.checkout.qr_code_image")}
                />
              )}
              {!isQrCodeVisible && isQrCodeLoading && (
                <div className={styles.qrLoader}></div>
              )}
              {!isQrCodeVisible && !isQrCodeLoading && (
                <p
                  className={styles.showQrButton}
                  onClick={() => {
                    if (disbaleCheckout?.message) {
                      acceptOrder();
                    } else {
                      removeDialogueError();
                    }
                    selectMop("UPI", "QR", "QR");
                  }}
                >
                  {t("resource.checkout.show_qr")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QrCodePaymet;
