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

const RbiSecureGuideline = ({ updateRbiGuidelineCard }) => {
  const securedCardRbiGuidelines = (value) => {
    updateRbiGuidelineCard(value);
  };

  return (
    <div className={styles["secure-card-guideline"]}>
      <p className={styles["card-description"]}>
        Tokenization is the safest way to secure the card. It provides the below
        advantages.
      </p>
      <div className={styles["secure-details"]}>
        <div className="secure-payment">
          <img src="/public/assets/credit-card.svg" alt="rbi-icon" />
          <div className="secure-payment-text">Secured payments method</div>
        </div>
        <div className="quick-payment secure-payment">
          <SvgWrapper svgSrc="creditCard" className={styles.typeIcon} />
          <div className={styles["secure-payment-text"]}>
            Quick payments without entering card details frequently
          </div>
        </div>
      </div>
      <p className={styles["guideline-detail"]}>
        As stated by RBI, card data will be tokenised, and safeguarded with card
        networks assuring card details are not being exposed.
      </p>
      <div className={styles["secure-my-card"]}>
        <button
          className={styles["button-text"]}
          onClick={() => securedCardRbiGuidelines(true)}
        >
          Yes, secure my card
        </button>
      </div>
      <button
        className={styles["may-be-later"]}
        onClick={() => securedCardRbiGuidelines(false)}
      >
        Maybe later
      </button>
    </div>
  );
};

export default RbiSecureGuideline;
