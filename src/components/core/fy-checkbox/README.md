# FyCheckbox Component

The `FyCheckbox` component is a single, standalone boolean checkbox atom. Unlike `FyInputGroup` (which manages an array of selected keys across a set of options), `FyCheckbox` controls exactly one boolean value - suited for single acceptance/toggle checkboxes such as "Same as business address" or "I accept the Terms & Conditions".

## Props

| Prop                | Type                                          | Default Value | Description                                                                                     |
| ------------------- | --------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| `checked`           | boolean                                       | `false`         | Whether the checkbox is checked.                                                                 |
| `onChange`          | `function(boolean, Event): void`              | `() => {}`      | Callback invoked with the new checked value.                                                     |
| `label`             | ReactNode                                     | `""`            | Label rendered next to the checkbox.                                                             |
| `required`          | boolean                                       | `false`         | If true, an asterisk is appended to the label.                                                   |
| `disabled`          | boolean                                       | `false`         | If true, the checkbox cannot be interacted with.                                                 |
| `error`             | object \| string                              | `undefined`     | Error state; if truthy, renders `errorMessage` (or `error.message`) below the checkbox.           |
| `errorMessage`      | string                                        | `""`            | Explicit error message to render when `error` is truthy.                                         |
| `name`              | string                                        | `""`            | The name attribute for the input element.                                                        |
| `id`                | string                                        | auto-generated  | The id attribute for the input element (also used to associate the label).                       |
| `className`         | string                                        | `""`            | Optional custom CSS class(es) to apply to the input element.                                     |
| `containerClassName`| string                                        | `""`            | Optional custom CSS class(es) to apply to the wrapping container.                                 |
| `labelClassName`    | string                                        | `""`            | Optional custom CSS class(es) to apply to the label element.                                      |
| `...props`          | React.InputHTMLAttributes<HTMLInputElement>   | `undefined`     | Additional props to be passed to the input element.                                               |

## Example Usage

```jsx
import FyCheckbox from "fdk-react-templates/components/core/fy-checkbox/fy-checkbox";
import "fdk-react-templates/components/core/fy-checkbox/fy-checkbox.css";

<FyCheckbox
  checked={sameAsBusinessAddress}
  onChange={(checked) => setSameAsBusinessAddress(checked)}
  label="Same as business address"
/>
```

## Contact

For any questions or feedback, please contact Prashant Pandey at [prashantpandey@gofynd.com](mailto:prashantpandey@gofynd.com).
