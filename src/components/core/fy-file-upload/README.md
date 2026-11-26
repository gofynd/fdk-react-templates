# FyFileUpload Component

The `FyFileUpload` component is a generic, presentation-only dropzone/file-picker shell. Supports drag-and-drop and click-to-browse, file type/size/count constraints, and a render-prop for custom preview content. This component does not perform any upload networking itself - it only surfaces the selected `File` objects via `onFilesSelected`, leaving the actual upload flow (signed URLs, progress tracking, etc.) to the caller.

## Props

| Prop                | Type                          | Default Value                              | Description                                                                                   |
| ------------------- | ----------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `accept`            | string                        | `""`                                         | Comma-separated list of accepted MIME types/extensions, e.g. `".jpg,.jpeg,.png,.pdf"`.          |
| `multiple`          | boolean                       | `false`                                       | If true, allows selecting/dropping more than one file at a time.                                |
| `maxSizeMb`         | number                        | `undefined`                                  | Maximum allowed file size in megabytes; files exceeding this are reported via `onError` instead of `onFilesSelected`. |
| `disabled`          | boolean                       | `false`                                       | If true, the dropzone cannot be interacted with.                                                |
| `error`             | boolean                       | `false`                                       | If true, the dropzone renders in an error state.                                                |
| `errorMessage`      | string                        | `""`                                         | Error message rendered below the dropzone when `error` is truthy.                               |
| `onFilesSelected`   | `function(File[]): void`      | `() => {}`                                   | Callback invoked with the accepted `File[]` from either a drop or a browse selection.            |
| `onError`           | `function(string): void`      | `() => {}`                                   | Callback invoked with a human-readable message when a selected file is rejected.                |
| `label`             | ReactNode                     | `"Drag & drop or click to upload"`            | Primary instructional text.                                                                      |
| `secondaryLabel`    | ReactNode                     | `""`                                         | Secondary/help text, e.g. accepted formats and size limit.                                        |
| `icon`              | ReactNode                     | default upload icon                          | Optional custom icon element rendered above the label.                                           |
| `children`          | ReactNode                     | `undefined`                                  | Optional custom content (e.g. an uploaded-file preview) rendered instead of the default empty state. |
| `className`         | string                        | `""`                                         | Optional custom CSS class(es) to apply to the dropzone element.                                  |
| `containerClassName`| string                        | `""`                                         | Optional custom CSS class(es) to apply to the outer wrapping container.                          |

## Example Usage

```jsx
import FyFileUpload from "fdk-react-templates/components/core/fy-file-upload/fy-file-upload";
import "fdk-react-templates/components/core/fy-file-upload/fy-file-upload.css";

<FyFileUpload
  accept=".jpg,.jpeg,.png,.pdf"
  maxSizeMb={10}
  onFilesSelected={(files) => handleUpload(files[0])}
  onError={(message) => showSnackbar(message, "error")}
  secondaryLabel="JPG, PNG or PDF, up to 10MB"
/>
```

## Contact

For any questions or feedback, please contact Prashant Pandey at [prashantpandey@gofynd.com](mailto:prashantpandey@gofynd.com).
