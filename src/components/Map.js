import React, { useRef, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; /* eslint import/no-webpack-loader-syntax: off */
import { useDispatch, useSelector } from "react-redux";
import useTicketGeocode from "./custom-hooks/useTicketGeocode";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXNoNTQzMjEiLCJhIjoiY2w2OHM1dXNuMGcwYzNkcWhubDZ4amNicyJ9.iysD0cFsVJJw-TPBHRzjDg";

const Map = () => {
  const ticketData = useSelector((state) => state.ticketData);
  const mapOptions = useSelector((state) => state.mapOptions);
  const customerAddressData = useSelector((state) => state.customerAddressData);
  const mapContainerRef = useRef(null);
  const dispatch = useDispatch();
  const ticketgeocodes = useTicketGeocode(ticketData, customerAddressData);
  const technicianGeocodes = useSelector(
    (state) => state.technicianData.technicianGeocodes
  );

  // Initialize map when component mounts
  useEffect(() => {
    let map = [];

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
    map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      // center: technicianGeocodes[0],
      zoom: mapOptions.zoom,
    });
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
    // technicianGeocodes.map((geocode, i) => {
    //   const popup = new mapboxgl.Popup({ offset: 25 }).setText(
    //     // "Construction on the Washington Monument began in 1848."
    //     `Technician: ${i + 1}`
    //   );
    //   const marker = new mapboxgl.Marker()
    //     .setLngLat(geocode)
    //     .setPopup(popup)
    //     .addTo(map);
    //   const markerDiv = marker.getElement();
    //   markerDiv.addEventListener("mouseenter", () => marker.togglePopup());
    //   markerDiv.addEventListener("mouseleave", () => marker.togglePopup());
    //   return marker;
    // });

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
          // "Construction on the Washington Monument began in 1848."
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

  return (
    <div style={{ width: "60%" }} className="my-5 align-self-center">
      <div ref={mapContainerRef} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default Map;
