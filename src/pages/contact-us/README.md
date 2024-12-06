# ContactPage Component

## Overview

The `ContactPage` component is a React-based form and contact information display page. It features a customizable contact form and sections for address, phone number, email, and social media links. The component is responsive and can be configured for both desktop and mobile views, making it an easy addition to any project that needs a contact support section.

## Features

- **Dynamic Form**: Automatically generates form fields such as name, phone number, email, and message.
- **Validation**: Client-side validation for required fields (name, phone, email) with proper format checks.
- **Support Information Display**: Shows business address, phone numbers, emails, working hours, and social media links based on props.
- **Mobile Responsive**: Adjusts layout dynamically for both desktop and mobile views.
- **Configurable Layout**: Options to show/hide address, phone, email, and social media sections as needed.

## Usage

To use the `ContactPage` component, import it into your React application and provide the necessary props for customization.

### Example

```jsx
import React from "react";
import ContactPage from "fdk-react-templates/pages/contact-us/contact-us";
import "fdk-react-templates/pages/contact-us/contact-us.css";

function SocailMedia({ social_links }) {
  return (
    <div>
      {Object.entries(social_links).map(
        ([key, { link, title }]) =>
          link && (
            <a key={key} href={link} title={title}>
              {title}
            </a>
          )
      )}
    </div>
  );
}

const App = () => {
  const contactInfo = {
    address: {
      address_line: ["123 Street", "Business Tower"],
      city: "City Name",
      pincode: "123456",
    },
    social_links: [
      { platform: "Facebook", url: "https://facebook.com" },
      { platform: "Twitter", url: "https://twitter.com" },
    ],
    support: { timing: "9 AM - 6 PM" },
  };

  const supportInfo = {
    contact: {
      phone: { phone: [{ code: "91", number: "1234567890" }] },
      email: { email: [{ value: "support@example.com" }] },
    },
  };

  const pageConfig = {
    show_address: true,
    show_phone: true,
    show_email: true,
    show_working_hours: true,
    show_icons: true,
    image_desktop: "/images/contact-background.jpg",
    align_image: "left",
    opacity: 50,
  };

  const handleSubmitForm = (formData) => {
    console.log("Form submitted", formData);
  };

  return (
    <ContactPage
      contactInfo={contactInfo}
      supportInfo={supportInfo}
      handleSubmitForm={handleSubmitForm}
      pageConfig={pageConfig}
      SocialMedia={SocailMedia}
    />
  );
};

export default App;

```
### Props

- **contactInfo** (object, required): Contains contact details such as address and social media links.
- **supportInfo** (object, required): Contains support information such as phone and email details.
- **handleSubmitForm** (function, required): Callback function that handles the form submission.
- **pageConfig** (object, required): Configuration object for the page layout, visibility of fields, and image display.
- **SocailMedia** (function, required): Component or function to render social media links.

### Page Configuration

This configuration allows you to customize the **Contact Us Page** on the Fynd platform. It controls various features, such as the layout of the banner, display options for contact details, and the overlay opacity.

| **Configuration**             | **Type**       | **Default Value**  | **Description**                                                                                   |
|-------------------------------|----------------|--------------------|---------------------------------------------------------------------------------------------------|
| `align_image`                  | `select`       | `right`            | Determines the alignment of the banner image on the page. Options: Left or Right.                |
| `image_desktop`                | `image_picker` | `""`               | Upload the banner image to display on the desktop version of the page. Aspect ratio: 3:4.         |
| `opacity`                      | `range`        | `30`               | Adjusts the opacity of the overlay banner. Value range: 0% to 100%.                              |
| `show_address`                 | `checkbox`     | `true`             | Toggles the visibility of the address section on the page.                                        |
| `show_phone`                   | `checkbox`     | `true`             | Toggles the visibility of the phone number on the page.                                           |
| `show_email`                   | `checkbox`     | `true`             | Toggles the visibility of the email address on the page.                                          |
| `show_icons`                   | `checkbox`     | `true`             | Toggles the visibility of social media icons on the page.                                         |
| `show_working_hours`           | `checkbox`     | `true`             | Toggles the visibility of the working hours section on the page.                                  |

#### Steps to Modify Page Configuration via Fynd Platform

1. **Log in to the Fynd Platform:**
   - Go to [Fynd Platform](https://platform.fynd.com) and log in with your credentials.

2. **Navigate to Your Company:**
   - Once logged in, select your company from the list.

3. **Select the Theme:**
   - In the sidebar, under **Sales Channel**, select your sales channel.
   - Then, under **Appearance**, click on **Themes**.
   - In the current theme, click on **Edit**. Here, you can preview and configure the theme.  
     Here's a sample [theme](https://platform.fynd.com/company/5178/application/668765e1c984016d78222a21/themes/668768e7e21c099a562b5d56/edit).

4. **Navigate to the Page Configuration:**
   - Within the theme editor, navigate to the **Contact Us Page**. 
   - You can use the dropdown on the top to select the desired page.
   - Under the **Configuration** section, locate and click on the **Page** settings for the Contact Us Page.

5. **Modify Page Configurations:**
   - Adjust the settings for the Contact Us Page as needed:
     - Set the alignment of the banner image (`align_image`).
     - Upload a banner image (`image_desktop`).
     - Adjust the opacity of the overlay banner (`opacity`).
     - Toggle visibility for contact details like address, phone, email, working hours, and social media icons.

6. **Preview Changes:**
   - Preview the updates made to the page in real-time to ensure they look and function as expected.

7. **Save and Publish:**
   - After confirming your changes, click on **Save**. This will publish the updated configurations for the Contact Us Page.

8. **Test Your Storefront:**
   - Visit your store's live URL and navigate to the Contact Us Page to confirm the changes are reflected and working as intended.

By following these steps, you can easily customize the Contact Us Page configuration to suit your business needs.

This README provides a detailed overview of the `ContactPage` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
