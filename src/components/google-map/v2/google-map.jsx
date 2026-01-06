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
import { useStateRef } from "../../../helper/hooks";

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
  
  // Get last used location from localStorage
  const getLastUsedLocation = () => {
    try {
      const saved = localStorage.getItem('lastMapLocation');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };
  
  const [isLocationError, setIsLocationError] = useState(false);
  const [currentLocation, setCurrentLocation, currentLocationRef] =
    useStateRef(addressItem);
  const mapRef = useRef(null);
  
  // Priority: addressItem geo_location > last used location > country details
  const lastUsedLocation = getLastUsedLocation();
  const mapCenterRef = useRef({
    lat: Number(
      currentLocation?.geo_location?.latitude || 
      lastUsedLocation?.lat || 
      countryDetails?.latitude || 
      0
    ),
    lng: Number(
      currentLocation?.geo_location?.longitude || 
      lastUsedLocation?.lng || 
      countryDetails?.longitude || 
      0
    ),
  });

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    googleMapsApiKey: mapApiKey,
    libraries,
  });

  const getGeocodeByAddress = async (address) => {
    if (!address.area_code || !mapApiKey) {
      return;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address.area_code}&key=${mapApiKey}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      }
    } catch {
      return;
    }
  };

  const updateMapLocation = (address) => {
    setCurrentLocation(address);
    
    // Priority: address geo_location > last used location > country details
    const lastUsedLoc = getLastUsedLocation();
    mapCenterRef.current = {
      lat: Number(
        address?.geo_location?.latitude || 
        lastUsedLoc?.lat || 
        countryDetails?.latitude || 
        0
      ),
      lng: Number(
        address?.geo_location?.longitude || 
        lastUsedLoc?.lng || 
        countryDetails?.longitude || 
        0
      ),
    };
    mapRef?.current?.panTo(mapCenterRef.current);
  };

  useEffect(() => {
    if (!addressItem?.geo_location && addressItem?.area_code) {
      getGeocodeByAddress(addressItem).then((location) => {
        if (location) {
          updateMapLocation({ ...addressItem, geo_location: location });
        }
      });
    }
    updateMapLocation(addressItem);
  }, [
    countryDetails?.latitude,
    countryDetails?.longitude,
    addressItem?.area_code,
    addressItem?.geo_location?.latitude,
    addressItem?.geo_location?.longitude,
  ]);

  const locateUser = () => {
    if (!navigator?.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Save user's current location for future use
        try {
          localStorage.setItem('lastMapLocation', JSON.stringify(userLocation));
        } catch (error) {
          console.error('Failed to save location:', error);
        }
        mapRef.current.panTo(userLocation);
      },
      () => {
        setIsLocationError(true);
      }
    );
  };

  const AutocompleteProps = useMemo(
    () => ({
      onPlaceSelected: (place) => {
        if (place?.geometry) {
          const location = place?.geometry?.location;
          const selectedLocation = {
            lat: location.lat(),
            lng: location.lng(),
          };
          // Save the searched location for future use
          try {
            localStorage.setItem('lastMapLocation', JSON.stringify(selectedLocation));
          } catch (error) {
            console.error('Failed to save location:', error);
          }
          mapRef.current?.panTo(selectedLocation);
          setIsLocationError(false);
        } else {
          console.error("No geometry available for selected place");
        }
      },
    }),
    []
  );

  const GoogleMapProps = useMemo(
    () => ({
      mapContainerStyle: { width: "100%", height: "100%" },
      center: mapCenterRef.current,
      zoom: 19,
      options: { disableDefaultUI: true, gestureHandling: "greedy" },
      onLoad: (map) => {
        mapRef.current = map;
        onLoad(map);
      },
      onIdle: () => {
        if (mapRef.current) {
          const newCenter = mapRef.current.getCenter();
          const lat = newCenter.lat();
          const lng = newCenter.lng();
          setIsLocationError(false);
          if (
            mapCenterRef.current.lat !== lat ||
            mapCenterRef.current.lng !== lng ||
            !currentLocationRef.current
          ) {
            mapCenterRef.current = { lat, lng };
            // Save the selected location for future use
            try {
              localStorage.setItem('lastMapLocation', JSON.stringify({ lat, lng }));
            } catch (error) {
              console.error('Failed to save location:', error);
            }
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

  const isMapCountryError = useMemo(() => {
    return (
      !!currentLocation?.country_iso_code &&
      countryDetails?.iso2 !== currentLocation?.country_iso_code
    );
  }, [countryDetails?.iso2, currentLocation?.country_iso_code]);

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
            <GoogleMap {...GoogleMapProps} />
            <div className={styles.autocompleteWrapper}>
              <SearchIcon className={styles.autocompleteIcon} />
              <Autocomplete
                className={styles.autocompleteInput}
                placeholder={t("resource.localization.search_google_maps")}
                options={{
                  componentRestrictions: {
                    country: countryDetails?.iso2,
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
              aria-label={t("resource.localization.use_current_location")}
              onClick={locateUser}
              className={`${styles.locateIconBtn} ${(isLocationError || isMapCountryError) && styles.locationError}`}
            >
              <LocateIcon />
            </FyButton>
            {isLocationError && (
              <p className={styles.errorText}>
                Location access is blocked. Please enable location permissions in your browser settings to use this feature.
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
