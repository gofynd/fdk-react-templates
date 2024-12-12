# GoogleMapAddress Component

The `GoogleMapAddress` component integrates Google Maps for address selection, location detection, and marker dragging functionalities. It allows users to search for an address, select it from the Google Maps API, and detect their current location on the map. When the marker is dragged, the address updates accordingly, and the user can select the address to proceed.

## Features
- **Search Google Maps**: Provides an autocomplete search input to find addresses or places on Google Maps.
- **Location Detection**: Allows the user to detect their current location and center the map accordingly.
- **Marker Dragging**: The user can drag the map marker to update the location, and the address will be updated accordingly.
- **Address Display**: Displays the selected address and allows the user to confirm it.

## Props

| Prop Name       | Prop Type    | Default Value | Description                                                                 |
|-----------------|--------------|---------------|-----------------------------------------------------------------------------|
| `mapApiKey`     | `string`     | N/A           | The Google Maps API key used to load the map and Autocomplete service.       |
| `onAddressSelect` | `function`  | N/A           | A callback function that is triggered when an address is selected. It receives an object with the selected address details, including city, area_code (postal code), state, area (locality), address (premise), and country. |

## Example Usage

```jsx
import React, { useState } from "react";
import GoogleMapAddress from "fdk-react-templates/components/google-map/google-map";
import "fdk-react-templates/components/google-map/google-map.css";

const App = () => {
  const [address, setAddress] = useState(null);

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    console.log(selectedAddress);
  };

  return (
    <div>
      <GoogleMapAddress
        mapApiKey="YOUR_GOOGLE_MAPS_API_KEY"
        onAddressSelect={handleAddressSelect}
      />
      {address && (
        <div>
          <h3>Selected Address:</h3>
          <p>{address.address}</p>
        </div>
      )}
    </div>
  );
};

export default App;


```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).