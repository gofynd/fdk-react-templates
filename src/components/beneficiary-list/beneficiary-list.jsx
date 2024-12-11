/**
 * BeneficiaryList is a React functional component that renders a list of beneficiaries.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.beneficiaries - An array of beneficiary objects to be displayed.
 * @param {Object} props.selectedBeneficiary - The currently selected beneficiary object.
 * @param {Function} props.change - A callback function to handle changes in the selected beneficiary.
 *
 * @returns {JSX.Element} A JSX element representing the list of beneficiaries.
 */

import React from "react";
import * as styles from "./beneficiary-list.less";
import BeneficiaryItem from "./beneficiary-list-item/beneficiary-list-item";

function BeneficiaryList({ beneficiaries, selectedBeneficiary, change }) {
  return (
    <div>
      {beneficiaries?.map((item, index) => (
        <BeneficiaryItem
          key={index}
          className={`${styles.beneficiaryItem}`}
          selectedBeneficiary={selectedBeneficiary}
          beneficiary={item}
          change={change}
        ></BeneficiaryItem>
      ))}
    </div>
  );
}

export default BeneficiaryList;
