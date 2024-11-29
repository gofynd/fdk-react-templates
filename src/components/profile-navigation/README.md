# Profile Navigation Component

The `ProfileNavigation` component is used to render the navigation menu for a user profile page. It includes user profile details, links to different sections, and a sign-out option.

## Features
- **User profile details**: Displays user profile picture and name.
- **Navigation menu**: Includes links to different profile sections like `Edit Profile`, `My Account`, etc.
- **Sign out**: Allows the user to sign out of the application.

## Props

| Prop Name           | Prop Type      | Default Value | Description                                                                 |
|---------------------|----------------|---------------|-----------------------------------------------------------------------------|
| `children`          | `ReactNode`    | -             | The content to be displayed inside the profile section.                     |
| `signOut`           | `Function`     | -             | Function to handle user sign-out action.                                    |
| `userProfilePicUrl` | `string`       | -             | URL of the user's profile picture.                                          |
| `userName`          | `string`       | -             | The user's name to be displayed.                                            |

## Example Usage

```jsx
import React from "react";
import ProfileNavigation from "fdk-react-templates/components/profile-navigation/profile-navigation";
import "fdk-react-templates/components/profile-navigation/profile-navigation.css";

const App = () => (
  <ProfileNavigation
    signOut={signOutFunction}
    userProfilePicUrl="https://example.com/user.jpg"
    userName="John Doe"
  >
    {/* Profile content here */}
  </ProfileNavigation>
);

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).