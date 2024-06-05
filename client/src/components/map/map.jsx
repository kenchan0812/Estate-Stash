// @ts-ignore
import React from "react";
import "./map.scss";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

const Map = ({ items }) => {
  const [selectedPlace, setSelectedPlace] = useState("");
  const defaultLatitude = 14.5995;
  const defaultLongitude = 120.9842;

  const [center, setCenter] = useState({
    lat: items.length > 0 ? items[0].latitude : defaultLatitude,
    lng: items.length > 0 ? items[0].longitude : defaultLongitude,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // @ts-ignore
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
  });

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      const crd = pos.coords;
      const coords = {
        lat: crd.latitude,
        lng: crd.longitude,
      };
      setCenter(coords);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  return (
    <>
      {isLoaded && (
        <GoogleMap zoom={8} center={center} mapContainerClassName="map">
          {items.map((item) => (
            <MarkerF
              key={item.id}
              onClick={() => {
                setSelectedPlace(item);
              }}
              position={{ lat: item.latitude, lng: item.longitude }}
            />
          ))}
          {selectedPlace && (
            <InfoWindowF
              position={{
                // @ts-ignore
                lat: selectedPlace.latitude,
                // @ts-ignore
                lng: selectedPlace.longitude,
              }}
              zIndex={1}
              onCloseClick={() => {
                setSelectedPlace("");
              }}
            >
              <div className="popupContainer">
                <img
                  src={
                    // @ts-ignore
                    selectedPlace.img
                  }
                  alt=""
                />
                <div className="textContainer">
                  <Link
                    to={`/${
                      // @ts-ignore
                      selectedPlace.id
                    }`}
                    className="title"
                  >
                    {
                      // @ts-ignore
                      selectedPlace.title
                    }
                  </Link>
                  <span>
                    {
                      // @ts-ignore
                      selectedPlace.bedroom
                    }{" "}
                    bedroom
                  </span>
                  <b>
                    ${" "}
                    {
                      // @ts-ignore
                      selectedPlace.price
                    }
                  </b>
                </div>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      )}
    </>
  );
};

export default Map;
