# FyInput Component

The `FyInput` component is a versatile and customizable input for React applications. It supports various styles, sizes, and additional elements such as label and error messages.

## Props

| Prop                  | Type                                            | Default Value       | Description                                                                                       |
|---------------------|------------|--------------------------------------|---------------------------------------------------------------------------------------------------|
| `label`               | string                                          | `""`                 | The text label displayed above or beside the input field.   |
| `labelVariant`        | string                                          | `"normal`            | The style variant of the label. Options might include `"normal"`, `"floating"`.  |
| `inputVariant`        | string`                                         | `"outlined"`         | The style variant of the input field. Common options could be `"outlined"`, `"no-border"`, `"underline"`.  |
| `inputClassName`      | string                                          | `undefined`          | Optional custom CSS class(es) to apply to the input element.  |
| `containerClassName`  | string                                          | `undefined`          | Optional custom CSS class(es) to apply to the container element that wraps the label and input.                                   |
| `labelClassName`      | string                                          | `false`              | Optional custom CSS class(es) to apply to the label element.
| `showAsterik`         | boolean                                         | `true`               | If true, an asterisk (*) will be displayed next to the label to indicate that the field is required.
| `multiline`           | boolean                                         | `false`              | If true, text area element is rendered.
| `id`                  | string                                          | `undefined`          | The ID to be applied to the input element, useful for linking labels and inputs or for testing purposes.
| `error`               | boolean                                         | `false`              | If true, the input field will display an error state.
| `errorMessage`        | string                                          | `"Invalid input"`    | The message displayed below the input field when `error` is true.
| `...props`            | React.InputHTMLAttributes<HTMLInputElement>     | `undefined`           | Additional props that are passed to the underlying input element. These can include standard HTML input attributes such as `type`, `value`, `onChange`, `placeholder`, and more.

## Example Usage

```jsx
import FyInput from "fdk-react-templates/components/core/fy-input/fy-input";
import "fdk-react-templates/components/core/fy-input/fy-input.css";

<FyInput
  label="Email"
  labelVariant="floating"
  inputVariant="outlined"
  inputClassName="custom-input"
  containerClassName="custom-container"
  labelClassName="custom-label"
  showAsterik={false}
  id="email-input"
/>
```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

