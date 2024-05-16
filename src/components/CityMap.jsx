/* global google*/

import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import APIclient from "../services/restAPI";

const containerStyle = {
  height: "600px",
  margin: "20px 0",
};

const defaultCenter = { lat: -34.397, lng: 150.644 }; // Adjust based on your location

function CityMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY, // Replace with your actual API key
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [directions, setDirections] = useState(null);
  const [navigationDestination, setNavigationDestination] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!isLoaded || !map) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCenter(userLocation);
          map.panTo(userLocation);

          new google.maps.Marker({
            position: userLocation,
            map,
            title: "You Are Here",
          });
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [isLoaded, map]);

  const clearDirectionsAndDestination = () => {
    setDirections(null);
    setNavigationDestination(null);
  };

  const findAndRouteToNearestHospital = () => {
    if (!isLoaded || !navigator.geolocation || !map) return;

    clearDirectionsAndDestination();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCenter(userLocation);
          map.panTo(userLocation);

          const service = new google.maps.places.PlacesService(map);
          service.nearbySearch(
            {
              location: userLocation,
              radius: "5000",
              type: ["hospital"],
            },
            (results, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results[0]
              ) {
                const locNow = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                };
                setNavigationDestination(locNow);
                planRoute(userLocation, locNow, google.maps.TravelMode.DRIVING);
              } else {
                console.error("No hospitals found");
              }
            }
          );
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    }
  };

  const routeToNearestExit = async () => {
    if (!isLoaded || !navigator.geolocation || !map) return;

    clearDirectionsAndDestination();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCenter(userLocation);
          map.panTo(userLocation);

          // Example: Predefined exit point. Replace with actual logic for finding nearest exit.
          const apiClient = new APIclient();
          const cityMarker = await apiClient.getNearestExit(userLocation);
          const exitLocation = {
            lat: cityMarker.latitude,
            lng: cityMarker.longitude,
          };
          setNavigationDestination(exitLocation); // Set for navigation
          planRoute(userLocation, exitLocation, google.maps.TravelMode.DRIVING); // Example: Driving to exit
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    }
  };

  const planRoute = (origin, destination, travelMode) => {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
  };

  const navigateUsingGoogleMaps = (travelMode) => {
    if (!navigationDestination) return;
    // Directly use the lat and lng properties if navigationDestination is a plain object.
    const destination = `${navigationDestination.lat},${navigationDestination.lng}`;
    const mode =
      travelMode === "DRIVING"
        ? google.maps.TravelMode.DRIVING
        : google.maps.TravelMode.WALKING;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${mode}`,
      "_blank"
    );
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ mapId: "9787198eba5dffae" }}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {!directions && (
          <>
            <button
              onClick={routeToNearestExit}
              style={{ padding: "10px", fontSize: "16px" }}
            >
              Plan Route to Nearest Exit
            </button>
            <button
              onClick={findAndRouteToNearestHospital}
              style={{ padding: "10px", fontSize: "16px" }}
            >
              Plan Route to Nearest Hospital
            </button>
          </>
        )}
        {navigationDestination && (
          <>
            <button
              onClick={() =>
                navigateUsingGoogleMaps(google.maps.TravelMode.DRIVING)
              }
              style={{ padding: "10px", fontSize: "16px" }}
            >
              Navigate (Drive)
            </button>
            <button
              onClick={() =>
                navigateUsingGoogleMaps(google.maps.TravelMode.WALKING)
              }
              style={{ padding: "10px", fontSize: "16px" }}
            >
              Navigate (Walk)
            </button>
          </>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(CityMap);
