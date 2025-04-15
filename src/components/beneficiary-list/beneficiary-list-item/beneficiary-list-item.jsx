/**
 * Component: BeneficiaryItem
 *
 * This React functional component renders a beneficiary item with a title and subtitle.
 * It displays the beneficiary's title and account details or subtitle based on the transfer mode.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.beneficiary - The beneficiary object containing details.
 * @param {string} props.beneficiary.title - The title of the beneficiary.
 * @param {string} props.beneficiary.transfer_mode - The mode of transfer, e.g., "bank".
 * @param {string} props.beneficiary.account_holder - The name of the account holder.
 * @param {string} props.beneficiary.account_no - The account number of the beneficiary.
 * @param {string} [props.beneficiary.bank_name] - The bank name, if applicable.
 * @param {string} props.beneficiary.subtitle - The subtitle for non-bank transfer modes.
 * @param {Object} props.selectedBeneficiary - The currently selected beneficiary.
 * @param {Function} props.change - Function to handle changes in selection.
 *
 * @returns {JSX.Element} A JSX element representing the beneficiary item.
 */

import React from "react";
import * as styles from "./beneficiary-list-item.less";
import RadioIcon from "../../../assets/images/radio";
import { useGlobalTranslation } from "fdk-core/utils";

function BeneficiaryItem({ beneficiary, selectedBeneficiary, change }) {
  const { t } = useGlobalTranslation("translation");
  const isSelected =
    selectedBeneficiary?.beneficiary_id === beneficiary?.beneficiary_id;
  const getTitle = () => {
    return beneficiary.title;
  };
  const getSubtitle = () => {
    return beneficiary.transfer_mode === "bank"
      ? `${t("resource.order.account_details")}: ${beneficiary.account_holder} | ${beneficiary.account_no
      } ${beneficiary.bank_name ? `| ${beneficiary.bank_name}` : ""}`
      : beneficiary.subtitle;
  };

  return (
    <div className={`${styles.beneficiaryItem}`}>
      <div>
        <div
          className={`${styles.beneficiaryContent}`}
          onClick={() => change(beneficiary)}
        >
          <span
            className={`${styles.beneficiaryRadio} ${isSelected ? styles.checked : ""
              }`}
          >
            <RadioIcon width={16} checked={isSelected} />
          </span>
          <div className={`${styles.text}`}>
            <div className={`${styles.beneficiaryTitle} ${styles.boldxs}`}>
              {getTitle()}
            </div>
            <div
              className={`${styles.beneficiarySubtitle} ${styles.regularxs}`}
            >
              {getSubtitle()}
            </div>
            {beneficiary.transfer_mode === "bank" && beneficiary.ifsc_code && (
              <div
                className={`${styles.beneficiarySubtitle} ${styles.regularxs}`}
              >
                {t("resource.common.ifsc_code")} : {beneficiary.ifsc_code}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeneficiaryItem;
