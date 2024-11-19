# BeneficiaryItem Component

The `BeneficiaryItem` component is used to display individual beneficiary details, including their title, subtitle, and transfer mode. It also manages the selection state, displaying a selected state indicator, and allows the user to select a beneficiary by clicking on an icon.

## Features

- **Title and Subtitle**: Displays beneficiary title and subtitle, with special handling for beneficiaries with a bank transfer mode.
- **Selection Handling**: Renders a selected state indicator when the beneficiary is selected.
- **Conditional Rendering**: Displays different content based on the beneficiary's transfer mode (`bank` or other).
- **SvgWrapper Component**: Utilizes the `SvgWrapper` component to display icons for selection states.

## Props

| Prop Name              | Prop Type   | Default Value | Description                                                                 |
|------------------------|-------------|---------------|-----------------------------------------------------------------------------|
| `beneficiary`           | object      | N/A           | The beneficiary object containing information like `title`, `subtitle`, etc.|
| `selectedBeneficiary`   | object      | N/A           | The currently selected beneficiary, used to highlight the selected item.    |
| `change`                | function    | N/A           | A function to handle beneficiary selection changes.                         |

## Example Usage

```jsx
import React from "react";
import BeneficiaryItem from "fdk-react-templates/components/beneficiary-list/beneficiary-list-item/beneficiary-list-item";
import "fdk-react-templates/components/beneficiary-list/beneficiary-list-item/beneficiary-list-item.css";

const App = () => {
  const beneficiary = {
    beneficiary_id: 1,
    title: "John Doe",
    transfer_mode: "bank",
    account_holder: "John",
    account_no: "12345",
    bank_name: "XYZ Bank",
    ifsc_code: "XYZ123"
  };

  const selectedBeneficiary = beneficiary;

  const handleBeneficiaryChange = (beneficiary) => {
    console.log("Selected beneficiary:", beneficiary);
  };

  return (
    <div>
      <BeneficiaryItem
        beneficiary={beneficiary}
        selectedBeneficiary={selectedBeneficiary}
        change={handleBeneficiaryChange}
      />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).