# `FormBuilder` Component

The `FormBuilder` component is a dynamic form generator that renders various form fields based on input data. It also manages form submission and displays a success message after submission.

## Props

| Prop                  | Type                                            | Default Value       | Description                                                                                       |
|---------------------|------------|--------------------------------------|---------------------------------------------------------------------------------------------------|
| `data`              | object                                            | `undefined`            | Contains form metadata including inputs, header_image, title, description etc.  |
| `onFormSubmit`      | function                                          | `(value) => {}`        | A callback function invoked when the form is submitted. It receives the form data.  |
| `successMessage`    | string                                            | `"Enquiry Submitted"`  | Message to display after successful form submission.  |

## Example Usage

```jsx
import FormBuilder from "fdk-react-templates/components/form-builder/form-builder";
import "fdk-react-templates/components/form-builder/form-builder.css";

const formData = {
  header_image: "header.jpg",
  title: "Contact Us",
  description: "Please fill out the form below.",
  inputs: [
    {
      display: "Full Name",
      key: "full_name",
      type: "text",
      required: true,
      placeholder: "Enter your name"
    },
    {
      display: "Contact Method",
      key: "contact_method",
      type: "dropdown",
      options: [
        { display: "Email", key: "email" },
        { display: "Phone", key: "phone" }
      ],
      required: true,
      placeholder: "Select a contact method"
    }
  ]
};

const handleFormSubmit = (data) => {
  console.log("Form data submitted:", data);
};

<FormBuilder
  data={formData}
  onFormSubmit={handleFormSubmit}
/>
```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

