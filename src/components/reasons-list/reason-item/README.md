# Reason Item Component

The `ReasonItem` component renders a selectable reason item with an optional text area if the reason requires additional input. It allows users to select a reason and input additional details if needed.

## Features
- **Selectable reasons**: Users can select a reason by clicking on the associated icon.
- **Optional text area**: If the selected reason requires additional input, a text area is displayed.
- **Dynamic update**: On blur, the component sends the input text to the parent component via the `otherReason` callback.

## Props

| Prop Name         | Prop Type      | Default Value | Description                                                                 |
|-------------------|----------------|---------------|-----------------------------------------------------------------------------|
| `reason`          | `object`       | `null`        | The reason object containing the reason's details.                          |
| `selectedReason`  | `object`       | `null`        | The currently selected reason.                                               |
| `change`          | `function`     | `null`        | Callback function to update the selected reason when a reason is clicked.   |
| `otherReason`     | `function`     | `null`        | Callback function to handle the additional input text when the text area is blurred. |

## Example Usage

```jsx
import React, { useState } from "react";
import ReasonItem from "fdk-react-templates/components/reasons-list/reason-item/reason-item";
import "fdk-react-templates/components/reasons-list/reason-item/reason-item.css";

const App = () => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReasonText, setOtherReasonText] = useState("");

  const changeReason = (reason) => {
    setSelectedReason(reason);
  };

  const handleOtherReason = (text) => {
    setOtherReasonText(text);
  };

  const reasonData = {
    id: 1,
    display_name: "Reason 1",
    meta: { show_text_area: true },
  };

  return (
    <div>
      <ReasonItem
        reason={reasonData}
        selectedReason={selectedReason}
        change={changeReason}
        otherReason={handleOtherReason}
      />
      {selectedReason?.id === reasonData.id && otherReasonText && (
        <p>Your reason: {otherReasonText}</p>
      )}
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).