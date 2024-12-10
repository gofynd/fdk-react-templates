# RBI Guideline Component

The `RbiGuideline` component provides a guideline for securing a credit card through tokenization, explaining its benefits and allowing users to opt-in for card tokenization.

## Features
- **RBI guidelines**: Displays a description of RBI guidelines related to card tokenization.
- **Secure payment methods**: Highlights the benefits of tokenization, such as secured payments and quick payment options.
- **User action**: Provides buttons for users to choose whether to secure their card or opt for tokenization at a later time.

## Props

| Prop Name                | Prop Type      | Default Value | Description                                                                 |
|--------------------------|----------------|---------------|-----------------------------------------------------------------------------|
| `updateRbiGuidelineCard` | `function`     | `null`        | Callback function to update the status of the RBI guideline card.           |

## Example Usage

```jsx
import React, { useState } from "react";
import RbiGuideline from "fdk-react-templates/components/rbi-guideline/rbi-guideline";
import "fdk-react-templates/components/rbi-guideline/rbi-guideline.css";

const App = () => {
  const [isCardSecured, setIsCardSecured] = useState(false);

  const updateRbiGuidelineCard = (value) => {
    setIsCardSecured(value);
  };

  return (
    <div>
      <RbiGuideline updateRbiGuidelineCard={updateRbiGuidelineCard} />
      {isCardSecured && <p>Your card is now secured with tokenization.</p>}
    </div>
  );
};

export default App;

```
## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).