# Modal Component

The Modal component is a flexible and customizable modal dialog for React applications. It supports various modal types, customizable styles, focus management, and outside click handling for closing.

## Props

| Prop                | Type                                            | Default Value       | Description                                                                                       |
|---------------------|------------|--------------------------------------|---------------------------------------------------------------------------------------------------|
| `children`          | ReactNode                                       | `undefined`          | The content to be displayed inside the modal body.
| `title`             | string                                          | `undefined`          | The title of the modal, displayed in the header.
| `subTitle`          | string                                          | `undefined`          | The subTitle of the modal, displayed in the header.
| `isOpen`            | boolean                                         | `false`              | Determines whether the modal is open or closed.
| `hideHeader`        | boolean                                         | `false`              | Determines whether the modal header is visible or not.
| `isCancellable`     | boolean`                                        | `true`               | If true, the modal can be closed by pressing the Escape key or clicking outside.
| `childHandleFocus`  | boolean                                         | `false`              | If true, the focus is managed by the child component rather than the modal itself.
| `modalType`         | string                                          | `""`                 | Specifies the type of modal. Options include "right-modal", "center-modal", "strict-center".
| `closeDialog`       | function                                        | `() => {}`           | Function to close the modal. Triggered on Escape key press, outside click, or close icon click.
| `titleClassName`    | string                                          | `"`                  | Optional custom CSS class(es) to apply to the title element.
| `subTitleClassName` | string                                          | `"`                  | Optional custom CSS class(es) to apply to the subTitle element.
| `headerClassName`   | string                                          | `"`                  | Optional custom CSS class(es) to apply to the header element.
| `bodyClassName`     | string                                          | `"`                  | Optional custom CSS class(es) to apply to the body element.
| `containerClassName`| string                                          | `"`                  | Optional custom CSS class(es) to apply to the modal container element.
| `ignoreClickOutsideForClass`| string                                  | `undefined`          | Specifies classes for which handleClickOutside doesn't invokes.

## Example Usage

```jsx
import Modal from "fdk-react-templates/components/core/modal/modal";
import "fdk-react-templates/components/core/modal/modal.css";

<Modal
  isOpen={true}
  isCancellable={true}
  modalType="center-modal"
  closeDialog={handleClose}
  title="Modal Title"
  titleClassName="customTitleClass"
  subTitle = "Modal SubTitle"
  subTitleClassName = "customSubTitleClass"
  headerClassName="customHeaderClass"
  bodyClassName="customBodyClass"
  containerClassName="customContainerClass"
  ignoreClickOutsideForClass= "ignoreClickOutsideForClass"
>
  <p>Modal content goes here.</p>
</Modal>
```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

