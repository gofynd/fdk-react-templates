# FyButton Component

The `FyButton` component is a versatile and customizable button for React applications. It supports various styles, sizes, and additional elements such as icons.

## Props

| Prop                | Type                                            | Default Value       | Description                                                                                       |
|---------------------|------------|--------------------------------------|---------------------------------------------------------------------------------------------------|
| `children`          | ReactNode                                       | `undefined`          | The content inside the button, typically text or other elements.                                |
| `className`         | string                                          | `undefined`          | Optional custom CSS class(es) to apply to the button.                                      |
| `variant`           | string`                                         | `"contained"`        | The style variant of the button. Options might include `"contained"`, `"outlined"`  and `"text"`.                                  |
| `size`              | string                                          | `"medium`            | The size of the button. Common options could be `"small"`, `"medium"`, `"large"`.                                         |
| `color`             | string                                          | `"primary"`          | The color theme of the button, such as `"primary"`, `"secondary"` etc.                                   |
| `fullWidth`         | boolean                                         | `false`              | If true, the button will expand to fill its container's width.
| `isLoading`         | boolean                                         | `false`              | If true, the button will be disabled and loading animation will be visible.
| `startIcon`         | ReactNode                                       | `<></>`              | An icon or element to be placed at the start of the button content.
| `endIcon`           | ReactNode                                       | `<></>`              | An icon or element to be placed at the end of the button content.
| `ariaLabel`         | string                                          | `""`                 | An accessible label for screen readers.
| `...props`          | React.ButtonHTMLAttributes<HTMLButtonElement>   | `undefined`          | Additional props to be passed to the button element.

## Example Usage

```jsx
import FyButton from "fdk-react-templates/components/core/fy-button/fy-button";
import "fdk-react-templates/components/core/fy-button/fy-button.css";

<FyButton
  variant="outlined"
  size="large"
  color="secondary"
  fullWidth={true}
  startIcon={<MyStartIcon />}
  endIcon={<MyEndIcon />}
  ariaLabel="Submit Form"
>
  Submit
</FyButton>
```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

