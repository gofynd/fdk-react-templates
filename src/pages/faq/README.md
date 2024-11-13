## Faq Component

### Overview
The `Faq` component is used to display a list of frequently asked questions (FAQs) and allows users to navigate between different FAQ categories. The component provides the ability to expand or collapse individual questions, filter by categories, and navigate to a contact page for further assistance.

### Features
- **FAQ Expansion**: Allows users to expand and collapse answers for each FAQ item.
- **Category Filtering**: Users can filter the FAQ list by selecting a category.
- **Responsive Design**: The component adjusts for mobile and desktop views, hiding certain elements based on the screen size.
- **Navigation to Contact Page**: Includes a "CONTACT US" button that directs users to a contact page for additional help.

## Usage
To use the `Faq` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from 'react';
import Faq from 'fdk-react-templates/pages/faq';

const App = () => {
  const [faqs, setFaqs] = useState([
    { question: "What is your return policy?", answer: "You can return items within 30 days.", open: false },
    { question: "How do I track my order?", answer: "Go to your account and click on 'Track Order'.", open: false },
  ]);
  const faqCategories = [
    { title: "Orders", slug: "orders" },
    { title: "Payments", slug: "payments" },
  ];
  const [activeFaqCat, setActiveFaqCat] = useState(faqCategories[0]);
  const [hasCatQuery, setHasCatQuery] = useState(true);

  const updateSearchParams = (params) => {
    // Handle search params update logic
  };

  return (
    <Faq
      faqCategories={faqCategories}
      activeFaqCat={activeFaqCat}
      faqs={faqs}
      setFaqs={setFaqs}
      updateSearchParams={updateSearchParams}
      hasCatQuery={hasCatQuery}
    />
  );
}

export default App;

```
### Props

- **faqCategories** (array, required): An array of FAQ categories, each containing a title and slug.
- **activeFaqCat** (object, required): The currently selected FAQ category with title and slug.
- **faqs** (array, required): An array of FAQ objects, each containing question, answer, and open status to indicate whether the answer is visible.
- **setFaqs** (function, required): A state setter function to update the list of FAQs when a question is toggled open or closed.
- **updateSearchParams** (function, required): A function to update the search parameters, used to filter FAQs by category.
- **hasCatQuery** (boolean, required): A boolean that indicates whether a category query is active.

```
This README provides a detailed overview of the `Faq` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
