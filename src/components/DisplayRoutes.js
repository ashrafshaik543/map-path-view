import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "./app.css";
import { useSelector } from "react-redux";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg";

const DisplayRoutes = () => {
  const mapContainer = useRef();
  const navigate = useNavigate();
  const mapData = useSelector((state) => state.mapData);

  useEffect(() => {
    // console
    if (mapData.addresses.length < 2) navigate("/");
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-99.6649, 38.6013],
      zoom: 13,
      pitch: 60,
      bearing: 80,
    });

    // if (mapData.bounds) map.fitBounds(mapData.bounds);

    mapData.addresses.map((location) =>
      new mapboxgl.Marker()
        .setLngLat([location.geocode[1], location.geocode[0]])
        .addTo(map)
    );

    map.on("load", () => {
      let coordinates = mapData.routeCoordinates
        ? mapData.routeCoordinates
        : [
            [-122.483696, 37.833818],
            [-122.483482, 37.833174],
            [-122.483396, 37.8327],
            [-122.483568, 37.832056],
            [-122.48404, 37.831141],
            [-122.48404, 37.830497],
            [-122.483482, 37.82992],
            [-122.483568, 37.829548],
            [-122.48507, 37.829446],
            [-122.4861, 37.828802],
            [-122.486958, 37.82931],
            [-122.487001, 37.830802],
            [-122.487516, 37.831683],
            [-122.488031, 37.832158],
            [-122.488889, 37.832971],
            [-122.489876, 37.832632],
            [-122.490434, 37.832937],
            [-122.49125, 37.832429],
            [-122.491636, 37.832564],
            [-122.492237, 37.833378],
            [-122.493782, 37.833683],
          ];

      const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of coordinates) {
        bounds.extend(coord);
      }

      map.fitBounds(bounds, {
        padding: 20,
      });

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 3,
        },
      });
    });

    return () => map.remove();
  }, [mapData.routeCoordinates, mapData.addresses, mapData.bounds, navigate]);

  return (
    <div className="w-100 py-5 d-flex flex-column justify-content-center">
      <div
        className="align-self-center"
        ref={mapContainer}
        style={{ width: "90%", height: "80vh" }}
      />
    </div>
  );
};

export default DisplayRoutes;
