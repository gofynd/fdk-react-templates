# FySwitch Component

The `FySwitch` component is a boolean toggle switch, used for options such as "GST Registered?" where a checkbox would be visually inappropriate.

## Props

| Prop                | Type                                          | Default Value | Description                                                                 |
| ------------------- | --------------------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| `checked`           | boolean                                       | `false`         | Whether the switch is on.                                                    |
| `onChange`          | `function(boolean, Event): void`              | `() => {}`      | Callback invoked with the new checked value.                                |
| `label`             | ReactNode                                     | `""`            | Label rendered next to the switch.                                          |
| `labelPosition`     | string                                        | `"end"`         | Position of the label relative to the switch, either `"start"` or `"end"`.  |
| `disabled`          | boolean                                       | `false`         | If true, the switch cannot be interacted with.                              |
| `size`              | string                                        | `"medium"`      | The size of the switch, either `"small"` or `"medium"`.                     |
| `name`              | string                                        | `""`            | The name attribute for the underlying checkbox input.                       |
| `id`                | string                                        | auto-generated  | The id attribute for the underlying checkbox input.                         |
| `className`         | string                                        | `""`            | Optional custom CSS class(es) to apply to the switch track.                 |
| `containerClassName`| string                                        | `""`            | Optional custom CSS class(es) to apply to the wrapping container.           |
| `labelClassName`    | string                                        | `""`            | Optional custom CSS class(es) to apply to the label element.                |
| `...props`          | React.InputHTMLAttributes<HTMLInputElement>   | `undefined`     | Additional props to be passed to the underlying input element.              |

## Example Usage

```jsx
import FySwitch from "fdk-react-templates/components/core/fy-switch/fy-switch";
import "fdk-react-templates/components/core/fy-switch/fy-switch.css";

<FySwitch
  checked={gstRegistered}
  onChange={(checked) => setGstRegistered(checked)}
  label="GST Registered?"
/>
```

## Contact

For any questions or feedback, please contact Prashant Pandey at [prashantpandey@gofynd.com](mailto:prashantpandey@gofynd.com).
