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
import ContactPage from "./path/to/contact-page/ContactPage";

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
    phone: [{ code: "+1", number: "1234567890" }],
    email: [{ value: "support@example.com" }],
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

const SocialMedia = ({ social_links }) => (
  <div>
    {social_links.map((link, index) => (
      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
        {link.platform}
      </a>
    ))}
  </div>
);

const App = () => (
  <ContactPage
    contactInfo={contactInfo}
    supportInfo={supportInfo}
    handleSubmitForm={handleSubmitForm}
    pageConfig={pageConfig}
    SocialMedia={SocialMedia}
  />
);

export default App;
