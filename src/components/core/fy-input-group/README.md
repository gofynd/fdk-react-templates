# FyInputGroup Component

The FyInputGroup is a versatile input group component that can render either a group of radio buttons or checkboxes.This component supports various styles, error handling, and label configurations, and is built using React with CSS modules for styling.

## Props

| Prop                  | Type                                            | Default Value       | Description                                                                                       |
|---------------------|------------|--------------------------------------|---------------------------------------------------------------------------------------------------|
| `options`             | Array<{ display: string, key: any }>            | `[]`                 | An array of objects representing the options for the input group. Each object must have a `display` (display text) and `key` (input value).   |
| `label`               | string                                          | `""`                 | The text label displayed above or beside the input field.   |
| `type`                | sring                                           | `"radio"`            | The type of input, either "radio" or "checkbox". Determines the behavior and appearance of the input group. |
| `name`                | string                                          | `""`                 | The name attribute for the input elements, useful for grouping them in a form.
| `inputClassName`      | string                                          | `undefined`          | Optional custom CSS class(es) to apply to the input element.  |
| `containerClassName`  | string                                          | `undefined`          | Optional custom CSS class(es) to apply to the container element that wraps the label and input.                                   |
| `labelClassName`      | string                                          | `false`              | Optional custom CSS class(es) to apply to the label element.
| `required`            | booleam                                         | `false`              | If true, the input group is marked as required.
| `showAsterik`         | boolean                                         | `true`               | If true, an asterisk (*) will be displayed next to the label to indicate that the field is required.
| `disabled`            | boolean                                         | `true`               | if true, input group will be disabled.
| `error`               | object                                          | `undefined`          | The input group will display an error state, typically with an error message.
| `value`               | string                                          | `"Invalid input"`    | The currently selected value for the input group. Used in controlled components to manage the selected state externally.
| `onChange`            | function(any): void                             | `(value) => {}`      | A callback function that is triggered when the selected value changes. Receives the newly selected value as an argument.

## Example Usage

```jsx
import FyInputGroup from "fdk-react-templates/components/core/fy-input-group/fy-input-group";
import "fdk-react-templates/components/core/fy-input-group/fy-input-group.css";

<FyInputGroup
  label="Select Option"
  options={[
    {
      display: "Option 1",
      key: "option 1",
    },
    {
      display: "Option 2",
      key: "option 2",
    },
    {
      display: "Option 3",
      key: "option 3",
    },
  ]}
  name="option"
/>
```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

