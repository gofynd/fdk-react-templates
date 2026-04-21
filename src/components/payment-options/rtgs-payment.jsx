import React, { useRef, useState, useMemo } from "react";
import UploadSvg from "../../assets/images/cloud_upload.svg";
import CopyToClipboardSvg from "../../assets/images/copy-to-clip.svg";
import FileSvg from "../../assets/images/file.svg";
import SvgCheck from "../../assets/images/checkmark-filled-small.svg";
import DeleteSvg from "../../assets/images/delete2.svg";
import TickBlackActiveSvg from "../../assets/images/tick-black-active.svg";
import FyInput from "../../components/core/fy-input/fy-input";
import DangerInfoIcon from "../../assets/images/danger-info.svg";
import { copyToClipboard, formatFileSize, validateUtr } from "../../helper/utils";

function RtgsPayment({
  // File upload hook (from parent)
  rtgsFileUpload,
  // Payment flow
  proceedToPay,
  selectedRtgsPayment,
  selectedPaymentPayload,
  acceptOrder,
  // Amount display
  getCurrencySymbol,
  getTotalValue,
  // UI / layout
  styles,
  t,
  isTablet,
  isPaymentLoading,
  loader,
  onPriceDetailsClick,
  enableLinkPaymentOption,
  StickyPayNow,
  priceFormatCurrencySymbol,
}) {
  const uploadInputRef = useRef(null);

  // ── Local state ──────────────────────────────────────────────────────────────
  const [rtgsUtrNumber, setRtgsUtrNumber] = useState("");
  const [rtgsUtrError, setRtgsUtrError] = useState(false);
  const [rtgsUtrMinError, setRtgsUtrMinError] = useState(false);
  const [rtgsUtrInvalidCharError, setRtgsUtrInvalidCharError] = useState(false);
  const [rtgsFileUploadError, setRtgsFileUploadError] = useState(false);
  const [rtgsProofFiles, setRtgsProofFiles] = useState([]);
  const [copiedValue, setCopiedValue] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Config derived from API ───────────────────────────────────────────────────
  const rtgsDisplayConfig = useMemo(() => {
    const extractValue = (fieldData) => {
      if (!fieldData) return "";
      if (typeof fieldData.value === "object" && fieldData.value?.label) {
        return fieldData.value.label;
      }
      return fieldData.value || "";
    };

    const configSource = rtgsFileUpload?.neftRtgsConfig || {};

    const fieldConfig = {
      account_number: { copyEnabled: true },
      account_name: { copyEnabled: false },
      account_type: { copyEnabled: false },
      account_bank: { copyEnabled: false },
      account_ifsc: { copyEnabled: true },
      account_branch: { copyEnabled: false },
    };

    const beneficiaryDetails = [];
    Object.keys(fieldConfig).forEach((key) => {
      const field = configSource[key];
      if (field && !field.type?.includes("toggle")) {
        beneficiaryDetails.push({
          label: field.display_name,
          value: extractValue(field),
          isCopyEnabled: fieldConfig[key].copyEnabled,
        });
      }
    });

    const isUtrFieldRequired = configSource.transaction_id?.value ?? true;
    const isUploadFieldRequired = configSource.payment_receipt?.value ?? true;

    return {
      beneficiaryTitle:
        t("resource.dynamic_label.beneficiary_bank_details") ||
        "Beneficiary Bank Details",
      transactionTitle:
        t("resource.dynamic_label.transaction_details") ||
        "Transaction Details",
      utrLabel:
        configSource.transaction_id?.display_name ||
        "Enter unique transaction number",
      utrDescription:
        t("resource.dynamic_label.utr_helper") ||
        "UTR is a unique alphanumeric code assigned by a bank to track a specific financial transaction",
      uploadHeading:
        t("resource.dynamic_label.upload_payment_receipt") ||
        configSource.payment_receipt?.display_name ||
        "Drag and drop your files here",
      uploadCta: t("resource.dynamic_label.upload_file") || "UPLOAD FILE",
      uploadHelper:
        `${t("resource.dynamic_label.supported_format")}: PDF, PNG, JPEG (5MB)` ||
        "Supported Format: PDF, PNG, JPEG (5MB)",
      beneficiaryDetails,
      isUtrFieldRequired,
      isUploadFieldRequired,
    };
  }, [rtgsFileUpload?.neftRtgsConfig]);

  const {
    beneficiaryDetails,
    beneficiaryTitle,
    transactionTitle,
    utrDescription,
    uploadHeading,
    uploadCta,
    uploadHelper,
    isUtrFieldRequired,
    isUploadFieldRequired,
  } = rtgsDisplayConfig;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleUtrInputChange = (event) => {
    const inputValue = event.target.value;
    const hasInvalidChars = /[^A-Za-z0-9]/.test(inputValue);
    const value = inputValue.toUpperCase();

    if (rtgsUtrError) setRtgsUtrError(false);
    if (value.trim().length >= 16) setRtgsUtrMinError(false);
    setRtgsUtrInvalidCharError(hasInvalidChars);
    setRtgsUtrNumber(value);
  };


  const handleRtgsPlaceOrder = () => {
    setRtgsFileUploadError(false);
    let hasError = false;

    const utrValid = validateUtr(rtgsUtrNumber, {
      isRequired: isUtrFieldRequired,
      setRequiredError: setRtgsUtrError,
      setInvalidCharError: setRtgsUtrInvalidCharError,
      setMinError: setRtgsUtrMinError,
    });

    if (!utrValid) hasError = true;

    if (isUploadFieldRequired) {
      if (
        !rtgsFileUpload?.state?.fileUploaded ||
        rtgsFileUpload?.state?.uploadedFileUrl?.length === 0
      ) {
        setRtgsFileUploadError(true);
        hasError = true;
      }
    }

    if (!hasError) {
      const updatedRtgsPayment = {
        ...selectedRtgsPayment,
        offline_utr: rtgsUtrNumber || "",
        receipt_urls: rtgsFileUpload?.state?.uploadedFileUrl || [],
      };

      proceedToPay("RTGS", {
        ...selectedPaymentPayload,
        selectedRtgsPayment: updatedRtgsPayment,
      });
    }
  };

  const handleUploadButtonClick = () => {
    uploadInputRef.current?.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fakeEvent = {
        target: { files: e.dataTransfer.files, value: "" },
      };
      handleFileInputChange(fakeEvent);
    }
  };


  const handleFileRemove = (fileIndex) => {
    setRtgsProofFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
    if (rtgsFileUpload?.reset) {
      rtgsFileUpload.reset(fileIndex);
    }
  };

  const handleFileInputChange = async (event) => {
    const files = Array.from(event?.target?.files || []);
    if (files.length === 0) return;

    const maxSizeInBytes = 5 * 1024 * 1024;
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    const allowedExtensions = ["pdf", "png", "jpg", "jpeg"];

    for (const file of files) {
      if (file.size > maxSizeInBytes) {
        alert(
          t("resource.dynamic_label.file_size_exceeded") ||
            `File ${file.name} size must not exceed 5MB`
        );
        event.target.value = "";
        return;
      }

      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
        alert(
          t("resource.dynamic_label.invalid_file_type") ||
            `Only PDF and image files (PNG, JPG, JPEG) are allowed for ${file.name}`
        );
        event.target.value = "";
        return;
      }
    }

    setRtgsProofFiles((prev) => [...prev, ...files]);
    if (rtgsFileUploadError) setRtgsFileUploadError(false);

    if (rtgsFileUpload?.upload) {
      for (const file of files) {
        await rtgsFileUpload.upload(file);
      }
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────────
  const isRtgsPlaceOrderDisabled = isPaymentLoading;
  const utrFieldSet = t("resource.dynamic_label.utr_number") || "UTR Number";
  const currency = getCurrencySymbol;
  const totalValue = Math.ceil(getTotalValue());
  const mop = "RTGS";

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className={styles.neftWrapper}>
        <section className={styles.neftSection}>
          <p className={styles.neftSectionTitle}>{beneficiaryTitle}</p>
          <div className={styles.neftBeneficiaryCard}>
            {beneficiaryDetails
              .filter((detail) => detail.value && detail.value.trim() !== "")
              .map((detail) => (
                <div key={detail.label} className={styles.neftBeneficiaryRow}>
                  <div className={styles.neftBeneficiaryLabelWrapper}>
                    <span className={styles.neftBeneficiaryLabel}>
                      {detail.label}
                    </span>
                    <span className={styles.neftLabelSeparator}>:</span>
                  </div>
                  <div className={styles.neftBeneficiaryValue}>
                    <span>{detail.value}</span>
                    {detail.isCopyEnabled && (
                      <button
                        type="button"
                        className={styles.neftCopyButton}
                        onClick={() =>
                          copyToClipboard(detail.value, (v) => { setCopiedValue(v); setTimeout(() => setCopiedValue(null), 4000); })
                        }
                      >
                        {copiedValue === detail.value ? (
                          <TickBlackActiveSvg />
                        ) : (
                          <CopyToClipboardSvg />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.infoAlert}>
            <div className={styles.infoAlertIcon}>
              <DangerInfoIcon />
            </div>
            <span>
              {t("resource.dynamic_label.please_pay_for_mop_payment", {
                currency,
                totalValue,
                mop,
              })}
            </span>
          </div>
        </section>

        <div className={styles.neftFormBlock}>
          <div className={styles.neftFormBlockInner}>
            <section className={styles.neftSection}>
              <p className={styles.neftSectionTitle}>{transactionTitle}</p>
              <div className={styles.field}>
                <FyInput
                  id="utrNumber"
                  label={`${utrFieldSet}${isUtrFieldRequired ? "*" : ""}`}
                  showAsterik={isUtrFieldRequired}
                  labelVariant="floating"
                  inputVariant="outlined"
                  inputClassName={styles["fs-12"]}
                  containerClassName={styles["field-input-container"]}
                  minLength={16}
                  maxLength={22}
                  type="text"
                  value={rtgsUtrNumber}
                  onChange={handleUtrInputChange}
                  error={
                    rtgsUtrError || rtgsUtrMinError || rtgsUtrInvalidCharError
                  }
                  errorMessage={
                    rtgsUtrError
                      ? t("resource.common.field_required")
                      : rtgsUtrMinError
                        ? t("resource.dynamic_label.utr_min_length")
                        : rtgsUtrInvalidCharError
                          ? t("resource.dynamic_label.utr_invalid_characters") ||
                            "Only alphanumeric characters are allowed (A-Z, 0-9). No spaces or special characters."
                          : ""
                  }
                />
              </div>
            </section>
            <p className={styles.neftHelperText}>{utrDescription}</p>
          </div>

          <section
            className={`${styles.neftSection} ${styles.neftUploadSection}`}
          >
            <div
              className={`${styles.neftUploadBox} ${isDragging ? styles.neftUploadBoxDragging : ""}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={styles.neftUploadButtonWrapper}>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  ref={uploadInputRef}
                  className={styles.neftHiddenInput}
                  onChange={handleFileInputChange}
                  disabled={rtgsFileUpload?.state?.isUploading}
                  multiple
                />
                <div className={styles.neftUploadIcon} aria-hidden="true">
                  <UploadSvg />
                </div>
                <button
                  type="button"
                  className={styles.neftUploadButton}
                  onClick={handleUploadButtonClick}
                  disabled={rtgsFileUpload?.state?.isUploading}
                >
                  {uploadCta}
                </button>
              </div>
              <div className={styles.neftUploadHelperWrapper}>
                <p className={styles.neftUploadTitle}>
                  {uploadHeading}
                  {isUploadFieldRequired && (
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  )}
                </p>
                <p className={styles.neftUploadHelper}>{uploadHelper}</p>
              </div>
            </div>

            {(rtgsFileUpload?.state?.fileUploadError || rtgsFileUploadError) && (
              <div className={styles.neftUploadError}>
                {rtgsFileUpload?.state?.fileUploadError ||
                  (rtgsFileUploadError && t("resource.common.field_required"))}
              </div>
            )}

            {rtgsFileUpload?.state?.uploadingFiles?.length > 0 && (
              <div className={styles.neftUploadingFilesWrapper}>
                {rtgsFileUpload.state.uploadingFiles.map((uploadingFile) => (
                  <div key={uploadingFile.id} className={styles.neftFileCard}>
                    <div className={styles.neftFileCardContent}>
                      <div className={styles.neftFileInfo}>
                        <div className={styles.neftFileIcon}>
                          <FileSvg className={styles.fileIcon} />
                        </div>
                        <div className={styles.neftFileDetails}>
                          <span className={styles.neftFileName}>
                            {uploadingFile.name}
                          </span>
                          <div className={styles.neftProgressContainer}>
                            <div className={styles.neftProgressBarContainer}>
                              <div
                                className={styles.neftProgressBar}
                                style={{ width: `${uploadingFile.progress}%` }}
                              />
                            </div>
                            <span className={styles.neftProgressText}>
                              {uploadingFile.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {rtgsProofFiles?.some(
              (_, index) => index < rtgsFileUpload?.state?.fileUploadedName?.length
            ) && (
              <div className={styles.neftUploadedFilesWrapper}>
                {rtgsProofFiles.map((file, index) => {
                  const isUploaded =
                    index < rtgsFileUpload?.state?.fileUploadedName?.length;
                  if (!isUploaded) return null;
                  return (
                    <div key={`file-${index}`} className={styles.neftFileCard}>
                      <div className={styles.neftFileCardContent}>
                        <div className={styles.neftFileInfo}>
                          <div className={styles.neftFileIcon}>
                            <FileSvg className={styles.fileIcon} />
                          </div>
                          <div className={styles.neftFileDetails}>
                            <span className={styles.neftFileName}>
                              {file.name}
                              <SvgCheck className={styles.neftSuccessIndicator} />
                            </span>
                            <span className={styles.neftFileSize}>
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                          <div className={styles.neftFileActions}>
                            <button
                              className={styles.neftFileActionBtn}
                              onClick={() => handleFileRemove(index)}
                              aria-label="Remove file"
                            >
                              <DeleteSvg className={styles.neftDeleteIcon} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <div>
            {isTablet ? (
              <StickyPayNow
                customClassName={styles.visibleOnTab}
                value={priceFormatCurrencySymbol(getCurrencySymbol, getTotalValue())}
                onPriceDetailsClick={onPriceDetailsClick}
                disabled={isRtgsPlaceOrderDisabled}
                enableLinkPaymentOption={enableLinkPaymentOption}
                isPaymentLoading={isPaymentLoading}
                loader={loader}
                proceedToPay={() => {
                  handleRtgsPlaceOrder();
                  acceptOrder();
                }}
              />
            ) : (
              <button
                className={styles.neftPlaceOrderBtn}
                onClick={handleRtgsPlaceOrder}
                disabled={isRtgsPlaceOrderDisabled}
              >
                {!isPaymentLoading ? t("resource.checkout.place_order") : loader}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RtgsPayment;
