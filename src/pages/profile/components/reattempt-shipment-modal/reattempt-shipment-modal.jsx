import React, { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Modal from "../../../../components/core/modal/modal";
import * as styles from "./reattempt-shipment-modal.less";
import FyInput from "../../../../components/core/fy-input/fy-input";
import EditIcon from "../../../../assets/images/edit.svg";
import FyDatePicker from "../../../../components/date-picker/fy-date-picker/fy-date-picker";
import Loader from "../../../../components/loader/loader";
import { AddressFormInputs } from "../../../../components/address-form/address-form";
import { useMobile } from "../../../../helper/hooks/useMobile";
import { useGlobalTranslation } from "fdk-core/utils";

function ReattemptShipmentModal({
  handleModalChange,
  isOpen,
  shipmentId,
  shipmentDetails,
  onSubmit,
  addressFormSchema,
  addressItem,
  maxInactiveDate,
  minInactiveDate,
  excludeDates,
  defaultPincode,
  mobileAddressObject,
}) {
  const { t } = useGlobalTranslation("translation");

  const [editMode, setEditMode] = useState(false);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const isMobile = useMobile(480);
  const scheduleDate = "";
  const additionalComments = "";

  // Always derive this from latest props
  const inputsAddresItem = useMemo(() => {
    return {
      ...addressItem,
      phone: {
        countryCode: addressItem?.country_phone_code?.replace("+", ""),
        mobile: addressItem?.phone,
        isValidNumber: true,
      },
      area_code:
        addressItem?.area_code || addressItem?.pincode || defaultPincode || "",
    };
  }, [addressItem, defaultPincode]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      scheduleDate,
      additionalComments,
      ...inputsAddresItem,
    },
  });

  const formMethods = { setValue, getValues, setError, trigger };
  useEffect(() => {
    if (!isOpen || !addressItem) return;

    const prevValues = getValues();

    reset({
      scheduleDate: prevValues.scheduleDate || scheduleDate,
      additionalComments: prevValues.additionalComments || additionalComments,
      ...inputsAddresItem,
    });

    setHasInitialized(true);
  }, [isOpen, inputsAddresItem]);

  const closeDialog = () => handleModalChange({ isOpen: false });

  const handleFormChange = (formData) => {};

  const handleDateChange = (utcDateString) => {};

  const handleShowCalendarPopup = (calendarState) => {
    setShowCalendarPopup(() => calendarState);
  };

  const submitForm = (data) => {
    onSubmit(data);
  };

  const formatAddressForDisplay = (address) => {
    if (!address) return null;

    return address
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line, idx) => (
        <span key={idx}>
          {line}
          <br />
        </span>
      ));
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t("resource.profile.request_reattempt")}
      closeDialog={closeDialog}
      containerClassName={`${styles.modalContainer} ${
        isMobile && editMode ? styles.mobileEditModeModalCont : ""
      }`}
      headerClassName={`${styles.modalHeader} ${
        isMobile && editMode ? styles.mobileEditModeModalHeader : ""
      }`}
      customClassName={{ color: "@TextHeading" }}
    >
      <form onSubmit={handleSubmit(submitForm)}>
        <div className={styles.topContainer}>
          <div className={styles.inputsContainer}>
            <div className={styles.inputsContainerHeading}>
              {t("resource.profile.choose_reattempt_date")}
            </div>
            <Controller
              name="scheduleDate"
              control={control}
              rules={{
                required: `${t("resource.profile.please_select_reattempt_date")}`,
                validate: (value) =>
                  value?.trim?.().length > 0 ||
                  `${t("resource.profile.date_cant_be_blank")}`,
              }}
              render={({ field, fieldState }) => (
                <FyDatePicker
                  {...field}
                  ref={field.ref}
                  onChange={(date) => {
                    field.onChange(date);
                    handleDateChange(date);
                  }}
                  maxInactiveDate={maxInactiveDate}
                  minInactiveDate={minInactiveDate}
                  placeholderText="DD-MM-YYYY"
                  dateFormat="DD-MM-YYYY"
                  inputLabel={`${t("resource.profile.reattempt_on")}`}
                  isLabelFloating={false}
                  excludeDates={excludeDates}
                  required={true}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  handleShowCalendarPopup={handleShowCalendarPopup}
                />
              )}
            />
          </div>
          <div className={styles.addressContainer}>
            <div className={styles.addressDetailsCard}>
              <div className={styles.addressDetailsHeader}>
                <div>{t("resource.profile.address_details")}</div>
                {!editMode && (
                  <div
                    onClick={() => setEditMode(true)}
                    className={styles.editIconStyles}
                  >
                    <EditIcon />
                  </div>
                )}
              </div>
              {editMode ? (
                <div className={styles.addressEditContainer}>
                  <div className={styles.addressDetailsGrid}>
                    <AddressFormInputs
                      formSchema={addressFormSchema}
                      control={control}
                      formMethods={formMethods}
                      onChange={handleFormChange}
                      addressItem={inputsAddresItem}
                      {...(isMobile && {
                        customStyles: {
                          formContainer: {
                            display: "flex",
                            flexDirection: "column",
                          },
                        },
                      })}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.addressDetailsContainer}>
                  <div className={styles.adddressText}>
                    {formatAddressForDisplay(
                      shipmentDetails?.delivery_address?.display_address
                    ) || ""}
                  </div>
                  <div className={styles.mobileNumberText}>
                    {mobileAddressObject?.display_name}:{" "}
                    {shipmentDetails?.delivery_address?.phone || ""}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              paddingBottom: showCalendarPopup && isMobile ? "200px" : "0px",
            }}
          >
            {/* <FyInput
              name="additionalComments"
              label={`${t("resource.profile.additional_comments_optional")}`}
              placeholder={`${t("resource.profile.enter_remarks")}`}
              {...register("additionalComments")}
              required={false}
            /> */}
            <Controller
              name="additionalComments"
              control={control}
              rules={{
                maxLength: {
                  value: 250,
                  message: t("resource.profile.max_characters_250"),
                },
              }}
              render={({ field, fieldState }) => {
                const remaining = 250 - (field.value?.length || 0);

                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <FyInput
                      {...field}
                      name="additionalComments"
                      label={t("resource.profile.additional_comments_optional")}
                      placeholder={t("resource.profile.enter_remarks")}
                      required={false}
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      maxLength={250}
                      onChange={(e) => {
                        let value = e.target.value;
                        // If pasted or typed beyond 250, trim it
                        if (value.length > 250) {
                          value = value.slice(0, 250);
                        }

                        field.onChange(value);
                      }}
                    />
                    <div
                      className={`${styles.addCommentsLimit} ${remaining > 0 ? styles.allowedColor : styles.notAllowedColor}`}
                    >
                      {remaining}/250
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit">REQUEST REATTEMPT</button>
        </div>
      </form>
    </Modal>
  );
}

export default ReattemptShipmentModal;
