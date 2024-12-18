/**
 * This component handles the selection and display of geographical locations using Google Maps API.
 * It allows users to search for places, select addresses, and retrieve location details such as city, state, and postal code.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.mapApiKey - The API key for accessing Google Maps services.
 * @param {Function} props.onAddressSelect - Callback function to handle the selected address.
 *
 * @returns {JSX.Element} A React component that renders a map interface with address selection capabilities.
 *
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import * as styles from "./google-map.less";
import Autocomplete from "react-google-autocomplete";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const autoCompleteStyles = {
  width: "100%",
  height: "40px",
  borderRadius: "8px",
  padding: "0px 30px",
  border: "none",
};

const GoogleMapAddress = ({
  mapApiKey,
  onAddressSelect,
  countryDetails,
  addressItem,
  onLoad = () => {},
}) => {
  const [selectedPlace, setSelectedPlace] = useState({
    lat: countryDetails?.latitude,
    lng: countryDetails?.longitude,
  });
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [locality, setLocality] = useState("");
  const [premise, setPremise] = useState("");
  const [country, setCountry] = useState("India");
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const defaultPincode = localStorage?.getItem("pincode") || "400076";
  useEffect(() => {
    if (addressItem?.geo_location) {
      const location = {
        lat: Number(addressItem?.geo_location?.latitude),
        lng: Number(addressItem?.geo_location?.longitude),
      };
      setSelectedPlace(location);
      mapRef?.current?.panTo(location);
    } else {
      const location = {
        lat: Number(countryDetails?.latitude),
        lng: Number(countryDetails?.longitude),
      };
      setSelectedPlace(location);
      mapRef?.current?.panTo(location);
    }
  }, [countryDetails, addressItem]);

  useEffect(() => {
    getLatLngFromPostalCode(defaultPincode);
  }, []);

  function stateReset() {
    setPincode("");
    setCity("");
    setCountry("India");
    setLocality("");
    setState("");
  }

  function selectAddress() {
    onAddressSelect({
      city: city,
      area_code: pincode,
      state: state,
      area: locality,
      address: premise,
      country: country,
      geo_location: {
        latitude: selectedPlace?.lat,
        longitude: selectedPlace?.lng,
      },
    });
  }

  const handlePlaceSelect = useCallback((place) => {
    if (place?.geometry) {
      const location = place?.geometry?.location;
      const lat = location.lat();
      const lng = location.lng();
      setSelectedPlace({ lat, lng });
      setAddress(place.formatted_address);
      let prem = place?.address_components?.find((m) =>
        m?.types?.includes("premise")
      );
      setPremise(prem?.long_name || "");
      // Get city and state from the location
      getCityAndState(lat, lng);
    } else {
      console.error("No geometry available for selected place");
    }
  }, []);

  const getCityAndState = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapApiKey}`
      );
      const data = await response.json();
      const addressComponents = data.results[0].address_components;
      stateReset();
      let subLocalities = [];
      addressComponents.forEach((component) => {
        if (component.types.includes("premise")) {
          setPremise(component.long_name);
        }
        if (component.types.includes("country")) {
          setCountry(component.long_name);
        }
        if (component.types.includes("locality")) {
          setCity(component.long_name);
        }
        if (component.types.includes("administrative_area_level_1")) {
          setState(component.long_name);
        }
        if (component.types.includes("postal_code")) {
          setPincode(component.long_name);
        }
        if (
          component.types.includes("sublocality") ||
          component.types.includes("sublocality_level_1") ||
          component.types.includes("sublocality_level_2")
        ) {
          subLocalities.push(component.long_name);
        }

        setLocality(subLocalities.join(", "));
      });
    } catch (error) {
      console.error("Error fetching city and state:", error);
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapApiKey}`
      );
      const data = await response.json();
      let subLocalities = [];
      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        setAddress(place.formatted_address);

        if (place?.geometry) {
          const location = place?.geometry?.location;
          const lat = location.lat;
          const lng = location.lng;
          setSelectedPlace({ lat, lng });
        }
        // Extract city, state, and pincode from the place
        place.address_components.forEach((component) => {
          if (component.types.includes("premise")) {
            setPremise(component.long_name);
          }
          if (component.types.includes("country")) {
            setCountry(component.long_name);
          }
          if (component.types.includes("locality")) {
            setCity(component.long_name);
          }
          if (component.types.includes("administrative_area_level_1")) {
            setState(component.long_name);
          }
          if (component.types.includes("postal_code")) {
            setPincode(component.long_name);
          }
          if (
            component.types.includes("sublocality") ||
            component.types.includes("sublocality_level_1") ||
            component.types.includes("sublocality_level_2")
          ) {
            subLocalities.push(component.long_name);
          }

          setLocality(subLocalities.join(", "));
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleMarkerDragEnd = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPlace({ lat, lng });
    getAddressFromLatLng(lat, lng);
  }, []);

  const locateUser = () => {
    if (navigator?.geolocation) {
      navigator?.geolocation?.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedPlace(pos);
          getAddressFromLatLng(pos.lat, pos.lng);
          mapRef?.current?.panTo(pos);
        },
        () => {
          handleLocationError(true);
        }
      );
    } else {
      handleLocationError(false);
    }
  };
  const handleLocationError = (browserHasGeolocation, pos) => {
    console.error(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
  };

  const getLatLngFromPostalCode = async (postalCode) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${mapApiKey}`
      );
      const data = await response.json();
      if (data?.results?.length > 0) {
        const location = data.results[0]?.geometry?.location;
        const lat = location?.lat;
        const lng = location?.lng;
        setSelectedPlace({ lat, lng });
        mapRef?.current?.panTo({ lat, lng });
      }
    } catch (error) {
      console.error("Error fetching coordinates from postal code:", error);
    }
  };

  return (
    <div className={styles.mapAddress}>
      <LoadScript googleMapsApiKey={mapApiKey} libraries={libraries}>
        <div ref={inputRef} className={styles.autoCompleteWrap}>
          <SvgWrapper
            className={styles.searchAutoIcon}
            svgSrc="search"
          ></SvgWrapper>
          <Autocomplete
            placeholder="Search Google Maps"
            apiKey={mapApiKey}
            style={autoCompleteStyles}
            onPlaceSelected={handlePlaceSelect}
            options={{
              types: ["geocode", "establishment"],
              componentRestrictions: { country: countryDetails?.iso2 },
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
        <div className={styles.mapCompWrap}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={selectedPlace}
            zoom={selectedPlace ? 15 : 10}
            options={{
              fullscreenControl: false,
              mapTypeControl: false,
              streetViewControl: false,
            }}
            onLoad={(map) => {
              mapRef.current = map;
              onLoad(map);
            }}
          >
            {selectedPlace && (
              <Marker
                position={selectedPlace}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
              />
            )}
          </GoogleMap>
          <button
            title="Detect My Location"
            onClick={locateUser}
            className={styles.locateIconBtn}
          >
            <SvgWrapper
              className={styles.locateIcon}
              svgSrc="locate"
            ></SvgWrapper>
          </button>
        </div>
      </LoadScript>
      {address && (
        <div className={styles.addressSelect}>
          <p>{address}</p>
          <button onClick={selectAddress}> Use This</button>
        </div>
      )}
    </div>
  );
};

export default GoogleMapAddress;
