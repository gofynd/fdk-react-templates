import React, { useState, useEffect } from "react";
import * as styles from "./contact-us.less";
import FyInput from "../../components/core/fy-input/fy-input";
import { Controller, useForm } from "react-hook-form";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import FyButton from "../../components/core/fy-button/fy-button";
import FyImage from "../../components/core/fy-image/fy-image";
import { isRunningOnClient } from "../../helper/utils";
import { detectMobileWidth } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function ContactSupport({
  contactInfo = "",
  supportInfo = "",
  handleSubmitForm = () => { },
  pageConfig = "",
  SocailMedia = () => <></>,
}) {
  const { t } = useGlobalTranslation("translation");
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      comment: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (isRunningOnClient()) {
      setIsMobile(detectMobileWidth());
      setIsLoading(false);
    }
  }, []);

  const inputFields = [
    {
      type: "text",
      label: t("resource.common.full_name"),
      name: "name",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.name,
      pattern: null,
      errorMessage: t("resource.contact_us.please_enter_your_name"),
    },
    {
      type: "number",
      label: t("resource.common.phone_number"),
      name: "phone",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.phone,
      pattern: {
        value: /^[0-9]{10}$/,
        message: t("resource.common.invalid_mobile_number"),
      },
      errorMessage: errors?.phone?.message || t("resource.common.invalid_mobile_number"),
    },
    {
      type: "email",
      label: t("resource.common.email"),
      name: "email",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.email,
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: t("resource.common.invalid_email_address"),
      },
      errorMessage: errors?.email?.message || t("resource.common.invalid_email_address"),
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
    handleSubmitForm(data);
    reset();
    setText("");
  };

  return (
    <div
      className={`${styles.basePageContainer} ${styles.contactUs_mainContainer} ${pageConfig?.align_image === "left" && styles.invert}`}
    >
      {!isLoading && (
        <div
          className={`${styles.contact_container} ${!isLoading && !isMobile && pageConfig?.image_desktop && styles.onImageContainer}`}
        >
          <div className={`${styles.flex_item}`}>
            <h3 className={styles.fontHeader}>{t("resource.common.contact_us")}</h3>
            <div className={styles.listItems}>
              {pageConfig?.show_address &&
                contactInfo?.address?.address_line[0].length > 0 && (
                  <div className={`${styles.item} fontBody b1`}>
                    <div>
                      <SvgWrapper svgSrc="location" />
                    </div>
                    <div>
                      {contactInfo?.address?.address_line?.map((el, i) => (
                        <span key={i}>{el}</span>
                      ))}
                      {contactInfo?.address?.city && <span>{` ${contactInfo?.address?.city}`}</span>}
                      {contactInfo?.address?.pincode && <span>,{` ${contactInfo?.address?.pincode}`}</span>}
                    </div>
                  </div>
                )}
              {pageConfig?.show_phone && contact?.number && (
                <div className={`${styles.item} fontBody b1`}>
                  <SvgWrapper svgSrc="callSupport" />
                  <FDKLink to={`tel:${contact?.number}`}>
                    {contact?.code}-{contact?.number}
                  </FDKLink>
                </div>
              )}
              {pageConfig?.show_email && email?.length && (
                <div className={`${styles.item} fontBody b1`}>
                  <SvgWrapper svgSrc="contactEmail" />
                  <FDKLink to={`mailto:${email}`}>{email}</FDKLink>
                </div>
              )}
              {pageConfig?.show_working_hours &&
                contactInfo?.support?.timing && (
                  <div className={`${styles.item} fontBody b1`}>
                    <SvgWrapper svgSrc="timer" />
                    {contactInfo?.support?.timing}
                  </div>
                )}
              {pageConfig?.show_icons && contactInfo?.social_links && (
                <SocailMedia social_links={contactInfo?.social_links} />
              )}
            </div>
          </div>
          <div className={styles.flex_item}>
            <form onSubmit={handleSubmit(submitForm)}>
              {inputFields?.map((field, index) => (
                <div className={styles.form_row} key={index}>
                  <Controller
                    name={field.name}
                    control={control}
                    rules={{
                      required: field.required,
                      pattern: field.pattern,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <FyInput
                        htmlFor={field.name}
                        labelClassName={styles.lableText}
                        inputClassName={`${styles.inputPlaceholder} fontBody`}
                        label={focusedInput === field.name ? field.label : ""}
                        onFocus={() => setFocusedInput(field.name)}
                        onBlur={() => setFocusedInput(null)}
                        placeholder={field.label}
                        showAsterik={field.showAsterik}
                        required={field.required}
                        labelVariant="floating"
                        type={field.type}
                        maxLength={field.type === "textarea" ? 500 : null}
                        error={errors[field.name]}
                        onChange={(e) => {
                          onChange(e);
                          if (field?.type === "textarea") {
                            setText(e.target.value);
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
      )}
      {!isLoading && !isMobile && pageConfig?.image_desktop && (
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
  );
}

export default ContactSupport;
