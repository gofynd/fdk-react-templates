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

import React, { useState, useEffect, useMemo, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import * as styles from "./google-map.less";
import Autocomplete from "react-google-autocomplete";
import SearchIcon from "../../../assets/images/search.svg";
import LocateIcon from "../../../assets/images/locate.svg";
import LocationPinIcon from "../../../assets/images/location-pin.svg";
import MarkerIcon from "../../../assets/images/marker.svg";
import FyButton from "../../core/fy-button/fy-button";
import { useGlobalTranslation } from "fdk-core/utils";
import Shimmer from "../../shimmer/shimmer";
import { getAddressFromComponents } from "../../../helper/utils";

const libraries = ["places"];

const GoogleMapAddress = ({
  className,
  mapApiKey,
  onAddressSelect,
  countryDetails,
  addressItem,
  onLoad = () => {},
}) => {
  const { t } = useGlobalTranslation("translation");
  const [isLocationError, setIsLocationError] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(addressItem);
  const mapRef = useRef(null);
  const mapCenterRef = useRef({
    lat: Number(
      currentLocation?.geo_location?.latitude || countryDetails?.latitude || 0
    ),
    lng: Number(
      currentLocation?.geo_location?.longitude || countryDetails?.longitude || 0
    ),
  });

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    googleMapsApiKey: mapApiKey,
    libraries,
  });

  useEffect(() => {
    setCurrentLocation(addressItem);
    mapCenterRef.current = {
      lat: Number(
        addressItem?.geo_location?.latitude || countryDetails?.latitude || 0
      ),
      lng: Number(
        addressItem?.geo_location?.longitude || countryDetails?.longitude || 0
      ),
    };
    mapRef?.current?.panTo(location);
  }, [countryDetails, addressItem]);

  // function stateReset() {
  //   setPincode("");
  //   setCity("");
  //   setCountry("India");
  //   setLocality("");
  //   setState("");
  // }

  // function selectAddress() {
  //   onAddressSelect({
  //     city: city,
  //     area_code: pincode,
  //     state: state,
  //     area: locality,
  //     address: premise,
  //     country: country,
  //     geo_location: {
  //       latitude: selectedPlace?.lat,
  //       longitude: selectedPlace?.lng,
  //     },
  //   });
  // }

  // const handlePlaceSelect = useCallback((place) => {
  //   if (place?.geometry) {
  //     const location = place?.geometry?.location;
  //     const lat = location.lat();
  //     const lng = location.lng();
  //     setSelectedPlace({ lat, lng });
  //     setAddress(place.formatted_address);
  //     let prem = place?.address_components?.find((m) =>
  //       m?.types?.includes("premise")
  //     );
  //     setPremise(prem?.long_name || "");
  //     // Get city and state from the location
  //     getCityAndState(lat, lng);
  //   } else {
  //     console.error("No geometry available for selected place");
  //   }
  // }, []);

  // const getCityAndState = async (lat, lng) => {
  //   try {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapApiKey}`
  //     );
  //     const data = await response.json();
  //     const addressComponents = data.results[0].address_components;
  //     stateReset();
  //     let subLocalities = [];
  //     addressComponents.forEach((component) => {
  //       if (component.types.includes("plus_code")) {
  //         setPremise(component.long_name);
  //       } else if (component.types.includes("premise")) {
  //         setPremise(component.long_name);
  //       } else if (component.types.includes("street_number")) {
  //         setPremise((prev) => (prev += component.long_name));
  //       } else if (component.types.includes("country")) {
  //         setCountry(component.long_name);
  //       } else if (component.types.includes("locality")) {
  //         setCity(component.long_name);
  //       } else if (component.types.includes("administrative_area_level_1")) {
  //         setState(component.long_name);
  //       } else if (component.types.includes("postal_code")) {
  //         setPincode(component.long_name);
  //       } else if (
  //         component.types.includes("sublocality") ||
  //         component.types.includes("sublocality_level_1") ||
  //         component.types.includes("sublocality_level_2")
  //       ) {
  //         subLocalities.push(component.long_name);
  //       }

  //       setLocality(subLocalities.join(", "));
  //     });
  //   } catch (error) {
  //     console.error("Error fetching city and state:", error);
  //   }
  // };

  // const getAddressFromLatLng = async (lat, lng) => {
  //   try {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapApiKey}`
  //     );
  //     const data = await response.json();
  //     let subLocalities = [];
  //     if (data.results && data.results.length > 0) {
  //       const place = data.results[0];
  //       setAddress(place.formatted_address);

  //       if (place?.geometry) {
  //         const location = place?.geometry?.location;
  //         const lat = location.lat;
  //         const lng = location.lng;
  //         setSelectedPlace({ lat, lng });
  //       }
  //       // Extract city, state, and pincode from the place
  //       place.address_components.forEach((component) => {
  //         if (component.types.includes("premise")) {
  //           setPremise(component.long_name);
  //         }
  //         if (component.types.includes("country")) {
  //           setCountry(component.long_name);
  //         }
  //         if (component.types.includes("locality")) {
  //           setCity(component.long_name);
  //         }
  //         if (component.types.includes("administrative_area_level_1")) {
  //           setState(component.long_name);
  //         }
  //         if (component.types.includes("postal_code")) {
  //           setPincode(component.long_name);
  //         }
  //         if (
  //           component.types.includes("sublocality") ||
  //           component.types.includes("sublocality_level_1") ||
  //           component.types.includes("sublocality_level_2")
  //         ) {
  //           subLocalities.push(component.long_name);
  //         }

  //         setLocality(subLocalities.join(", "));
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching address:", error);
  //   }
  // };

  const locateUser = () => {
    if (!navigator?.geolocation || !mapApiKey) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        mapRef.current?.panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {}
    );
  };

  // const handleLocationError = (browserHasGeolocation, pos) => {
  //   console.error(
  //     browserHasGeolocation
  //       ? "Error: The Geolocation service failed."
  //       : "Error: Your browser doesn't support geolocation."
  //   );
  // };

   const AutocompleteProps = useMemo(
    () => ({
      onPlaceSelected: (place) => {
        if (place?.geometry) {
          const location = place?.geometry?.location;
          mapRef.current?.panTo({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          console.error("No geometry available for selected place");
        }
      },
    }),
    []
  );

  const GoogleMapProps = useMemo(
    () => ({
      onLoad: (map) => {
        mapRef.current = map;
        onLoad(map);
      },
      onIdle: () => {
        if (mapRef.current) {
          const newCenter = mapRef.current.getCenter();
          const lat = newCenter.lat();
          const lng = newCenter.lng();

          if (
            mapCenterRef.current.lat !== lat ||
            mapCenterRef.current.lng !== lng || !currentLocation
          ) {
            mapCenterRef.current = { lat, lng };
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === "OK" && results[0]) {
                const address = getAddressFromComponents(
                  results[0].address_components
                );
                setCurrentLocation({
                  ...address,
                  geo_location: {
                    latitude: mapCenterRef.current.lat,
                    longitude: mapCenterRef.current.lng,
                  },
                });
              } else {
                console.error("Geocoder failed:", status);
              }
            });
          }
        }
      },
    }),
    []
  );

  // const isMapCountryError = useMemo(() => {
  //   return (
  //     !!currentLocation?.country_iso_code &&
  //     i18nDetails?.countryCode !== currentLocation?.country_iso_code
  //   );
  // }, [i18nDetails, currentLocation]);

  const isMapCountryError = false;

  const displayAddress = useMemo(() => {
    if (!currentLocation) return null;
    return {
      addressLine1: [currentLocation.address, currentLocation.area]
        .filter(Boolean)
        .join(", "),
      addressLine2: [
        currentLocation.landmark,
        currentLocation.city,
        currentLocation.state,
        currentLocation.area_code,
      ]
        .filter(Boolean)
        .join(", "),
    };
  }, [currentLocation]);

  return (
    <div className={`${styles.mapWrapper} ${className}`}>
      <div className={styles.mapContainer}>
        {isMapLoaded ? (
          <>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={mapCenterRef.current}
              zoom={19}
              options={{
                disableDefaultUI: true,
                gestureHandling: "greedy",
              }}
              {...GoogleMapProps}
            />
            <div className={styles.autocompleteWrapper}>
              <SearchIcon className={styles.autocompleteIcon} />
              <Autocomplete
                className={styles.autocompleteInput}
                placeholder="Search for pincode, area, street name..."
                options={{
                  componentRestrictions: {
                    // country: i18nDetails?.countryCode,
                  },
                  types: ["geocode", "establishment"],
                }}
                {...AutocompleteProps}
              />
            </div>
            <span className={styles.markerIcon}>
              <MarkerIcon />
              <div className={styles.markerLabel}>
                <div>Your order will be delivered here</div>
                <div className={styles.markerLabelText}>
                  Move pin to your exact location
                </div>
              </div>
            </span>
            <FyButton
              aria-label="Use Current Location"
              onClick={locateUser}
              className={`${styles.locateIconBtn} ${isLocationError || isMapCountryError && styles.locationError}`}
            >
              <LocateIcon />
            </FyButton>
            {isLocationError && (
              <p className={styles.errorText}>
                We can’t access your location. Please allow access in browser
              </p>
            )}
            {isMapCountryError && (
              <p
                className={styles.errorText}
              >{`Please select a location within ${countryDetails.display_name}`}</p>
            )}
          </>
        ) : (
          <Shimmer height="100%" />
        )}
      </div>
      <div className={styles.mapFooter}>
        {displayAddress && (
          <div className={styles.addressContainer}>
            <span>
              <LocationPinIcon className={styles.locationPinIcon} />
            </span>
            <div className={styles.address}>
              {!!displayAddress.addressLine1 && (
                <h4 className={styles.title}>{displayAddress.addressLine1}</h4>
              )}
              {!!displayAddress.addressLine2 && (
                <p className={styles.subTitle}>{displayAddress.addressLine2}</p>
              )}
            </div>
          </div>
        )}
        <FyButton
          onClick={() => onAddressSelect(currentLocation)}
          disabled={isMapCountryError}
        >
          CONFIRM
        </FyButton>
      </div>
    </div>
  );
};

export default GoogleMapAddress;
