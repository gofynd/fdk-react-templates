/**
 * FyFileUpload Component
 *
 * A generic, presentation-only dropzone/file-picker shell for React
 * applications. Supports drag-and-drop and click-to-browse, file
 * type/size/count constraints, and a render-prop for custom preview content.
 * This component does not perform any upload networking itself - it only
 * surfaces the selected `File` objects via `onFilesSelected`, leaving the
 * actual upload flow (signed URLs, progress tracking, etc.) to the caller.
 *
 * @param {string} accept - Comma-separated list of accepted MIME types/extensions, e.g. ".jpg,.jpeg,.png,.pdf".
 * @param {boolean} multiple - If true, allows selecting/dropping more than one file at a time.
 * @param {number} maxSizeMb - Maximum allowed file size in megabytes; files exceeding this are reported via `onError` instead of `onFilesSelected`.
 * @param {boolean} disabled - If true, the dropzone cannot be interacted with.
 * @param {boolean} error - If true, the dropzone renders in an error state.
 * @param {string} errorMessage - Error message rendered below the dropzone when `error` is truthy.
 * @param {function(File[]): void} onFilesSelected - Callback invoked with the accepted `File[]` from either a drop or a browse selection.
 * @param {function(string): void} onError - Callback invoked with a human-readable message when a selected file is rejected (e.g. exceeds `maxSizeMb`).
 * @param {React.ReactNode} label - Primary instructional text, e.g. "Drag & drop or click to upload".
 * @param {React.ReactNode} secondaryLabel - Secondary/help text, e.g. accepted formats and size limit.
 * @param {React.ReactNode} icon - Optional custom icon element rendered above the label.
 * @param {React.ReactNode} children - Optional custom content (e.g. an uploaded-file preview) rendered instead of the default empty-state label/icon.
 * @param {string} className - Optional custom CSS class(es) to apply to the dropzone element.
 * @param {string} containerClassName - Optional custom CSS class(es) to apply to the outer wrapping container.
 *
 * @returns {JSX.Element} A drag-and-drop/click file picker shell.
 */

import React, { useCallback, useRef, useState } from "react";
import * as styles from "./fy-file-upload.less";

const bytesToMb = (bytes) => bytes / (1024 * 1024);

const DefaultUploadIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 16V4M12 4L7 9M12 4L17 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FyFileUpload = ({
  accept = "",
  multiple = false,
  maxSizeMb,
  disabled = false,
  error = false,
  errorMessage = "",
  onFilesSelected = () => {},
  onError = () => {},
  label = "Drag & drop or click to upload",
  secondaryLabel = "",
  icon,
  children,
  className = "",
  containerClassName = "",
}) => {
  const inputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const validateAndEmit = useCallback(
    (fileList) => {
      const files = Array.from(fileList || []);
      if (!files.length) return;

      if (typeof maxSizeMb === "number") {
        const oversized = files.find((file) => bytesToMb(file.size) > maxSizeMb);
        if (oversized) {
          onError(`File size should not exceed ${maxSizeMb}MB`);
          return;
        }
      }

      onFilesSelected(multiple ? files : [files[0]]);
    },
    [maxSizeMb, multiple, onFilesSelected, onError]
  );

  const handleInputChange = (event) => {
    validateAndEmit(event.target.files);
    // Reset so selecting the same file again still fires onChange
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;
    validateAndEmit(event.dataTransfer?.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div className={`${styles.uploadWrapper} ${containerClassName}`}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ""} ${
          disabled ? styles.disabled : ""
        } ${error ? styles.error : ""} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className={styles.hiddenInput}
        />
        {children || (
          <div className={styles.emptyState}>
            <span className={styles.icon}>{icon || <DefaultUploadIcon />}</span>
            <span className={styles.label}>{label}</span>
            {secondaryLabel && (
              <span className={styles.secondaryLabel}>{secondaryLabel}</span>
            )}
          </div>
        )}
      </div>
      {error && errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
};

export default FyFileUpload;
