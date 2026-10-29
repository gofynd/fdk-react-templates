# AddressForm Component

The `AddressForm` component is designed for adding or updating an address. It provides a flexible form with support for Google Maps integration and custom footer buttons.

## Props

| Prop                | Type       | Default Value                        | Description                                                                                       |
|---------------------|------------|--------------------------------------|---------------------------------------------------------------------------------------------------|
| `formSchema`        | array      | See `defaultFormSchema` below         | The schema defining the fields and their validation for the form.                                |
| `addressItem`       | object     | `undefined`                           | The existing address object, used when updating an address.                                      |
| `mapApiKey`         | string     | `""`                                  | API key for integrating Google Maps.                                                             |
| `showGoogleMap`     | boolean    | `false`                               | Flag to show/hide the Google Maps component in the form.                                          |
| `isNewAddress`      | boolean    | `true`                                | Indicates if the form is for a new address or an existing one.                                   |
| `onAddAddress`      | function   | `() => {}`                            | Callback function to handle adding a new address.                                                |
| `onUpdateAddress`   | function   | `() => {}`                            | Callback function to handle updating an existing address.                                        |
| `onGetLocality`     | function   | `() => {}`                            | Callback function to fetch locality information based on the address.                           |
| `customFooter`      | component  | See example below                     | Custom React component for rendering the footer of the form, typically a submit button or reset delete buttons         |

## Default Form Schema

The `formSchema` prop defines the structure and validation rules for the form fields. Below is the default schema used by the `AddressForm` component:

```jsx
const defaultFormSchema = [

{
    group: "addressInfo",
    groupLabel: "Address Information",
    fields: [
      {
        name: "address",
        label: "Flat No/House No*",
        type: "text",
        required: true,
        maxLength: 40,
        fullWidth: false,
        validation: {
          required: "House No. is required",
          pattern: {
            value: /^[A-Za-z0-9,./\s-]+$/,
            message: "House No can only contain letters, numbers, comma, period, hyphen, and slash",
          },
          maxLength: {
            value: 40,
            message: "Can not exceed 40 characters",
          },
        },
      },
      {
        name: "area",
        label: "Building Name/ Street *",
        type: "text",
        required: true,
        maxLength: 60,
        fullWidth: false,
        validation: {
          required: "address is required",
          pattern: {
            value: /^[A-Za-z0-9,./\s-]+$/,
            message: "address can only contain letters, numbers, comma, period, hyphen, and slash",
          },
          maxLength: {
            value: 60,
            message: "Can not exceed 60 characters",
          },
        },
      },
      {
        name: "landmark",
        label: "Locality/ Landmark *",
        type: "text",
        required: true,
        fullWidth: false,
        maxLength: 60,
        validation: {
          required: "landmark is required",
          pattern: {
            value: /^[A-Za-z0-9,./\s-]+$/,
            message: "address can only contain letters, numbers, comma, period, hyphen, and slash",
          },
          maxLength: {
            value: 60,
            message: "Can not exceed 60 characters",
          },
        },
      },
      {
        name: "area_code",
        label: "Pincode*",
        type: "text",
        required: true,
        maxLength: 6,
        fullWidth: false,
        validation: {
          required: "Pin-code is required",
          pattern: {
            value: /^[1-9][0-9]{5}$/,
            message: "Invalid pin-code",
          },
          maxLength: {
            value: 6,
            message: "Can not exceed 6 digits",
          },
        },
      },
      {
        name: "city",
        label: "City*",
        type: "text",
        required: true,
        fullWidth: false,
        validation: {
          required: "City is required",
          pattern: {
            value: /^[A-Za-z/\s]+$/,
            message: "City can only contain letters",
          },
          maxLength: {
            value: 40,
            message: "City cannot exceed 40 characters",
          },
        },
      },
      {
        name: "state",
        label: "State*",
        type: "text",
        required: true,
        fullWidth: false,
        validation: {
          required: "State is required",
          pattern: {
            value: /^[A-Za-z]+$/,
            message: "State can only contain letters",
          },
          maxLength: {
            value: 40,
            message: "State cannot exceed 40 characters",
          },
        },
      },
      { name: "country", label: "", type: "hidden", required: false },
    ],
  },

  {
    group: "contactInfo",
    groupLabel: "Contact Information",
    fields: [
      {
        name: "name",
        label: "Full Name*",
        type: "text",
        required: true,
        fullWidth: true,
        validation: {
          required: "Name is required",
          pattern: {
            value: /^[A-Za-z\s]+$/,
            message: "Name can only contain letters",
          },
          maxLength: {
            value: 50,
            message: "Name cannot exceed 50 characters",
          },
        },
      },
      {
        name: "phone",
        label: "Mobile Number*",
        type: "text",
        required: true,
        fullWidth: false,
        validation: {
          required: "Mobile number is required",
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Invalid mobile number",
          },
        },
      },
      {
        name: "email",
        label: "Email (optional)",
        type: "email",
        fullWidth: false,
        validation: {
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: "Invalid email address",
          },
          maxLength: {
            value: 50,
            message: "Email cannot exceed 50 characters",
          },
        },
      },
      {
        name: "is_default_address",
        label: "Make this my default address",
        type: "checkbox",
        fullWidth: true,
      },
    ],
  },
];
```
## Example Usage

```jsx
import React from "react";
import AddressForm from "fdk-react-templates/components/address-form/address-form";
import "fdk-react-templates/components/address-form/address-form.css";

const App = () => {
  const addressItem = {
    custom_json: {},
    address: "Nayati",
    address_type: "Work",
    area: "201",
    area_code: "411045",
    area_code_slug: "pincode",
    checkout_mode: "self",
    city: "Pune",
    country: "India",
    country_code: "",
    country_iso_code: "IN",
    country_phone_code: "+91",
    created_by_user_id: "66b31ef6b66f0bfc4df55f74",
    email: null,
    geo_location: null,
    google_map_point: null,
    id: "66b31f8c32abfc430258c83e",
    is_active: null,
    is_default_address: false,
    landmark: "Tech Park",
    meta: null,
    name: "Saurabh",
    phone: "9527555177",
    state: "Maharashtra",
    tags: [],
    user_id: "66b31ef6b66f0bfc4df55f74",
    sector: "",
  };

  return (
    <AddressForm
      addressItem={addressItem}
      mapApiKey={YOUR_MAP_API_KEY}
      onAddAddress={() => {}}
      onUpdateAddress={() => {}}
      onGetLocality={() => {}}
    />
  );
};

export default App;


```
## Installation

To use this component, ensure you have the necessary dependencies installed. For example, if using `react-hook-form` and `@googlemaps/react-wrapper`, make sure to install them:

```bash
npm install react-hook-form @googlemaps/react-wrapper
```


## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).

