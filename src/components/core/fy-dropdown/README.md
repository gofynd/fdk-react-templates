# `FyDropdown` Component

The `FyDropdown` component is a customizable dropdown menu for React applications, supporting label customization, error messages, and flexible dropdown behavior.

## Props

| Prop                  | Type                                            | Default Value       | Description                                                                                       |
|---------------------|------------|--------------------------------------|---------------------------------------------------------------------------------------------------|
| `options`             | array                                           | `[]`                 | An array of options to display in the dropdown. Each option should have key and display properties.   |
| `label`               | string                                          | `"`                  | The label text displayed above the dropdown.  |
| `placeholder`         | string                                          | `""`                 | The text shown when no option is selected.  |
| `error`               | object                                          | `undefined`          | If provided, the dropdown will display an error message. The object should contain an error message.  |
| `containerClassName`  | string                                          | `undefined`          | Optional custom CSS class(es) to apply to the container element that wraps the label and input.                                   |
| `labelClassName`      | string                                          | `undefined`          | Optional custom CSS class(es) to apply to the label element.
| `showAsterik`         | boolean                                         | `true`               | If true, an asterisk (*) will be displayed next to the label to indicate that the field is required.
| `required`            | boolean                                         | `false`              | If true, the dropdown will indicate that selecting an option is mandatory.
| `value`               | object                                          | `undefined`          | The currently selected option, should be an object with key and display properties.
| `onChange`            | function                                        | `(value) => {}`      | Callback function triggered when an option is selected.

## Example Usage

```jsx
import FyDropdown from "fdk-react-templates/components/core/fy-dropdown/fy-dropdown";
import "fdk-react-templates/components/core/fy-dropdown/fy-dropdown.css";

<FyDropdown
  name="example"
  required
  label="Choose Option"
  placeholder="Choose a option that is suitable"
  options={[
    { display: "Option 1", key: "option-1" },
    { display: "Option 2", key: "option-2" },
    { display: "Option 3", key: "option-3" },
    { display: "Option 4", key: "option-4" },
    { display: "Option 5", key: "option-5" },
    { display: "Option 6", key: "option-6" },
  ]}
/>
```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

