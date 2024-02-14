import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Form from "react-bootstrap/Form";

import "mapbox-gl/dist/mapbox-gl.css";
import "./app.css";
import { useDispatch, useSelector } from "react-redux";
import useTicketGeocode from "./custom-hooks/useTicketGeocode";
import useTechnicianGeocodes from "./custom-hooks/useTechnicianGeocodes";
import useOptimalRoute from "./custom-hooks/useOptimalRoute";
import { setRouteCoordinates } from "../store/store-actions/mapOptionsActions";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg";

const DisplayRoutes = () => {
  const mapContainer = useRef();
  const navigate = useNavigate();
  const ticketData = useSelector((state) => state.ticketData);
  const customerAddressData = useSelector((state) => state.customerAddressData);
  const mapOptions = useSelector((state) => state.mapOptions);
  const ticketgeocodes = useTicketGeocode(ticketData, customerAddressData);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const technicianGeocodes = useTechnicianGeocodes(
    selectedTechnician,
    ticketData,
    customerAddressData,
    mapOptions
  );
  const geocodesToVisit = useOptimalRoute(
    selectedTechnician,
    technicianGeocodes,
    mapOptions.center
  );
  const dispatch = useDispatch();

  useEffect(() => {}, [selectedTechnician]);

  useEffect(() => {
    dispatch(setRouteCoordinates(geocodesToVisit));
  }, [geocodesToVisit, dispatch]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-74.8732823, 42.66520382],
      zoom: 6,
    });

    if (geocodesToVisit.length !== 0) {
      console.log(geocodesToVisit);
      geocodesToVisit.map((geocode) =>
        new mapboxgl.Marker().setLngLat([geocode[1], geocode[0]]).addTo(map)
      );
    } else {
      new mapboxgl.Marker().setLngLat([-74.8732823, 42.66520382]).addTo(map);
    }

    map.on("load", () => {
      let coordinates = mapOptions.routeCoordinates
        ? mapOptions.routeCoordinates
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

      for (const coord of coordinates) {
        bounds.extend(coord);
      }

      if (mapOptions.routeCoordinates) {
        map.fitBounds(bounds, {
          padding: 20,
        });
      }

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
  }, [
    mapOptions.bounds,
    navigate,
    mapOptions.routeCoordinates,
    ticketgeocodes,
    geocodesToVisit,
  ]);

  return (
    <div className="w-100 py-5 d-flex flex-column justify-content-center px-5">
      <div style={{ width: "20%" }} className="mb-3">
        <Form.Select
          onChange={(e) => {
            if (e.target.value !== "null")
              setSelectedTechnician(e.target.value);
            else setSelectedTechnician(null);
          }}
          aria-label="Default select example">
          <option value="null">Select Technician for routes</option>
          <option value="one">Technician 1</option>
          <option value="two">Technician 2</option>
          <option value="three">Technician 3</option>
        </Form.Select>
      </div>
      <div className="w-100" ref={mapContainer} style={{ height: "80vh" }} />
    </div>
  );
};

export default DisplayRoutes;
