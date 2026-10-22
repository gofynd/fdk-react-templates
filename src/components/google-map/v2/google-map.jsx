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
import CloseIcon from "../../../assets/images/close.svg";
import FyButton from "../../core/fy-button/fy-button";
import { useGlobalTranslation } from "fdk-core/utils";
import Shimmer from "../../shimmer/shimmer";
import { getAddressFromComponents } from "../../../helper/utils";
import { useStateRef } from "../../../helper/hooks";
import {
  getGoogleMapFormFields,
  getAddressMapPoint,
  hasPrefilledAddressLocation,
  resolveAddressMapCenter,
} from "../../../helper/address-form-location";

const GoogleMapAddress = ({
  className,
  mapApiKey,
  onAddressSelect,
  countryDetails,
  addressItem,
  onLoad = () => {},
  onClose,
  showHeader = true,
}) => {
  const { t } = useGlobalTranslation("translation");
  const isNewAddress = !addressItem;
  
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
  const selectedPlaceRef = useRef(null);
  const geocodeRequestRef = useRef(0);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  useEffect(() => () => {
    geocodeRequestRef.current += 1;
  }, []);
  
  // Priority: addressItem geo_location > last used location > country details > Mumbai
  const mapCenterRef = useRef(
    resolveAddressMapCenter(addressItem, getLastUsedLocation(), countryDetails)
  );

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    googleMapsApiKey: mapApiKey,
    id: "google-maps-script",
    libraries: ["places"],
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
    
    // Priority: address geo_location > last used location > country details > Mumbai
    mapCenterRef.current = resolveAddressMapCenter(
      address,
      getLastUsedLocation(),
      countryDetails
    );
    mapRef?.current?.panTo(mapCenterRef.current);
  };

  useEffect(() => {
    let active = true;
    if (!getAddressMapPoint(addressItem) && addressItem?.area_code) {
      getGeocodeByAddress(addressItem).then((location) => {
        if (active && location) {
          updateMapLocation({ ...addressItem, geo_location: location });
        }
      });
    }
    updateMapLocation(addressItem);
    return () => {
      active = false;
    };
  }, [
    countryDetails?.latitude,
    countryDetails?.longitude,
    addressItem?.area_code,
    addressItem?.geo_location?.latitude,
    addressItem?.geo_location?.longitude,
    isNewAddress,
  ]);

  const locateUser = () => {
    if (!navigator?.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        selectedPlaceRef.current = null;
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
          selectedPlaceRef.current = {
            ...selectedLocation,
            ...getGoogleMapFormFields(place.address_components),
            pending: true,
          };
          geocodeRequestRef.current += 1;
          setIsResolvingAddress(true);
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
            Math.abs(mapCenterRef.current.lat - lat) > 0.0000001 ||
            Math.abs(mapCenterRef.current.lng - lng) > 0.0000001 ||
            selectedPlaceRef.current?.pending ||
            !currentLocationRef.current ||
            (!addressItem?.id &&
              !currentLocationRef.current?.map_address_fields &&
              !hasPrefilledAddressLocation(currentLocationRef.current))
          ) {
            mapCenterRef.current = { lat, lng };
            // Save the selected location for future use
            try {
              localStorage.setItem('lastMapLocation', JSON.stringify({ lat, lng }));
            } catch (error) {
              console.error('Failed to save location:', error);
            }
            const geocoder = new window.google.maps.Geocoder();
            const request = ++geocodeRequestRef.current;
            const selection = selectedPlaceRef.current;
            if (selection) selection.pending = false;
            setIsResolvingAddress(true);
            geocoder.geocode({ location: { lat, lng }, ...(countryDetails?.iso2 === "IN" && { language: "en" }) }, (results, status) => {
              if (request !== geocodeRequestRef.current) return;
              setIsResolvingAddress(false);
              if (status === "OK" && results[0]) {
                const address = getAddressFromComponents(
                  results[0].address_components
                );
                setCurrentLocation({
                  ...address,
                  map_address_fields: getGoogleMapFormFields(
                    results[0].address_components, { lat, lng }, selection
                  ),
                  geo_location: {
                    latitude: lat,
                    longitude: lng,
                  },
                });
              } else {
                setCurrentLocation(null);
                console.error("Geocoder failed:", status);
              }
            });
          }
        }
      },
    }),
    [countryDetails?.iso2]
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
      {showHeader && onClose && (
        <div className={styles.mapHeader}>
          <h2 className={styles.mapHeaderTitle}>
            {t("resource.common.address.select_delivery_location")}
          </h2>
          <button
            type="button"
            className={styles.closeIcon}
            onClick={onClose}
            aria-label={t("resource.common.close")}
          >
            <CloseIcon />
          </button>
        </div>
      )}
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
          disabled={isMapCountryError || isResolvingAddress || !currentLocation}
        >
          CONFIRM
        </FyButton>
      </div>
    </div>
  );
};

export default GoogleMapAddress;
