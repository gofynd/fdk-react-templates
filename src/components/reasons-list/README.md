# Reasons List Component

The `ReasonsList` component renders a list of `ReasonItem` components, sorted by priority. It allows users to select a reason and input additional details for each reason.

## Features
- **Sorted reasons**: The list of reasons is sorted based on priority.
- **Render each reason**: Each reason is rendered as a `ReasonItem` component, allowing for selection and additional input.
- **Dynamic data handling**: The component allows passing of selected reason and text area data to the parent component.

## Props

| Prop Name         | Prop Type      | Default Value | Description                                                                 |
|-------------------|----------------|---------------|-----------------------------------------------------------------------------|
| `reasons`         | `array`        | `[]`          | Array of reasons to be displayed in the list. Each reason object should contain `id`, `display_name`, and `priority`. |
| `selectedReason`  | `object`       | `null`        | The currently selected reason.                                               |
| `change`          | `function`     | `null`        | Callback function to update the selected reason when a reason is clicked.   |
| `otherReason`     | `function`     | `null`        | Callback function to handle the additional input text when the text area is blurred. |

## Example Usage

```jsx
import React, { useState } from "react";
import ReasonsList from "fdk-react-templates/components/reasons-list/reasons-list";
import "fdk-react-templates/components/reasons-list/reasons-list.css";

const App = () => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReasonText, setOtherReasonText] = useState("");

  const changeReason = (reason) => {
    setSelectedReason(reason);
  };

  const handleOtherReason = (text) => {
    setOtherReasonText(text);
  };

  const reasonData = [
    { id: 1, display_name: "Reason 1", priority: 2, meta: { show_text_area: true } },
    { id: 2, display_name: "Reason 2", priority: 1, meta: { show_text_area: false } },
    { id: 3, display_name: "Reason 3", priority: 3, meta: { show_text_area: true } },
  ];

  return (
    <div>
      <ReasonsList
        reasons={reasonData}
        selectedReason={selectedReason}
        change={changeReason}
        otherReason={handleOtherReason}
      />
      {selectedReason && <p>You selected: {selectedReason.display_name}</p>}
    </div>
  );
};

export default App;

```
## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).