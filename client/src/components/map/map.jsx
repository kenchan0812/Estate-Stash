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
  const [center, setCenter] = useState({
    lat: items[0].latitude,
    lng: items[0].longitude,
  });
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
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
        <GoogleMap zoom={9} center={center} mapContainerClassName="map">
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
                lat: selectedPlace.latitude,
                lng: selectedPlace.longitude,
              }}
              zIndex={1}
              onCloseClick={() => {
                setSelectedPlace("");
              }}
            >
              <div className="popupContainer">
                <img src={selectedPlace.img} alt="" />
                <div className="textContainer">
                  <Link to={`/${selectedPlace.id}`} className="title">
                    {selectedPlace.title}
                  </Link>
                  <span>selectedPlace.bedroom</span>
                  <b>$ {selectedPlace.price}</b>
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
