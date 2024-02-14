import React, { useRef, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; /* eslint import/no-webpack-loader-syntax: off */
import { useDispatch, useSelector } from "react-redux";
import useTicketGeocode from "./custom-hooks/useTicketGeocode";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg";

const Map = () => {
  const ticketData = useSelector((state) => state.ticketData);
  const mapOptions = useSelector((state) => state.mapOptions);
  const customerAddressData = useSelector((state) => state.customerAddressData);
  const mapContainerRef = useRef(null);
  const dispatch = useDispatch();
  const ticketgeocodes = useTicketGeocode(ticketData, customerAddressData);

  // Initialize map when component mounts
  useEffect(() => {
    let map = [];
    if (ticketData.tickets.length === 0) {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-74.8732823, 42.66520382],
        zoom: mapOptions.zoom,
      });

      new mapboxgl.Marker().setLngLat([-74.8732823, 42.66520382]).addTo(map);
    } else if (ticketData.tickets.length === 1) {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [ticketgeocodes[0][1], ticketgeocodes[0][0]],

        zoom: mapOptions.zoom,
      });

      new mapboxgl.Marker({
        color: ticketData.tickets[0].selected ? "blue" : "black",
      })
        .setLngLat([ticketgeocodes[0][1], ticketgeocodes[0][0]])
        .addTo(map);
    } else {
      let minLat = ticketgeocodes[0][0];
      let maxLat = ticketgeocodes[0][0];
      let minLong = ticketgeocodes[0][1];
      let maxLong = ticketgeocodes[0][1];
      for (const geocode of ticketgeocodes) {
        minLat = Math.min(minLat, geocode[0]);
        maxLat = Math.max(maxLat, geocode[0]);
        minLong = Math.min(minLong, geocode[1]);
        maxLong = Math.max(maxLong, geocode[1]);
      }

      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [ticketgeocodes[0][1], ticketgeocodes[0][0]],
        zoom: 5,
      });
      ticketgeocodes.map((geocode, i) =>
        new mapboxgl.Marker({
          color: ticketData.tickets[i].selected ? "blue" : "black",
        })
          .setLngLat([geocode[1], geocode[0]])
          .addTo(map)
      );

      map.fitBounds([
        [minLong - 0.5, minLat - 0.5],
        [maxLong + 0.5, maxLat + 0.5],
      ]);
    }

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => map.remove();
  }, [ticketgeocodes, ticketData.tickets, dispatch, mapOptions.zoom]);

  return (
    <div style={{ width: "60%" }} className="my-5 align-self-center">
      <div ref={mapContainerRef} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default Map;
