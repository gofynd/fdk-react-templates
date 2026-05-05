/**
 * A React functional component that displays RBI guidelines for secured card payments.
 * It provides information about the benefits of tokenization for card security.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.updateRbiGuidelineCard - A function to update the RBI guideline card.
 *
 * @returns {JSX.Element} A JSX element that renders the RBI guidelines for secured card payments.
 *
 */

import React from "react";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import * as styles from "./rbi-guideline.less";
import { useGlobalTranslation } from "fdk-core/utils";

const RbiSecureGuideline = ({ updateRbiGuidelineCard }) => {
  const { t } = useGlobalTranslation("translation");
  const securedCardRbiGuidelines = (value) => {
    updateRbiGuidelineCard(value);
  };

  return (
    <div className={styles["secure-card-guideline"]}>
      <p className={styles["card-description"]}>
        {t("resource.checkout.card_tokenization_benefits")}
      </p>
      <div className={styles["secure-details"]}>
        <div className="secure-payment">
          <img src="/public/assets/credit-card.svg" alt={t("resource.checkout.rbi_icon")} />
          <div className="secure-payment-text">{t("resource.checkout.secured_payment_method")}</div>
        </div>
        <div className="quick-payment secure-payment">
          <SvgWrapper svgSrc="creditCard" className={styles.typeIcon} />
          <div className={styles["secure-payment-text"]}>
            {t("resource.checkout.quick_payment_no_card_details")}
          </div>
        </div>
      </div>
      <p className={styles["guideline-detail"]}>
        {t("resource.checkout.rbi_card_data_tokenization_notice")}
      </p>
      <div className={styles["secure-my-card"]}>
        <button
          className={styles["button-text"]}
          onClick={() => securedCardRbiGuidelines(true)}
        >
          {t("resource.checkout.secure_my_card_yes")}
        </button>
      </div>
      <button
        className={styles["may-be-later"]}
        onClick={() => securedCardRbiGuidelines(false)}
      >
        {t("resource.checkout.maybe_later")}
      </button>
    </div>
  );
};

export default RbiSecureGuideline;
