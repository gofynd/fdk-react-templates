# BeneficiaryList Component

The `BeneficiaryList` component is designed to display a list of beneficiaries, rendering a `BeneficiaryItem` for each one. It receives a list of beneficiaries, a selected beneficiary, and a change handler for managing interactions.

## Features

- **Rendering Beneficiaries**: Dynamically renders a list of beneficiaries by mapping through the `beneficiaries` array.
- **Selection Handling**: Accepts a `selectedBeneficiary` prop and highlights the selected item.
- **Modular Styling**: Utilizes CSS Modules for styling the component and individual beneficiary items.

## Props

| Prop Name            | Prop Type   | Default Value | Description                                                    |
|----------------------|-------------|---------------|----------------------------------------------------------------|
| `beneficiaries`       | array       | N/A           | A list of beneficiaries to be displayed.                      |
| `selectedBeneficiary` | object      | N/A           | The currently selected beneficiary. Used for highlighting.     |
| `change`              | function    | N/A           | A function to handle beneficiary selection.                    |

## Example Usage

```jsx
import React from "react";
import BeneficiaryList from "fdk-react-templates/components/beneficiary-list/beneficiary-list";
import "fdk-react-templates/components/beneficiary-list/beneficiary-list.css";

const App = () => {
  const beneficiaries = [
    { beneficiary_id: 1, title: "John Doe", transfer_mode: "bank", account_holder: "John", account_no: "12345", bank_name: "XYZ Bank" },
    { beneficiary_id: 2, title: "Jane Doe", transfer_mode: "cash", subtitle: "Cash Payment" },
  ];

  const selectedBeneficiary = beneficiaries[0];

  const handleBeneficiaryChange = (beneficiary) => {
    console.log("Selected beneficiary:", beneficiary);
  };

  return (
    <div>
      <BeneficiaryList
        beneficiaries={beneficiaries}
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