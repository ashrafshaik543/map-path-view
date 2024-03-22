import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; /* eslint import/no-webpack-loader-syntax: off */
import { useDispatch, useSelector } from "react-redux";
import useTicketGeocode from "./custom-hooks/useTicketGeocode";
import classes from "./Map.module.css";
import { polygon, point, booleanPointInPolygon } from "@turf/turf";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { assignTechnicianToTickets } from "../store/store-slice/ticketDataSlice";
import { assignMultipleTicketsToTechnician } from "../store/store-slice/technicianDataSlice";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg";

const Map = () => {
  const ticketData = useSelector((state) => state.ticketData);
  const mapOptions = useSelector((state) => state.mapOptions);
  const customerAddressData = useSelector((state) => state.customerAddressData);
  const mapContainerRef = useRef(null);
  const dispatch = useDispatch();
  const { ticketgeocodes } = useTicketGeocode(ticketData, customerAddressData);
  const technicianGeocodes = useSelector(
    (state) => state.technicianData.technicianGeocodes
  );
  const [error, setError] = useState("");

  // Initialize map when component mounts

  useEffect(() => {
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLong = Infinity;
    let maxLong = -Infinity;

    for (const technician in technicianGeocodes) {
      minLat = Math.min(minLat, technicianGeocodes[technician][1]);
      maxLat = Math.max(maxLat, technicianGeocodes[technician][1]);
      minLong = Math.min(minLong, technicianGeocodes[technician][0]);
      maxLong = Math.max(maxLong, technicianGeocodes[technician][0]);
    }
    let map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      // center: technicianGeocodes[0],
      zoom: mapOptions.zoom,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: "draw_polygon",
    });
    map.addControl(draw);

    map.on("draw.create", polygonChange);
    // map.on("draw.delete", polygonChange);
    map.on("draw.update", polygonChange);

    function polygonChange() {
      const data = draw.getAll();
      // console.log(data.features[0].geometry.coordinates);
      const poly = polygon(data.features[0].geometry.coordinates);
      const assignedTicketIds = [];
      ticketgeocodes.forEach((geocode, i) => {
        const pt = point([geocode[1], geocode[0]]);
        if (booleanPointInPolygon(pt, poly))
          assignedTicketIds.push(ticketData.tickets[i].id);
      });
      let selectedTechnician = null;
      for (const technician in technicianGeocodes) {
        const pt = point(technicianGeocodes[technician]);
        if (selectedTechnician !== null && booleanPointInPolygon(pt, poly)) {
          setError("Select only one technician to assign to");
          return;
        }
        if (booleanPointInPolygon(pt, poly)) selectedTechnician = technician;
      }
      if (!selectedTechnician) {
        setError("Select a technician to assign to");
        return;
      }
      if (assignedTicketIds.length > 0) {
        dispatch(
          assignTechnicianToTickets({
            assignedTicketIds,
            technician: selectedTechnician,
          })
        );
        dispatch(
          assignMultipleTicketsToTechnician({
            assignedTicketIds,
            technician: selectedTechnician,
          })
        );
        setError("");
      }
    }

    let i = 0;
    for (const technician in technicianGeocodes) {
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        // "Construction on the Washington Monument began in 1848."
        `Technician: ${i++ + 1}`
      );
      const marker = new mapboxgl.Marker()
        .setLngLat(technicianGeocodes[technician])
        .setPopup(popup)
        .addTo(map);
      const markerDiv = marker.getElement();
      markerDiv.addEventListener("mouseenter", () => marker.togglePopup());
      markerDiv.addEventListener("mouseleave", () => marker.togglePopup());
    }

    if (ticketData.tickets.length === 1) {
      //if only one ticket exists
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        // "Construction on the Washington Monument began in 1848."
        `Job Description: ${ticketData.tickets[0].jobDescription}`
      );
      const marker = new mapboxgl.Marker({
        color: ticketData.tickets[0].selected ? "blue" : "black",
      })
        .setLngLat([ticketgeocodes[0][1], ticketgeocodes[0][0]])
        .setPopup(popup)
        .addTo(map);
      const markerDiv = marker.getElement();
      markerDiv.addEventListener("mouseenter", () => marker.togglePopup());
      markerDiv.addEventListener("mouseleave", () => marker.togglePopup());
    } else if (ticketData.tickets.length > 1) {
      //if more than one ticket present
      //setting bounds based on north east and south west extreme ticket addresses

      for (const geocode of ticketgeocodes) {
        minLat = Math.min(minLat, geocode[0]);
        maxLat = Math.max(maxLat, geocode[0]);
        minLong = Math.min(minLong, geocode[1]);
        maxLong = Math.max(maxLong, geocode[1]);
      }

      ticketgeocodes.map((geocode, i) => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          `Job Description: ${ticketData.tickets[i].jobDescription}`
        );
        const marker = new mapboxgl.Marker({
          color: ticketData.tickets[i].selected ? "blue" : "black",
        })
          .setLngLat([geocode[1], geocode[0]])
          .setPopup(popup)
          .addTo(map);
        const markerDiv = marker.getElement();
        markerDiv.addEventListener("mouseenter", () => marker.togglePopup());
        markerDiv.addEventListener("mouseleave", () => marker.togglePopup());

        return marker;
      });
    }

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.fitBounds([
      [minLong - 0.5, minLat - 0.5],
      [maxLong + 0.5, maxLat + 0.5],
    ]);
    return () => map.remove();
  }, [
    ticketgeocodes,
    ticketData.tickets,
    dispatch,
    mapOptions.zoom,
    technicianGeocodes,
  ]);
  const mapStyle = `my-5 align-self-center ${classes.map}`;

  return (
    <div className="w-100">
      <div className="mb-0">
        {error && <p className="text-danger mb-0">{error}</p>}
      </div>
      <div
        ref={mapContainerRef}
        // style={{ height: "500px", width: "100%" }}
        className={mapStyle}
      />
    </div>
  );
};

export default Map;
