# FyProgress Component

The `FyProgress` component is a linear, determinate progress bar - used, for example, to show per-file upload progress.

## Props

| Prop                | Type    | Default Value | Description                                                                  |
| ------------------- | ------- | -------------- | ------------------------------------------------------------------------------ |
| `value`             | number  | `0`             | Current progress value from 0 to 100.                                        |
| `size`              | string  | `"medium"`      | The size (thickness) of the progress bar, either `"small"`, `"medium"`, or `"large"`. |
| `color`             | string  | `"primary"`     | The color theme of the progress fill, such as `"primary"`, `"success"`, or `"error"`. |
| `showLabel`         | boolean | `false`         | If true, renders the numeric percentage next to the bar.                     |
| `className`         | string  | `""`            | Optional custom CSS class(es) to apply to the progress fill element.         |
| `containerClassName`| string  | `""`            | Optional custom CSS class(es) to apply to the outer track container.        |
| `ariaLabel`         | string  | `"Progress"`    | An accessible label for screen readers.                                      |

## Example Usage

```jsx
import FyProgress from "fdk-react-templates/components/core/fy-progress/fy-progress";
import "fdk-react-templates/components/core/fy-progress/fy-progress.css";

<FyProgress value={uploadProgress} showLabel color="primary" />
```

## Contact

For any questions or feedback, please contact Prashant Pandey at [prashantpandey@gofynd.com](mailto:prashantpandey@gofynd.com).
