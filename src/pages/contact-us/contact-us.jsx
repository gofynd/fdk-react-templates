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

function ContactSupport({
  contactInfo = "",
  supportInfo = "",
  handleSubmitForm = () => {},
  pageConfig = "",
  SocailMedia = () => <></>,
}) {
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

  const [focusedInput, setFocusedInput] = useState(null);
  const [text, setText] = useState("");

  const inputFields = [
    {
      type: "text",
      label: "Full Name",
      name: "name",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.name,
      pattern: {
        value: /^[a-zA-Z0-9 ]+$/,
        message: "Please enter a valid name",
      },
      errorMessage: "Please enter your name",
    },
    {
      type: "number",
      label: "Phone Number",
      name: "phone",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.phone,
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Please enter a valid phone number",
      },
      errorMessage: "Please enter your phone number",
    },
    {
      type: "text",
      label: "Email",
      name: "email",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.email,
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please enter a valid email address",
      },
      errorMessage: "Please enter your email address",
    },
    {
      type: "textarea",
      label: "Message",
      name: "comment",
      showAsterik: false,
      required: false,
      error: errors?.comment,
      pattern: null,
      errorMessage: "Please enter your comment",
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

  return (
    <div
      className={`${styles.basePageContainer} ${styles.contactUs_mainContainer} ${pageConfig?.align_image === "left" && styles.invert}`}
    >
      <div
        className={`${styles.contact_container} ${pageConfig?.image_desktop ? styles.onImageContainer : ""}`}
      >
        <div className={`${styles.flex_item}`}>
          <h3 className={styles.fontHeader}>Contact Us</h3>
          <div className={styles.listItems}>
            {showAddress &&
              contactInfo?.address?.address_line[0].length > 0 && (
                <div className={`${styles.item} fontBody b1`}>
                  <div>
                    <SvgWrapper svgSrc="location" />
                  </div>
                  <div>
                    {contactInfo?.address?.address_line?.map((el, i) => (
                      <span key={i}>{el}&nbsp;</span>
                    ))}
                    <span>{` ${contactInfo?.address?.city}`}</span>
                    <span>
                      &nbsp;{`${contactInfo?.address?.country}`}&nbsp;
                    </span>
                    <span>{` ${contactInfo?.address?.pincode}`}</span>
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
                SEND MESSAGE
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
  );
}

export default ContactSupport;
