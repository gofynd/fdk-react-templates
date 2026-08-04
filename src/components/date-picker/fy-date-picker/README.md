# FyDatePicker

`FyDatePicker` is a customizable and accessible date picker React component that allows users to select a date using a calendar UI or by typing manually. It supports multiple date formats, range restrictions, theme customization, and input behaviors.

---

## ✨ Features

- ✅ Select date via calendar UI or manual input  
- 📅 Multiple date format support (`MM-DD-YYYY`, `DD-MM-YYYY`, etc.)  
- 🔐 Disable or make the input read-only  
- 🎨 Customizable theme color  
- ⛔ Prevent selection outside min/max dates  
- 🧼 Clear selected date  
- 📋 Floating label & customizable placeholder  

---

## 📦 Installation

Copy the component files (`FyDatePicker.jsx`, related `*.less` styles, and SVG assets) into your project.

---

## 🚀 Usage

```jsx
import FyDatePicker from "./path-to/FyDatePicker";

const MyComponent = () => {
  const handleDateChange = (date) => {
    console.log("Selected Date:", date);
  };

  return (
    <FyDatePicker
      preselectedDate="04-15-2025"
      onChange={handleDateChange}
      maxInactiveDate="12-31-2025"
      minInactiveDate="01-01-2024"
      placeholderText="MM-DD-YYYY"
      dateFormat="MM-DD-YYYY"
      inputLabel="Select a date"
      themeColor="#28a745"
    />
  );
};

```
## ⚙️ Props

| Prop Name         | Type       | Default        | Description                                                                 |
|------------------|------------|----------------|-----------------------------------------------------------------------------|
| `preselectedDate`| `string`   | `""`           | Initial selected date in the format specified by `dateFormat`              |
| `onChange`       | `function` | `() => {}`     | Callback function triggered when the selected date changes                 |
| `maxInactiveDate`| `string`   | `undefined`    | Maximum date beyond which selection is disabled                            |
| `minInactiveDate`| `string`   | `undefined`    | Minimum date before which selection is disabled                            |
| `placeholderText`| `string`   | `dateFormat`   | Input placeholder text                                                     |
| `dateFormat`     | `string`   | `"MM-DD-YYYY"` | Date format (`"DD-MM-YYYY"`, `"MM/DD/YYYY"`, `"YYYY-DD-MM"`, etc.)         |
| `disabled`       | `boolean`  | `false`        | Disables the input if `true`                                               |
| `readOnly`       | `boolean`  | `false`        | Makes the input read-only if `true`                                        |
| `themeColor`     | `string`   | `"#007bff"`    | Highlight color for selected date                                          |
| `inputLabel`     | `string`   | `"label"`      | Floating label shown above the input                                       |

---

## 📅 Supported Date Formats

The `dateFormat` prop supports the following formats:

- `DD-MM-YYYY`
- `MM-DD-YYYY`
- `YYYY-DD-MM`
- `DD/MM/YYYY`
- `MM/DD/YYYY`
- `YYYY/DD/MM`

Dates entered or returned will conform to the specified format.

---

## 🧪 Validation

- Input validation is enforced based on the `dateFormat`.
- Invalid dates or improperly formatted strings will **not** trigger the `onChange` callback.

---

## 🎨 Styling

Styling is handled via LESS in the `fy-date-picker.less` file.  
You can customize the component’s appearance (borders, font, spacing, etc.) using the exposed class names from `styles.*`.

---

## 📁 Assets

Ensure the following SVG assets are available and properly imported into the component:

- `date-picker.svg`
- `chevron-left.svg`
- `chevron-right.svg`
- `clear-icon.svg`

---

## 🛑 Limitations

- ❌ No time selection support  
- 🌐 No localization/i18n support out of the box  
- 📆 Currently supports only the **Gregorian calendar**
