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
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import * as styles from "./google-map.less";
import Autocomplete from "react-google-autocomplete";
import SearchIcon from "../../assets/images/search.svg";
import LocateIcon from "../../assets/images/locate.svg";
import { useGlobalTranslation } from "fdk-core/utils";

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
  const { t } = useGlobalTranslation("translation");
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
  const [country, setCountry] = useState(
    countryDetails?.display_name || "India"
  );
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const hasInitialGeocodeRef = useRef(false);
  const lastGeocodeKeyRef = useRef(null);
  const isNewAddress = !addressItem;

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    googleMapsApiKey: mapApiKey,
    libraries,
  });

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

  function stateReset() {
    setPincode("");
    setCity("");
    setLocality("");
    setState("");
  }

  function selectAddress(payload) {
    const data = payload || {
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
    };
    onAddressSelect(data);
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
      let localPremise = "";
      let localCountry = country || "";
      let localCity = "";
      let localState = "";
      let localPincode = "";
      addressComponents.forEach((component) => {
        if (component.types.includes("plus_code")) {
          localPremise = component.long_name;
        } else if (component.types.includes("premise")) {
          localPremise = component.long_name;
        } else if (component.types.includes("street_number")) {
          localPremise = `${localPremise}${component.long_name}`;
        } else if (component.types.includes("country")) {
          localCountry = component.long_name;
        } else if (component.types.includes("locality")) {
          localCity = component.long_name;
        } else if (component.types.includes("administrative_area_level_1")) {
          localState = component.long_name;
        } else if (component.types.includes("postal_code")) {
          localPincode = component.long_name;
        } else if (
          component.types.includes("sublocality") ||
          component.types.includes("sublocality_level_1") ||
          component.types.includes("sublocality_level_2")
        ) {
          subLocalities.push(component.long_name);
        }
      });
      const localLocality = subLocalities.join(", ");
      setPremise(localPremise);
      setCountry(localCountry);
      setCity(localCity);
      setState(localState);
      setPincode(localPincode);
      setLocality(localLocality);
      selectAddress({
        city: localCity,
        area_code: localPincode,
        state: localState,
        area: localLocality,
        address: localPremise,
        country: localCountry,
        geo_location: { latitude: lat, longitude: lng },
      });
    } catch (error) {
      console.error("Error fetching city and state:", error);
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const key = `${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;
      if (lastGeocodeKeyRef.current === key) {
        return;
      }
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapApiKey}`
      );
      const data = await response.json();
      let subLocalities = [];
      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        setAddress(place.formatted_address);
        let outLat = lat;
        let outLng = lng;
        if (place?.geometry) {
          const location = place?.geometry?.location;
          outLat = location.lat;
          outLng = location.lng;
          setSelectedPlace({ lat: outLat, lng: outLng });
        }
        // Extract city, state, and pincode from the place
        let localPremise = "";
        let localCountry = country || "";
        let localCity = "";
        let localState = "";
        let localPincode = "";
        place.address_components.forEach((component) => {
          if (component.types.includes("premise")) {
            localPremise = component.long_name;
          }
          if (component.types.includes("country")) {
            localCountry = component.long_name;
          }
          if (component.types.includes("locality")) {
            localCity = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            localState = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            localPincode = component.long_name;
          }
          if (
            component.types.includes("sublocality") ||
            component.types.includes("sublocality_level_1") ||
            component.types.includes("sublocality_level_2")
          ) {
            subLocalities.push(component.long_name);
          }
        });
        const localLocality = subLocalities.join(", ");
        setPremise(localPremise);
        setCountry(localCountry);
        setCity(localCity);
        setState(localState);
        setPincode(localPincode);
        setLocality(localLocality);
        selectAddress({
          city: localCity,
          area_code: localPincode,
          state: localState,
          area: localLocality,
          address: localPremise,
          country: localCountry,
          geo_location: { latitude: outLat, longitude: outLng },
        });
        lastGeocodeKeyRef.current = key;
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
  const handleLocationError = (browserHasGeolocation) => {
    console.error(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
    onLoad(map);
  };

  useEffect(() => {
    // Auto-populate address and notify parent on initial load only for new address; guard double-invoke in StrictMode
    if (!isMapLoaded) return;
    if (!isNewAddress) return;
    if (hasInitialGeocodeRef.current) return;
    hasInitialGeocodeRef.current = true;
    if (selectedPlace?.lat && selectedPlace?.lng) {
      getAddressFromLatLng(selectedPlace.lat, selectedPlace.lng);
    }
  }, [isMapLoaded]);

  return (
    <div className={styles.mapAddress}>
      <div className={styles.mapWrapper} style={mapContainerStyle}>
        {isMapLoaded ? (
          <div>
            <div
              ref={inputRef}
              className={styles.autoCompleteWrap}
              style={{ display: !isMapLoaded && "none" }}
            >
              <SearchIcon className={styles.searchAutoIcon} />
              <Autocomplete
                placeholder={t("resource.localization.search_google_maps")}
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
            <div
              className={styles.mapCompWrap}
              style={{ display: !isMapLoaded && "none" }}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedPlace}
                zoom={selectedPlace ? 15 : 10}
                options={{
                  fullscreenControl: false,
                  mapTypeControl: false,
                  streetViewControl: false,
                }}
                onLoad={onMapLoad}
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
                title={t("resource.localization.detect_my_location")}
                onClick={locateUser}
                className={styles.locateIconBtn}
              >
                <LocateIcon className={styles.locateIcon} />
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.skeleton}>
            <canvas />
          </div>
        )}
      </div>
      {address && (
        <div className={styles.addressSelect}>
          <p>{address}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMapAddress;
