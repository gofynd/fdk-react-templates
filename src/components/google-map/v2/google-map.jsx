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
  const [isLocationError, setIsLocationError] = useState(false);
  const [currentLocation, setCurrentLocation, currentLocationRef] =
    useStateRef(addressItem);
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
    mapRef?.current?.panTo(mapCenterRef.current);
  }, [countryDetails, addressItem]);

  const locateUser = () => {
    if (!navigator?.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        mapRef.current.panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setIsLocationError(true);
      }
    );
  };

  const AutocompleteProps = useMemo(
    () => ({
      onPlaceSelected: (place) => {
        if (place?.geometry) {
          const location = place?.geometry?.location;
          mapRef.current?.panTo({
            lat: location.lat(),
            lng: location.lng(),
          });
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
