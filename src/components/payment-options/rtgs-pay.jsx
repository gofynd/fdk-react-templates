import React, { useMemo, useRef, useState } from "react";
import { useGlobalTranslation } from "fdk-core/utils";
import FyInput from "../core/fy-input/fy-input";
import UploadSvg from "../../assets/images/cloud_upload.svg";
import CopyToClipboardSvg from "../../assets/images/copy-to-clip.svg";
import FileSvg from "../../assets/images/file.svg";
import SvgCheck from "../../assets/images/checkmark-filled-small.svg";
import DeleteSvg from "../../assets/images/delete2.svg";
import TickBlackActiveSvg from "../../assets/images/tick-black-active.svg";
import DangerInfoIcon from "../../assets/images/danger-info.svg";
import { priceFormatCurrencySymbol } from "../../helper/utils";

function RtgsPay({
  styles,
  StickyPayNow,
  isTablet,
  getCurrencySymbol,
  getTotalValue,
  rtgsFileUpload = { state: {}, upload: () => {}, reset: () => {} },
  proceedToPay,
  selectedPaymentPayload,
  enableLinkPaymentOption,
  isPaymentLoading,
  loader,
  onPriceDetailsClick,
}) {
  const { t } = useGlobalTranslation("translation");

  const [utrNumber, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState(false);
  const [utrMinError, setUtrMinError] = useState(false);
  const [utrInvalidCharError, setUtrInvalidCharError] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [proofFiles, setProofFiles] = useState([]);
  const [copiedValue, setCopiedValue] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const uploadInputRef = useRef(null);

  const displayConfig = useMemo(() => {
    const extractValue = (fieldData) => {
      if (!fieldData) return "";
      if (typeof fieldData.value === "object" && fieldData.value?.label)
        return fieldData.value.label;
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
    return {
      beneficiaryTitle:
        t("resource.dynamic_label.beneficiary_bank_details") ||
        "Beneficiary Bank Details",
      transactionTitle:
        t("resource.dynamic_label.transaction_details") || "Transaction Details",
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
      utrLabel:
        configSource.transaction_id?.display_name ||
        "Enter unique transaction number",
      beneficiaryDetails,
      isUtrFieldRequired: configSource.transaction_id?.value ?? true,
      isUploadFieldRequired: configSource.payment_receipt?.value ?? true,
    };
  }, [rtgsFileUpload?.neftRtgsConfig]);

  const handleCopyToClipboard = async (value, setter) => {
    try {
      await navigator.clipboard.writeText(value);
      setter(value);
      setTimeout(() => setter(null), 2000);
    } catch (err) {
      console.error("Copy to clipboard failed", err);
    }
  };

  const handleUtrInputChange = (event) => {
    const inputValue = event.target.value;
    const hasInvalidChars = /[^A-Za-z0-9]/.test(inputValue);
    const value = inputValue.toUpperCase();
    if (utrError) setUtrError(false);
    if (value.trim().length >= 16) setUtrMinError(false);
    setUtrInvalidCharError(hasInvalidChars);
    setUtrNumber(value);
  };

  const validateUtr = (utr, isRequired) => {
    setUtrError(false);
    setUtrInvalidCharError(false);
    setUtrMinError(false);
    const trimmed = utr?.trim() || "";
    if (isRequired && !trimmed) { setUtrError(true); return false; }
    if (!trimmed) return true;
    if (/[^A-Za-z0-9]/.test(trimmed)) { setUtrInvalidCharError(true); return false; }
    if (trimmed.length < 16) { setUtrMinError(true); return false; }
    return true;
  };

  const handlePlaceOrder = () => {
    const { isUtrFieldRequired, isUploadFieldRequired } = displayConfig;
    setFileUploadError(false);
    let hasError = false;
    if (!validateUtr(utrNumber, isUtrFieldRequired)) hasError = true;
    if (isUploadFieldRequired) {
      if (!rtgsFileUpload?.state?.fileUploaded || rtgsFileUpload?.state?.uploadedFileUrl?.length === 0) {
        setFileUploadError(true);
        hasError = true;
      }
    }
    if (!hasError) {
      proceedToPay("RTGS", {
        ...selectedPaymentPayload,
        selectedRtgsPayment: {
          offline_utr: utrNumber || "",
          receipt_urls: rtgsFileUpload?.state?.uploadedFileUrl || [],
        },
      });
    }
  };

  const handleUploadButtonClick = () => uploadInputRef.current?.click();
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); if (!isDragging) setIsDragging(true); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      handleFileInputChange({ target: { files: e.dataTransfer.files, value: "" } });
    }
  };

  const formatFileSize = (bytes) => `${(bytes / 1024).toFixed(2)} kb`;

  const handleFileRemove = (fileIndex) => {
    setProofFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    if (uploadInputRef.current) uploadInputRef.current.value = "";
    if (rtgsFileUpload?.reset) rtgsFileUpload.reset(fileIndex);
  };

  const handleFileInputChange = async (event) => {
    const files = Array.from(event?.target?.files || []);
    if (files.length === 0) return;
    const maxSizeInBytes = 5 * 1024 * 1024;
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    const allowedExtensions = ["pdf", "png", "jpg", "jpeg"];
    for (const file of files) {
      if (file.size > maxSizeInBytes) {
        alert(t("resource.dynamic_label.file_size_exceeded") || `File ${file.name} size must not exceed 5MB`);
        event.target.value = "";
        return;
      }
      const ext = file.name.split(".").pop().toLowerCase();
      if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(ext)) {
        alert(t("resource.dynamic_label.invalid_file_type") || `Only PDF and image files (PNG, JPG, JPEG) are allowed for ${file.name}`);
        event.target.value = "";
        return;
      }
    }
    setProofFiles((prev) => [...prev, ...files]);
    if (fileUploadError) setFileUploadError(false);
    if (rtgsFileUpload?.upload) {
      for (const file of files) await rtgsFileUpload.upload(file);
    }
  };

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
  } = displayConfig;

  const utrFieldLabel = t("resource.dynamic_label.utr_number") || "UTR Number";
  const currency = getCurrencySymbol;
  const totalValue = Math.ceil(getTotalValue());

  return (
    <div>
      <div className={styles.neftWrapper}>
        <section className={styles.neftSection}>
          <p className={styles.neftSectionTitle}>{beneficiaryTitle}</p>
          <div className={styles.neftBeneficiaryCard}>
            {beneficiaryDetails
              .filter((d) => d.value && d.value.trim() !== "")
              .map((detail) => (
                <div key={detail.label} className={styles.neftBeneficiaryRow}>
                  <div className={styles.neftBeneficiaryLabelWrapper}>
                    <span className={styles.neftBeneficiaryLabel}>{detail.label}</span>
                    <span className={styles.neftLabelSeparator}>:</span>
                  </div>
                  <div className={styles.neftBeneficiaryValue}>
                    <span>{detail.value}</span>
                    {detail.isCopyEnabled && (
                      <button
                        type="button"
                        className={styles.neftCopyButton}
                        onClick={() => handleCopyToClipboard(detail.value, setCopiedValue)}
                      >
                        {copiedValue === detail.value ? <TickBlackActiveSvg /> : <CopyToClipboardSvg />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.infoAlert}>
            <div className={styles.infoAlertIcon}><DangerInfoIcon /></div>
            <span>
              {t("resource.dynamic_label.please_pay_for_mop_payment", {
                currency,
                totalValue,
                mop: "RTGS",
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
                  id="rtgsUtrNumber"
                  label={`${utrFieldLabel}${isUtrFieldRequired ? "*" : ""}`}
                  showAsterik={isUtrFieldRequired}
                  labelVariant="floating"
                  inputVariant="outlined"
                  inputClassName={styles["fs-12"]}
                  containerClassName={styles["field-input-container"]}
                  minLength={16}
                  maxLength={22}
                  type="text"
                  value={utrNumber}
                  onChange={handleUtrInputChange}
                  error={utrError || utrMinError || utrInvalidCharError}
                  errorMessage={
                    utrError
                      ? t("resource.common.field_required")
                      : utrMinError
                        ? t("resource.dynamic_label.utr_min_length")
                        : utrInvalidCharError
                          ? t("resource.dynamic_label.utr_invalid_characters") ||
                            "Only alphanumeric characters are allowed (A-Z, 0-9). No spaces or special characters."
                          : ""
                  }
                />
              </div>
            </section>
            <p className={styles.neftHelperText}>{utrDescription}</p>
          </div>

          <section className={`${styles.neftSection} ${styles.neftUploadSection}`}>
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
                <div className={styles.neftUploadIcon} aria-hidden="true"><UploadSvg /></div>
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
                  {isUploadFieldRequired && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
                </p>
                <p className={styles.neftUploadHelper}>{uploadHelper}</p>
              </div>
            </div>

            {rtgsFileUpload?.state?.uploadingFiles?.length > 0 && (
              <div className={styles.neftUploadingFilesWrapper}>
                {rtgsFileUpload.state.uploadingFiles.map((uploadingFile) => (
                  <div key={uploadingFile.id} className={styles.neftFileCard}>
                    <div className={styles.neftFileCardContent}>
                      <div className={styles.neftFileInfo}>
                        <div className={styles.neftFileIcon}><FileSvg className={styles.fileIcon} /></div>
                        <div className={styles.neftFileDetails}>
                          <span className={styles.neftFileName}>{uploadingFile.name}</span>
                          <div className={styles.neftProgressContainer}>
                            <div className={styles.neftProgressBarContainer}>
                              <div
                                className={styles.neftProgressBar}
                                style={{ width: `${uploadingFile.progress}%` }}
                              />
                            </div>
                            <span className={styles.neftProgressText}>{uploadingFile.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {proofFiles?.some((_, index) => index < rtgsFileUpload?.state?.fileUploadedName?.length) && (
              <div className={styles.neftUploadedFilesWrapper}>
                {proofFiles.map((file, index) => {
                  if (index >= rtgsFileUpload?.state?.fileUploadedName?.length) return null;
                  return (
                    <div key={`file-${index}`} className={styles.neftFileCard}>
                      <div className={styles.neftFileCardContent}>
                        <div className={styles.neftFileInfo}>
                          <div className={styles.neftFileIcon}><FileSvg className={styles.fileIcon} /></div>
                          <div className={styles.neftFileDetails}>
                            <span className={styles.neftFileName}>
                              {file.name}
                              <SvgCheck className={styles.neftSuccessIndicator} />
                            </span>
                            <span className={styles.neftFileSize}>{formatFileSize(file.size)}</span>
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

            {(rtgsFileUpload?.state?.fileUploadError || fileUploadError) && (
              <div className={styles.neftUploadError}>
                {rtgsFileUpload?.state?.fileUploadError ||
                  (fileUploadError && t("resource.common.field_required"))}
              </div>
            )}
          </section>

          <div>
            {isTablet ? (
              <StickyPayNow
                customClassName={styles.visibleOnTab}
                value={priceFormatCurrencySymbol(getCurrencySymbol, getTotalValue())}
                onPriceDetailsClick={onPriceDetailsClick}
                disabled={isPaymentLoading}
                enableLinkPaymentOption={enableLinkPaymentOption}
                isPaymentLoading={isPaymentLoading}
                loader={loader}
                proceedToPay={handlePlaceOrder}
              />
            ) : (
              <button
                className={styles.neftPlaceOrderBtn}
                onClick={handlePlaceOrder}
                disabled={isPaymentLoading}
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

export default RtgsPay;
