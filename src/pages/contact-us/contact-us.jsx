import React, { useState, useMemo, useEffect } from "react";
import * as styles from "./contact-us.less";
import FyInput from "../../components/core/fy-input/fy-input";
import { Controller, useForm } from "react-hook-form";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import FyButton from "../../components/core/fy-button/fy-button";
import FyImage from "../../components/core/fy-image/fy-image";
import { useGlobalTranslation } from "fdk-core/utils";

function ContactSupport({
  contactInfo = "",
  supportInfo = "",
  handleSubmitForm = () => {},
  pageConfig = "",
  SocailMedia = () => <></>,
  appInfo,
  prefillData: { values = {}, errors: prefillErrors = {} } = {},
}) {
  const { t } = useGlobalTranslation("translation");
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: (values?.name || "").replace(/^"|"$/g, ""),
      phone: (values?.phone || "").replace(/^"|"$/g, ""),
      email: (values?.email || "").replace(/^"|"$/g, ""),
      comment: (values?.comment || "").replace(/^"|"$/g, ""),
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (values?.comment) {
      setText(values.comment.replace(/^"|"$/g, ""));
    }
  }, [values?.comment]);

  useEffect(() => {
    if (prefillErrors?.name) {
      setError("name", {
        type: "manual",
        message: t("resource.contact_us.please_enter_a_valid_name"),
      });
    }
    if (prefillErrors?.phone) {
      setError("phone", {
        type: "manual",
        message: t("resource.contact_us.please_enter_a_valid_phone_number"),
      });
    }
    if (prefillErrors?.email) {
      setError("email", {
        type: "manual",
        message: t("resource.contact_us.please_enter_a_valid_email_address"),
      });
    }
    if (prefillErrors?.comment) {
      const isTooLong = values?.comment?.length > 500;
      setError("comment", {
        type: "manual",
        message: isTooLong
          ? t("resource.contact_us.entered_msg_greater_than_500_char")
          : t("resource.contact_us.please_enter_your_comment"),
      });
    }
  }, [prefillErrors, setError, t]);

  const [focusedInput, setFocusedInput] = useState(null);
  const [text, setText] = useState("");

  const inputFields = [
    {
      type: "text",
      label: t("resource.common.full_name"),
      name: "name",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.name,
      pattern: {
        value: /^[a-zA-Z0-9 ]+$/,
        message: t("resource.contact_us.please_enter_a_valid_name"),
      },
      errorMessage: t("resource.contact_us.please_enter_your_name"),
    },
    {
      type: "tel",
      label: t("resource.common.phone_number"),
      name: "phone",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.phone,
      pattern: {
        value: /^\+?[0-9\s]{1,15}$/,
        message: t("resource.contact_us.please_enter_a_valid_phone_number"),
      },
      errorMessage: t("resource.contact_us.please_enter_your_phone_number"),
    },
    {
      type: "text",
      label: t("resource.common.email"),
      name: "email",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.email,
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,6}){1,2}$/,
        message: t("resource.contact_us.please_enter_a_valid_email_address"),
      },
      errorMessage: t("resource.contact_us.please_enter_your_email_address"),
    },
    {
      type: "textarea",
      label: t("resource.contact_us.message"),
      name: "comment",
      showAsterik: false,
      required: false,
      error: errors?.comment,
      pattern: null,
      errorMessage: t("resource.contact_us.please_enter_your_comment"),
      multiline: true,
    },
  ];

  const contact = supportInfo?.contact?.phone?.phone[0];
  const email = supportInfo?.contact?.email?.email[0]?.value;

  const overlayStyles = {
    "--overlay-opacity": `${pageConfig?.opacity}%`,
  };

  const submitForm = async (data) => {
    try {
      await handleSubmitForm(data);
      reset({
        name: "",
        phone: "",
        email: "",
        comment: "",
      });
      setText("");
    } catch (err) {
      console.error("Form submission failed", err);
    }
  };
  const showAddress =
    typeof pageConfig?.show_address === "boolean"
      ? pageConfig.show_address
      : true;

  const showPhone =
    typeof pageConfig?.show_phone === "boolean" ? pageConfig?.show_phone : true;

  const showEmail =
    typeof pageConfig?.show_email === "boolean" ? pageConfig?.show_email : true;
  const showWorkingHours =
    typeof pageConfig?.show_working_hours === "boolean"
      ? pageConfig?.show_working_hours
      : true;
  const showIcons =
    typeof pageConfig?.show_icons === "boolean" ? pageConfig?.show_icons : true;
  const showDescription =
    typeof pageConfig?.show_description === "boolean"
      ? pageConfig?.show_description
      : true;

  const showListItems = useMemo(
    () =>
      (showAddress && contactInfo?.address?.address_line?.[0]?.length > 0) ||
      (showPhone && contact?.number) ||
      (showEmail && email?.length) ||
      (showIcons && contactInfo?.social_links) ||
      (showWorkingHours && contactInfo?.support?.timing),
    [
      showAddress,
      showPhone,
      showEmail,
      showIcons,
      showWorkingHours,
      contactInfo,
      supportInfo,
    ]
  );

  return (
    <div className={`basePageContainer margin0auto`}>
      <div
        className={` ${styles.contactUs_mainContainer} ${pageConfig?.align_image === "left" && styles.invert}`}
      >
        <div
          className={`${styles.contact_container} ${pageConfig?.image_desktop ? styles.onImageContainer : ""} ${pageConfig?.align_description === "above_footer" ? styles.reducedBottomGap : ""}`}
        >
          <div className={`${styles.flex_item}`}>
            <div>
              <h1 className={`fontHeader ${styles.showDesktop}`}>
                {t("resource.common.contact_us")}
              </h1>
              {appInfo?.description?.length > 0 &&
                showDescription &&
                pageConfig?.align_description !== "above_footer" && (
                  <p
                    className={`${styles.description}  ${styles.showDesktop} fontBody`}
                  >
                    {appInfo?.description}
                  </p>
                )}
            </div>
            {showListItems && (
              <div className={styles.listItems}>
                {showAddress &&
                  contactInfo?.address?.address_line?.[0]?.length > 0 && (
                    <div className={`${styles.item} fontBody b1`}>
                      <div>
                        <SvgWrapper svgSrc="location" />
                      </div>
                      <div>
                        {contactInfo?.address?.address_line?.map((el, i) => (
                          <span key={i}>{el}&nbsp;</span>
                        ))}
                        <span>{` ${contactInfo?.address?.city || ""}`}</span>
                        <span>
                          &nbsp;{`${contactInfo?.address?.country || ""}`}&nbsp;
                        </span>
                        <span>{` ${contactInfo?.address?.pincode || ""}`}</span>
                      </div>
                    </div>
                  )}
                {showPhone && contact?.number && (
                  <div className={`${styles.item} fontBody b1`}>
                    <SvgWrapper svgSrc="callSupport" />
                    <a href={`tel:${contact?.number}`}>
                      {contact?.code}-{contact?.number}
                    </a>
                  </div>
                )}
                {showEmail && email?.length && (
                  <div className={`${styles.item} fontBody b1`}>
                    <SvgWrapper svgSrc="contactEmail" />
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                )}
                {showWorkingHours && contactInfo?.support?.timing && (
                  <div className={`${styles.item} fontBody b1`}>
                    <SvgWrapper svgSrc="timer" />
                    {contactInfo?.support?.timing}
                  </div>
                )}
                {showIcons && contactInfo?.social_links && (
                  <SocailMedia
                    social_links={contactInfo?.social_links}
                    customClassName={styles.iconSpacing}
                  />
                )}
              </div>
            )}
          </div>
          <div className={styles.flex_item}>
            <div>
              <h3 className={`${styles.showMobile} fontHeader`}>
                {t("resource.common.contact_us")}
              </h3>
              {appInfo?.description?.length > 0 &&
                showDescription &&
                pageConfig?.align_description !== "above_footer" && (
                  <p
                    className={`${styles.description} ${styles.showMobile} fontBody`}
                  >
                    {appInfo?.description}
                  </p>
                )}
            </div>
            <form onSubmit={handleSubmit(submitForm)}>
              {inputFields?.map((field, index) => (
                <div className={styles.form_row} key={index}>
                  <Controller
                    name={field.name}
                    control={control}
                    rules={{
                      required: field.required,
                      pattern: field.pattern,
                      validate:
                        field.name === "comment"
                          ? (val) => {
                              if (val && val.length > 500) {
                                return t(
                                  "resource.contact_us.entered_msg_greater_than_500_char"
                                );
                              }
                              return true;
                            }
                          : undefined,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <FyInput
                        htmlFor={field.name}
                        labelClassName={styles.lableText}
                        inputClassName={`${styles.inputPlaceholder} fontBody`}
                        label={
                          focusedInput === field.name || Boolean(value)
                            ? field.label
                            : ""
                        }
                        onFocus={() => setFocusedInput(field.name)}
                        onBlur={() => setFocusedInput(null)}
                        placeholder={field.label}
                        showAsterik={field.showAsterik}
                        required={field.required}
                        labelVariant="floating"
                        type={field.type}
                        maxLength={field.type === "textarea" ? 500 : null}
                        error={errors[field.name]}
                        onInput={
                          field.type === "tel"
                            ? (e) => {
                                // Allow only numbers, space, and + for country code
                                e.target.value = e.target.value
                                  .replace(/[^+\d\s]/g, "")
                                  .slice(0, 15);
                                onChange(e);
                              }
                            : null
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(e);
                          if (field.type === "textarea") {
                            setText(val);
                          }
                        }}
                        value={value}
                        multiline={field.multiline}
                        errorMessage={
                          errors[field.name]
                            ? errors[field.name].message || field.errorMessage
                            : ""
                        }
                      />
                    )}
                  />
                  {field?.type === "textarea" && (
                    <div className={`${styles.maxChar} fontBody`}>
                      {text.length}/{500}
                    </div>
                  )}
                </div>
              ))}
              <div>
                <FyButton
                  className={`${styles.btn_submit}`}
                  variant="outlined"
                  size="large"
                  color="primary"
                  fullWidth={true}
                  type="submit"
                >
                  {t("resource.contact_us.send_message")}
                </FyButton>
              </div>
            </form>
          </div>
        </div>
        {pageConfig?.image_desktop && (
          <div className={styles.imageContainer} style={overlayStyles}>
            <FyImage
              customClass={styles.imageWrapper}
              src={pageConfig?.image_desktop}
              aspectRatio={3 / 4}
              showOverlay={true}
              overlayColor="#000000"
              overlayCustomClass={styles.overlay}
            />
          </div>
        )}
      </div>
      {appInfo?.description?.length > 0 &&
        showDescription &&
        pageConfig?.align_description === "above_footer" && (
          <div
            className={`${styles.flex_item} ${styles.descriptionMargin} ${pageConfig?.image_desktop ? styles.descriptionPaddingTop : ""}`}
          >
            <p className={`${styles.description} fontBody`}>
              {appInfo?.description}
            </p>
          </div>
        )}
    </div>
  );
}

export default ContactSupport;
