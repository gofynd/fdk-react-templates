# LocationModal Component

The `LocationModal` component is used to allow users to enter a pincode to check product availability and delivery options based on their location. It includes an input field for the pincode, a submit button, and an option to use the current location.

## Features
- **Pincode Input**: Allows users to enter a 6-digit pincode to check product availability.
- **Current Location**: Option to use the user's current location to check availability.
- **Form Validation**: Validates the pincode as a 6-digit number using react-hook-form.
- **Modal Dialog**: Displayed as a modal window that can be closed by the user.

## Props

| Prop Name                | Prop Type      | Default Value | Description                                                                 |
|--------------------------|----------------|---------------|-----------------------------------------------------------------------------|
| `isOpen`                 | `boolean`      | `true`        | Controls whether the modal is visible or hidden.                             |
| `pincode`                | `string`       | `""`          | The initial pincode value.                                                   |
| `onClose`                | `function`     | `() => {}`    | Callback function called when the modal is closed.                          |
| `onSubmit`               | `function`     | `() => {}`    | Callback function called when the form is submitted with valid data.       |
| `onCurrentLocationClick` | `function`     | `() => {}`    | Callback function called when the "Use my current location" button is clicked. |

## Example Usage

```jsx
import React, { useState } from "react";
import LocationModal from "fdk-react-templates/components/location-modal/location-modal";
import "fdk-react-templates/components/location-modal/location-modal.css";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data) => {
    console.log("Pincode submitted:", data.pincode);
  };

  const handleCurrentLocation = () => {
    console.log("Using current location");
  };

  return (
    <LocationModal
      isOpen={isModalOpen}
      pincode="110001"
      onClose={handleCloseModal}
      onSubmit={handleSubmit}
      onCurrentLocationClick={handleCurrentLocation}
    />
  );
};

export default App;

```
## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).
